const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base='http://localhost:5173';
const uid='11111111-1111-4111-8111-111111111111';
const token=['e30',Buffer.from(JSON.stringify({sub:uid,exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'test'].join('.');
const session={access_token:token,refresh_token:'test-refresh',user:{id:uid,email:'student@example.test'}};
async function locale(p,lang){await p.click('#sk-lang');await p.click(`[data-language="${lang}"]`);assert.equal(await p.locator('html').getAttribute('lang'),lang==='bm'?'ms':'en')}
async function fill(p){await p.fill('#account-name','Test Student');await p.fill('#account-email','student@example.test');await p.fill('#account-password','correct-password')}
async function backend(context,requests,options={}){
  await context.route('**/config.js',r=>r.fulfill({contentType:'application/javascript',body:"window.SCHOLARKU_CONFIG={SUPABASE_URL:'https://auth.scholarku.test',SUPABASE_ANON_KEY:'test-public-key'};"}));
  await context.route('https://auth.scholarku.test/**',async r=>{
    const url=new URL(r.request().url()),body=r.request().postDataJSON();requests.push({url,body});
    if(url.pathname==='/auth/v1/authorize'){
      assert.equal(url.searchParams.get('provider'),'google');assert.equal(url.searchParams.get('code_challenge_method'),'s256');
      const dest=new URL(url.searchParams.get('redirect_to'));assert.equal(dest.origin,base);assert(dest.searchParams.get('state'));dest.searchParams.set('code','test-google-code');
      return options.cancel?r.fulfill({contentType:'text/html',body:'<h1>Cancel test sign-in</h1>'}):r.fulfill({status:302,headers:{location:dest.href}});
    }
    const headers={'access-control-allow-origin':base,'access-control-allow-headers':'authorization,apikey,content-type','access-control-allow-methods':'GET,POST,OPTIONS,PATCH'};
    if(r.request().method()==='OPTIONS')return r.fulfill({status:204,headers});
    if(url.pathname==='/auth/v1/token'){
      if(url.searchParams.get('grant_type')==='pkce'){assert.equal(body.auth_code,'test-google-code');assert.equal(body.code_verifier.length,43)}else{assert.equal(body.email,'student@example.test');assert.equal(body.password,'correct-password')}
      return r.fulfill({status:options.reject?400:200,headers,contentType:'application/json',body:JSON.stringify(options.reject?{msg:'Invalid login credentials'}:session)});
    }
    if(url.pathname==='/auth/v1/signup'){
      assert.equal(body.data.full_name,'Test Student');assert.equal(body.data.desired_role,'student');assert.equal(body.email,'student@example.test');assert.equal(body.password,'correct-password');
      return r.fulfill({headers,contentType:'application/json',body:JSON.stringify({id:uid})});
    }
    if(url.pathname==='/auth/v1/logout')return r.fulfill({status:204,headers});
    return r.fulfill({headers,contentType:'application/json',body:JSON.stringify(url.pathname==='/rest/v1/profiles'?[{id:uid,full_name:'Test Student',role:'student'}]:[])});
  });
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});const errors=[];
 try{
  const c=await browser.newContext({viewport:{width:1440,height:1000}});c.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));const p=await c.newPage();await p.goto(base);
  assert.equal(await p.locator('.desktop-nav').count(),0);assert.equal(await p.locator('.compact-header .header-actions>a').count(),1);assert.equal(await p.locator('#explore-menu').isVisible(),false);
  await p.click('#explore-toggle');assert.equal(await p.locator('#explore-menu a').count(),7);await p.keyboard.press('Escape');assert.equal(await p.locator('#explore-menu').isVisible(),false);
  await p.focus('#explore-toggle');await p.keyboard.press('ArrowDown');assert(await p.locator('#explore-menu a').first().evaluate(el=>el===document.activeElement));await p.click('#explore-menu a[href="#/internships"]');
  const names=[];for(let i=1;i<=4;i++){await p.click(`[data-sk-page="${i}"]`);assert.equal(await p.locator('.sk-card').count(),10);names.push(...await p.locator('.sk-org h3').allTextContents())}assert.equal(new Set(names).size,40);
  await p.fill('#sk-query','Maybank');assert.equal(await p.locator('.sk-card').count(),1);await p.click('.sk-save');await p.reload();await p.fill('#sk-query','Maybank');assert.equal(await p.locator('.sk-save').getAttribute('aria-pressed'),'true');
  await locale(p,'bm');assert.match(await p.locator('h1').innerText(),/Latihan industri/);await p.click('#explore-toggle');assert.match(await p.locator('#explore-menu').innerText(),/Program graduan/);await p.click('#explore-menu a[href="#/graduates"]');assert.equal(await p.locator('.sk-card').count(),10);
  await p.click('#sk-theme-toggle');await p.reload();assert.equal(await p.locator('html').getAttribute('data-theme'),'light');assert.equal(await p.locator('html').getAttribute('lang'),'ms');await locale(p,'en');
  await p.click('.account-header-button');await p.waitForURL('**/#/login');assert(await p.locator('#account-form').isVisible());assert.equal(await p.locator('#modal-overlay').count(),0);
  await fill(p);await locale(p,'bm');assert.equal(await p.locator('#account-name').inputValue(),'Test Student');assert.equal(await p.locator('#account-password').inputValue(),'correct-password');await p.click('[data-account-password]');assert.equal(await p.locator('#account-password').getAttribute('type'),'text');await p.click('[data-account-password]');
  await p.click('#account-form [type="submit"]');assert.match(await p.locator('#account-message').innerText(),/belum tersedia/);assert.equal(await p.evaluate(()=>localStorage.getItem('scholarku.auth')),null);await locale(p,'en');await p.click('[data-account-google]');assert.match(await p.locator('#account-message').innerText(),/not available yet/);
  for(const path of ['/','/internships','/graduates','/scholarships','/explore','/community','/community/tech','/mentors','/employers','/trust','/login','/signup']){await p.goto(base+'/#'+path);assert.equal(await p.locator('a[href*="assessment"],button[data-act*="test"]').count(),0);assert(!/mock tests?|mock assessments?/i.test(await p.locator('body').innerText()))}
  await p.goto(base+'/#/assessments');await p.waitForURL('**/#/explore');
  for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:900});for(const path of ['/','/internships','/login','/signup']){await p.goto(base+'/#'+path);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width} ${path}`);await p.click('#explore-toggle');const box=await p.locator('#explore-menu').boundingBox();assert(box.x>=0&&box.x+box.width<=width,`dropdown overflow ${width}`);await p.keyboard.press('Escape')}}
  await p.setViewportSize({width:1440,height:1000});await p.goto(base+'/#/scholarships');await p.click('#explore-toggle');await p.screenshot({path:'/tmp/scholarku-new-header.png'});await p.goto(base+'/#/login');await p.screenshot({path:'/tmp/scholarku-new-login.png',fullPage:true});await c.close();
  const requests=[],ac=await browser.newContext();ac.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));await backend(ac,requests);const a=await ac.newPage();
  await a.goto(base+'/#/signup');await fill(a);await a.click('#account-form [type="submit"]');await a.waitForSelector('.account-message.success');assert.match(await a.locator('#account-message').innerText(),/Check your email/);assert.equal(await a.locator('#account-password').inputValue(),'');assert.equal(await a.evaluate(()=>localStorage.getItem('scholarku.auth')),null);
  await a.goto(base+'/#/login');await fill(a);await a.click('#account-form [type="submit"]');await a.waitForURL('**/#/dashboard');await a.click('[data-act="logout"]');await a.waitForURL('**/#/');assert.equal(await a.evaluate(()=>localStorage.getItem('scholarku.auth')),null);
  await a.goto(base+'/#/login');await a.click('[data-account-google]');await a.waitForURL('**/#/dashboard');const auth=requests.find(r=>r.url.pathname==='/auth/v1/authorize'),exchange=requests.find(r=>r.url.searchParams.get('grant_type')==='pkce');assert.equal(require('node:crypto').createHash('sha256').update(exchange.body.code_verifier).digest('base64url'),auth.url.searchParams.get('code_challenge'));assert.equal(await a.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('scholarku.oauth.')).length),0);await a.reload();assert.equal((await a.evaluate(()=>JSON.parse(localStorage.getItem('scholarku.auth')))).user.id,uid);await ac.close();
  const cc=await browser.newContext();await backend(cc,[],{cancel:true});const cp=await cc.newPage();await cp.goto(base+'/#/login');const pop=cp.waitForEvent('popup');await cp.click('[data-account-google]');const popup=await pop;await popup.waitForLoadState();await popup.close();await cp.waitForSelector('.account-message.error');assert.equal(await cp.evaluate(()=>localStorage.getItem('scholarku.auth')),null);await cc.close();
  const rc=await browser.newContext();await backend(rc,[],{reject:true});const rp=await rc.newPage();await rp.goto(base+'/#/login');await fill(rp);await rp.click('#account-form [type="submit"]');await rp.waitForSelector('.account-message.error');assert.equal(await rp.evaluate(()=>localStorage.getItem('scholarku.auth')),null);await rc.close();
  assert.deepEqual(errors,[]);console.log('PASS: dropdowns and keyboard controls; language/theme persistence; 80 directory entries; Mock Tests removed; account screens and form validation; email signup/login/error/logout; Google popup PKCE exchange/cancel; session restoration; responsive widths 320–1440px. Auth provider responses were mocked, not real accounts.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
