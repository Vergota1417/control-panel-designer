/**
 * Read-only adjacency grouped by exact terminal. This is NOT an electrical
 * continuity, current-flow or safety calculation.
 */
export function terminalConnections(project,deviceId){
 const device=project?.parts?.find(p=>p.id===deviceId);
 if(!device||!Array.isArray(device.terminal))return [];
 const groups=device.terminal.map(terminal=>({terminal,links:[]}));
 const byTerminal=new Map(groups.map(g=>[g.terminal,g]));
 const devices=new Map(project.parts.map(p=>[p.id,p]));
 for(const w of project.wires||[]){
  if(!w)continue;
  const edges=[
   w.from===deviceId?[w.fromTerminal,w.to,w.toTerminal,'outgoing']:null,
   w.to===deviceId?[w.toTerminal,w.from,w.fromTerminal,'incoming']:null
  ];
  for(const edge of edges){
   if(!edge)continue;
   const [terminal,peerId,peerTerminal,relation]=edge;
   const group=byTerminal.get(terminal),peer=devices.get(peerId);
   if(!group||!peer||!Array.isArray(peer.terminal)||!peer.terminal.includes(peerTerminal))continue;
   group.links.push({wireId:w.id,kind:w.kind,label:w.label,peerId,peerTerminal,relation});
  }
 }
 return groups;
}
