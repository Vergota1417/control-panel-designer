# AI Coding Agent — Operating Instructions
You are building a deterministic, local-first industrial control-panel engineering application. Read `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, and `docs/SAFETY.md` first.

## Non-negotiable requirements
- Keep one authoritative structured project model for devices, terminals, wires, circuits, physical locations, and metadata.
- Never substitute image inference or AI-generated text for verified manufacturer electrical ratings or installation requirements.
- Do not claim electrical compliance, approved wire gauge, protective-device rating, functional-safety rating, or construction readiness from incomplete inputs.
- Build missing-input reporting, provenance, and constraints into every future design/calculation engine.
- Keep `npm run check` passing. For each feature, write failure/edge-case tests, not just happy-path tests.
- Preserve backward compatibility for saved projects or introduce explicit migrations. Never silently lose imported data.
- No paid AI APIs, required login, telemetry, license keys, or subscription dependencies in the shipped application.
- Prefer fast browser UI, offline-capable components and minimal dependencies; avoid premature AI/3D complexity.
- Do not rewrite unrelated features to add a feature. Commit in reviewable slices.
- Only propose industrial wiring if source, return, bonding, protective devices, load data, conductor conditions, applicable standard, and manufacturer instructions are resolved.
- Read-only explanations and symbolic conceptual diagrams are permitted with explicit warning if information is incomplete.

## Pull request definition of done
1. State exactly what changed and what did not change.
2. Provide tests, reproducible steps, and any new known limitations.
3. Run `npm run check`, document pass/fail.
4. Demonstrate no loss of wire endpoints when a component moves.
5. Treat any safety-critical output as unverified until an authorized engineer checks it.
6. Routine UI, documentation, and non-engineering bugfixes explicitly authorized by the owner can be merged only after all required CI and browser checks pass. Never auto-merge unknown contributions, and always request qualified review of engineering rules, electrical safety or construction-ready outputs.

## Next tasks in priority order
1. Add robust JSON schema versioning and import validation (reject malformed coordinates/IDs/XSS data).
2. Improve connector port anchors and update wire geometry smoothly during dragging (basic motion is implemented).
3. Add panel configuration with bounds, rail geometry and snap-to-grid.
4. Add component catalog metadata and human-managed verification status.
5. Add a connection-focused expandable tree, upstream/downstream tracing and net semantics; a switch or relay must not be treated as uninterrupted continuity.
6. Introduce layout conflict reporting beyond rectangle collisions (required thermal/access clearances).
7. Create printable wire schedule, parts list and naming profiles without suggesting safety-approved gauges.
8. Add a reviewable engineering-rules subsystem and deterministic fixtures.
