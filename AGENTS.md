## Cursor Cloud specific instructions

This is a **Vite + React + TypeScript** frontend-only SPA ("WorldView"). No backend services, databases, or Docker required.

### Quick reference

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (Vite on port 5173) |
| Lint | `npm run lint` |
| Build | `npm run build` (`tsc -b && vite build`) |
| Preview prod build | `npm run preview` |

### Notes

- Node.js v22 and npm 10 are used. The lockfile is `package-lock.json` — always use `npm`.
- No automated test framework is configured yet (no `test` script in `package.json`). Manual testing via the browser is the current approach.
- The React Compiler (`babel-plugin-react-compiler`) is enabled in `vite.config.ts`, which slightly impacts dev/build performance.
- To expose the dev server for browser testing, run: `npx vite --host 0.0.0.0 --port 5173`.
