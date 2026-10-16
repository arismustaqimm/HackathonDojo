-- Run once in the existing ScholarKu project's SQL Editor, AFTER schema.sql.
-- Additive and repeatable: preserves existing users, applications and documents.
begin;

create table if not exists public.communities (
 id text primary key, name text not null, description text not null,
 active boolean not null default true
);
create table if not exists public.community_channels (
 community_id text not null references public.communities(id) on delete cascade,
 slug text not null, primary key(community_id,slug)
);
create table if not exists public.community_memberships (
 community_id text not null references public.communities(id) on delete cascade,
 user_id uuid not null references public.profiles(id) on delete cascade,
 joined_at timestamptz not null default now(), primary key(community_id,user_id)
);
create table if not exists public.community_messages (
 id uuid primary key default gen_random_uuid(),
 community_id text not null, channel text not null,
 user_id uuid not null references public.profiles(id) on delete cascade,
 author_name text not null default 'Member',
 body text not null check(length(trim(body)) between 1 and 2000),
 created_at timestamptz not null default now(),
 foreign key(community_id,channel) references public.community_channels(community_id,slug)
);
create table if not exists public.community_reports (
 id uuid primary key default gen_random_uuid(),
 message_id uuid not null references public.community_messages(id) on delete cascade,
 user_id uuid not null references public.profiles(id) on delete cascade,
 reason text not null check(length(trim(reason)) between 5 and 1000),
 created_at timestamptz not null default now(), unique(message_id,user_id)
);
-- Private rate-limit events survive message deletion; no member can read/change them.
create table if not exists public.community_post_events (
 user_id uuid not null references public.profiles(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.community_post_events enable row level security;
revoke all on public.community_post_events from public,anon,authenticated;

insert into public.communities(id,name,description) values
 ('tech','Code & Coffee MY','Software development, hackathons and student projects.'),
 ('scholars','Scholarship Seekers','Funding applications, interviews and study opportunities.'),
 ('cyber','SOC & Cyber Defence','Security operations, incident response and defensive security careers.'),
 ('design','Creators & Designers','Design portfolios, user research and creative practice.'),
 ('finance','Finance & Investment Circle','Financial analysis, investment banking and early-career finance.'),
 ('ai','Data & AI Malaysia','Data science, machine learning, analytics and responsible AI.')
 on conflict(id) do update set name=excluded.name,description=excluded.description;
insert into public.community_channels(community_id,slug)
 select id,'general' from public.communities on conflict do nothing;
insert into public.community_channels(community_id,slug) values
 ('tech','projects'),('tech','hackathons'),('tech','skill-exchange'),
 ('scholars','applications'),('scholars','interviews'),
 ('cyber','soc-careers'),('cyber','incident-response'),('cyber','ctf-learning'),
 ('design','portfolio-feedback'),('design','opportunities'),
 ('finance','investment-banking'),('finance','quant-research'),('finance','interviews'),
 ('ai','data-science'),('ai','machine-learning'),('ai','projects') on conflict do nothing;

create or replace function public.is_community_member(p_community_id text)
 returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.community_memberships where community_id=p_community_id and user_id=auth.uid());
$$;
revoke all on function public.is_community_member(text) from public;
grant execute on function public.is_community_member(text) to authenticated;

create or replace function public.community_stats()
 returns table(community_id text,member_count bigint,message_count bigint)
 language sql stable security definer set search_path='' as $$
 select c.id,(select count(*) from public.community_memberships m where m.community_id=c.id),
 (select count(*) from public.community_messages t where t.community_id=c.id)
 from public.communities c where c.active;
$$;
revoke all on function public.community_stats() from public;
grant execute on function public.community_stats() to anon,authenticated;

create or replace function public.join_community(p_community_id text)
 returns void language plpgsql security invoker set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Sign in to join a community'; end if;
 insert into public.community_memberships(community_id,user_id) values(p_community_id,auth.uid()) on conflict do nothing;
end; $$;
revoke all on function public.join_community(text) from public;
grant execute on function public.join_community(text) to authenticated;

create or replace function public.set_community_message_author()
 returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.user_id is distinct from auth.uid() then raise exception 'Message author must be the signed-in user'; end if;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
 if (select count(*) from public.community_post_events where user_id=auth.uid() and created_at>now()-interval '10 seconds')>=10 then raise exception 'Please wait before sending more messages'; end if;
 insert into public.community_post_events(user_id) values(auth.uid());
 select coalesce(nullif(trim(full_name),''),'Member') into new.author_name from public.profiles where id=auth.uid();
 new.created_at=now();
 return new;
end; $$;
drop trigger if exists community_message_author on public.community_messages;
create trigger community_message_author before insert on public.community_messages
 for each row execute function public.set_community_message_author();

alter table public.communities enable row level security;
alter table public.community_channels enable row level security;
alter table public.community_memberships enable row level security;
alter table public.community_messages enable row level security;
alter table public.community_reports enable row level security;
drop policy if exists community_directory_read on public.communities;
create policy community_directory_read on public.communities for select using(active);
drop policy if exists community_channels_read on public.community_channels;
create policy community_channels_read on public.community_channels for select using(exists(select 1 from public.communities c where c.id=community_id and c.active));
drop policy if exists membership_read_own on public.community_memberships;
create policy membership_read_own on public.community_memberships for select to authenticated using(user_id=auth.uid());
drop policy if exists membership_join_own on public.community_memberships;
create policy membership_join_own on public.community_memberships for insert to authenticated
 with check(user_id=auth.uid() and exists(select 1 from public.communities c where c.id=community_id and c.active));
drop policy if exists membership_leave_own on public.community_memberships;
create policy membership_leave_own on public.community_memberships for delete to authenticated using(user_id=auth.uid());
drop policy if exists member_messages_read on public.community_messages;
create policy member_messages_read on public.community_messages for select to authenticated
 using(public.is_community_member(community_id) and exists(select 1 from public.communities c where c.id=community_id and c.active));
drop policy if exists member_messages_send on public.community_messages;
create policy member_messages_send on public.community_messages for insert to authenticated
 with check(user_id=auth.uid() and public.is_community_member(community_id) and exists(select 1 from public.communities c where c.id=community_id and c.active));
drop policy if exists member_messages_delete on public.community_messages;
create policy member_messages_delete on public.community_messages for delete to authenticated using(user_id=auth.uid() or public.is_admin());
drop policy if exists member_reports_submit on public.community_reports;
create policy member_reports_submit on public.community_reports for insert to authenticated
 with check(user_id=auth.uid() and exists(select 1 from public.community_messages m where m.id=message_id and public.is_community_member(m.community_id)));
drop policy if exists member_reports_read on public.community_reports;
create policy member_reports_read on public.community_reports for select to authenticated using(user_id=auth.uid() or public.is_admin());

create table if not exists public.mentors (
 id text primary key, name text not null, role_title text not null,
 discipline text not null, bio text not null,
 profile_url text not null check(profile_url like 'https://%'),
 source_url text not null check(source_url like 'https://%'),
 source_note text not null,
 profile_status text not null default 'public_reference' check(profile_status in ('public_reference','enrolled','unavailable')),
 linked_user_id uuid unique references public.profiles(id),
 check(profile_status<>'enrolled' or linked_user_id is not null)
);
create table if not exists public.mentorship_requests (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id) on delete cascade,
 mentor_id text not null references public.mentors(id),
 request_type text not null check(request_type in ('cv_review','session')),
 topic text not null check(length(trim(topic)) between 10 and 2000),
 cv_path text,
 requester_name text not null default 'Student',
 mentor_reply text not null default '' check(length(mentor_reply)<=5000),
 status text not null default 'waiting_for_mentor' check(status in ('waiting_for_mentor','submitted','accepted','declined','completed','cancelled')),
 created_at timestamptz not null default now(),
 check((request_type='cv_review' and cv_path is not null) or (request_type='session' and cv_path is null))
);
alter table public.mentorship_requests add column if not exists mentor_reply text not null default '' check(length(mentor_reply)<=5000);
create or replace function public.guard_mentorship_request()
 returns trigger language plpgsql security definer set search_path='' as $$
declare m public.mentors%rowtype;
begin
 select * into m from public.mentors where id=new.mentor_id;
 if tg_op='INSERT' then
  if auth.uid() is null or new.user_id is distinct from auth.uid() then raise exception 'Sign in to request mentoring'; end if;
  if m.profile_status='unavailable' then raise exception 'Mentor is not accepting requests'; end if;
  if new.cv_path is not null and (split_part(new.cv_path,'/',1)<>auth.uid()::text or not exists(select 1 from storage.objects where bucket_id='mentor-cvs' and name=new.cv_path)) then raise exception 'A private CV upload owned by the requester is required'; end if;
  new.status=case when m.profile_status='enrolled' then 'submitted' else 'waiting_for_mentor' end;
  select coalesce(nullif(trim(full_name),''),'Student') into new.requester_name from public.profiles where id=auth.uid();
  new.created_at=now();
 else
  if new.id<>old.id or new.user_id<>old.user_id or new.mentor_id<>old.mentor_id or new.request_type<>old.request_type or new.topic<>old.topic or new.cv_path is distinct from old.cv_path or new.requester_name<>old.requester_name or new.created_at<>old.created_at then raise exception 'Request content is immutable'; end if;
  if new.status='submitted' and old.status='waiting_for_mentor' and m.profile_status='enrolled' and new.mentor_reply is not distinct from old.mentor_reply and (auth.uid() is null or public.is_admin()) then return new; end if;
  if auth.uid()=old.user_id and new.status='cancelled' and old.status in ('waiting_for_mentor','submitted','accepted') and new.mentor_reply is not distinct from old.mentor_reply then return new; end if;
  if auth.uid()=m.linked_user_id and m.profile_status='enrolled' then
   if new.status in ('accepted','declined') and old.status in ('waiting_for_mentor','submitted') then return new; end if;
   if new.status='completed' and old.status='accepted' then return new; end if;
   if new.status=old.status and old.status in ('submitted','accepted','declined','completed') then return new; end if;
  end if;
  raise exception 'Request status change is not permitted';
 end if;
 return new;
end; $$;
drop trigger if exists mentorship_request_guard on public.mentorship_requests;
create trigger mentorship_request_guard before insert or update on public.mentorship_requests for each row execute function public.guard_mentorship_request();
create or replace function public.activate_mentor_requests()
 returns trigger language plpgsql security definer set search_path='' as $$
begin
 if old.linked_user_id is not null and new.linked_user_id is distinct from old.linked_user_id then raise exception 'An enrolled mentor identity cannot be reassigned'; end if;
 if new.profile_status='enrolled' and (old.profile_status<>'enrolled' or old.linked_user_id is null) then
  update public.mentorship_requests set status='submitted' where mentor_id=new.id and status='waiting_for_mentor';
 end if;
 return new;
end; $$;
drop trigger if exists mentor_enrolment_activates_requests on public.mentors;
create trigger mentor_enrolment_activates_requests after update on public.mentors for each row execute function public.activate_mentor_requests();
alter table public.mentors enable row level security;
alter table public.mentorship_requests enable row level security;
drop policy if exists mentor_directory_read on public.mentors;
create policy mentor_directory_read on public.mentors for select using(true);
drop policy if exists mentor_directory_admin on public.mentors;
create policy mentor_directory_admin on public.mentors for all to authenticated using(public.is_admin()) with check(public.is_admin());
drop policy if exists mentorship_requests_read on public.mentorship_requests;
create policy mentorship_requests_read on public.mentorship_requests for select to authenticated
 using(user_id=auth.uid() or exists(select 1 from public.mentors m where m.id=mentor_id and m.linked_user_id=auth.uid() and m.profile_status='enrolled'));
drop policy if exists mentorship_requests_insert on public.mentorship_requests;
create policy mentorship_requests_insert on public.mentorship_requests for insert to authenticated with check(user_id=auth.uid());
drop policy if exists mentorship_requests_update on public.mentorship_requests;
create policy mentorship_requests_update on public.mentorship_requests for update to authenticated
 using(user_id=auth.uid() or exists(select 1 from public.mentors m where m.id=mentor_id and m.linked_user_id=auth.uid() and m.profile_status='enrolled'))
 with check(user_id=auth.uid() or exists(select 1 from public.mentors m where m.id=mentor_id and m.linked_user_id=auth.uid() and m.profile_status='enrolled'));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('mentor-cvs','mentor-cvs',false,5242880,array['application/pdf']) on conflict(id) do nothing;
drop policy if exists mentorship_cv_upload on storage.objects;
create policy mentorship_cv_upload on storage.objects for insert to authenticated
 with check(bucket_id='mentor-cvs' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists mentorship_cv_read on storage.objects;
create policy mentorship_cv_read on storage.objects for select to authenticated
 using(bucket_id='mentor-cvs' and ((storage.foldername(name))[1]=auth.uid()::text or exists(
  select 1 from public.mentorship_requests r join public.mentors m on m.id=r.mentor_id
  where r.cv_path=storage.objects.name and m.linked_user_id=auth.uid() and m.profile_status='enrolled' and r.status in ('submitted','accepted','completed'))));
drop policy if exists mentorship_cv_delete on storage.objects;
create policy mentorship_cv_delete on storage.objects for delete to authenticated
 using(bucket_id='mentor-cvs' and (storage.foldername(name))[1]=auth.uid()::text);

create index if not exists community_messages_history on public.community_messages(community_id,channel,created_at desc,id);
create index if not exists community_post_events_user on public.community_post_events(user_id,created_at desc);
create index if not exists community_memberships_user on public.community_memberships(user_id);
create index if not exists mentorship_requests_user on public.mentorship_requests(user_id,created_at desc);
create index if not exists mentorship_requests_mentor on public.mentorship_requests(mentor_id,created_at desc);

grant select on public.communities,public.community_channels,public.mentors to anon,authenticated;
grant select,insert,delete on public.community_memberships,public.community_messages to authenticated;
grant select,insert on public.community_reports to authenticated;
grant select,insert,update on public.mentorship_requests to authenticated;
grant insert,update,delete on public.mentors to authenticated;

-- Real public references; preserve existing enrolment and linked accounts on reruns.
insert into public.mentors(id,name,role_title,discipline,bio,profile_url,source_url,source_note)
values
 ('yhilpisch','Dr. Yves Hilpisch','CEO, The Python Quants — finance & Python','Finance','Public profile identifies the CEO of The Python Quants and its finance training programme.','https://github.com/yhilpisch','https://github.com/yhilpisch','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('stefan-jansen','Stefan Jansen','Machine learning for trading','Finance','Author-maintained work on machine learning, investment research and trading systems.','https://github.com/stefan-jansen','https://github.com/stefan-jansen','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('robcarver17','Robert Carver','Systematic trading & financial writing','Finance','Public profile describes a trader and writer and links to an open-source systematic trading project.','https://github.com/robcarver17','https://github.com/robcarver17','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('pmorissette','Philippe Morissette','Quantitative finance software','Finance','Public projects include financial analysis and strategy backtesting tools.','https://github.com/pmorissette','https://github.com/pmorissette','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('Neo23x0','Florian Roth','SOC detection engineering, Sigma & YARA','Cybersecurity','Public work focuses on digital forensics, incident response and detection rules.','https://github.com/Neo23x0','https://github.com/Neo23x0','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('Cyb3rWard0g','Roberto Rodriguez','Security research & threat detection','Cybersecurity','Public security research projects provide material for defensive engineering and threat hunting.','https://github.com/Cyb3rWard0g','https://github.com/Cyb3rWard0g','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('clintgibler','Clint Gibler','Security research & education','Cybersecurity','Public security education and research resources for application security practitioners.','https://github.com/clintgibler','https://github.com/clintgibler','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('shehackspurple','SheHacksPurple','AppSec, DevSecOps & cloud security coaching','Cybersecurity','Public bio explicitly lists training, coaching and knowledge sharing in application and cloud security.','https://github.com/shehackspurple','https://github.com/shehackspurple','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('joshmadakor1','Josh Madakor','IT & cybersecurity learning projects','Cybersecurity','Public hands-on projects support early-career IT and cybersecurity learning.','https://github.com/joshmadakor1','https://github.com/joshmadakor1','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('rasbt','Sebastian Raschka','AI research engineering & LLMs','Data & AI','Public bio identifies an AI Research Engineer working on large language models.','https://github.com/rasbt','https://github.com/rasbt','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('alexeygrigorev','Alexey Grigorev','DataTalks.Club & practical ML learning','Data & AI','Public profile links to DataTalks.Club and practical data and machine-learning projects.','https://github.com/alexeygrigorev','https://github.com/alexeygrigorev','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('eugeneyan','Eugene Yan','Principal Applied Scientist, Amazon','Data & AI','Public profile reports a Principal Applied Scientist role at Amazon and work on customer-facing machine-learning systems.','https://github.com/eugeneyan','https://github.com/eugeneyan','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('chiphuyen','Chip Huyen','AI engineering & ML systems','Data & AI','Public author projects cover AI engineering and machine-learning system design.','https://github.com/chiphuyen','https://github.com/chiphuyen','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('thu-vu92','Thu Vu','Data analytics & practical projects','Data & AI','Public data projects and educational material support analytics portfolios and learning.','https://github.com/thu-vu92','https://github.com/thu-vu92','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('khuyentran1401','Khuyen Tran','Production-ready data science','Data & AI','Public bio identifies the author of Production-Ready Data Science and founder of CodeCut.','https://github.com/khuyentran1401','https://github.com/khuyentran1401','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('krishnaik06','Krish C Naik','Data science, ML & deep learning','Data & AI','Public bio describes a data scientist with machine-learning and deep-learning experience.','https://github.com/krishnaik06','https://github.com/krishnaik06','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('PlayingNumbers','Ken Jee','Data science portfolio & career learning','Data & AI','Public profile identifies Ken Jee and links to educational project repositories.','https://github.com/PlayingNumbers','https://github.com/PlayingNumbers','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('sdras','Sarah Drasner','Distinguished Engineer, Google — AI & Web','Engineering leadership','Public profile reports a Distinguished Engineer role in Chrome’s AI/Web ecosystem and a previous Senior Director of Engineering role at Google.','https://github.com/sdras','https://github.com/sdras','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('swyx','Shawn Wang (swyx)','Software & AI engineering education','Software & AI','Public profile and projects connect software engineering, AI and developer learning.','https://github.com/swyx','https://github.com/swyx','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.'),
 ('ranaroussi','Ran Aroussi','Financial data tools & software infrastructure','Finance & software','Public profile describes software infrastructure work; public repositories include financial data tooling.','https://github.com/ranaroussi','https://github.com/ranaroussi','Public profile retrieved 16 October 2026. ScholarKu participation and present availability are unconfirmed.')
on conflict(id) do update set name=excluded.name,role_title=excluded.role_title,discipline=excluded.discipline,bio=excluded.bio,profile_url=excluded.profile_url,source_url=excluded.source_url,source_note=excluded.source_note;

commit;
