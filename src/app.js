import {initialProject,validate,exportWireSchedule,traceLinks,validateImportedProject} from './model.js';
import {terminalConnections} from './terminal-explorer.js';

const KEY='control-panel-designer-v1',W=1100,H=640,NS='http://www.w3.org/2000/svg';
const el=id=>document.getElementById(id);
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let project;try{project=validateImportedProject(JSON.parse(localStorage.getItem(KEY)))}catch{project=initialProject()}
let selected='PS1',selectedWire=null,tracing=false,drag=null,pan=null,view={scale:1,x:0,y:0};
const viewport=el('viewport'),board=el('board');
const part=id=>project.parts.find(p=>p.id===id);
const wire=id=>project.wires.find(w=>w.id===id);
const allowed=()=>el('kind').value==='ALL'?['AC','DC','SIGNAL','ETHERNET']:el('kind').value==='POWER'?['AC','DC']:[el('kind').value];
const network=()=>traceLinks(project,selected,{scope:el('scope').value,direction:el('direction').value,kinds:allowed()});
function save(){try{localStorage.setItem(KEY,JSON.stringify(project))}catch(e){console.warn('Local save failed',e)}}
function download(name,body,type){const url=URL.createObjectURL(new Blob([body],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function geometry(w){const a=part(w.from),b=part(w.to);if(!a||!b)return '';const x=a.x+a.w/2,y=a.y+a.h/2,xx=b.x+b.w/2,yy=b.y+b.h/2,m=(x+xx)/2;return 'M'+x+' '+y+'H'+m+'V'+yy+'H'+xx}
function mapView(){board.style.transform='translate('+view.x+'px,'+view.y+'px) scale('+view.scale+')';el('zoom-level').textContent=Math.round(view.scale*100)+'%';mini()}
function fit(){const r=viewport.getBoundingClientRect(),s=Math.min(r.width/W,r.height/H)*.95;view={scale:s,x:(r.width-W*s)/2,y:(r.height-H*s)/2};mapView()}
function zoom(factor,cx,cy){const r=viewport.getBoundingClientRect(),x=cx-r.left,y=cy-r.top,prior=view.scale;view.scale=Math.max(.22,Math.min(3.5,prior*factor));const t=view.scale/prior;view.x=x-(x-view.x)*t;view.y=y-(y-view.y)*t;mapView()}
function center(p){if(!p)return;const r=viewport.getBoundingClientRect();view.x=r.width/2-(p.x+p.w/2)*view.scale;view.y=r.height/2-(p.y+p.h/2)*view.scale;mapView()}
function mini(){const target=el('minimap');target.replaceChildren();const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 1100 640');for(const p of project.parts){const r=document.createElementNS(NS,'rect');r.setAttribute('x',p.x);r.setAttribute('y',p.y);r.setAttribute('width',p.w);r.setAttribute('height',p.h);r.setAttribute('class',p.id===selected?'mini-part selected':'mini-part');svg.append(r)}const r=viewport.getBoundingClientRect(),frame=document.createElementNS(NS,'rect');for(const[k,v]of Object.entries({x:-view.x/view.scale,y:-view.y/view.scale,width:r.width/view.scale,height:r.height/view.scale}))frame.setAttribute(k,v);frame.setAttribute('class','mini-window');svg.append(frame);target.append(svg)}
function refresh(){const linked=tracing?network():null,wireIds=new Set(linked?.wires.map(w=>w.id)||[]),ids=new Set(linked?.devices||[]);
 board.querySelectorAll('[data-wire]').forEach(path=>{const w=wire(path.dataset.wire);path.setAttribute('d',geometry(w));path.setAttribute('class','wire '+w.kind.toLowerCase()+(tracing&&!wireIds.has(w.id)?' muted':'')+(selectedWire===w.id?' active':(!selectedWire&&(w.from===selected||w.to===selected)?' linked':'')))});
 board.querySelectorAll('.component').forEach(b=>b.classList.toggle('muted',tracing&&!ids.has(b.dataset.id)));
}
function render(){board.replaceChildren();const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 1100 640');svg.setAttribute('class','wires');
 for(const w of project.wires){const line=document.createElementNS(NS,'path');line.dataset.wire=w.id;line.setAttribute('role','button');line.setAttribute('tabindex','0');line.setAttribute('aria-label',w.id+' from '+w.from+' to '+w.to);line.addEventListener('click',e=>{e.stopPropagation();chooseWire(w.id)});line.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseWire(w.id)}});svg.append(line)}board.append(svg);
 for(const p of project.parts){const b=document.createElement('button');b.dataset.id=p.id;b.className='component'+(selected===p.id?' selected':'');for(const[k,v]of Object.entries({left:p.x+'px',top:p.y+'px',width:p.w+'px',height:p.h+'px'}))b.style[k]=v;b.innerHTML='<span class="tag">'+safe(p.id)+'</span><strong>'+safe(p.name)+'</strong><small>'+safe(p.type)+'</small>';
  b.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:p.id,cx:e.clientX,cy:e.clientY,x:p.x,y:p.y,moved:false};b.setPointerCapture(e.pointerId)});
  b.addEventListener('pointermove',e=>{if(!drag||drag.id!==p.id)return;const dx=(e.clientX-drag.cx)/view.scale,dy=(e.clientY-drag.cy)/view.scale;drag.moved=drag.moved||Math.abs(dx)+Math.abs(dy)>3;p.x=Math.max(0,Math.min(W-p.w,Math.round(drag.x+dx)));p.y=Math.max(0,Math.min(H-p.h,Math.round(drag.y+dy)));b.style.left=p.x+'px';b.style.top=p.y+'px';refresh()});
  b.addEventListener('pointerup',()=>{const moved=drag?.moved;drag=null;if(moved)save();mini();showDetails()});
  b.addEventListener('pointercancel',()=>{drag=null;save()});
  b.addEventListener('click',()=>choosePart(p.id));board.append(b)}
 refresh();showDetails();mini();
}
function choosePart(id,jump=false){selected=id;selectedWire=null;render();if(jump)center(part(id))}
function chooseWire(id){const w=wire(id);if(!w)return;selected=w.from;selectedWire=id;render()}
function showDetails(){const p=part(selected),details=el('details');if(!p){details.textContent='Choose a device';return}const current=wire(selectedWire),wires=connectedWires(project,selected),related=network();let body='<div class="eyebrow">'+(current?'SELECTED CONNECTION':'SELECTED DEVICE')+'</div>';
 if(current){body+='<h2>'+safe(current.id)+'</h2><p>'+safe(current.label)+'</p><div class="property"><span>Circuit</span><b>'+safe(current.kind)+'</b></div><div class="connection"><b>'+safe(current.from)+':'+safe(current.fromTerminal)+'</b><span>→</span><b>'+safe(current.to)+':'+safe(current.toTerminal)+'</b></div><div class="side-actions"><button data-go="'+safe(current.from)+'">Show source</button><button data-go="'+safe(current.to)+'">Show destination</button></div><p class="disclaimer">Arrow indicates drawing reference direction, not verified energized current flow.</p>'}
 else{body+='<h2>'+safe(p.id)+' · '+safe(p.name)+'</h2><p>'+safe(p.purpose)+'</p>';for(const[k,v]of Object.entries({Type:p.type,Power:p.voltage,'Rated current':p.current,'Functional zone':p.zone}))body+='<div class="property"><span>'+safe(k)+'</span><b>'+safe(v)+'</b></div>';
 body+='<h3>Terminals</h3><div class="chips">'+p.terminal.map(t=>'<span>'+safe(t)+'</span>').join('')+'</div><h3>Connected wires ('+wires.length+')</h3>';
 body+=wires.map(w=>'<button class="connection connection-button" data-link="'+safe(w.id)+'"><b>'+safe(w.id)+' · '+safe(w.kind)+'</b><small>'+safe(w.from)+':'+safe(w.fromTerminal)+' → '+safe(w.to)+':'+safe(w.toTerminal)+'</small><span>'+safe(w.label)+'</span></button>').join('')||'<p>No connections.</p>'}
 body+='<h3>Explore connected devices</h3><p>'+related.devices.length+' devices · '+related.wires.length+' links for selected filter</p><div class="connected-devices">'+related.devices.filter(id=>id!==selected).map(id=>'<button data-go="'+safe(id)+'">'+safe(id)+' · '+safe(part(id)?.name||id)+'</button>').join('')+'</div><div class="warning">Concept drawing only. Ratings, conductor sizing, protective devices and safety compliance are not verified.</div>';
 details.innerHTML=body;
 const issues=validate(project);el('status').textContent=project.parts.length+' devices · '+project.wires.length+' connections · '+issues.length+' geometry/connectivity warning(s)';el('warnings').replaceChildren();if(!issues.length)el('warnings').textContent='No geometry/connectivity warnings. Electrical design remains unverified.';else for(const m of issues){const div=document.createElement('div');div.textContent=m;el('warnings').append(div)}
}
el('details').addEventListener('click',e=>{const go=e.target.closest('[data-go]'),link=e.target.closest('[data-link]');if(go)choosePart(go.dataset.go,true);else if(link)chooseWire(link.dataset.link)});
viewport.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.component')||e.target.dataset.wire)return;pan={x:e.clientX,y:e.clientY,vx:view.x,vy:view.y};viewport.setPointerCapture(e.pointerId);viewport.classList.add('panning')});
viewport.addEventListener('pointermove',e=>{if(!pan)return;view.x=pan.vx+e.clientX-pan.x;view.y=pan.vy+e.clientY-pan.y;mapView()});
for(const name of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(name,()=>{pan=null;viewport.classList.remove('panning')});
viewport.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.12:1/1.12,e.clientX,e.clientY)},{passive:false});
el('zoom-in').onclick=()=>{const r=viewport.getBoundingClientRect();zoom(1.25,r.left+r.width/2,r.top+r.height/2)};
el('zoom-out').onclick=()=>{const r=viewport.getBoundingClientRect();zoom(.8,r.left+r.width/2,r.top+r.height/2)};
el('fit').onclick=fit;
el('minimap').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect(),px=(e.clientX-r.left)/r.width*W,py=(e.clientY-r.top)/r.height*H,b=viewport.getBoundingClientRect();view.x=b.width/2-px*view.scale;view.y=b.height/2-py*view.scale;mapView()});
el('trace').onclick=()=>{tracing=!tracing;el('trace').textContent=tracing?'Trace on':'Trace off';el('trace').setAttribute('aria-pressed',String(tracing));render()};
for(const id of ['scope','kind','direction'])el(id).onchange=render;
el('export-json').onclick=()=>download('test-bench-project.json',JSON.stringify(project,null,2),'application/json');
el('export-csv').onclick=()=>download('wire-schedule.csv',exportWireSchedule(project),'text/csv');
el('reset').onclick=()=>{if(confirm('Reset demonstration and replace local changes? Export JSON first if needed.')){project=initialProject();selected='PS1';selectedWire=null;tracing=false;el('trace').textContent='Trace off';el('trace').setAttribute('aria-pressed','false');save();render();fit()}};
el('import-json').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{if(f.size>2000000)throw Error('File exceeds 2 MB');const data=validateImportedProject(JSON.parse(await f.text()));project=data;selected=data.parts[0]?.id||'';selectedWire=null;save();render();fit()}catch(err){alert('Import rejected; existing design was kept. '+err.message)}e.target.value=''};
render();requestAnimationFrame(fit);window.addEventListener('resize',fit);
