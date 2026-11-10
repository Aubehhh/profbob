import asyncio
from playwright.async_api import async_playwright
B='http://127.0.0.1:8765';D='/home/claude/tests/shots/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        c=await b.new_context(viewport={'width':1280,'height':860},reduced_motion='reduce');pg=await c.new_page()
        await pg.goto(B+'/cours/crea/explorer/');await pg.wait_for_timeout(600);await pg.screenshot(path=D+'ci_o1.png')
        await pg.goto(B+'/cours/crea/innover/#s1');await pg.wait_for_timeout(700);await pg.screenshot(path=D+'ci_o2.png')
        await pg.goto(B+'/mini-ds/?m=crea&ds=crea');await pg.wait_for_selector('#start');await pg.click('#start');await pg.wait_for_selector('.mds-q')
        await pg.wait_for_timeout(300);await pg.screenshot(path=D+'ci_o3.png')
        pg.once('dialog',lambda d: asyncio.ensure_future(d.accept()));await pg.click('#mds-submit2');await pg.wait_for_selector('.mds-score')
        await pg.evaluate("document.querySelectorAll('.mds-q')[1].scrollIntoView()");await pg.wait_for_timeout(400);await pg.screenshot(path=D+'ci_o4.png')
        await c.close()
        for sch in ['light','dark']:
            c=await b.new_context(viewport={'width':390,'height':844},color_scheme=sch,device_scale_factor=2,is_mobile=True,reduced_motion='reduce');pg=await c.new_page()
            await pg.goto(B+'/cours/crea/imaginer/');await pg.wait_for_timeout(600);await pg.screenshot(path=D+f'ci_t1_{sch}.png')
            await pg.goto(B+'/cours/crea/imaginer/#s2');await pg.wait_for_timeout(700);await pg.evaluate("window.scrollBy(0,180)");await pg.wait_for_timeout(200);await pg.screenshot(path=D+f'ci_t2_{sch}.png')
            await pg.goto(B+'/cours/crea/explorer/#s2');await pg.wait_for_timeout(700);await pg.screenshot(path=D+f'ci_t3_{sch}.png')
            await pg.goto(B+'/mini-ds/?m=crea&ch=imaginer');await pg.wait_for_selector('#start');await pg.click('#start');await pg.wait_for_selector('.mds-q');await pg.wait_for_timeout(300)
            await pg.evaluate("document.querySelectorAll('.mds-q')[0].scrollIntoView()");await pg.wait_for_timeout(200);await pg.screenshot(path=D+f'ci_t4_{sch}.png')
            await c.close()
        await b.close()
asyncio.run(main())
