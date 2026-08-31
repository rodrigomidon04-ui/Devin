---
name: testing-mundo-carton
description: How to run and end-to-end test the MUNDO CARTÓN app (mundo-carton/ Vite+React+TS+Tailwind 4) in demo mode, including WhatsApp/Supabase env toggles and known environment limits.
---

# Testing MUNDO CARTÓN (`mundo-carton/`)

## Run it
```bash
source ~/.nvm/nvm.sh && nvm use default   # node 24; node 20.18.1 works but Vite warns
cd mundo-carton && npm install && npm run dev   # http://localhost:5173
```
The root repo is a separate portfolio app that also uses port 5173 — only run one at a time.

## Modes are driven purely by env vars (`mundo-carton/.env`, gitignored)
- No `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` → **MODO DEMO**: content comes from
  `src/lib/seed.ts` (4 videos, 6 products) and is stored in `localStorage`
  (`mundoCarton.*` keys, cart under `mundoCarton.cart`). Footer reads "Modo demo · …".
- No `VITE_WHATSAPP_NUMBER` → the "Encargar por WhatsApp" button is rendered as a
  disabled `<a>` (`pointer-events-none`, no href) plus a warning naming the variable.
  Set it (e.g. `VITE_WHATSAPP_NUMBER=59899123456`) and Vite auto-restarts on `.env` change;
  reload the page and read the `href` of the anchor to verify the `wa.me/<number>?text=…`
  payload (order lines + `Total:`). No need to open WhatsApp.
- Optional: `VITE_SITE_TITLE`, `VITE_SITE_SUBTITLE`.

## Demo login (no password)
Click **Entrar** in the header, type any email, submit. That reveals the
"+ Video"/"+ Producto" button (label depends on the active section) and the trash
buttons on cards. Delete uses `window.confirm` — accept the native dialog.

## Useful UI facts
- Sections are the "Videos"/"Tienda" buttons under the hero; the header add-button label
  follows the active section.
- Category chips: "Todos" + 4 categories per section, defined in `src/lib/labels.ts`.
- Video URL field is `type="url"`, so an obviously non-URL string is blocked by the
  browser's own (English) tooltip before the app's Spanish error in `AddVideoModal.tsx`
  can appear. Keep that in mind when asserting on validation text.
- YouTube links produce `i.ytimg.com/vi/<id>/hqdefault.jpg` thumbnails and a
  `youtube-nocookie.com/embed/<id>?rel=0` iframe (`src/lib/video.ts`).
- Prices use `Intl.NumberFormat('es-UY', UYU)` → renders like `$ 1.234` (dot thousands,
  non-breaking space).

## Environment limitation seen in this sandbox
The seeded sample MP4s (`commondatastorage.googleapis.com/gtv-videos-bucket/...`) return
**403** through the sandbox egress proxy, so `<video>` fails with
`MEDIA_ERR_SRC_NOT_SUPPORTED` (error code 4) and shows a black player. `i.ytimg.com` and
YouTube embeds do load. If MP4 playback matters, verify with a YouTube link instead and
report direct-MP4 playback as not verifiable rather than broken. Check with:
`curl -s -o /dev/null -w '%{http_code}' <mp4-url>`.

## Devin Secrets Needed
None — demo mode needs no credentials.
