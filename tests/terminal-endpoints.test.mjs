import test from 'node:test';
import assert from 'node:assert/strict';
import {initialProject} from '../src/model.js';
import {terminalConnections} from '../src/terminal-explorer.js';
test('documented terminal endpoints are grouped without device continuity',()=>{
 const groups=terminalConnections(initialProject(),'PLC1');
 assert.equal(groups.length,5);
 assert.deepEqual(groups.find(g=>g.terminal==='ETH').links.map(l=>l.peerId+':'+l.peerTerminal),['SW1:ETH1']);
 assert.deepEqual(groups.find(g=>g.terminal==='M').links,[]);
 const relay=terminalConnections(initialProject(),'K1');
 assert.equal(relay.find(g=>g.terminal==='13').links[0].peerId,'TB1');
 assert.equal(relay.find(g=>g.terminal==='14').links[0].peerId,'X1');
});
