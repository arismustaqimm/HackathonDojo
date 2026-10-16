# Activate Google and email accounts

The login and registration screens use your own Supabase project. If Google and email login already work on your laptop, preserve that working `config.js` and use the same project. The cloud checkout keeps a blank public configuration; it does not contain your local connection details.

## 1. Create the account service

1. Create a project at https://supabase.com/dashboard.
2. For a **new** project, review and run `database/schema.sql` once, then `database/002_community_mentorship.sql`. For your existing project where login works and the first schema was already applied, run **only** `database/002_community_mentorship.sql`. Do not rerun the original schema there.
3. Open the project's API settings and copy the **Project URL** and the public **legacy anon key**. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `config.js`. The anon key is intended for browser use with database access rules. Never use a `service_role` or secret key in these files.

```js
window.SCHOLARKU_CONFIG = {
  SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_PUBLIC_ANON_KEY",
};
```

## 2. Enable email sign-in

In Supabase Authentication, enable the Email provider and email/password registrations. Keep email confirmation enabled for public deployments. Configure your production email delivery before inviting users; the default email service has limits.

The registration screen collects full name, email and password (minimum eight characters). New accounts use the student role; the employer feature has been removed. The login screen collects the requested name, email, and password; authentication checks email and password. Names are not authentication factors. Passwords are sent to Supabase and are never saved in this application's local storage.

## 3. Enable Google

1. In Google Cloud Console, create an OAuth consent screen for your application, then an OAuth client of type **Web application**. While the app is in testing, add the Google accounts you intend to test with as test users.
2. Add the exact callback URL shown by Supabase's **Google provider** settings as an authorized redirect URI in Google Cloud. It normally ends in `/auth/v1/callback` on your Supabase project hostname.
3. Copy the Google client ID and client secret into **Supabase Authentication → Providers → Google**, then enable the provider. Keep the Google client secret only in Supabase; never put it in the frontend, GitHub, or chat.
4. In Supabase Authentication URL Configuration, set the Site URL to your deployed app's HTTPS origin. Add the application's callback URLs to the redirect allowlist:

   - Local development: `http://localhost:5173/auth-callback.html**`
   - Your deployed app: `https://YOUR-APP-DOMAIN/auth-callback.html**`

   The suffix permits the application's per-attempt `state` query parameter. Keep the hostname and callback path restricted to your own app. Use the exact port/origin you run; `127.0.0.1` and `localhost` are different origins. The app must be served at the domain root, including `auth-callback.html`.

## 4. Run and test real accounts

Run `npm start`, open `http://localhost:5173`, and select **Log in** at the top right. Allow the sign-in popup for this site.

- **Create an account:** enter your name, email, and password; follow the email confirmation step, then log in.
- **Continue with Google:** Google's own account chooser opens in a popup. The app exchanges the returned code using PKCE and opens your dashboard after success. If a browser blocks the popup, allow it and try again.
- New Google and email users receive student profiles. Participating mentors use their own accounts, linked to a mentor record by an administrator after identity and consent checks. No user can adopt another person's mentor identity from the browser. See `MENTOR_SOURCES.md`.
- Check sign out, an incorrect password, a cancelled Google popup, and a page reload after signing in.

Use HTTPS in production. PKCE, popup completion, and the application must use the same origin. Google may refuse account choosers inside embedded browsers; use a normal browser tab for the app.

## Automated verification

Run `npm ci`, `npm run check`, and `npm test`. Start the development server separately, then run `npm run test:browser`. The browser suite exercises email requests and Google popup/PKCE completion against intercepted test responses; it does not sign in to a real Google account or claim that your external provider settings work.

Without configuration the forms remain visible and display an explicit unavailable message on submit. They never create a fake account or treat an unverified Google click as a successful login.
