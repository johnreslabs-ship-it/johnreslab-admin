# Johnres Lab — Admin Dashboard

A separate, standalone admin application for managing the Johnres Lab public site's content: blog posts, projects, downloads, categories, media, featured videos, subscribers, and settings. Not linked from the public site anywhere — reachable only if you know its URL.

Built with React + TypeScript + Vite + Tailwind CSS v4 + Firebase (Authentication, Firestore, Storage).

---

## How this fits with the public site

The public site (`johnreslab-website`) and this admin app share one Firebase project:

- **This app** writes to Firestore (blog posts, projects, downloads, etc.) and Firebase Storage (uploaded files).
- **The public site** reads from the same Firestore collections (read-only, no login needed) and falls back to its own static content if Firebase isn't configured — so the public site never breaks, even before you've set any of this up.

They're separate codebases/repos by design, per the "keep the admin panel undiscoverable from the public site" requirement — but they must point at the **same Firebase project** to actually talk to each other.

---

## 1. Create a Firebase project (one-time, shared with the public site)

1. Go to https://console.firebase.google.com → **Add project** → name it (e.g. `johnreslab`).
2. **Enable Authentication**: Build → Authentication → Get started → Sign-in method → enable **Email/Password**.
3. **Create your admin user**: Authentication → Users → Add user → enter your email + a password. This is the only account that can log into the admin panel (there's no public sign-up).
4. **Enable Firestore**: Build → Firestore Database → Create database → start in **production mode** (we'll deploy proper rules next) → choose a region.
5. **Enable Storage**: Build → Storage → Get started → production mode.
6. **Register a web app**: Project Settings (gear icon) → General → "Your apps" → Add app → Web (`</>`) → give it a nickname → copy the `firebaseConfig` values shown. You'll paste these into **both** apps' `.env` files.

## 2. Deploy security rules

This repo includes `firestore.rules` and `storage.rules`, already written to:
- Let the public site **read** blog posts, projects, downloads, categories, featured videos, settings, and write page-view counts — without logging in.
- Require **sign-in** (i.e. only you) for every write except page views, and for reading/writing subscribers.

Deploy them with the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore storage   # point it at this folder, choose your project, don't overwrite the .rules files
firebase deploy --only firestore:rules,storage:rules
```

(Or paste the contents of `firestore.rules` / `storage.rules` directly into Firebase Console → Firestore/Storage → Rules tab → Publish — no CLI needed if you'd rather do it by hand.)

## 3. Local development

```bash
npm install
cp .env.example .env      # paste in your Firebase config from step 1.6
npm run dev
```

Log in with the admin user you created in step 1.3.

## 4. Seed initial content (optional but recommended)

To start the admin panel populated with the same tutorials/projects/downloads currently hardcoded in the public site (rather than an empty dashboard):

```bash
# Add these two lines to your .env (only needed for this one-time script):
# SEED_ADMIN_EMAIL=you@example.com
# SEED_ADMIN_PASSWORD=your-password

npm run seed
```

This is safe to review before running — open `scripts/seed.mjs` to see exactly what it creates.

## 5. Deploying the admin app

Keep this in its **own repository** (e.g. `johnreslab-admin`), separate from the public site repo — this is what keeps it undiscoverable from the public site's navigation.

1. Push this project to a new GitHub repo.
2. Settings → Pages → Build and deployment → Source → **GitHub Actions**.
3. Settings → Secrets and variables → Actions → add all six `VITE_FIREBASE_*` secrets from your `.env`.
4. Push to `main` — the included workflow builds and deploys automatically.

Your admin panel will be live at `https://<username>.github.io/johnreslab-admin/` (or similar) — a URL that's never linked from the public site. Treat that URL itself as semi-private; anyone with the URL still can't get in without your login, but there's no reason to publish it anywhere.

If you deploy to a project page (not a root `username.github.io` repo), update `base: '/'` in `vite.config.ts` to `base: '/johnreslab-admin/'`.

## 6. Connecting the public site to this Firebase project

In the **public site's** repo (`johnreslab-website`), add the same six `VITE_FIREBASE_*` values to its `.env` (locally) and as GitHub Actions secrets (for deployment). Once both are configured with matching values, the public site's Blog, Projects, and Downloads pages will automatically switch from static content to live Firestore data — no code changes needed, it's already wired up.

---

## What's real vs. what's a documented next step

**Fully working:**
- Email/password login, protected routes
- Blog posts: create/edit/delete, draft/publish toggle, tags, categories, SEO fields (meta title/description, OG image), auto slug generation, live Markdown preview
- Projects & Downloads: full CRUD
- Downloads: optional direct file upload to Firebase Storage
- Categories: shared list used by both blog posts and downloads
- Media Library: upload/list/delete files in Storage, copy public URL
- Featured Videos: pin specific YouTube videos above the live-fetched uploads on the public site
- Subscribers: manual list management + CSV export
- Settings: social links and contact info (stored, but see note below)
- Profile: view account email, send password reset
- Backup/Export: one-click JSON export of all content
- Dashboard: real content counts + real page-view analytics (no Google Analytics account needed)

**Documented but not wired up (by design, to keep scope honest):**
- The **Settings** page saves to Firestore, but the public site still reads social links/tagline from its own code rather than from here — wiring that up is a small, clearly-isolated follow-up if you want it.
- There's no public-facing newsletter signup form yet — Subscribers is a manual list until one is added.
- Visitor stats are page-view counts, not full analytics (no referrers, geography, etc.) — that would require Google Analytics with its own OAuth setup, out of scope for a Firebase-only stack.

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Firebase (Auth + Firestore + Storage), marked (Markdown preview)
