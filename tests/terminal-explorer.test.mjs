import test from 'node:test';
import assert from 'node:assert/strict';
import {terminalConnections} from '../src/terminal-explorer.js';
test('unknown device has no terminal groups',()=>assert.deepEqual(terminalConnections({parts:[],wires:[]},'missing'),[]));
