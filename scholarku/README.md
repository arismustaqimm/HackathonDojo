# ScholarKu 0.2.0

A student opportunities website for Malaysia: career guidance, scholarships and travel support, sourced professional profiles, private mentoring requests and authenticated communities.

## Update your existing app

Follow [UPDATE_AND_DEPLOY.md](UPDATE_AND_DEPLOY.md). Preserve your working `config.js`, update the frontend files, and run the **new** `database/002_community_mentorship.sql` in your existing Supabase project. Do not rerun the original schema in a project where you already applied it.

## Run in VS Code

Node.js 18 or newer is required. Open either the repository folder or its `scholarku` subfolder using **File → Open Folder** in VS Code. Press **F5** and choose **ScholarKu (localhost:5173)** if prompted. The included `.vscode/launch.json` starts the Node server on port 5173 and opens the site in your default browser. No terminal commands or extra extensions are needed. Use **Shift+F5** to stop it. If a terminal already runs the server, stop it with Ctrl+C before using F5 to free port 5173.

For an existing downloaded copy, you can copy only the new `.vscode` folder into the matching folder on your laptop. Keep your working `config.js` and other app files. The repository-root configuration expects the `scholarku` subfolder; the configuration inside `scholarku` expects `server.mjs` beside it.

Alternatively, open a terminal in `scholarku` (the folder containing `package.json`). On Windows PowerShell:

```powershell
npm.cmd start
```

On macOS/Linux use `npm start`. Open http://localhost:5173 and keep the terminal running. Production frontend files have no install-time dependencies.

## What's included

- A compact Explore menu, a separate language dropdown and persistent light/dark appearance. Opportunity cards, filters, native options and their active states use the selected theme.
- Google/email authentication, preserved from the working account flow. **For Employers and Mock Tests are removed.** Legacy tables are retained to preserve existing data; there is no employer signup or posting interface.
- **40 internship** and **40 graduate** career portals, ten per page. Each has a full preparation/application guide with role pathways, eligibility questions, document checklists, application steps and official source links. General sector guidance is distinguished from a current vacancy's confirmed requirements.
- **11 funding/support entries**, including FLYsiswa, Doha Institute, NTU graduate research funding and Yayasan Khazanah. These are under Scholarships & Aid; travel assistance is not presented as an internship. Amounts, dates and award names that could not be verified are labelled for official confirmation.
- **20 real public professional profiles** across finance, cybersecurity/SOC, data/AI, software and engineering leadership. Sources include self-published GitHub bios and authored projects. These are discovery references, not assertions of enrolment or availability. See [MENTOR_SOURCES.md](MENTOR_SOURCES.md).
- Per-person **CV review or session requests**. Valid PDF CVs up to 5 MB go into private storage. Requests, status changes and mentor feedback are stored in Supabase. Requests to public references wait until that exact person enrols; only the student can read the CV while waiting. Enrolled mentors have a private inbox with accept/decline/complete and reply actions.
- **Six real, initially empty communities**. Joining requires confirmation and authentication. Messages are stored centrally, attributed by the database to the signed-in profile and visible only to enrolled members. Chat polls every three seconds while visible and displays the latest 100 messages; the composer and unsent draft stay intact. Channel changes focus the input. Users may delete their own messages, leave rooms and report abuse. No fake conversations or member counts are seeded.
- Saved public career/funding pages remain browser-local and appear in the dashboard's Saved opportunities view. CVs and community conversations use the live backend.

## Before going online

Follow [UPDATE_AND_DEPLOY.md](UPDATE_AND_DEPLOY.md), including the new database migration, participating-mentor enrolment, moderator responsibilities and Netlify login redirects.

Create the static upload folder on your laptop, where your working public configuration is present:

```powershell
npm.cmd run export
```

Upload `dist` to Netlify Drop. The export excludes SQL, tests, dependencies and development tools. The repository's example `config.js` is intentionally blank; copying it over your working file will disable login. For first-time account-service setup, see [AUTH_SETUP.md](AUTH_SETUP.md).

## Development verification

```sh
npm ci --cache /tmp/scholarku-npm-cache
npm run check
npm test
```

With `npm start` running separately:

```sh
npm run test:browser
```

Node tests exercise source/catalogue integrity, OAuth error handling, repeatable static export, and the new SQL migration using PostgreSQL/PGlite with actual row-level-security policies, roles, triggers and storage metadata. Browser suites exercise authentication with intercepted provider responses, responsive layouts, both themes/languages, two-account chat, enrolment, draft/focus preservation, private PDF requests, mentor replies and failure handling. Live Google accounts and the owner's Supabase project are not accessed by these tests. The owner separately confirmed Google/email login and registration on their laptop.

The browser tests use `/usr/bin/chromium` when present. Else install Chromium with `npx playwright install chromium`, or set `CHROMIUM_PATH`. Tests write screenshots to `/tmp`.

## Main files

| File                                                       | Purpose                                                             |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| `navigation.js`, `account.css`                             | Header, menus and account-screen appearance                         |
| `auth-ui.js`, `supabase.js`, `auth-callback.*`             | Account forms, authentication, database and private storage adapter |
| `community.js`                                             | Enrolment, channel conversations, polling, drafts and reporting     |
| `mentorship.js`, `mentor-data.js`                          | Sourced profiles, CV/session requests, mentor inbox and feedback    |
| `opportunities.js`, `career-guidance.js`, `career-data.js` | Search, detail pages, guidance and employer portal links            |
| `funding-data.js`                                          | Bilingual programme information and verification status             |
| `real-pages.js`, `site-utils.js`                           | Homepage, appearance and shared rendering helpers                   |
| `live-features.css`                                        | Theme fixes, responsive chat, mentors and detail pages              |
| `database/002_community_mentorship.sql`                    | Additive live-data schema, access rules and source records          |
| `scripts/export.mjs`                                       | Clean static-site export                                            |

## Data verification limits

Public professional profiles were retrieved from GitHub on 16 October 2026. Employer portals and the supplied programme sites were blocked by the cloud environment's egress policy. The required source domains were saved in an environment-configuration draft for review; saving did not activate network access. The four new programme guides therefore distinguish user-supplied information from verified facts and avoid invented deadlines, stipends, bonds or admission guarantees. Confirm current terms through the linked official providers.
