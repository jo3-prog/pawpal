# PawPal — Pet Adoption App

A fully-featured pet adoption app built with Next.js 14, React, Context API, and Tailwind CSS, completing all four weeks of the PawPal project brief.

---

## Features

| Area | What's included |
|---|---|
| **Browse** | Responsive grid of pet cards with a "shelter intake card" aesthetic |
| **Search** | Real-time search by name, type, breed, or any keyword tag |
| **Filter** | Type + breed dropdowns (breed list narrows to match selected type) |
| **Favorites** | Heart button on every card; persisted to `localStorage` |
| **Apply to Adopt** | Modal form with validation; submitted applications persist to `localStorage` |
| **My Applications** | Dedicated page listing all submissions with a withdraw action |
| **Live data** | Optional Petfinder API integration — falls back to 14 static demo pets when no key is configured |
| **Loading states** | Animated skeleton cards while the API loads |
| **Responsive** | Mobile-first layout, works on 320 px → wide desktop |
| **Accessible** | Semantic HTML, visible focus styles, `prefers-reduced-motion` support, ARIA labels |
| **Deployment-ready** | `vercel.json` with security headers and CDN cache rules |

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Set up Petfinder API keys
cp .env.local.example .env.local
# Edit .env.local and add your PETFINDER_API_KEY + PETFINDER_SECRET

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If you skip step 2, the app runs fine using the 14 bundled demo pets.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `PETFINDER_API_KEY` | No | Petfinder OAuth2 client_id |
| `PETFINDER_SECRET` | No | Petfinder OAuth2 client_secret |

Get credentials free at [petfinder.com/developers](https://www.petfinder.com/developers/).

---

## Project structure

```
pages/
  _app.js             Wraps the app in PetProvider + Layout
  _document.js         Base HTML document
  index.js             Home page (hero + PetList)
  pets/[id].js         Dynamic pet detail page (getStaticPaths / getStaticProps)
  favorites.js          Saved pets page
  applications.js       My Applications page
  404.js               Custom not-found page
  api/
    pets.js            API route — proxies Petfinder, returns static data as fallback

components/
  Header.js            Sticky nav with live favorites + applications counts
  Footer.js
  Layout.js            Header + main + Footer wrapper
  PetCard.js           Kennel-card style listing tile
  PetList.js           Search + filters + grid (with loading skeleton + error banner)
  SearchBar.js
  FilterBar.js
  PetDetail.js          Full pet profile page component
  AdoptionModal.js      Apply to Adopt modal with form validation
  EmptyState.js         Shared empty-state UI

context/
  PetContext.js         Context API: pets, favorites, applications, search, filters,
                        loading/error state, fetchPets()

data/
  pets.js               14 static demo pets (used when no API key is configured)

lib/
  petfinder.js          Petfinder API v2 client with token caching

styles/
  globals.css           Tailwind layers + shelter "kennel card" design system
```

---

## How the Petfinder integration works

```
Browser                 Next.js server              Petfinder API
  │                          │                           │
  │  GET /api/pets?type=Dog  │                           │
  │─────────────────────────>│                           │
  │                          │  POST /oauth2/token       │
  │                          │──────────────────────────>│
  │                          │  { access_token }         │
  │                          │<──────────────────────────│
  │                          │  GET /animals?type=Dog    │
  │                          │──────────────────────────>│
  │                          │  { animals: [...] }       │
  │                          │<──────────────────────────│
  │  { pets: [...] }         │   (normalised + cached)   │
  │<─────────────────────────│                           │
```

- The API key and secret **never reach the browser** — they're only read by the server-side API route.
- The access token is cached in module scope and reused for its full 3 600-second lifetime.
- If the Petfinder API is unreachable the route returns the static demo data with a `warning` field, so the UI degrades gracefully.

---

## Deploying to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts, then add your environment variables:

```bash
vercel env add PETFINDER_API_KEY
vercel env add PETFINDER_SECRET
vercel --prod
```

### Option B — GitHub integration (recommended)

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. In **Environment Variables** add `PETFINDER_API_KEY` and `PETFINDER_SECRET`.
4. Click **Deploy**.

All subsequent pushes to `main` will trigger a production deploy automatically.

---

## Production build

```bash
npm run build   # type-checks, lints, and statically generates all pet pages
npm start       # serves the production bundle locally
```
