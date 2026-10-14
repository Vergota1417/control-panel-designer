# Control Panel Designer — Milestone 1

Local-first engineering workspace for an **illustrative industrial test bench**. Built for expansion into real parts databases, cabinet geometry, rules-based electrical validation, routing and labels.

## Start on Windows
1. Install Node.js 22 or newer (if not already installed).
2. Unzip the project, open PowerShell in the folder.
3. Run `npm run check` and `npm start`.
4. Open `http://localhost:4173` in a browser.

No npm install, subscription, API key, GPU, or internet is needed to run the app. NVIDIA GPU will become useful later for optional local AI or advanced 3D workloads.

## Prototype capabilities
Select components, highlight topological connections, drag positions, inspect terminal-to-terminal wire assignments, download CSV and JSON, import a saved JSON, reset demo. Browser local storage keeps edits on reload.

## GitHub setup (once)
Create an **empty private repository** named `control-panel-designer` in your GitHub account. On your PC, with Git installed, from the unzipped project directory:
```powershell
git init
git add .
git commit -m "feat: initial panel designer and engineering foundations"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/control-panel-designer.git
git push -u origin main
```
Replace YOUR_USERNAME with your GitHub username. GitHub may ask for authentication. The `.github/workflows/ci.yml` workflow runs automated tests for future pull requests. **Review each proposed change; do not enable unattended self-merging.**

## Development with GitHub AI agents
In your coding agent / Codex GitHub workflow, point the agent to this repo and tell it to follow `AGENTS.md`. Have it work one milestone per PR, with tests and a before/after screenshot where relevant. Require the `Verify Prototype` CI to pass and manually approve critical engineering changes.

## Important
**Concept only — not approved for energized installation.** Read `docs/SAFETY.md`. Example wiring is incomplete and the highlighted network is NOT a verified electrical continuity or safety analysis.
