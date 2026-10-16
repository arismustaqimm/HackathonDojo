# ScholarKu

A student opportunities website for Malaysia: scholarships, internships, graduate programmes, community and mentorship.

## Run in VS Code

Install Node.js 18 or newer. Open this `scholarku` folder in VS Code, open Terminal → New Terminal, then run:

```sh
npm start
```

Open http://localhost:5173 in your browser. Keep the terminal running; Ctrl+C stops the server. Production frontend files do not need an npm install.

## Current interface

- The clean header has a single **Explore** dropdown, a separate **English / Bahasa Melayu** dropdown, a theme button and an account button. Navigation supports touch, keyboard, Escape and clicking outside to close.
- **Log in** at the top right opens a dedicated account page. It offers Google sign-in in a popup, plus email/password login and account registration. Name, email and password fields are provided. Passwords are not stored by this frontend.
- **Mock Tests has been removed**: no navigation links, assessment pages, question banks, timers or scoring. Old assessment URLs redirect to Explore.
- The internship directory retains all original providers plus requested additions: **40 unique employers**. The graduate directory has **40 unique employers**, with ExxonMobil deduplicated. Both show ten entries per page, with search, previous/next controls, saved links and copy-link buttons.
- Appearance and language preferences persist in the browser. The font stack uses Apple system fonts where available and native fallbacks elsewhere.

## Activate real Google and email sign-in

Read [AUTH_SETUP.md](AUTH_SETUP.md). You must create a Supabase project, run the database schema, set the public project URL/anon key in `config.js`, and enable the Email and Google providers. The Google client secret belongs only in Supabase provider settings.

No Supabase project has been connected to this checkout. Without it, the account screens show a clear unavailable message; they do not pretend to create accounts or authenticate users. Real Google sign-in, confirmation email delivery and database access require validation after your project is configured.

Community example posts and fictional opportunities remain labelled as demonstrations. Employer career links open the provider's own website. Employers require approval under the existing verification workflow before publishing live opportunities.

## Development checks

```sh
npm ci --cache /tmp/scholarku-npm-cache
npm run check
npm test
```

With the server running in another terminal:

```sh
npm run test:browser
```

The browser suite uses system Chromium at `/usr/bin/chromium` if available. Otherwise install it with `npx playwright install chromium`, or set `CHROMIUM_PATH` to your Chromium executable. Tests cover dropdowns, translation/theme persistence, responsive layouts, directory pagination, account forms, and intercepted email/Google OAuth responses. Provider responses are mocked; this does not prove live external authentication. Screenshots are written under `/tmp`.

## Edit the interface

- `navigation.js`: header, Explore options and language menu.
- `auth-ui.js`: login/registration pages and their English/Malay copy.
- `account.css`: dropdown and account-screen appearance.
- `supabase.js`, `auth-callback.js`, `auth-callback.html`: authentication and popup completion.
- `career-data.js`, `real-pages.js`: career directories, cards and pagination.
- `localization.js`: shared translations for the rest of the app.
- `appearance.css`: overall light/dark appearance.

## Opportunity data

Employer URLs are career directories, not a feed of confirmed vacancies. Opening and closing dates remain **Not confirmed — check employer** until an intake-specific source is verified. Employer sites could not be checked from this environment because of egress restrictions during the original update. The supplied Google-search wrappers have been replaced with their direct destinations, but live vacancy availability and every external URL's current response remain unverified.
