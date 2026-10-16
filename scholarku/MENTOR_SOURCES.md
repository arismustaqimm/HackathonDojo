# Mentor discovery: sources and consent

The twenty records in `mentor-data.js` refer to real, public professional profiles retrieved from GitHub on 16 October 2026. Each record includes its direct source URL. The finance, data/AI, security/SOC, software and leadership descriptions summarize publicly displayed bios and projects. Titles are included where explicitly stated by the profile owner; they are self-reported and have not been independently checked with an employer. These sources do not establish willingness to review CVs or a relationship with ScholarKu. No email addresses or profile photographs were copied.

The public GitHub profiles for all twenty handles were fetched successfully during this update. They remain editable by their owners. Search and read the source before relying on a role. Titles such as “investment banker”, “Senior SOC Manager”, “Cybersecurity Administrative Director” or “Data Scientist Intern” have not been invented for people without supporting evidence. More of these precise niches can be added when a real person and verifiable public source are available.

These people have **not enrolled in ScholarKu**. The product labels them as public references. A student can register interest in a session or CV review, but the request is held with `waiting_for_mentor` status until the selected person joins and their identity/consent is checked. A CV remains private to the student while waiting. An interest request is not sent as an email or attributed to the named person. Alternatively students may visit a person's own public profile and follow any contact/mentoring route the person provides there.

## Register a participating mentor

Obtain the person's agreement and verify their identity through their own public contact channel. Have them create their own ScholarKu account. In Supabase SQL Editor, link the verified account to the matching source record:

```sql
update public.mentors
set linked_user_id = 'VERIFIED_AUTH_USER_UUID', profile_status = 'enrolled'
where id = 'MATCHING_PUBLIC_PROFILE_HANDLE';
```

Only a database administrator can establish this link. Users cannot select a name from the directory to impersonate a mentor. An enrolled mentor can open **Mentorship → My requests** to read requests addressed to their account, view permitted CVs through expiring URLs, accept/decline/complete requests, and write private feedback or session arrangements. Students see the reply in the same request. There is no automatic claim of employment verification.

To stop accepting requests, set `profile_status='unavailable'`. This also revokes mentor access to CVs. Do not move an existing mentor record to a different person: create a new record for a new identity.

To add a different consenting mentor, create a new row in `public.mentors` with their own name, accurate role/discipline, biography and public source/profile URLs. Then link their verified account as above. Do not link a friend or test user to a famous person's source record. The database prevents reassignment of an enrolled mentor identity and automatically activates waiting requests when that exact mentor enrols.

## Research access limitation

The cloud egress policy blocked direct checks of MentorCruise, ADPList and the supplied programme sites. A domain-specific environment configuration draft was saved for review. Public GitHub bios and authored projects were an accessible first-party alternative; blocked websites were not treated as verified. Coding Coach's public historical directory was inspected during research but its dated 2019 roles were not imported as current appointments.
