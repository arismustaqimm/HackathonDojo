-- SCHOLARKU Supabase PostgreSQL schema and RLS migration
-- Run once in a NEW Supabase project via SQL Editor. Review before use in production.
-- No real company or opportunity data is seeded by this migration.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null default 'Student',
 role text not null default 'student' check(role in ('student','employer','admin')),
 institution text, field text, skills text[] default '{}',
 location_state text, education_level text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create or replace function public.create_profile_for_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles(id,full_name,role)
 values (new.id,coalesce(nullif(new.raw_user_meta_data->>'full_name',''),'New student'),
 case when new.raw_user_meta_data->>'desired_role'='employer' then 'employer' else 'student' end)
 on conflict(id) do nothing;
 return new;
end; $$;
drop trigger if exists on_auth_user_created_scholarku on auth.users;
create trigger on_auth_user_created_scholarku after insert on auth.users for each row execute function public.create_profile_for_user();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;

create or replace function public.guard_profile_update() returns trigger language plpgsql set search_path = '' as $$
begin
 if new.id is distinct from old.id or (new.role is distinct from old.role and current_user not in ('postgres','service_role')) then
   raise exception 'Profile identity and role are protected';
 end if;
 new.updated_at = now();
 return new;
end; $$;
drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role before update on public.profiles for each row execute function public.guard_profile_update();

create table if not exists public.organizations (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references public.profiles(id),
 name text not null, category text not null default 'SME',
 industry text, location_state text, website text, registration_number text,
 description text, contact_email text,
 verification_status text not null default 'unverified' check(verification_status in ('unverified','pending','approved','rejected','suspended')),
 verified_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(owner_id)
);
create or replace function public.guard_organization() returns trigger language plpgsql set search_path = '' as $$
begin
 if tg_op='UPDATE' then
   if new.owner_id is distinct from old.owner_id then raise exception 'Organization owner cannot be changed'; end if;
   if (new.verification_status is distinct from old.verification_status or new.verified_at is distinct from old.verified_at)
      and current_user not in ('postgres','service_role') and not public.is_admin() then
     raise exception 'Only administrators can change verification';
   end if;
 end if;
 new.updated_at=now();
 return new;
end; $$;
drop trigger if exists guard_organization_updates on public.organizations;
create trigger guard_organization_updates before update on public.organizations for each row execute function public.guard_organization();

create table if not exists public.organization_verification_requests (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.organizations(id) on delete cascade,
 notes text not null,
 status text not null default 'pending' check(status in ('pending','approved','rejected','more_info')),
 reviewer_id uuid references public.profiles(id),
 reviewer_reason text, reviewed_at timestamptz,
 created_at timestamptz not null default now()
);
create table if not exists public.verification_evidence (
 id uuid primary key default gen_random_uuid(),
 request_id uuid not null references public.organization_verification_requests(id) on delete cascade,
 path text not null,
 uploaded_at timestamptz not null default now()
);
create table if not exists public.opportunities (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.organizations(id),
 title text not null, kind text not null default 'Internship'
    check(kind in ('Internship','Graduate Programme','Scholarship','Competition','Workshop')),
 description text not null, field text not null default 'All Fields',
 education_level text default 'Undergraduate', skills text[] default '{}',
 location_state text not null default 'Malaysia', location_district text,
 work_mode text not null default 'On-site' check(work_mode in ('On-site','Hybrid','Remote','Online','Nationwide')),
 duration text, contract_type text check(contract_type in ('With contract','No contract','Not specified')), start_date date, application_deadline date,
 allowance text, vacancies integer check(vacancies is null or vacancies>0),
 external_url text, status text not null default 'draft' check(status in ('draft','published','closed','suspended')),
 is_demo boolean not null default false,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create or replace function public.guard_publishing() returns trigger language plpgsql set search_path = '' as $$
begin
 if new.status='published' and not exists(select 1 from public.organizations where id=new.organization_id and verification_status='approved') then
    raise exception 'Organization must be approved before publishing';
 end if;
 if tg_op='UPDATE' and new.organization_id<>old.organization_id then raise exception 'Cannot transfer opportunity ownership'; end if;
 new.updated_at=now();
 return new;
end; $$;
drop trigger if exists enforce_verified_publisher on public.opportunities;
create trigger enforce_verified_publisher before insert or update on public.opportunities for each row execute function public.guard_publishing();

-- Automatically suspend existing published listings if organizational approval is lost.
create or replace function public.suspend_on_verification_loss() returns trigger language plpgsql set search_path = '' as $$
begin
 if old.verification_status='approved' and new.verification_status<>'approved' then
   update public.opportunities set status='suspended' where organization_id=new.id and status='published';
 end if;
 return new;
end; $$;
drop trigger if exists organization_trust_revoked on public.organizations;
create trigger organization_trust_revoked after update of verification_status on public.organizations for each row execute function public.suspend_on_verification_loss();

create table if not exists public.applications (
 id uuid primary key default gen_random_uuid(),
 opportunity_id uuid not null references public.opportunities(id) on delete cascade,
 user_id uuid not null references public.profiles(id) on delete cascade,
 cover_note text not null,
 applicant_name text, applicant_institution text,
 cv_path text not null,
 status text not null default 'Submitted' check(status in ('Submitted','Under Review','Shortlisted','Interview','Offered','Rejected','Withdrawn')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(opportunity_id,user_id)
);
create or replace function public.guard_application() returns trigger language plpgsql set search_path = '' as $$
begin
 if tg_op='INSERT' then
   select full_name,institution into new.applicant_name,new.applicant_institution from public.profiles where id=new.user_id;
   if not exists(select 1 from public.opportunities o join public.organizations g on o.organization_id=g.id
     where o.id=new.opportunity_id and o.kind='Internship' and o.status='published' and g.verification_status='approved') then
     raise exception 'Internship not open for applications';
   end if;
 elsif tg_op='UPDATE' then
   if new.user_id<>old.user_id or new.opportunity_id<>old.opportunity_id or new.cv_path<>old.cv_path
      or new.cover_note<>old.cover_note or new.applicant_name is distinct from old.applicant_name or new.applicant_institution is distinct from old.applicant_institution then raise exception 'Application identity and content are immutable'; end if;
   if auth.uid()=old.user_id and not public.is_admin() and new.status<>'Withdrawn' then
      raise exception 'Students can only withdraw applications';
   end if;
 end if;
 new.updated_at=now(); return new;
end; $$;
drop trigger if exists guard_application_change on public.applications;
create trigger guard_application_change before insert or update on public.applications for each row execute function public.guard_application();

create table if not exists public.saved_opportunities (
 user_id uuid not null references public.profiles(id) on delete cascade,
 opportunity_id uuid not null references public.opportunities(id) on delete cascade,
 created_at timestamptz not null default now(), primary key(user_id,opportunity_id)
);
create table if not exists public.reports (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id),
 opportunity_id uuid not null references public.opportunities(id),
 reason text not null,
 status text not null default 'new' check(status in ('new','investigating','closed')),
 created_at timestamptz not null default now()
);
create table if not exists public.notifications (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id) on delete cascade,
 content text not null, is_read boolean not null default false,created_at timestamptz not null default now()
);
create table if not exists public.audit_logs (
 id uuid primary key default gen_random_uuid(), actor_id uuid references public.profiles(id),
 action text not null, subject_type text not null, subject_id uuid,
 reason text, created_at timestamptz not null default now()
);

create or replace function public.review_verification(p_request_id uuid,p_decision text,p_reason text)
returns void language plpgsql security definer set search_path = '' as $$
declare req public.organization_verification_requests%rowtype;
begin
 if not public.is_admin() then raise exception 'Administrator permission required'; end if;
 if p_decision not in ('approved','rejected','more_info') then raise exception 'Invalid review decision'; end if;
 if length(trim(coalesce(p_reason,'')))<4 then raise exception 'A meaningful review reason is required'; end if;
 select * into req from public.organization_verification_requests where id=p_request_id and status='pending' for update;
 if not found then raise exception 'Pending verification request not found'; end if;
 if exists(select 1 from public.organizations where id=req.organization_id and owner_id=auth.uid()) then
   raise exception 'Cannot review your own organization';
 end if;
 update public.organization_verification_requests set status=p_decision,reviewer_id=auth.uid(),reviewer_reason=p_reason,reviewed_at=now() where id=p_request_id;
 update public.organizations set verification_status=case when p_decision='approved' then 'approved' when p_decision='rejected' then 'rejected' else 'pending' end,
 verified_at=case when p_decision='approved' then now() else null end where id=req.organization_id;
 insert into public.audit_logs(actor_id,action,subject_type,subject_id,reason)
 values(auth.uid(),'verification_'||p_decision,'organization',req.organization_id,p_reason);
end; $$;

create or replace function public.revoke_organization(p_organization_id uuid,p_reason text)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if not public.is_admin() then raise exception 'Administrator permission required'; end if;
 if length(trim(coalesce(p_reason,'')))<4 then raise exception 'Reason is required'; end if;
 update public.organizations set verification_status='suspended',verified_at=null where id=p_organization_id;
 update public.opportunities set status='suspended' where organization_id=p_organization_id and status='published';
 insert into public.audit_logs(actor_id,action,subject_type,subject_id,reason)
 values(auth.uid(),'verification_revoked','organization',p_organization_id,p_reason);
end; $$;

-- Enable RLS on every public table.
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_verification_requests enable row level security;
alter table public.verification_evidence enable row level security;
alter table public.opportunities enable row level security;
alter table public.applications enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.reports enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles select own or admin" on public.profiles for select using (id=auth.uid() or public.is_admin());
create policy "profiles update own" on public.profiles for update using(id=auth.uid()) with check(id=auth.uid());
create policy "organizations read approved or own or admin" on public.organizations for select using(verification_status='approved' or owner_id=auth.uid() or public.is_admin());
create policy "employers insert own organization" on public.organizations for insert to authenticated with check (owner_id=auth.uid() and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='employer') and verification_status='unverified');
create policy "employers update own organization" on public.organizations for update to authenticated using (owner_id=auth.uid() or public.is_admin()) with check(owner_id=auth.uid() or public.is_admin());
create policy "requests read owner or admin" on public.organization_verification_requests for select to authenticated using (public.is_admin() or exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid()));
create policy "requests insert employer own" on public.organization_verification_requests for insert to authenticated with check(status='pending' and reviewer_id is null and reviewed_at is null and exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid() and o.verification_status<>'suspended'));
create policy "requests update admin" on public.organization_verification_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "evidence owner or admin reads" on public.verification_evidence for select to authenticated using(public.is_admin() or exists(select 1 from public.organization_verification_requests r join public.organizations o on r.organization_id=o.id where r.id=request_id and o.owner_id=auth.uid()));
create policy "evidence employer upload" on public.verification_evidence for insert to authenticated with check (exists(select 1 from public.organization_verification_requests r join public.organizations o on r.organization_id=o.id where r.id=request_id and o.owner_id=auth.uid() and r.status='pending'));
create policy "read published listings" on public.opportunities for select using(status='published' or public.is_admin() or exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid()));
create policy "approved employers publish own" on public.opportunities for insert to authenticated with check (exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid() and (status<>'published' or o.verification_status='approved')));
create policy "employers change own listings" on public.opportunities for update to authenticated using(public.is_admin() or exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid())) with check(public.is_admin() or exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid()));
create policy "read own or employer applications" on public.applications for select to authenticated using(user_id=auth.uid() or public.is_admin() or exists(select 1 from public.opportunities o join public.organizations g on o.organization_id=g.id where o.id=opportunity_id and g.owner_id=auth.uid()));
create policy "students insert applications" on public.applications for insert to authenticated with check(user_id=auth.uid() and status='Submitted' and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='student'));
create policy "students withdraw or employers review" on public.applications for update to authenticated using(user_id=auth.uid() or public.is_admin() or exists(select 1 from public.opportunities o join public.organizations g on o.organization_id=g.id where o.id=opportunity_id and g.owner_id=auth.uid())) with check(user_id=auth.uid() or public.is_admin() or exists(select 1 from public.opportunities o join public.organizations g on o.organization_id=g.id where o.id=opportunity_id and g.owner_id=auth.uid()));
create policy "saved select own" on public.saved_opportunities for select to authenticated using(user_id=auth.uid());
create policy "saved insert own" on public.saved_opportunities for insert to authenticated with check(user_id=auth.uid());
create policy "saved delete own" on public.saved_opportunities for delete to authenticated using(user_id=auth.uid());
create policy "reports select own or admin" on public.reports for select to authenticated using(user_id=auth.uid() or public.is_admin());
create policy "reports submit own" on public.reports for insert to authenticated with check(user_id=auth.uid() and status='new');
create policy "reports admin update" on public.reports for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "notifications read own" on public.notifications for select to authenticated using(user_id=auth.uid());
create policy "notifications update own" on public.notifications for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "audit admin only" on public.audit_logs for select to authenticated using(public.is_admin());

-- Private buckets: documents are never publicly readable.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('resumes','resumes',false,5242880,array['application/pdf']),
       ('verification-evidence','verification-evidence',false,5242880,array['application/pdf','image/png','image/jpeg'])
 on conflict(id) do nothing;

create policy "students upload own resumes" on storage.objects for insert to authenticated
 with check(bucket_id='resumes' and (storage.foldername(name))[1]=auth.uid()::text and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='student'));
create policy "resume access by applicant employer admin" on storage.objects for select to authenticated
 using(bucket_id='resumes' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin() or exists(
  select 1 from public.applications a join public.opportunities o on a.opportunity_id=o.id join public.organizations g on o.organization_id=g.id where a.cv_path=name and g.owner_id=auth.uid())));
create policy "employer evidence uploads" on storage.objects for insert to authenticated
 with check(bucket_id='verification-evidence' and (storage.foldername(name))[1]=auth.uid()::text and exists(select 1 from public.organizations o where o.owner_id=auth.uid()));
create policy "evidence viewed by owner or admin" on storage.objects for select to authenticated
 using(bucket_id='verification-evidence' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()));

create index if not exists opportunities_published_filter on public.opportunities(status,field,location_state,created_at desc);
create index if not exists opportunities_org on public.opportunities(organization_id);
create index if not exists applications_user on public.applications(user_id);
create index if not exists applications_opp on public.applications(opportunity_id);
create index if not exists verification_pending on public.organization_verification_requests(status,created_at desc);
create index if not exists audit_subject on public.audit_logs(subject_id,created_at desc);

-- Provision an admin only from Supabase SQL Editor or a trusted backend using
-- the service role, AFTER an admin account has registered:
-- update public.profiles set role='admin' where id='<AUTH_USER_UUID>';
-- Never expose a service_role key or admin provisioning in the public frontend.
