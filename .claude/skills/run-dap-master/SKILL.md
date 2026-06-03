---
name: run-dap-master
description: Run, start, build, screenshot, verify, smoke-test, launch the DAP Master Next.js app (localhost:3000). Use when asked to run the app, check a change works, verify a route, test a feature, confirm a build passes.
---

# run-dap-master

DAP Master is a Next.js 14 Pages Router app (SSG, TypeScript). The driver is
`smoke.ps1` — a PowerShell script that starts the dev server, warms up SSG pages,
and HTTP-checks all key routes. Run it with `powershell.exe -ExecutionPolicy Bypass`.

**No chromium-cli** on this Windows host — the driver uses `Invoke-WebRequest` to
poke routes and verify content. For visual inspection, open a browser to
`http://127.0.0.1:3000` after the server is up.

---

## Prerequisites

- Node 22 + npm 11 (already present)
- `powershell.exe` (Windows PowerShell 5.1 — `pwsh` is NOT installed)
- Port 3000 free (driver kills existing occupants automatically)
- Log dir exists: `New-Item -ItemType Directory -Force C:\Temp` (usually pre-exists)

```powershell
# Verify
node --version   # v22.x
npm --version    # 11.x
```

---

## Build

```powershell
cd E:\apps\dap
powershell -ExecutionPolicy Bypass -File .claude\skills\run-dap-master\smoke.ps1 build
# Output written to C:\Temp\next-build.log
# Expect: "BUILD OK" with SSG route list
```

Build takes ~30–60 s on first run. Subsequent runs are faster.

**Gotcha — stale .next after switching dev↔build:**  
Running `next build` then `next dev` (or vice versa) with the same `.next` directory
causes webpack chunk 404s (`Cannot find module './567.js'`). The `dev` mode clears
`.next` automatically. If you only call `check`, ensure the server was started via
`dev` mode (not after a manual `build`).

---

## Run — agent path

### Full flow (start + warm-up + smoke)

```powershell
cd E:\apps\dap
powershell -ExecutionPolicy Bypass -File .claude\skills\run-dap-master\smoke.ps1 dev
```

- Clears stale `.next` cache
- Starts `next dev` on port 3000 as a detached `cmd.exe` process
- Waits up to 40 s for initial `http://127.0.0.1:3000/` response
- Warms up 6 SSG pages (triggers compilation; each waits up to 90 s)
- Runs 15-point smoke suite: 10 HTTP + 4 content + 1 404 check
- Exits 0 on all pass, 1 on any failure
- Server keeps running after the script exits

### Smoke-test only (server already running)

```powershell
powershell -ExecutionPolicy Bypass -File .claude\skills\run-dap-master\smoke.ps1 check
```

Same warm-up + same smoke suite. Use after you changed a file and want to verify
without restarting.

### Stop server

```powershell
powershell -ExecutionPolicy Bypass -File .claude\skills\run-dap-master\smoke.ps1 stop
```

Kills the process listening on port 3000 by PID.

---

## Smoke suite — what is checked

| # | Check | Route |
|---|---|---|
| 1–10 | HTTP 200 | `/` `/theory` `/quiz` `/quiz/exam` `/quiz/wrong` `/quiz/bookmarks` `/theory/part1_ch1` `/theory/part4_ch4` `/quiz/chapter/part1_ch1` `/quiz/chapter/part4_ch4` |
| 11 | Homepage contains nav links | `/` → regex `quiz\|theory\|part1` |
| 12 | Theory page has EA content | `/theory/part1_ch1` → regex `EA\|Enterprise\|part1` |
| 13 | Quiz chapter has questions | `/quiz/chapter/part1_ch1` → regex `p1c1\|quiz\|part1\|question` |
| 14 | Exam page renders | `/quiz/exam` → regex `exam\|timer\|quiz` |
| 15 | Non-existent chapter → 404 | `/theory/part99_ch1` |

---

## Run — human path

```powershell
cd E:\apps\dap
npx next dev
# Opens http://localhost:3000 — browse manually.
# Ctrl-C to stop.
```

Not usable headless. Use `smoke.ps1` for agent workflows.

---

## Gotchas

**Warm-up timeouts on `/` and `/theory` are normal on a cold server.**  
The first two pages timeout in `Wait-Page` because `next dev` returns the
"missing required error components, refreshing…" loading stub (which `Invoke-WebRequest`
treats as a non-200) while webpack compiles. Subsequent routes compile faster and
return 200. The smoke test still passes because by the time the HTTP status loop
runs, all pages are compiled.

**stale .next after `next build`.**  
Running `smoke.ps1 build` then `smoke.ps1 check` fails with 500 / webpack module
errors. Always restart via `smoke.ps1 dev` after a production build, which clears
`.next` before launching dev mode.

**`pwsh` not installed — use `powershell.exe`.**  
The driver shebang says `pwsh` for portability, but on this machine only
`powershell.exe` (Windows PowerShell 5.1) is present. Always invoke with
`powershell -ExecutionPolicy Bypass -File smoke.ps1`.

**Port 3000 already in use.**  
`smoke.ps1` kills the occupant automatically. If `Stop-Server` can't kill a
protected process, run `netstat -ano | findstr :3000` manually to find the PID
and `taskkill /F /PID <pid>`.

**Korean characters in PowerShell 5.1.**  
PS 5.1 defaults to UTF-16 LE. The `smoke.ps1` uses ASCII-only regex patterns to
avoid encoding issues. Do not add Korean string literals to `smoke.ps1`.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Cannot find module './567.js'` (500 on quiz routes) | Run `smoke.ps1 dev` (clears .next first) instead of `check` on a post-build server |
| Warm-up TIMEOUT on every page | Server didn't start; check `C:\Temp\next-dev.log` last 10 lines |
| `The operation has timed out` on Invoke-WebRequest | Normal during initial SSG compile; warm-up retries every 3 s for 90 s |
| `pwsh not recognized` | Use `powershell -ExecutionPolicy Bypass -File smoke.ps1` |
| Build fails with `tsc error` | Run `npm run type-check` first to see TypeScript errors |
| `/quiz/chapter/part1_ch1` 500 after adding new code | Check `npm run type-check && npm run lint` — SSG page crashes on compile error |
