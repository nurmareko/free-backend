# Free — Backend (REST API)

Next.js (App Router) + Neon Postgres + Prisma + Vercel Blob.
Auth = Google ID token verification. This is the API the Android app talks to via Retrofit.

## Endpoints

| Method | Path | Body | Notes |
|---|---|---|---|
| `GET` | `/api/items` | — | All items, newest first |
| `GET` | `/api/items?mine=true` | — | Caller's items only |
| `GET` | `/api/items/{id}` | — | Detail |
| `POST` | `/api/items` | multipart | Create (owner from token) |
| `PUT` | `/api/items/{id}` | multipart | Update, owner only |
| `DELETE` | `/api/items/{id}` | — | Delete, owner only |
| `GET` | `/api/me` | — | Authed profile |

All requests need `Authorization: Bearer <google_id_token>`.
Multipart fields: `title`, `description`, `location`, `contactInfo`, `image` (file).

## Setup

1. **Install**
   ```bash
   npm install        # runs `prisma generate` automatically
   ```

2. **Neon** — create a project, copy the **pooled** connection string into `.env`:
   ```
   DATABASE_URL="postgresql://...?sslmode=require"
   ```

3. **Google OAuth** — in Google Cloud Console create an OAuth **Web** client.
   Put its ID in `.env` as `GOOGLE_WEB_CLIENT_ID`. Use this *same* ID as
   `serverClientId` in the Android app. (Create a separate Android OAuth client too,
   with your SHA-1, but you do NOT put the Android client ID here.)

4. **Push schema to the DB**
   ```bash
   npx prisma migrate dev --name init   # local
   # or: npx prisma db push
   ```

5. **Run locally**
   ```bash
   npm run dev    # http://localhost:3000
   ```
   For local Blob uploads you also need `BLOB_READ_WRITE_TOKEN` in `.env`
   (Vercel dashboard → Storage → your Blob store → tokens).

## Deploy to Vercel

```bash
vercel            # link/create the project
vercel --prod
```
- Add a **Blob store** in the Vercel project (Storage tab) → `BLOB_READ_WRITE_TOKEN`
  is injected automatically.
- Add env vars in the Vercel dashboard: `DATABASE_URL`, `GOOGLE_WEB_CLIENT_ID`.
- Run the migration against the production DB once:
  ```bash
  npx prisma migrate deploy
  ```

## Test with curl

Grab a real Google ID token first — easiest is to log the `idToken` from the Android
app in Logcat, or use the OAuth 2.0 Playground. Then:

```bash
TOKEN="paste_id_token_here"
BASE="https://your-app.vercel.app/api"   # or http://localhost:3000/api

# who am I
curl -H "Authorization: Bearer $TOKEN" $BASE/me

# list (empty at first)
curl -H "Authorization: Bearer $TOKEN" $BASE/items

# create (multipart with an image file)
curl -X POST $BASE/items \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Old Backpack" \
  -F "description=Still usable, zipper is a bit rough." \
  -F "location=Near campus" \
  -F "contactInfo=whatsapp 082112223334" \
  -F "image=@/path/to/photo.jpg"

# my posts
curl -H "Authorization: Bearer $TOKEN" "$BASE/items?mine=true"

# delete (use an id from the create response)
curl -X DELETE -H "Authorization: Bearer $TOKEN" $BASE/items/THE_ID
```

A missing/bad token returns `401 {"error":"..."}`; deleting someone else's item returns `403`.

## Notes

- `ownerId` is always taken from the verified token, never trusted from the client body.
- Compress images on the Android side (~1080px, JPEG 80%) — Vercel's serverless body
  limit is ~4.5 MB and raw phone photos exceed it.
- `prisma generate` needs network access to Prisma's binary host; if a locked-down
  environment blocks it, set `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` (normal dev
  machines and Vercel are fine).
