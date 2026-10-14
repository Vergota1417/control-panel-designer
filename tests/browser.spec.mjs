import {test,expect} from '@playwright/test';

test('zoom, choose device, choose wire, navigate and filter trace',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.locator('.component')).toHaveCount(8);
 await expect(page.locator('[data-wire]')).toHaveCount(8);
 const old=await page.locator('#zoom-level').innerText();
 await page.locator('#zoom-in').click();
 await expect(page.locator('#zoom-level')).not.toHaveText(old);
 await page.locator('.component[data-id="PLC1"]').click();
 await expect(page.locator('#details h2')).toContainText('PLC1');
 await page.locator('[data-link="W008"]').click();
 await expect(page.locator('#details h2')).toContainText('W008');
 await page.locator('[data-go="SW1"]').first().click();
 await expect(page.locator('#details h2')).toContainText('SW1');
 await page.locator('#trace').click();
 await page.locator('#kind').selectOption('ETHERNET');
 await expect(page.locator('.component:not(.muted)')).toHaveCount(2);
 expect(errors).toEqual([]);
});

test('moving a component preserves its electrical endpoints and local work',async({page})=>{
 await page.goto('/');
 const device=page.locator('.component[data-id="K1"]');
 const before=await device.evaluate(el=>el.style.left);
 const bb=await device.boundingBox();
 await page.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);
 await page.mouse.down();
 await page.mouse.move(bb.x+bb.width/2+32,bb.y+bb.height/2+25,{steps:4});
 await page.mouse.up();
 await expect(device).not.toHaveCSS('left',before);
 await expect(page.locator('[data-wire]')).toHaveCount(8);
 await page.reload();
 await expect(page.locator('.component[data-id="K1"]')).not.toHaveCSS('left',before);
 await expect(page.locator('[data-wire]')).toHaveCount(8);
});
