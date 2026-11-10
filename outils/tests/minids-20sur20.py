import asyncio,re,sys
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:8765'
async def run_one(page,m,ch):
    await page.goto(f'{BASE}/mini-ds/?m={m}&ch={ch}')
    await page.wait_for_selector('#start')
    await page.click('#start')
    await page.wait_for_selector('.mds-q')
    F='.mds-field input,.mds-field select'
    n=await page.locator(F).count()
    for i in range(n):
        el=page.locator(F).nth(i)
        if await el.evaluate('e=>e.tagName')=='SELECT': await el.select_option(index=1)
        else: await el.fill('1')
    page.once('dialog',lambda d: asyncio.ensure_future(d.accept()))
    await page.click('#mds-submit2')
    await page.wait_for_selector('.mds-score')
    exps=await page.locator('.mds-field .exp').all_inner_texts()
    vals=[]
    for t in exps:
        m=re.match(r'\s*(?:✗ attendu|✓)\s+(.*)$',t,re.S)
        vals.append(m.group(1).strip())
    await page.click('#mds-redo')
    await page.wait_for_selector('.mds-q')
    for i,v in enumerate(vals):
        el=page.locator(F).nth(i)
        if await el.evaluate('e=>e.tagName')=='SELECT': await el.select_option(label=v)
        else: await el.fill(re.sub(r'\s+[^\d\s,.−\-]+$','',v) if re.match(r'^[−\-]?[\d,.]+\s',v) else v)
    await page.click('#mds-submit2')
    await page.wait_for_selector('.mds-score')
    note=await page.locator('.mds-score [data-note]').inner_text()
    qs=await page.locator('.mds-q h3 .tag').all_inner_texts()
    return note.replace('\n',' '),n,qs
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        page=await b.new_page()
        errs=[];page.on('pageerror',lambda e: errs.append(str(e)))
        for m,ch in [('embarque','systemes'),('embarque','arduino'),('embarque','controle'),('embarque','temps'),('web','bases'),('web','structure'),('web','css'),('web','formulaires'),('outils','complexes'),('elec','sinusoidal')]:
            for k in range(2):
                note,n,qs=await run_one(page,m,ch)
                print(ch,'essai',k+1,':',note,'·',n,'cases ·',', '.join(qs))
        print('erreurs JS :',errs or 'aucune')
        await b.close()
asyncio.run(main())
