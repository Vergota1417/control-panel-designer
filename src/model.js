export const seedParts = [
  {id:'Q1',name:'Main disconnect',type:'Disconnect',x:58,y:48,w:112,h:100,voltage:'120 VAC (illustrative)',current:'TBD',purpose:'Isolates incoming supply',terminal:['L','T'],zone:'AC'},
  {id:'F1',name:'Branch protection',type:'Circuit protection',x:196,y:48,w:92,h:100,voltage:'120 VAC',current:'TBD',purpose:'Branch protection placeholder; rating not selected',terminal:['LINE','LOAD'],zone:'AC'},
  {id:'PS1',name:'DC power supply',type:'Power supply',x:318,y:48,w:128,h:100,voltage:'120 VAC → 24 VDC',current:'TBD',purpose:'Supplies control power',terminal:['L','N','PE','+V','-V'],zone:'DC'},
  {id:'TB1',name:'24 V distribution',type:'Terminal distribution',x:492,y:48,w:124,h:100,voltage:'24 VDC',current:'TBD',purpose:'Branch connection point',terminal:['IN+','OUT1+','OUT2+'],zone:'DC'},
  {id:'PLC1',name:'PLC CPU / I/O',type:'PLC',x:664,y:48,w:145,h:128,voltage:'24 VDC',current:'TBD',purpose:'Control logic and field I/O',terminal:['L+','M','I0','Q0','ETH'],zone:'DC'},
  {id:'K1',name:'Interface relay',type:'Relay',x:494,y:230,w:110,h:92,voltage:'24 VDC coil',current:'TBD',purpose:'Switches pilot load',terminal:['A1','A2','13','14'],zone:'DC'},
  {id:'X1',name:'Field terminals',type:'Terminal block',x:663,y:230,w:140,h:92,voltage:'Mixed (separate circuits)',current:'TBD',purpose:'Connects outside field devices',terminal:['1','2','3'],zone:'FIELD'},
  {id:'SW1',name:'Ethernet switch',type:'Network switch',x:304,y:230,w:125,h:92,voltage:'24 VDC (assumed)',current:'TBD',purpose:'Industrial network distribution',terminal:['PWR+','PWR-','ETH1','ETH2'],zone:'NETWORK'}
];
export const seedWires = [
  {id:'W001',from:'Q1',fromTerminal:'T',to:'F1',toTerminal:'LINE',kind:'AC',label:'AC feed'},
  {id:'W002',from:'F1',fromTerminal:'LOAD',to:'PS1',toTerminal:'L',kind:'AC',label:'Protected AC'},
  {id:'W003',from:'PS1',fromTerminal:'+V',to:'TB1',toTerminal:'IN+',kind:'DC',label:'+24 VDC'},
  {id:'W004',from:'TB1',fromTerminal:'OUT1+',to:'PLC1',toTerminal:'L+',kind:'DC',label:'PLC supply'},
  {id:'W005',from:'TB1',fromTerminal:'OUT2+',to:'K1',toTerminal:'13',kind:'DC',label:'Control branch'},
  {id:'W006',from:'PLC1',fromTerminal:'Q0',to:'K1',toTerminal:'A1',kind:'SIGNAL',label:'Relay command'},
  {id:'W007',from:'K1',fromTerminal:'14',to:'X1',toTerminal:'1',kind:'SIGNAL',label:'Switched field feed'},
  {id:'W008',from:'PLC1',fromTerminal:'ETH',to:'SW1',toTerminal:'ETH1',kind:'ETHERNET',label:'Data link'}
];
export const clone = x => JSON.parse(JSON.stringify(x));
export function initialProject(){return {schemaVersion:1,title:'Industrial Test Bench — Concept',parts:clone(seedParts),wires:clone(seedWires)}}
export function validate(project){
  const problems=[];
  const ids=new Set();
  for(const p of project.parts||[]){if(ids.has(p.id))problems.push(`Duplicate tag: ${p.id}`); ids.add(p.id); if(!(p.w>0&&p.h>0)) problems.push(`Invalid geometry: ${p.id}`)}
  for(const w of project.wires||[]){
    const a=project.parts.find(p=>p.id===w.from),b=project.parts.find(p=>p.id===w.to);
    if(!a||!b){problems.push(`Wire ${w.id} references missing device`);continue}
    if(!a.terminal.includes(w.fromTerminal)||!b.terminal.includes(w.toTerminal))problems.push(`Wire ${w.id} references missing terminal`);
  }
  for(let i=0;i<project.parts.length;i++)for(let j=i+1;j<project.parts.length;j++){
    const a=project.parts[i],b=project.parts[j];
    if(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y)problems.push(`Physical overlap: ${a.id} / ${b.id}`)
  }
  return problems;
}
export function pathsFrom(project,selected){
 const seen=new Set([selected]),queue=[selected];
 while(queue.length){const cur=queue.shift(); for(const w of project.wires){const next=w.from===cur?w.to:w.to===cur?w.from:null; if(next&&!seen.has(next)){seen.add(next);queue.push(next)}}}
 return {devices:[...seen],wires:project.wires.filter(w=>seen.has(w.from)&&seen.has(w.to))};
}
export function connectedWires(project,id){return project.wires.filter(w=>w.from===id||w.to===id)}
export function exportWireSchedule(project){const rows=[['Wire','From tag','From terminal','To tag','To terminal','Circuit','Description']];for(const w of project.wires)rows.push([w.id,w.from,w.fromTerminal,w.to,w.toTerminal,w.kind,w.label]);return rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n')}
