# Test navigateur (agent tests) : lancer d'abord « python3 -m http.server 8765 --bind 127.0.0.1 » à la racine du site.
import asyncio,re,sys
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:8765'
async def run_one(page,ch):
    await page.goto(f'{BASE}/mini-ds/?m=meca&ch={ch}')
    await page.wait_for_selector('#start')
    await page.click('#start')
    await page.wait_for_selector('.mds-q')
    n=await page.locator('.mds-field input').count()
    for i in range(n): await page.locator('.mds-field input').nth(i).fill('1')
    page.once('dialog',lambda d: asyncio.ensure_future(d.accept()))
    await page.click('#mds-submit2')
    await page.wait_for_selector('.mds-score')
    exps=await page.locator('.mds-field .exp').all_inner_texts()
    vals=[]
    for t in exps:
        m=re.search(r'attendu\s+([−\-]?[\d,\.]+)',t) or re.search(r'✓\s+([−\-]?[\d,\.]+)',t)
        vals.append(m.group(1))
    await page.click('#mds-redo')
    await page.wait_for_selector('.mds-q')
    for i,v in enumerate(vals): await page.locator('.mds-field input').nth(i).fill(v)
    await page.click('#mds-submit2')
    await page.wait_for_selector('.mds-score')
    note=await page.locator('.mds-score [data-note]').inner_text()
    qs=await page.locator('.mds-q h3 .tag').all_inner_texts()
    return note.replace('\n',' '),n,qs
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        page=await b.new_page()
        errs=[];page.on('pageerror',lambda e: errs.append(str(e)))
        for ch in ['vecteurs','equilibre','moments','vecteurs,equilibre,moments']:
            for k in range(3):
                note,n,qs=await run_one(page,ch)
                print(ch,'essai',k+1,':',note,'·',n,'cases ·',', '.join(qs))
        print('erreurs JS :',errs or 'aucune')
        await b.close()
asyncio.run(main())
