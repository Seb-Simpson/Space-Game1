import { test, expect } from '@playwright/test';
test('mission control, flight, pause and persistent recovery', async ({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('#new-flight')).toBeVisible();await expect(page.locator('#space canvas')).toBeVisible();
 await page.screenshot({path:'test-results/mission-control.png',fullPage:true});
 await page.locator('#new-flight').click();await page.locator('#launch').click();
 await expect(page.locator('#time')).not.toHaveText('00:00',{timeout:20000});
 await page.keyboard.press('Escape');await expect(page.locator('#pause-overlay')).toBeVisible();
 const paused=await page.locator('#time').textContent();await page.waitForTimeout(300);expect(await page.locator('#time').textContent()).toBe(paused);
 await page.locator('#save').click();await expect(page.locator('#toast')).toContainText('saved');
 await page.locator('#exit').click();await page.reload();await expect(page.locator('#continue')).toBeEnabled();await page.locator('#continue').click();
 await page.screenshot({path:'test-results/flight.png',fullPage:true});
 expect(errors).toEqual([]);
});
test('mobile menu and flight controls fit viewport',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('#new-flight')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 await page.screenshot({path:'test-results/mobile-menu.png',fullPage:true});
 await page.locator('#new-flight').click();await expect(page.locator('#throttle')).toBeVisible();await expect(page.locator('#launch')).toBeVisible();await page.locator('#launch').click();await page.screenshot({path:'test-results/mobile-flight.png',fullPage:true});
});
