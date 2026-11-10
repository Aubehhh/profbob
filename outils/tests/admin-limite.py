import asyncio,time,re,json
from playwright.async_api import async_playwright
hits=[];n429=[0]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
    c=await b.new_context(viewport={'width':1280,'height':900});pg=await c.new_page()
    async def handler(route):
      now=time.time();hits[:]=[t for t in hits if now-t<10];
      if len(hits)>=30:
        n429[0]+=1;await route.fulfill(status=429,headers={'Retry-After':'10','Access-Control-Allow-Origin':'*'},body='{"error":"rate"}');return
      hits.append(now);k=route.request.url.rsplit('/',1)[1]
      if k.startswith('p-matieres_l'):await route.fulfill(status=404,headers={'Access-Control-Allow-Origin':'*'},body='{"error":"Key not found"}');return
      v=7 if k.startswith('p-') else 3 if k.startswith('u-') else 11 if k.startswith('j-') else 5
      await route.fulfill(status=200,headers={'Access-Control-Allow-Origin':'*','Content-Type':'application/json'},body=json.dumps({'value':v}))
    await pg.route(re.compile(r'https://abacus\.jasoncameron\.dev/.*'),handler)
    await pg.add_init_script("sessionStorage.setItem('pb-admin','1')")
    t0=time.time();await pg.goto('http://127.0.0.1:8765/admin/')
    await pg.wait_for_function("document.getElementById('state').textContent.startsWith('Mis à jour')||document.getElementById('state').textContent.startsWith('Impossible')",timeout=180000)
    print('durée',round(time.time()-t0),'s ; 429 reçus',n429[0]);print(await pg.inner_text('#state'))
    print(await pg.inner_text('#kpis'))
    zeros=await pg.evaluate("[...document.querySelectorAll('#pages td.v')].filter(t=>t.textContent==='0').length")
    print('pages à 0 :',zeros)
    await pg.screenshot(path='/home/claude/tests/shots/admin.png',full_page=False)
    # second chargement : les jours passés viennent du cache
    hits.clear();t0=time.time();await pg.reload()
    await pg.wait_for_function("document.getElementById('state').textContent.startsWith('Mis à jour')",timeout=180000)
    print('2e chargement',round(time.time()-t0),'s')
    await b.close()
asyncio.run(main())
