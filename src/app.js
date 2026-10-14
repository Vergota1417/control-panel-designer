import {initialProject,validate,pathsFrom,connectedWires,exportWireSchedule} from './model.js';
const KEY='control-panel-designer-v1';
let project;try{project=JSON.parse(localStorage.getItem(KEY))||initialProject()}catch{project=initialProject()}
let selected='PS1', trace=false, drag=null;
const el=id=>document.getElementById(id);
function save(){localStorage.setItem(KEY,JSON.stringify(project));}
function download(name,content,type){const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function linePoints(a,b){const x1=a.x+a.w/2,y1=a.y+a.h/2,x2=b.x+b.w/2,y2=b.y+b.h/2;return {x1,y1,x2,y2}}
function render(){
 const board=el('board');board.innerHTML='';
 const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1100 640');svg.setAttribute('class','wires');
 const area=trace?pathsFrom(project,selected):null;
 for(const w of project.wires){const a=project.parts.find(p=>p.id===w.from),b=project.parts.find(p=>p.id===w.to);if(!a||!b)continue;const {x1,y1,x2,y2}=linePoints(a,b);const path=document.createElementNS(ns,'path');let mid=(x1+x2)/2;path.setAttribute('d',`M${x1},${y1} H${mid} V${y2} H${x2}`);path.setAttribute('class',`wire ${w.kind.toLowerCase()} ${area&&!area.wires.some(t=>t.id===w.id)?'muted':''} ${w.from===selected||w.to===selected?'linked':''}`);svg.append(path)}board.append(svg);
 for(const p of project.parts){const d=document.createElement('button');d.className='component '+(p.id===selected?'selected ':'')+(trace&&area&&!area.devices.includes(p.id)?'muted ':'');d.style.left=p.x/1100*100+'%';d.style.top=p.y/640*100+'%';d.style.width=p.w/1100*100+'%';d.style.height=p.h/640*100+'%';d.dataset.id=p.id;d.innerHTML=`<span class="tag">${p.id}</span><strong>${p.name}</strong><small>${p.type}</small>`;d.addEventListener('pointerdown',e=>{if(e.button!==0)return;selected=p.id;drag={id:p.id,x:e.clientX,y:e.clientY,px:p.x,py:p.y};d.setPointerCapture(e.pointerId);renderSidebar()});d.addEventListener('pointermove',e=>{if(!drag||drag.id!==p.id)return;const rect=board.getBoundingClientRect();const dx=(e.clientX-drag.x)*1100/rect.width,dy=(e.clientY-drag.y)*640/rect.height;p.x=Math.max(0,Math.min(1100-p.w,Math.round(drag.px+dx)));p.y=Math.max(0,Math.min(640-p.h,Math.round(drag.py+dy)));d.style.left=p.x/1100*100+'%';d.style.top=p.y/640*100+'%'});d.addEventListener('pointerup',()=>{drag=null;save();render()});d.addEventListener('click',()=>{selected=p.id;render()});board.append(d)}
 renderSidebar();
}
function renderSidebar(){const p=project.parts.find(p=>p.id===selected);const details=el('details');if(!p){details.textContent='Select a device';return}
 const wires=connectedWires(project,selected);
 details.innerHTML=`<div class="eyebrow">SELECTED DEVICE</div><h2>${p.id} · ${p.name}</h2><p>${p.purpose}</p><div class="property"><span>Type</span><b>${p.type}</b></div><div class="property"><span>Power</span><b>${p.voltage}</b></div><div class="property"><span>Rated current</span><b>${p.current}</b></div><div class="property"><span>Functional zone</span><b>${p.zone}</b></div><h3>Terminals</h3><div class="chips">${p.terminal.map(t=>`<span>${t}</span>`).join('')}</div><h3>Connected wires (${wires.length})</h3>${wires.map(w=>`<div class="connection"><b>${w.id} · ${w.kind}</b><small>${w.from}:${w.fromTerminal} → ${w.to}:${w.toTerminal}</small><span>${w.label}</span></div>`).join('')||'<p>No wires.</p>'}<div class="warning">Concept only: ratings, conductor sizes, protective devices and safety compliance are not verified.</div>`;
 const checks=validate(project);el('status').textContent=`${project.parts.length} devices · ${project.wires.length} connections · ${checks.length} geometry/connectivity warning(s)`;el('warnings').innerHTML=checks.map(c=>`<div>${c}</div>`).join('')||'<div>No geometry/connectivity issues detected. Electrical design is not validated.</div>';
}
el('trace').addEventListener('click',()=>{trace=!trace;el('trace').textContent=trace?'Show all connections':'Highlight network';render()});
el('export-json').onclick=()=>download('test-bench-project.json',JSON.stringify(project,null,2),'application/json');
el('export-csv').onclick=()=>download('wire-schedule.csv',exportWireSchedule(project),'text/csv');
el('reset').onclick=()=>{if(confirm('Reset demonstration to its original state?')){project=initialProject();selected='PS1';trace=false;save();render()}};
el('import-json').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const p=JSON.parse(await f.text());if(!Array.isArray(p.parts)||!Array.isArray(p.wires)||p.schemaVersion!==1)throw Error('Unsupported project structure');project=p;selected=p.parts[0]?.id||'';save();render()}catch(err){alert('Cannot import project: '+err.message)}e.target.value=''};
render();
