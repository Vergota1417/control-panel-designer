# Product purpose and milestone map
## Why
Build a reusable industrial control-panel design environment that minimizes repetitive drafting and makes the electrical and physical design easy to understand, verify, assemble, maintain and expand.
## V1
A standalone interactive test bench, truthful connectivity model, manufacturability warning engine, device catalog, and exportable documents. No claim of code compliance.
## Roadmap
1. Engineering data: verified part metadata, schema, versioning, device/terminal/net model.
2. Interactive explorer: schematic, connected devices, circuit-semantic tracing, sidebar.
3. Panel geometry: DIN rails, wire ducts, dimensional constraints and placement.
4. Electrical verification: source/return/protection/load/bonding and profile-specific configurable checks.
5. Manufacturing: wire paths, measured lengths with allowances, labels, schedule and BOM.
6. Optimization: constraint solving prioritizing code/manufacturer requirements, maintenance space, then route efficiency.
7. Local assistant: propose structured edits and explain errors; never decide if a panel is safe.
8. PLC integration: import/export I/O and tag maps, source project links, controlled change proposals.
## Acceptance for milestone 1
- Load a sample panel with eight devices and terminal-to-terminal links.
- Select a device to inspect ratings placeholders, terminals, and adjacent wires.
- Highlight its connected graph (explicitly labeled topological only).
- Drag a device while retaining all connections.
- Save/reload locally, import/export project JSON and CSV wire schedule.
- Catch duplicate tags, bad endpoints and overlaps.
- Run automated tests in CI.
## Non-goals
No automatic wire sizing, validated SCCR, functional-safety design, electrical signoff, or approved construction drawings in milestone 1.
