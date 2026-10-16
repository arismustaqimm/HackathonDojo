import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
const ids = {
  a: "11111111-1111-4111-8111-111111111111",
  b: "22222222-2222-4222-8222-222222222222",
  mentor: "33333333-3333-4333-8333-333333333333",
  admin: "44444444-4444-4444-8444-444444444444",
  rate: "55555555-5555-4555-8555-555555555555",
};
let db, requestId, messageId;
const migration = await readFile(
  new URL("../database/002_community_mentorship.sql", import.meta.url),
  "utf8",
);
async function as(user) {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
    user ? ids[user] : "",
  ]);
  await db.exec(
    "set role " +
      (user === "anon" ? "anon" : user ? "authenticated" : "postgres"),
  );
}
before(async () => {
  db = new PGlite();
  await db.exec(`
 create role anon;create role authenticated;
 create schema auth;create schema storage;
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 create table public.profiles(id uuid primary key,full_name text,role text);
 create function public.is_admin() returns boolean language sql stable security definer set search_path='' as $$select exists(select 1 from public.profiles where id=auth.uid() and role='admin')$$;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text references storage.buckets(id),name text,unique(bucket_id,name));
 create function storage.foldername(text) returns text[] language sql immutable as $$select string_to_array($1,'/')$$;
 alter table storage.objects enable row level security;
 grant usage on schema public,auth,storage to anon,authenticated;
 grant select,insert,delete on storage.objects to authenticated;
 insert into public.profiles values('${ids.a}','Student A','student'),('${ids.b}','Student B','student'),('${ids.mentor}','Enrolled Mentor','student'),('${ids.admin}','Moderator','admin');
 `);
  await db.exec(migration);
});
after(async () => {
  await db?.close();
});
test("migration is repeatable and starts with real empty communities and 20 sourced references", async () => {
  assert.equal(
    (await db.query("select count(*)::int as n from public.communities"))
      .rows[0].n,
    6,
  );
  assert.equal(
    (await db.query("select count(*)::int as n from public.community_messages"))
      .rows[0].n,
    0,
  );
  assert.equal(
    (await db.query("select count(*)::int as n from public.mentors")).rows[0].n,
    20,
  );
  await db.exec(migration);
  assert.equal(
    (await db.query("select count(*)::int as n from public.mentors")).rows[0].n,
    20,
  );
});
test("anonymous visitors can read only community metadata and aggregate counts", async () => {
  await as("anon");
  assert.equal(
    (await db.query("select * from public.communities")).rows.length,
    6,
  );
  assert.equal(
    (await db.query("select * from public.community_stats()")).rows.every(
      (x) => Number(x.member_count) === 0,
    ),
    true,
  );
  await assert.rejects(db.query("select * from public.community_messages"));
  await assert.rejects(db.query("select public.join_community('cyber')"));
});
test("only confirmed members can send and read; author name and timestamp come from the database", async () => {
  await as("a");
  assert.equal(
    (await db.query("select * from public.community_messages")).rows.length,
    0,
  );
  await assert.rejects(
    db.query(
      "insert into public.community_messages(community_id,channel,user_id,body) values('cyber','general',$1,'Not enrolled yet')",
      [ids.a],
    ),
  );
  await db.query("select public.join_community('cyber')");
  await db.query("select public.join_community('cyber')");
  assert.equal(
    (await db.query("select * from public.community_memberships")).rows.length,
    1,
  );
  const row = (
    await db.query(
      "insert into public.community_messages(community_id,channel,user_id,author_name,body,created_at) values('cyber','general',$1,'Forged executive','How do I prepare for a SOC role?','2000-01-01') returning *",
      [ids.a],
    )
  ).rows[0];
  messageId = row.id;
  assert.equal(row.author_name, "Student A");
  assert(new Date(row.created_at).getFullYear() > 2020);
  await assert.rejects(
    db.query(
      "insert into public.community_messages(community_id,channel,user_id,body) values('cyber','general',$1,'Forged identity')",
      [ids.b],
    ),
  );
  await assert.rejects(
    db.query(
      "insert into public.community_messages(community_id,channel,user_id,body) values('cyber','unknown-channel',$1,'Invalid channel')",
      [ids.a],
    ),
  );
});
test("members in a different account see genuine messages but cannot edit or delete another author", async () => {
  await as("b");
  assert.equal(
    (await db.query("select * from public.community_messages")).rows.length,
    0,
  );
  await db.query("select public.join_community('cyber')");
  assert.equal(
    (await db.query("select * from public.community_messages")).rows[0].body,
    "How do I prepare for a SOC role?",
  );
  assert.equal(
    (
      await db.query(
        "delete from public.community_messages where id=$1 returning id",
        [messageId],
      )
    ).rows.length,
    0,
  );
  await assert.rejects(
    db.query("update public.community_messages set body=$1 where id=$2", [
      "Changed",
      messageId,
    ]),
  );
  await db.query(
    "insert into public.community_reports(message_id,user_id,reason) values($1,$2,$3)",
    [messageId, ids.b, "A moderation test report"],
  );
  await as("admin");
  assert.equal(
    (await db.query("select * from public.community_reports")).rows.length,
    1,
  );
});
test("leaving revokes chat access and inactive communities do not accept members", async () => {
  await as("a");
  await db.query("delete from public.community_memberships where user_id=$1", [
    ids.a,
  ]);
  assert.equal(
    (await db.query("select * from public.community_messages")).rows.length,
    0,
  );
  await as();
  await db.query("update public.communities set active=false where id='tech'");
  await as("a");
  await assert.rejects(db.query("select public.join_community('tech')"));
  await as();
  await db.query("update public.communities set active=true where id='tech'");
});
test("CV uploads are private and an unregistered reference never receives a false booking", async () => {
  await as("a");
  await db.query(
    "insert into storage.objects(bucket_id,name) values('mentor-cvs',$1)",
    [ids.a + "/cv.pdf"],
  );
  const row = (
    await db.query(
      "insert into public.mentorship_requests(user_id,mentor_id,request_type,topic,cv_path,status,requester_name) values($1,'Neo23x0','cv_review','Please review my SOC analyst CV',$2,'accepted','Forged requester') returning *",
      [ids.a, ids.a + "/cv.pdf"],
    )
  ).rows[0];
  requestId = row.id;
  assert.equal(row.status, "waiting_for_mentor");
  assert.equal(row.requester_name, "Student A");
  await assert.rejects(
    db.query(
      "insert into public.mentorship_requests(user_id,mentor_id,request_type,topic,cv_path) values($1,'Neo23x0','cv_review','Missing owned CV upload',$2)",
      [ids.a, ids.b + "/cv.pdf"],
    ),
  );
  await as("b");
  assert.equal(
    (await db.query("select * from public.mentorship_requests")).rows.length,
    0,
  );
  assert.equal(
    (
      await db.query(
        "select * from storage.objects where bucket_id='mentor-cvs'",
      )
    ).rows.length,
    0,
  );
  await assert.rejects(
    db.query(
      "insert into storage.objects(bucket_id,name) values('mentor-cvs',$1)",
      [ids.a + "/not-mine.pdf"],
    ),
  );
});
test("enrolled mentors receive the selected requests and permitted CVs, and cannot forge request content", async () => {
  await as();
  await db.query(
    "update public.mentors set linked_user_id=$1,profile_status='enrolled' where id='Neo23x0'",
    [ids.mentor],
  );
  await as("mentor");
  const rows = (await db.query("select * from public.mentorship_requests"))
    .rows;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].status, "submitted");
  assert.equal(
    (
      await db.query(
        "select * from storage.objects where bucket_id='mentor-cvs'",
      )
    ).rows.length,
    1,
  );
  await assert.rejects(
    db.query(
      "update public.mentorship_requests set topic='Altered by mentor' where id=$1",
      [requestId],
    ),
  );
  await db.query(
    "update public.mentorship_requests set status='accepted' where id=$1",
    [requestId],
  );
  await db.query(
    "update public.mentorship_requests set mentor_reply=$2 where id=$1",
    [requestId, "Explain measurable outcomes in your CV."],
  );
  await db.query(
    "update public.mentorship_requests set status='completed' where id=$1",
    [requestId],
  );
  await as("a");
  assert.equal(
    (
      await db.query(
        "select mentor_reply from public.mentorship_requests where id=$1",
        [requestId],
      )
    ).rows[0].mentor_reply,
    "Explain measurable outcomes in your CV.",
  );
  await assert.rejects(
    db.query(
      "update public.mentorship_requests set mentor_reply='Forged feedback' where id=$1",
      [requestId],
    ),
  );
  assert.equal(
    (
      await db.query(
        "select status from public.mentorship_requests where id=$1",
        [requestId],
      )
    ).rows[0].status,
    "completed",
  );
  await assert.rejects(
    db.query(
      "update public.mentorship_requests set status='accepted' where id=$1",
      [requestId],
    ),
  );
  await as();
  await assert.rejects(
    db.query("update public.mentors set linked_user_id=$1 where id='Neo23x0'", [
      ids.b,
    ]),
  );
});
test("unavailability revokes mentor CV access; migration reruns preserve enrolled identities", async () => {
  await as();
  await db.exec(migration);
  assert.equal(
    (
      await db.query(
        "select linked_user_id from public.mentors where id='Neo23x0'",
      )
    ).rows[0].linked_user_id,
    ids.mentor,
  );
  await db.query(
    "update public.mentors set profile_status='unavailable' where id='Neo23x0'",
  );
  await as("mentor");
  assert.equal(
    (
      await db.query(
        "select * from storage.objects where bucket_id='mentor-cvs'",
      )
    ).rows.length,
    0,
  );
  await as("a");
  await assert.rejects(
    db.query(
      "insert into public.mentorship_requests(user_id,mentor_id,request_type,topic) values($1,'Neo23x0','session','A session while unavailable')",
      [ids.a],
    ),
  );
});
test("message rate limit cannot be bypassed by deleting earlier messages", async () => {
  await as();
  await db.query(
    "insert into public.profiles(id,full_name,role) values($1,'Rate Test','student') on conflict do nothing",
    [ids.rate],
  );
  await as("rate");
  await db.query("select public.join_community('finance')");
  for (let i = 0; i < 10; i++) {
    const message = (
      await db.query(
        "insert into public.community_messages(community_id,channel,user_id,body) values('finance','general',$1,'Rate limit check') returning id",
        [ids.rate],
      )
    ).rows[0];
    await db.query("delete from public.community_messages where id=$1", [
      message.id,
    ]);
  }
  await assert.rejects(
    db.query(
      "insert into public.community_messages(community_id,channel,user_id,body) values('finance','general',$1,'Too many posts')",
      [ids.rate],
    ),
    /Please wait/,
  );
  await assert.rejects(db.query("select * from public.community_post_events"));
});
