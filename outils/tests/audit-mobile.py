import asyncio
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:8765'
PAGES=['/','/matieres/','/matieres/mecanique/','/cours/statique/vecteurs/','/cours/statique/equilibre/','/cours/statique/moments/','/ds/statique/','/mini-ds/?m=meca&ch=vecteurs','/flashcards/?m=meca&ch=moments','/recherche/?q=ressort','/notes/','/contact/','/admin/','/404.html','/mini-ds/','/cours/thermo/concepts/','/cours/thermo/premier-principe/','/cours/thermo/proprietes/','/cours/thermo/volume-controle/','/cours/thermo/second-principe/','/matieres/thermodynamique/','/mini-ds/?m=thermo&ds=thermo','/flashcards/?m=thermo&ch=volume-controle','/cours/chimie/atome/','/cours/chimie/classification/','/cours/chimie/molecules/','/cours/chimie/organique/','/cours/chimie/description/','/flashcards/?m=chimie&ch=description','/matieres/chimie/','/mini-ds/?m=chimie&ds=chimie','/flashcards/?m=chimie&ch=molecules','/cours/elec/bases/','/cours/elec/continu/','/cours/elec/theoremes/','/cours/elec/sinusoidal/','/cours/elec/triphase/','/flashcards/?m=elec&ch=triphase','/matieres/electricite/','/mini-ds/?m=elec&ds=elec','/flashcards/?m=elec&ch=sinusoidal','/cours/maths/complexes/','/cours/maths/derivation/','/cours/maths/integration/','/cours/maths/trigonometrie/','/matieres/mathematiques/','/mini-ds/?m=outils&ds=outils','/flashcards/?m=outils&ch=integration','/cours/web/bases/','/cours/web/structure/','/cours/web/css/','/cours/web/formulaires/','/matieres/pages-web/','/mini-ds/?m=web&ds=web','/flashcards/?m=web&ch=css','/cours/embarque/systemes/','/cours/embarque/arduino/','/cours/embarque/controle/','/cours/embarque/temps/','/matieres/informatique-embarquee/','/mini-ds/?m=embarque&ds=embarque','/flashcards/?m=embarque&ch=temps','/cours/crea/explorer/','/cours/crea/imaginer/','/cours/crea/innover/','/matieres/creativite-innovation/','/mini-ds/?m=crea&ds=crea','/flashcards/?m=crea&ch=innover']
VIEWS=[('1280 clair',1280,800,'light'),('390 clair',390,844,'light'),('390 sombre',390,844,'dark')]
JS='''()=>{const W=innerWidth,out=[];
 if(document.documentElement.scrollWidth>W+1)out.push('page '+document.documentElement.scrollWidth+'px');
 document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(!r.width)return;
  let p=e.parentElement,clip=false;while(p&&p!==document.body){const s=getComputedStyle(p);if(/(auto|scroll|hidden)/.test(s.overflowX)){clip=true;break}p=p.parentElement}
  if(!clip&&(r.right>W+1||r.left<-1)&&getComputedStyle(e).position!=='fixed')out.push(e.tagName.toLowerCase()+'.'+(e.className||'').toString().slice(0,30)+' '+Math.round(r.left)+'→'+Math.round(r.right))});
 return out.slice(0,6)}'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        bad=0
        for name,w,h,scheme in VIEWS:
            ctx=await b.new_context(viewport={'width':w,'height':h},color_scheme=scheme,device_scale_factor=2 if w<500 else 1)
            pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e: errs.append(str(e)))
            for u in PAGES:
                await pg.goto(BASE+u);await pg.wait_for_timeout(350)
                o=await pg.evaluate(JS)
                if o or errs: bad+=1;print('✗',name,u,o,errs);errs.clear()
            await ctx.close()
        print('pages x vues :',len(PAGES)*len(VIEWS),'· problèmes :',bad)
        await b.close()
asyncio.run(main())
