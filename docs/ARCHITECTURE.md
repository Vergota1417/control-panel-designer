# Engineering architecture
The project JSON is the sole source of truth in the prototype; later versions will use a typed schema with migrations and SQLite or equivalent persistence.
Entities: Component {id, type, name, electrical metadata, terminal[], geometric bounds}; Connection {wire id, from device, from terminal, to device, to terminal, kind}; Panel {bounds and future rails, ducts, physical positions}.
The visual electrical map is generated from Connections, not saved as independent lines. Physical movement changes coordinates only and must never mutate wire endpoints.
Current connectivity traversal is undirected **topological adjacency**, not electrical conduction. It must evolve into terminal/net-level semantic paths where normally-open contacts, supplies, protection, PLC outputs, and Ethernet links follow distinct traversal rules.
Future engines should consume and produce validated JSON change sets, preserve revisions, and provide human-readable reasons for every rejected design edit.
