# Hospital & Doctor Live Sync — Setup

How a hospital or doctor registered in the web app reaches the **Medix Doctor
Android app**, and the one-time setup that makes it work.

## Why this is needed

The two clients never shared any storage:

- The web app keeps its roster in the **browser's** `localStorage`
  (`medix_branches`, `medix_doctors`).
- The Android app is an offline WebView bundle
  (`file:///android_asset/medix/index.html`) with its **own** `localStorage` on
  the phone.
- The server's `backendStore` lives in the memory of a **single serverless
  invocation**, seeded from `src/lib/data.ts`.

So a receptionist's write landed in one Vercel instance's RAM, while the phone's
poll was answered by another — which only ever knew the seeded demo roster.
`src/lib/roster-store.ts` closes that gap with one durable snapshot.

## Flow

```
Receptionist's browser                        Doctor's phone (Android WebView)
        │                                                │
   store.tsx ──► localStorage                     app.js polls every 4s
        │                                                │
        │ POST /api/v1/database                          │ GET /api/v1/hospitals
        │ { branches, doctors }                          │ GET /api/v1/doctors
        ▼                                                ▼
   ┌────────────────────────────────────────────────────────────┐
   │        Next.js API — medix-hospital-system.vercel.app      │
   │                                                            │
   │   saveRoster()  ◄── roster-store.ts ──►  hydrateBackendStore()
   └───────────────────────────┬────────────────────────────────┘
                               │ Supabase REST (service_role)
                               ▼
                     medix_roster (id = 1, data jsonb)
```

The whole roster is written as one snapshot rather than a diff. That is what
makes **removal** propagate: anything absent from the snapshot is gone for every
reader on their next poll.

The Android app never talks to Supabase. It keeps using its existing
`x-api-key` against this API, so `SUPABASE_SERVICE_ROLE_KEY` stays server-side.

## One-time setup

### 1. Create the table

In the Supabase dashboard → **SQL Editor**:

```sql
create table if not exists medix_roster (
  id         int primary key default 1,
  data       jsonb not null,
  updated_at timestamptz default now(),
  constraint medix_roster_single_row check (id = 1)
);

-- No policies are added on purpose: with RLS on and no policy, the public
-- anon key can neither read nor write this table. Only the server's
-- service_role key reaches it.
alter table medix_roster enable row level security;
```

### 2. Local environment

Add to `.env.local` (already gitignored):

```
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role secret from Settings → API>
```

Use the **`service_role`** key, not `anon` — RLS is on with no policies, so
`anon` is denied by design.

### 3. Production environment

Add the same two variables to Vercel → Project → **Settings → Environment
Variables → Production**, then redeploy. Or:

```bash
npx vercel env add SUPABASE_URL production
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
npx vercel --prod
```

## Verify

```bash
npm run dev
node scripts/verify_roster_sync.cjs
```

Covers: add a hospital and doctor, confirm both appear via
`GET /api/v1/hospitals` and `GET /api/v1/doctors`, confirm the doctor's portrait
survives, then remove them and confirm they disappear.

Against production, point `BASE` in that script at
`https://medix-hospital-system.vercel.app`.

To confirm the durable store specifically, check that `medix_roster` has a row
whose `updated_at` moves each time the receptionist saves.

## Without the environment variables

`isRosterStoreConfigured()` returns false, `saveRoster()` and
`hydrateBackendStore()` become no-ops, and both endpoints serve the seeded
roster from `src/lib/data.ts` exactly as they did before this feature existed.
Nothing breaks; cross-device sync is simply inactive.

## Android app changes

`Hospital_Android_Application/preview/app.js` is the source of truth for the
app's UI. It already polled the API every 4 seconds; the fix was that it used to
re-add any hospital missing from the server response but present in its own
`medix_live_hospitals_cache` — resurrecting removed hospitals forever. That
merge now runs only when the page genuinely shares the web app's `localStorage`
database (`hasWebAppDatabase()`), which is never true in the packaged app.

After editing `preview/app.js`, rebundle — the shipped `index.html` is a single
self-contained file with the JS and CSS inlined:

```bash
cd Hospital_Android_Application
node bundle_offline.cjs     # inlines app.js + styles.css into the HTML bundles
node sync_to_android.cjs    # copies preview/* into the Android assets
```

Then copy `preview/{app.js,index.html,HMS_Doctor_Offline_App.html,src_index.html}`
to `public/doctor-app/`, refresh `firebase-deploy/index.html`, and rebuild the
APK/AAB so the phone actually receives the change.
