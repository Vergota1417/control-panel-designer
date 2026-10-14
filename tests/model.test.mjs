import test from 'node:test';import assert from 'node:assert/strict';import {initialProject,validate,pathsFrom,connectedWires,exportWireSchedule} from '../src/model.js';
test('sample model has unique tags and physically separate devices',()=>assert.deepEqual(validate(initialProject()),[]));
test('tracing finds connected branch and network',()=>{const p=initialProject(),r=pathsFrom(p,'PS1');assert(r.devices.includes('X1'));assert(r.devices.includes('SW1'));assert(r.wires.length>0)});
test('device selection returns terminal-level wire records',()=>{const w=connectedWires(initialProject(),'PS1');assert.equal(w.length,2);assert.equal(w[0].toTerminal,'L')});
test('invalid terminals are detected',()=>{const p=initialProject();p.wires[0].toTerminal='MISSING';assert(validate(p).some(x=>x.includes('missing terminal')))});
test('overlapping devices are detected',()=>{const p=initialProject();p.parts[1].x=p.parts[0].x;assert(validate(p).some(x=>x.includes('Physical overlap')))});
test('CSV includes wire endpoints',()=>{const s=exportWireSchedule(initialProject());assert(s.includes('"W001"'));assert(s.includes('"Q1"'));assert(s.includes('"F1"'))});
