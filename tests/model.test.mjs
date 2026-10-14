import test from 'node:test';import assert from 'node:assert/strict';import {initialProject,validate,pathsFrom,connectedWires,exportWireSchedule} from '../src/model.js';
test('sample model has unique tags and physically separate devices',()=>assert.deepEqual(validate(initialProject()),[]));
test('tracing finds connected branch and network',()=>{const p=initialProject(),r=pathsFrom(p,'PS1');assert(r.devices.includes('X1'));assert(r.devices.includes('SW1'));assert(r.wires.length>0)});
test('device selection returns terminal-level wire records',()=>{const w=connectedWires(initialProject(),'PS1');assert.equal(w.length,2);assert.equal(w[0].toTerminal,'L')});
test('invalid terminals are detected',()=>{const p=initialProject();p.wires[0].toTerminal='MISSING';assert(validate(p).some(x=>x.includes('missing terminal')))});
test('overlapping devices are detected',()=>{const p=initialProject();p.parts[1].x=p.parts[0].x;assert(validate(p).some(x=>x.includes('Physical overlap')))});
test('CSV includes wire endpoints',()=>{const s=exportWireSchedule(initialProject());assert(s.includes('"W001"'));assert(s.includes('"Q1"'));assert(s.includes('"F1"'))});

import {traceLinks,validateImportedProject} from '../src/model.js';
test('direct links do not silently jump across multiple devices',()=>{
 const trace=traceLinks(initialProject(),'PS1');
 assert.deepEqual(new Set(trace.devices),new Set(['PS1','F1','TB1']));
 assert.deepEqual(new Set(trace.wires.map(w=>w.id)),new Set(['W002','W003']));
});
test('Ethernet trace excludes AC and DC links',()=>{
 const trace=traceLinks(initialProject(),'PLC1',{scope:'group',kinds:['ETHERNET']});
 assert.deepEqual(new Set(trace.devices),new Set(['PLC1','SW1']));
 assert.deepEqual(trace.wires.map(w=>w.id),['W008']);
});
test('incoming documented links only',()=>{
 const trace=traceLinks(initialProject(),'TB1',{direction:'upstream'});
 assert.deepEqual(new Set(trace.devices),new Set(['TB1','PS1']));
 assert.deepEqual(trace.wires.map(w=>w.id),['W003']);
});
test('invalid imported coordinates cannot replace a saved design',()=>{
 const original=initialProject(),invalid=structuredClone(original);invalid.parts[0].x=Infinity;
 assert.throws(()=>validateImportedProject(invalid),/geometry/);
 assert.equal(original.parts[0].x,58);
});
test('import rejects terminal mismatch and duplicate wire identification',()=>{
 const a=initialProject();a.wires[0].toTerminal='INVALID';
 assert.throws(()=>validateImportedProject(a),/terminal/);
 const b=initialProject();b.wires[1].id=b.wires[0].id;
 assert.throws(()=>validateImportedProject(b),/Duplicate/);
});
test('valid legacy schemaVersion 1 project stays loadable',()=>{
 const p=initialProject();assert.equal(validateImportedProject(p),p);
});
