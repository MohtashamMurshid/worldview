# WorldView

WorldView is a tactical geospatial monitoring SPA built with **React + TypeScript + Vite + CesiumJS**.

It provides:

- Global 3D globe viewport
- Satellite, commercial/military flights, CCTV, traffic, seismic, landmarks, and area-news overlays
- Tactical style modes (Normal / CRT / NVG / FLIR)
- Unified layer manager + entity inspector + feed health dashboard
- Real-time connector orchestration with graceful fallback datasets

## Quick start

```bash
npm install
npm run dev
```

For cloud/browser testing:

```bash
npx vite --host 0.0.0.0 --port 5173
```

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run lint` | Lint code |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |

## Optional environment variables

Copy `.env.example` to `.env` and configure as needed:

- `VITE_CESIUM_ION_TOKEN`: enables Cesium ion-backed assets.
- `VITE_USE_GOOGLE_3D_TILES=true`: attempts Google photorealistic 3D tiles (requires valid token setup).
- `VITE_ADSB_API_KEY`: enables direct ADS-B Exchange military feed query attempt.

## Data ingestion behavior

The app is **live-first** but resilient to browser/API limits:

- Connectors attempt to fetch public live feeds.
- On CORS/auth/source failure, they degrade to deterministic fallback datasets.
- Feed health panel exposes `ok / degraded / down` states.

This allows end-to-end investigative workflows even when some upstream feeds are unavailable.

## Keyboard shortcuts

- `M` → cycle display mode
- `F` → follow/unfollow selected entity
- `U` → toggle clean UI
