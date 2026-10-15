import test from 'node:test';
import assert from 'node:assert/strict';
import {initialProject} from '../src/model.js';
import {terminalConnections} from '../src/terminal-explorer.js';
test('multiple wires at one terminal and dangling endpoints',()=>{
 const p=initialProject();
 p.wires.push({id:'W009',from:'PLC1',fromTerminal:'ETH',to:'SW1',toTerminal:'ETH2',kind:'ETHERNET',label:'Second'});
 p.wires.push({id:'BAD',from:'PLC1',fromTerminal:'ETH',to:'UNKNOWN',toTerminal:'1',kind:'ETHERNET',label:'Broken'});
 const links=terminalConnections(p,'PLC1').find(g=>g.terminal==='ETH').links;
 assert.deepEqual(links.map(l=>l.wireId),['W008','W009']);
});
