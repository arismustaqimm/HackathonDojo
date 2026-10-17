# Update the working app without losing your login configuration

Your Google/email authentication already works on your laptop. Keep using that same Supabase project and preserve your working `config.js`.

## Start with F5 in VS Code

The ZIP includes `.vscode/launch.json` in both the repository root and `scholarku`, so either folder can be opened in VS Code. Press **F5**, select **ScholarKu (localhost:5173)** if prompted, and the server starts on port 5173 with the browser opening automatically. Stop it with **Shift+F5**. Stop any previous terminal server with Ctrl+C before switching to F5.

To add F5 support to a working older download, copy only the repository-root `.vscode` folder into your existing `HackathonDojo-main_4TH` folder, then reopen that folder in VS Code. If you open just `scholarku` in VS Code, copy `scholarku/.vscode` into your existing `scholarku` instead. This requires no edits to `config.js`, application code or Supabase.

## 1. Update the local files

1. Download the latest repository ZIP and extract it into a new folder.
2. Copy **your existing, working `scholarku/config.js`** into the new `scholarku` folder, replacing the blank example there. Do not use the Google client secret or Supabase service-role key in this file.
3. Stop the old server with Ctrl+C. In VS Code, open the **new `scholarku` folder** and choose Terminal → New Terminal.
4. On Windows PowerShell, run:

   ```powershell
   npm.cmd start
   ```

   On macOS/Linux, use `npm start`. Open http://localhost:5173 and refresh with Ctrl+Shift+R (Cmd+Shift+R on Mac).

## 2. Add live communities and CV requests to the existing database

In your existing **Supabase → SQL Editor**, create a **New query**, copy all of `database/002_community_mentorship.sql`, and click **Run**.

Run this new file only. Do **not** rerun the original `schema.sql` in the project you already configured. The new migration is additive and repeatable: it preserves user accounts, existing applications, source data and mentor-account links. It adds six empty community rooms, membership/message/report tables, twenty public reference profiles, private mentoring requests and a private PDF bucket.

Verify these behaviours before deployment:

- The community join dialog appears before enrolment. Cancelling it does not create membership.
- Two different signed-in accounts can join the same room and see each other's posts. No fake messages or member counts are seeded.
- The composer stays focused after sending. New messages arrive every three seconds while the tab is visible, without replacing the draft.
- Select a mentor and choose CV review or session. A valid PDF CV can be uploaded up to 5 MB. Sessions do not upload a CV.
- Your requests appear under **Mentorship → My requests**. A request to an unregistered public profile shows **Waiting for mentor enrolment**. This is an expression of interest, not a delivered invitation or booked session.

CV access is restricted by database and storage policies. While waiting, only the student can read their CV. After a selected mentor is identity-checked and enrolled, that account can read addressed requests and permitted CVs via links that expire in one minute. A mentor may accept, decline or complete a request and write private CV feedback or session arrangements. Students see replies under My requests and may cancel active requests. See [MENTOR_SOURCES.md](MENTOR_SOURCES.md) for enrolment.

The cloud checkout has no access to your laptop's working public connection details or your Supabase SQL Editor. The migration was validated locally using PostgreSQL/PGlite with authenticated roles and row-level security. It must still be run and checked in your own project.

## 3. Prepare a clean static upload folder

In a second terminal in the same `scholarku` folder, run:

```powershell
npm.cmd run export
```

This creates `dist` with the static site, assets and **your current public `config.js`**. It excludes database SQL, tests, dependencies and development tools. The export does not install packages or require a build service.

Upload **the `dist` folder** to Netlify Drop. Confirm `index.html` is directly inside the uploaded folder. Keep the generated HTTPS site address.

## 4. Permit login on the online site

In Supabase **Authentication → URL Configuration**:

- Set **Site URL** to your real HTTPS Netlify address, without a trailing path.
- Add `https://YOUR-SITE.netlify.app/auth-callback.html**` under Redirect URLs. Substitute your actual site name. The wildcard suffix permits the per-attempt state query parameter.
- Keep `http://localhost:5173/auth-callback.html**` if you want laptop testing to keep working.

The Google Cloud authorized redirect URI remains the **Supabase** `/auth/v1/callback` address you already configured. It is different from the app callback URL above. Test Google login, email login/confirmation, sign out, community enrolment/chat and a private CV request on the deployed address before inviting users.

## Public rooms need moderation

Message names come from signed-in profiles and are not verified job titles. There are no fabricated SOC executives or professional endorsements. Encourage real members to introduce themselves; do not seed conversations as if professionals wrote them.

Reports are stored in `public.community_reports` for a trusted administrator to review in Supabase. Administrators can remove messages. Students can delete their own messages. Membership removal does not erase existing posts; users should delete private content before leaving. The database limits each account to ten messages in ten seconds. Choose moderators and review reports before opening communities widely.

## Source limitations

The four new financial-support guides are under **Scholarships & Aid**, not internships. FLYsiswa is travel assistance; Doha, NTU and Khazanah examples concern graduate funding. Supplied award names, amounts, bonds and dates that could not be checked against current official pages are explicitly marked as needing confirmation. The broken Doha error-page link was replaced with its official website and admission portal. No current vacancies, stipend values or scholarship availability are invented.
