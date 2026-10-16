# Scholarku.com — Malaysian Student Opportunity Hub

**Hackathon-ready, mobile-responsive working prototype with an optional Supabase backend.**

Inspired by the clarity of [MyScholar](https://myscholar.my/) and the multi-category discovery of [Unstop](https://unstop.com/). This is an **original design**, not a copy of their branding, site assets, or code. All employers, scholarships, events, student posts and mentors bundled with this app are **fictional demo data**.

## Start the website (no installation needed)

Open `index.html` in a browser, or (recommended) run:

```bash
node --version     # Node.js 18+
npm run dev
```

Visit **http://localhost:5173**. No `npm install` is necessary.

The frontend is intentionally zero-dependency HTML + CSS + JavaScript so the hackathon demo works immediately, even before your team has configured Supabase. A future production version can be migrated to **Next.js + TypeScript + Tailwind CSS + shadcn/ui**, with Supabase retained for the database and auth.

## What's implemented right now

| Module | Local demo | Supabase-backed behavior |
|---|---|---|
| Home and responsive navigation | Working | Working |
| Scholarship, internship, event and graduate program search | Search, type, location, field, arrangement, organization class, education and graduate contract filters | Real approved-organization postings can appear alongside clearly marked samples |
| Student dashboards and profiles | Local demo state | Supabase Auth + profile updates |
| Bookmark opportunities | Browser persistence | Database records under RLS for live postings |
| Internship applications | Demo vacancies intentionally cannot accept actual applications | Applicant submission, duplicate protection, private PDF upload, status changes, withdrawal |
| Employer dashboard | Save sample organization, request review, submit sample internship after demo approval | Organization records, private evidence, admin review, verified-only publication, applicant status updates |
| Admin dashboard | Sample verification review and approval | Protected RPC approval/rejection + audit logs; RLS on sensitive data |
| Student Connect | Achievement posts | Demo/local only |
| Community servers and text channels | Functional simulated channels/messages | Realtime database/channel integration not yet wired |
| Skill exchange | Skill-exchange channel | Demo/local only |
| Mock assessment | 46 questions / 90 min across 15 + 30 + 1; one-shot answers, section timers, persistence | Browser practice mode only; **no genuine proctoring** |
| Mentorship and CV requests | Sample profiles and demo requests | Real mentor scheduling and files not connected |
| Voice calls | UI informational placeholder | **Not implemented** (LiveKit is a future option) |

### Demo script for the judges (~3–4 min)

1. Start on the homepage. Search **AI Workshops**, or browse opportunities by region, field and company type.
2. Click **Join for free → Enter as demo student**. Save an internship and view **Dashboard → Saved opportunities**.
3. Open **Community → Code & Coffee MY**. Explore channels, type a message, and share an achievement on Student Connect.
4. Open **Mock tests**. Start the assessment, answer one question, and demonstrate the locked answer and countdown.
5. Click the logout/switch icon (top right). Log in as **demo employer**. Save organization details and submit a verification request.
6. Log out, enter **demo admin**, approve the sample request (type a review reason), then switch back to demo employer and show that **New internship** becomes enabled.

**IMPORTANT:** The demo admin's approval is simulated, and does not validate any actual business. No fictional vacancy will accept a real student CV.

## Enabling Supabase (persistent full-stack internship workflow)

1. Create a new project at **supabase.com**.
2. Go to **SQL Editor**, create a new query, and run `database/schema.sql` once. It creates tables, functions, RLS policies, private resume/evidence buckets and indexes. Use a fresh project; this script is not a versioned migration.
3. Enable **Email** in Supabase Authentication. Choose whether you want mandatory email confirmation. Configure the correct Site URL and allowed Redirect URLs.
4. Open `config.js` and set:

```js
window.SCHOLARKU_CONFIG = {
  SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY'
};
```

5. Restart/reload the frontend. Sign up as an employer, complete the organization profile, and submit a review request. Sign up with a separate admin account, then grant admin role **only via trusted Supabase SQL Editor**, never from browser controls:

```sql
update public.profiles set role='admin'
where id='ACTUAL_ADMIN_AUTH_UUID';
```

6. Sign in as that admin account, review the pending request and approve or reject it. The decision and reviewer are recorded in the database. Approved employers can publish internships. Students can apply, upload a private PDF, and track status. Employers can review their own applicants and access CVs via short-lived signed links.
7. For public production launch, connect your actual verified data sources, conduct security and accessibility reviews, configure anti-abuse, consent, notification emails, monitoring and backup policies, and replace sample listings with authentic provider-approved ones.

**Never put the Supabase `service_role` key in `config.js`.** Only the public anon/publishable key belongs in browser code. Access control happens in PostgreSQL RLS and privilege-checked database functions, not merely by hiding buttons.

### Live-mode limitations

The Supabase implementation has been **written but not tested against a real hosted Supabase project**, because no Supabase project credentials were provided. Browser and syntax tests validate local demo behavior only. Review SQL and exercise all real auth, RLS, storage and review flows against your own test project before showing it as production-ready.

Realtime community chat, meeting scheduling, real mentor matching, external vacancy ingestion, voice communication, live proctoring, official employer checks and payment processing are **not** included. Use explicit provider permission or public official datasets for any actual listings; never pretend scraped jobs are independently verified.

## Architecture

- **Frontend:** responsive HTML5/CSS3 and no-build vanilla JavaScript (fastest self-contained demo).
- **Backend:** Supabase PostgreSQL/PostgREST/Auth/Storage with database Row-Level Security.
- **Roles:** student / employer / administrator (admin set only from trusted backend).
- **Trust layer:** evidence request → admin review RPC → approved status → publish gate → audit log, including revocation RPC.
- **Future growth:** Next.js App Router + TypeScript + Tailwind + shadcn/ui; Zod forms; React Query; Supabase Realtime; LiveKit for voice; background data ingest with moderation; Vercel deployment; Sentry monitoring and GitHub Actions CI.

## Deployment

For a static deployment, place `index.html`, `styles.css`, `app.js`, `supabase.js`, `config.js`, and `assets/` in Vercel/Netlify or any static hosting environment. The app uses hash routes (`#/internships`) to avoid needing server rewrites. **Do not deploy the SQL directory with public static assets**. Do not publish a live project until its security policies have been validated.

## Validation performed locally

- `node --check app.js` and `node --check supabase.js`
- Headless Chromium desktop and mobile rendering
- Page navigation, internship filter/reset, demo role sign-in, save and shortlist, community chat, locked mock-test progression
- Demo employer request → admin approval → verified-only sample publishing sequence

These checks do **not** substitute for testing the configured live backend.

## V2 — Malaysian official-source directory and dark UI

- `real-pages.js` adds a bilingual EN/BM homepage and official-provider directories for `#/internships` and `#/scholarships`.
- `real-theme.css` contains the MyScholar-inspired dark visual treatment and Apple system-font stack.
- Cards link externally to provider websites. They are **not verified open positions** and do not claim the provider endorses Scholarku.
- Logos use third-party favicon lookup and may not display on networks blocking Google favicons. Favicon display does not prove employer identity.
- The scholarship directory includes provider homepages where a specific current application endpoint could not be confirmed. Check the provider's latest information before applying.
- Existing local demo workflows for student communities, assessments, mentors, and employer verification are retained. Other pages may retain the original visual theme.
- Research confirmed the BNM 2026 internship and CIMB ASEAN Scholarship 2026 intakes are closed as of 16 October 2026. All other availability remains **unconfirmed**, not open.
- The initial version's fictional sample data still exists in the original JavaScript and may be visible on other routes such as Explore. These records remain labelled demo data.
- For production, implement server-side listing curation, logo asset licensing/attribution, a review log, periodic link checks, and complete BM translation of remaining pages.

## October 2026 update

The internship directory now contains 40 unique employers: all 31 requested employers plus nine additional original providers. The graduate directory contains 40 unique employers; the duplicated ExxonMobil link appears once. Google search wrappers have been replaced with their supplied direct employer destinations. Both directories show ten entries per page, with previous/next controls, numbered ranges, search, saved-state persistence, and copy-link actions. Graduate programmes have their own navigation entry and route (`#/graduates`).

The top-left appearance button switches between the original navy palette and the light palette across routes. Appearance and language are saved in the browser. The interface uses the Apple system font stack (Apple fonts when available, native platform fallbacks otherwise); no proprietary font download is required.

The shared English/Malay catalogue covers navigation, directories, dialogs, dashboards, community descriptions, assessment prompts/options and common notifications. Switching languages preserves the underlying form option values, so translated filters and submissions continue to work. Organization names, personal names, URLs, programming syntax and formal technical acronyms retain their original spelling. User-entered form values are preserved.

### Run and validate

Node.js 18 or later is required. The static application runs without production dependencies:

```sh
cd /workspace/HackathonDojo/scholarku
npm start
```

For repeatable development checks:

```sh
npm ci --cache /tmp/scholarku-npm-cache
npm run check
npm test
```

With the development server running on port 5173 in another terminal:

```sh
npm run test:browser
```

The browser test uses `/usr/bin/chromium` when present. Else install the Playwright Chromium browser with `npx playwright install chromium`, or set `CHROMIUM_PATH` to an installed Chromium executable. Browser downloads may require environment network access. Browser tests use an isolated browser context; the test profile does not affect your own browser data. They write screenshots under `/tmp`.

### Data limitations

The employer URLs are career directories, not a feed of confirmed vacancies. The provided links do not contain verified intake-specific opening and closing dates. Both date fields therefore display **Not confirmed — check employer**. Store confirmed ISO dates in `opening` and `closing` in `career-data.js` only after checking the relevant employer intake. Employer websites were blocked by the cloud environment's egress policy during this update, so their live responses and current application deadlines could not be verified. No hiring status, employer endorsement or application window is inferred from a link.

Existing Supabase setup remains optional and unchanged. Without configuration, account, employer and community functionality remains the explicitly labelled local demo. External employer applications open on the provider website.

Validation performed: JavaScript syntax checks; five Node tests covering catalogue integrity, direct URLs, retained employers and all 46 translated assessment prompts; Chromium browser checks covering all 80 directory entries, pagination, search, persistence, both locales/themes, twelve routes, dialogs, filters, a profile submission, assessment answering and mobile overflow. Live recruitment, email delivery and Supabase integrations were not exercised.
