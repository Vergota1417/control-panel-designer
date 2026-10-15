import {test,expect} from '@playwright/test';
test('terminal grouping works in Chromium',async({page})=>{
 await page.goto('/');
 const count=await page.evaluate(async()=>{
  const {terminalConnections}=await import('/src/terminal-explorer.js');
  return terminalConnections({parts:[{id:'A',terminal:['1']}],wires:[]},'A').length;
 });
 expect(count).toBe(1);
});
