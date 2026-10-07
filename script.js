/* ===== Results: fill these in. Use a short value like "+38%", "2.4M" or "12,000". Empty = shown as "result to add". ===== */
var RESULTS={
  /* Real figures: GMC leads, Honda, Baraka, Noisette. The rest are rough estimates for now. */
  gmc:   [{v:'1,800+',l:'qualified leads'},{v:'+20%',l:'more showroom visits'},{v:'1.5M+',l:'people reached'}],
  subaru:[{v:'+15%',l:'lift in sales'},{v:'3x',l:'more engagement'},{v:'+50%',l:'online growth'}],
  alpha: [{v:'+20%',l:'lift in sales'},{v:'2x',l:'more engagement'},{v:'10K+',l:'new followers'}],
  bait:  [{v:'+45%',l:'more engagement'},{v:'500K+',l:'video views'},{v:'800K+',l:'people reached'}],
  honda: [{v:'25,000+',l:'leads in 12 months'},{v:'<15 KWD',l:'average cost per lead'}],
  baraka:[{v:'40,000+',l:'KWD in Ramadan sales'},{v:'+20%',l:'sales growth, year on year'}],
  alessa:[{v:'5K+',l:'new followers'},{v:'2.5x',l:'more engagement'}],
  noisette:[{v:'+350',l:'new followers in two weeks'},{v:'12x',l:'more likes per post'}]
};
(function(){
  var stage=document.getElementById('stage'), vp=document.getElementById('vp');
  var slides=[].slice.call(stage.querySelectorAll('.slide')), cur=0, rotated=false;
  var IMG={brand:'assets/svc_brand_s.webp',social:'assets/svc_social_s.webp',digital:'assets/svc_digital.webp',media:'assets/svc_media.webp',infl:'assets/svc_influencers.webp',film:'assets/svc_film_s.webp',events:'assets/svc_events_s.webp',mall:'assets/svc_mall.webp',podcast:'assets/svc_podcast.webp',ai:'assets/svc_ai_s.webp',about:'assets/svc_about_s.webp'};

  /* --- fit the 1280x720 stage; turn it sideways on portrait phones --- */
  var coarse=window.matchMedia&&window.matchMedia('(pointer:coarse)').matches, turnEl=document.getElementById('turn'), turnShown=false;
  function fit(){
    var w=window.innerWidth,h=window.innerHeight;
    rotated=coarse&&h>w*1.1;
    var s=rotated?Math.min(h/1280,w/720):Math.min(w/1280,h/720);
    stage.style.setProperty('--s',s); stage.classList.toggle('rot',rotated);
    if(rotated&&!turnShown){turnShown=true;turnEl.classList.add('on');setTimeout(function(){turnEl.classList.remove('on')},3200);}
  }
  turnEl.addEventListener('click',function(){turnEl.classList.remove('on')});
  window.addEventListener('resize',fit); fit();

  /* --- dots + menu --- */
  var dotsEl=document.getElementById('dots'), list=document.getElementById('menuList'), menu=document.getElementById('menu'), menuBtn=document.getElementById('menuBtn');
  var prevB=document.getElementById('prev'), nextB=document.getElementById('next'), mItems=[];
  slides.forEach(function(s,i){
    var d=document.createElement('button'); d.setAttribute('aria-label',(i+1)+': '+s.dataset.name); d.onclick=function(){go(i)}; dotsEl.appendChild(d);
    var li=document.createElement('li'), b=document.createElement('button'); b.innerHTML='<span>'+(i+1)+'</span>'+s.dataset.name; b.onclick=function(){go(i);closeMenu()}; li.appendChild(b); list.appendChild(li); mItems.push(b);
  });
  function closeMenu(){menu.classList.remove('on');menuBtn.setAttribute('aria-expanded','false')}
  menuBtn.onclick=function(e){e.stopPropagation();var on=menu.classList.toggle('on');menuBtn.setAttribute('aria-expanded',on)};
  stage.addEventListener('click',function(e){if(menu.classList.contains('on')&&!menu.contains(e.target)&&!menuBtn.contains(e.target))closeMenu()});

  var forMode=false;
  function sync(){
    [].forEach.call(dotsEl.children,function(d,i){d.setAttribute('aria-current',i===cur)});
    mItems.forEach(function(b,i){b.setAttribute('aria-current',i===cur)});
    prevB.disabled=cur===0; nextB.disabled=cur===slides.length-1;
    slides.forEach(function(s,i){s.setAttribute('aria-hidden',i!==cur); if('inert' in s) s.inert=i!==cur;});
    if(!forMode){try{history.replaceState(null,'','#'+(cur+1))}catch(e){}}
  }
  function go(n){
    n=Math.max(0,Math.min(slides.length-1,n)); if(n===cur) return;
    stage.dataset.dir=n>cur?'fwd':'back';
    var old=slides[cur]; old.classList.remove('is-active'); old.classList.add('is-out'); setTimeout(function(){old.classList.remove('is-out')},850);
    slides[n].classList.add('is-active'); cur=n; sync(); onEnter(slides[n]);
  }
  prevB.onclick=function(){go(cur-1)}; nextB.onclick=function(){go(cur+1)};
  function slideIdx(id){for(var i=0;i<slides.length;i++)if(slides[i].dataset.id===id)return i;return -1}
  function goTo(v){var p=String(v).split(':'),n=/^\d+$/.test(p[0])?+p[0]:slideIdx(p[0]);if(n<0)return;closeModal();go(n);if(p[1])setTimeout(function(){openItem(p[1],0)},650)}
  stage.addEventListener('click',function(e){var a=e.target.closest('[data-go]'); if(a){e.preventDefault();e.stopPropagation();goTo(a.dataset.go)}});

  /* keyboard */
  document.addEventListener('keydown',function(e){
    if(openModal){if(e.key==='Escape')closeModal();else if(openModal===lb&&e.key==='ArrowRight')lbStep(1);else if(openModal===lb&&e.key==='ArrowLeft')lbStep(-1);return}
    if(e.key==='Escape'){closeMenu();return}
    if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();go(cur+1)}
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(cur-1)}
    else if(e.key==='Home'){go(0)} else if(e.key==='End'){go(slides.length-1)}
  });
  /* swipe (works when the stage is turned sideways too) */
  var sx,sy,st,down=false;
  vp.addEventListener('pointerdown',function(e){down=true;sx=e.clientX;sy=e.clientY;st=Date.now()});
  vp.addEventListener('pointerup',function(e){
    if(!down) return; down=false;
    var dx=e.clientX-sx, dy=e.clientY-sy; if(rotated){var t=dx;dx=dy;dy=-t;}
    var sw=Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3&&Date.now()-st<900;
    if(openModal){if(sw&&openModal===lb)lbStep(dx<0?1:-1);return}
    if(sw) go(cur+(dx<0?1:-1));
  });
  vp.addEventListener('pointercancel',function(){down=false});

  /* fullscreen */
  var fsB=document.getElementById('fs');
  if(!(document.fullscreenEnabled||document.webkitFullscreenEnabled)) fsB.hidden=true;
  fsB.onclick=function(){try{if(document.fullscreenElement||document.webkitFullscreenElement){(document.exitFullscreen||document.webkitExitFullscreen).call(document)}else{var el=document.documentElement,r=(el.requestFullscreen||el.webkitRequestFullscreen).call(el);if(r&&r.catch)r.catch(function(){})}}catch(e){}};

  /* modal */
  var openModal=null;
  stage.querySelectorAll('[data-open]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var m=document.getElementById(b.dataset.open);m.classList.add('on');openModal=m;m.querySelector('[data-close]').focus()}});
  function closeModal(){if(openModal){if(openModal===lb)clearInterval(lbTimer);openModal.classList.remove('on');openModal=null}}
  stage.querySelectorAll('[data-close]').forEach(function(b){b.onclick=closeModal});

  /* counters */
  function countUp(el){
    var to=parseFloat(el.dataset.count), pre=el.dataset.prefix||'', suf=el.dataset.suffix||'', dec=(el.dataset.count.split('.')[1]||'').length, t0=null, dur=1400;
    function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3),v=to*e;el.textContent=pre+(dec?v.toFixed(dec):Math.round(v).toLocaleString('en-US'))+suf;if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);
  }

  /* results tiles */
  function renderResults(box,key){
    var R=RESULTS[key]||[]; box.innerHTML='';
    R.forEach(function(r){
      var d=document.createElement('div'); var m=String(r.v||'').match(/^([^\d]*)([\d][\d,]*\.?\d*)(.*)$/);
      if(r.v&&m){d.className='res';var b=document.createElement('b');b.dataset.prefix=m[1];b.dataset.count=m[2].replace(/,/g,'');b.dataset.suffix=m[3];b.textContent=r.v;d.appendChild(b);}
      else if(r.v){d.className='res';d.innerHTML='<b></b>';d.firstChild.textContent=r.v;}
      else{d.className='res pending';d.innerHTML='<em>Result to add</em><b>—</b>';}
      var s=document.createElement('span');s.textContent=r.l;d.appendChild(s);box.appendChild(d);
    });
  }
  stage.querySelectorAll('[data-proj]').forEach(function(p){renderResults(p.querySelector('.results'),p.dataset.proj)});

  /* galleries */
  var galTimer=null;
  stage.querySelectorAll('.media').forEach(function(m){
    var ph=[].slice.call(m.querySelectorAll('.ph')), th=m.querySelector('.thumbs'); if(!th||ph.length<2) return;
    m._show=function(i){ph.forEach(function(p,j){p.classList.toggle('on',j===i)});[].forEach.call(th.children,function(b,j){b.setAttribute('aria-current',j===i)});m._i=i};
    ph.forEach(function(p,i){var b=document.createElement('button');b.setAttribute('aria-label','Image '+(i+1));b.innerHTML='<img alt="" src="'+p.src+'">';b.onclick=function(e){e.stopPropagation();m._show(i);clearInterval(galTimer)};th.appendChild(b)});
    m._show(0);
  });

  function onEnter(s){
    s.querySelectorAll('[data-count]').forEach(countUp);
    clearInterval(galTimer); clearInterval(qTimer);
    var m=s.querySelector('.media .thumbs'); if(m){var md=m.parentNode,n=md.querySelectorAll('.ph').length;galTimer=setInterval(function(){md._show((md._i+1)%n)},3800)}
    if(s.classList.contains('s-clients')) qTimer=setInterval(function(){showQ((qi+1)%qs.length)},6500);
    if(s.classList.contains('s-think')) playThink(); else stopAuto();
    if(s.classList.contains('s-story')) playStory(); else stopStory();
    if(s.classList.contains('s-work')) wallEnter(); else popStop();
    if(s.classList.contains('s-num')) playNum(); else stopNum();
    if(s.classList.contains('s-clients-grid')) showSector('all');
  }

  /* goals */
  var GOALS=[
    {t:'More people should know us',k:'Awareness',c:'var(--cyan)',s:[['social','Social media','Daily content that keeps you in people’s feeds.'],['media','Media buying','Your ads on the right screens, billboards and sites.'],['infl','Influencers','Trusted voices who introduce you to their followers.']],go:'gmc',p:'GMC Behbehani'},
    {t:'I want more sales',k:'Sales',c:'var(--orange)',s:[['digital','Digital ads','Online ads aimed at people who are ready to buy.'],['social','Social media','Content that turns followers into customers.'],['mall','Mall activations','Experiences that bring shoppers straight to you.']],go:'subaru',p:'Subaru'},
    {t:'I’m launching something new',k:'Launch',c:'var(--pink)',s:[['events','Events & launches','A launch moment people talk about.'],['film','Film & photo','Launch videos and photos, made in-house.'],['social','Social coverage','Live coverage, so everyone sees it.']],go:'work:honda',p:'the Honda Type R launch'},
    {t:'My brand needs a fresh look',k:'Brand',c:'var(--sky)',s:[['brand','Brand creation','A name, logo, look and voice that fit you.'],['film','Film & photo','New photos and videos in your new style.'],['social','Social media','Rolling the new look out everywhere.']],go:'bait',p:'Bait Al Sabon'},
    {t:'I need great content, every month',k:'Content',c:'var(--orange)',s:[['social','Social media','A monthly plan, made and posted for you.'],['film','Film & photo','Regular shoots by our in-house team.'],['ai','AI content','More content, faster, at a lower cost.']],go:'alpha',p:'Alpha Store'},
    {t:'I want to use AI',k:'AI',c:'var(--pink)',s:[['ai','AI + real shoots','Films that mix real footage with AI-built worlds.'],['digital','AI tools','Smart assistants and automations for your team.'],['about','AI training','Workshops that get your team using AI with confidence.']],go:'ai',p:'our AI work'}
  ];
  var gBox=document.getElementById('goals'), ans=document.getElementById('ansBody'), gBtns=[];
  function esc(x){return x.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function fillGoal(i){var g=GOALS[i];ans.innerHTML='<h3>'+esc(g.t)+'.</h3>'+g.s.map(function(r){return '<div class="svc-row"><img alt="" src="'+IMG[r[0]]+'"><div><b>'+esc(r[1])+'</b><span>'+esc(r[2])+'</span></div></div>'}).join('')+'<button class="link" data-go="'+g.go+'">See '+esc(g.p)+' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button>'}
  var gi=0;
  function pickGoal(i){gBtns.forEach(function(b,j){b.setAttribute('aria-pressed',j===i)});if(i===gi&&ans.innerHTML){return}gi=i;ans.classList.add('fade');setTimeout(function(){fillGoal(i);ans.classList.remove('fade')},200)}
  GOALS.forEach(function(g,i){var b=document.createElement('button');b.className='goal';b.style.setProperty('--c',g.c);b.innerHTML='<b>'+esc(g.t)+'</b><span>'+g.k+'</span>';b.onclick=function(){pickGoal(i)};gBox.appendChild(b);gBtns.push(b)});
  fillGoal(0); gBtns[0].setAttribute('aria-pressed','true');


  /* how we work: five steps */
  var ICON={
    listen:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
    research:'<circle cx="11" cy="11" r="6"/><path d="M16 16l4.5 4.5"/>',
    idea:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    make:'<rect x="3" y="7" width="13" height="10" rx="2"/><path d="M16 11l5-3v8l-5-3"/>',
    grow:'<path d="M4 19h16"/><path d="M6 15l4-4 3 3 6-6"/><path d="M15 8h4v4"/>'
  };
  var STEPS=[
    ['listen','We listen','Your business, your customers, your goal.','Before any idea, we sit with you and learn what you sell, who buys it and what’s in the way.','A one-page brief we agree on together.'],
    ['research','We research','What’s really going on in your market.','We study your customers and competitors in Kuwait to find the one insight worth building on.','One clear insight, in one sentence.'],
    ['idea','We find the idea','One big idea that works everywhere.','An idea simple enough to explain in one line, and strong enough for a reel, a billboard and an event.','Ideas you can see, with AI previews, before you approve.'],
    ['make','We make it','Everything made in-house.','Our own team writes, designs, films and books the media, so the quality stays in one place.','Content and campaigns, delivered on time.'],
    ['grow','We measure and improve','Do more of what works.','We track the numbers, explain them in plain words, and put more behind what’s working.','Clear reports and a plan for what comes next.']
  ];
  var stepsEl=document.getElementById('steps'), stepFill=document.getElementById('stepFill'), autoT=null, step=-1;
  var sBtns=STEPS.map(function(s,i){
    var b=document.createElement('button'); b.className='step'; b.setAttribute('aria-label','Step '+(i+1)+': '+s[1]);
    b.innerHTML='<span class="bgic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICON[s[0]]+'</svg></span><span class="step-top"><span class="n">0'+(i+1)+'</span><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICON[s[0]]+'</svg></span></span><h3>'+esc(s[1])+'</h3><p class="short">'+esc(s[2])+'</p><span class="more"><p>'+esc(s[3])+'</p><span class="get"><span>You get</span><b>'+esc(s[4])+'</b></span></span>';
    b.onclick=function(){stopAuto();setStep(i)}; stepsEl.appendChild(b); return b});
  function setStep(i){step=i;sBtns.forEach(function(b,j){b.classList.toggle('on',j===i);b.setAttribute('aria-expanded',j===i)});stepFill.style.width=((i+1)/STEPS.length*100)+'%'}
  function stopAuto(){clearInterval(autoT);autoT=null}
  function playThink(){stopAuto();setStep(0);var i=0;autoT=setInterval(function(){i++;if(i>=STEPS.length){stopAuto();return}setStep(i)},3600)}
  document.getElementById('replay').onclick=function(){playThink()};
  setStep(0);

  /* our story */
  var ST=[
    {y:2004,big:'2004',ey:'2004',h:'It starts as Media City.',b:'A small agency in Kuwait with one rule: do the work properly and protect the name.',l:'2004'},
    {y:2006.4,big:'Growth',ey:'The growth years',h:'Media City becomes MCG.',b:'A full-service agency across Kuwait and Beirut, trusted by the country’s leading brands.',l:'Growth'},
    {y:2020,big:'4 storms',ey:'2008 – 2020',h:'Four storms. Profitable through every one.',b:'The 2008 financial crisis, the 2014 oil price collapse, Lebanon’s 2019 crisis and the 2020 pandemic. We never traded quality or reputation for a quick win.',l:'Storms'},
    {y:2026,big:'Today',ey:'2026',h:'An AI-first agency.',b:'40+ people rebuilding how creative work gets made: AI content, our own tools and automations, and The AI Club by MCG.',l:'Today'},
    {y:0,big:'Next',ey:'Our vision',h:'The region’s reference for AI-powered creativity.',b:'Ideas that move people, made faster and smarter, for brands that want to lead.',l:'Next'}
  ];
  var X=function(y){return 24+(y-2004)*(980/22)}, BASEY=172;
  var PTS=[[2004,152],[2006,138],[2008,118],[2009,126],[2011,108],[2014,90],[2015,98],[2017,80],[2019,66],[2020,72],[2022,54],[2024,42],[2026,30]].map(function(p){return [X(p[0]),p[1]]});
  function smooth(P){var d='M'+P[0][0]+' '+P[0][1];for(var i=0;i<P.length-1;i++){var p0=P[i-1]||P[i],p1=P[i],p2=P[i+1],p3=P[i+2]||p2;d+='C'+(p1[0]+(p2[0]-p0[0])/6).toFixed(1)+' '+(p1[1]+(p2[1]-p0[1])/6).toFixed(1)+' '+(p2[0]-(p3[0]-p1[0])/6).toFixed(1)+' '+(p2[1]-(p3[1]-p1[1])/6).toFixed(1)+' '+p2[0].toFixed(1)+' '+p2[1]}return d}
  var stD=smooth(PTS), stBase=document.getElementById('stBase'), stLit=document.getElementById('stLit'), stRunner=document.getElementById('stRunner'), stChart=document.querySelector('.st-chart'), stDet=document.querySelector('.st-detail');
  stBase.setAttribute('d',stD); stLit.setAttribute('d',stD);
  document.getElementById('stArea').setAttribute('d',stD+'L'+X(2026)+' '+BASEY+'L'+X(2004)+' '+BASEY+'Z');
  var NX=[1140,14]; document.getElementById('stNext').setAttribute('d','M'+X(2026)+' 30C'+(X(2026)+50)+' 24 '+(NX[0]-50)+' 18 '+NX[0]+' '+NX[1]);
  var svgNS='http://www.w3.org/2000/svg', ticks=document.getElementById('stTicks'), storms=document.getElementById('stStorms');
  function el(n,a,p){var e=document.createElementNS(svgNS,n);for(var k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e}
  el('line',{x1:X(2004),x2:X(2026),y1:BASEY,y2:BASEY,stroke:'rgba(246,248,251,.16)'},ticks);
  [2004,2008,2014,2019,2020,2026].forEach(function(y){var g=el('g',{'class':'st-tick'},ticks);el('line',{x1:X(y),x2:X(y),y1:BASEY,y2:BASEY+5},g);var t=el('text',{x:X(y),y:BASEY+19,'text-anchor':'middle'},g);t.textContent=y});
  var stL=stBase.getTotalLength();
  function lenAtX(x){var lo=0,hi=stL;for(var k=0;k<30;k++){var m=(lo+hi)/2;if(stBase.getPointAtLength(m).x<x)lo=m;else hi=m}return (lo+hi)/2}
  [2008,2014,2019,2020].forEach(function(y){var p=stBase.getPointAtLength(lenAtX(X(y)));var g=el('g',{'class':'st-storm'},storms);el('line',{x1:p.x,x2:p.x,y1:p.y+6,y2:BASEY},g);el('circle',{cx:p.x,cy:p.y,r:5},g)});
  stLit.style.strokeDasharray=stL; stLit.style.strokeDashoffset=stL;
  var stStops=document.getElementById('stStops'), stLen=ST.map(function(s){return s.y?lenAtX(X(s.y)):stL});
  var stBtns=ST.map(function(s,i){var p=s.y?stBase.getPointAtLength(stLen[i]):{x:NX[0],y:NX[1]};var b=document.createElement('button');b.className='st-stop'+(s.y?'':' nx');b.style.left=(p.x/1168*100)+'%';b.style.top=(p.y/190*100)+'%';b.innerHTML='<span class="dot"></span><span class="lbl">'+s.l+'</span>';b.setAttribute('aria-label',s.ey+': '+s.h);b.onclick=function(){stopStory();setSt(i)};stStops.appendChild(b);return b});
  var stI=-1, stRun=0, stRaf=null, stT=null;
  function runTo(to){cancelAnimationFrame(stRaf);var from=stRun,t0=null,dur=1200;function f(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/dur),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;stRun=from+(to-from)*e;var p=stBase.getPointAtLength(stRun);stRunner.setAttribute('cx',p.x);stRunner.setAttribute('cy',p.y);if(k<1)stRaf=requestAnimationFrame(f)}stRaf=requestAnimationFrame(f)}
  function setSt(i){
    var first=stI<0; stI=i; var s=ST[i];
    stBtns.forEach(function(b,j){b.classList.toggle('on',j===i);b.classList.toggle('done',j<i)});
    stLit.style.strokeDashoffset=stL-stLen[i]; runTo(stLen[i]);
    stChart.classList.toggle('storms',i===2); stChart.classList.toggle('full',i>=3); stChart.classList.toggle('next',i===4);
    stDet.classList.add('fade');
    setTimeout(function(){document.getElementById('stBig').textContent=s.big;document.getElementById('stEy').textContent=s.ey;document.getElementById('stHead').textContent=s.h;document.getElementById('stBody').textContent=s.b;stDet.classList.remove('fade')},first?0:220);
  }
  function stopStory(){clearInterval(stT);stT=null}
  function playStory(){stopStory();stLit.style.transition='none';stLit.style.strokeDashoffset=stL;stRun=0;stLit.getBoundingClientRect();stLit.style.transition='';setSt(0);var i=0;stT=setInterval(function(){i++;if(i>=ST.length){stopStory();return}setSt(i)},4200)}
  document.getElementById('stReplay').onclick=function(){playStory()};
  setSt(0);

  /* who we work with */
  var CL=[
 {
  "n": "Honda",
  "s": "A",
  "u": "assets/logos/c00.webp"
 },
 {
  "n": "Honda Marine",
  "s": "A",
  "u": "assets/logos/c01.webp"
 },
 {
  "n": "Honda Alghanim",
  "s": "A",
  "u": "assets/logos/c02.webp"
 },
 {
  "n": "Honda Alghanim Motorcycles",
  "s": "A",
  "u": "assets/logos/c03.webp"
 },
 {
  "n": "Lotus Alghanim",
  "s": "A",
  "u": "assets/logos/c04.webp"
 },
 {
  "n": "GMC",
  "s": "A",
  "u": "assets/logos/c10.webp"
 },
 {
  "n": "Subaru",
  "s": "A",
  "u": "assets/logos/c11.webp"
 },
 {
  "n": "Caltex",
  "s": "A",
  "u": "assets/logos/c12.webp"
 },
 {
  "n": "Livan",
  "s": "A",
  "u": "assets/logos/c13.webp"
 },
 {
  "n": "Geely",
  "s": "A",
  "u": "assets/logos/c14.webp"
 },
 {
  "n": "BYD Alghanim",
  "s": "A",
  "u": "assets/logos/c15.webp"
 },
 {
  "n": "Mitsubishi",
  "s": "A",
  "u": "assets/logos/c21.webp"
 },
 {
  "n": "GWM",
  "s": "A",
  "u": "assets/logos/c22.webp"
 },
 {
  "n": "Pirelli",
  "s": "A",
  "u": "assets/logos/c28.webp"
 },
 {
  "n": "CFMOTO",
  "s": "A",
  "u": "assets/logos/c29.webp"
 },
 {
  "n": "Automall",
  "s": "A",
  "u": "assets/logos/c30.webp"
 },
 {
  "n": "Ali Alghanim & Sons Automotive",
  "s": "A",
  "u": "assets/logos/c31.webp"
 },
 {
  "n": "ACDelco",
  "s": "A",
  "u": "assets/logos/c32.webp"
 },
 {
  "n": "VGV",
  "s": "A",
  "u": "assets/logos/c34.webp"
 },
 {
  "n": "Isuzu",
  "s": "A",
  "u": "assets/logos/c35.webp"
 },
 {
  "n": "Zayani",
  "s": "A",
  "u": "assets/logos/c36.webp"
 },
 {
  "n": "Kuwait Motor Town",
  "s": "A",
  "u": "assets/logos/c37.webp"
 },
 {
  "n": "motorgy",
  "s": "A",
  "u": "assets/logos/c51.webp"
 },
 {
  "n": "Mercedes-Benz",
  "s": "A",
  "u": "assets/logos/c80.webp"
 },
 {
  "n": "Haval",
  "s": "A",
  "u": "assets/logos/c81.webp"
 },
 {
  "n": "Soueast",
  "s": "A",
  "u": "assets/logos/c84.webp"
 },
 {
  "n": "Riddara",
  "s": "A",
  "u": "assets/logos/c85.webp"
 },
 {
  "n": "Enaya Insurance",
  "s": "F",
  "u": "assets/logos/c05.webp"
 },
 {
  "n": "International Financial Advisors",
  "s": "F",
  "u": "assets/logos/c06.webp"
 },
 {
  "n": "Kuwait Investment Company",
  "s": "F",
  "u": "assets/logos/c07.webp"
 },
 {
  "n": "Al-Deera Holding",
  "s": "F",
  "u": "assets/logos/c08.webp"
 },
 {
  "n": "Union of Investment Companies",
  "s": "F",
  "u": "assets/logos/c19.webp"
 },
 {
  "n": "Beyout Investment Group",
  "s": "F",
  "u": "assets/logos/c23.webp"
 },
 {
  "n": "KFH Capital",
  "s": "F",
  "u": "assets/logos/c24.webp"
 },
 {
  "n": "KFH Trade",
  "s": "F",
  "u": "assets/logos/c25.webp"
 },
 {
  "n": "KFH Brokerage",
  "s": "F",
  "u": "assets/logos/c26.webp"
 },
 {
  "n": "KFH",
  "s": "F",
  "u": "assets/logos/c27.webp"
 },
 {
  "n": "Gulf Insurance Group",
  "s": "F",
  "u": "assets/logos/c39.webp"
 },
 {
  "n": "Commercial Facilities",
  "s": "F",
  "u": "assets/logos/c49.webp"
 },
 {
  "n": "Al Muzaini Exchange",
  "s": "F",
  "u": "assets/logos/c55.webp"
 },
 {
  "n": "Kuwait Credit Bank",
  "s": "F",
  "u": "assets/logos/c58.webp"
 },
 {
  "n": "Real Estate House",
  "s": "R",
  "u": "assets/logos/c09.webp"
 },
 {
  "n": "Wafra Real Estate",
  "s": "R",
  "u": "assets/logos/c20.webp"
 },
 {
  "n": "Kuwait International Fair",
  "s": "R",
  "u": "assets/logos/c38.webp"
 },
 {
  "n": "Al Tasheelat Real Estate",
  "s": "R",
  "u": "assets/logos/c42.webp"
 },
 {
  "n": "Souq Al Mubarakiya",
  "s": "R",
  "u": "assets/logos/c43.webp"
 },
 {
  "n": "Al Bustan",
  "s": "R",
  "u": "assets/logos/c45.webp"
 },
 {
  "n": "Souq Sharq",
  "s": "R",
  "u": "assets/logos/c52.webp"
 },
 {
  "n": "IFA Hotels & Resorts",
  "s": "H",
  "u": "assets/logos/c16.webp"
 },
 {
  "n": "Venue 56",
  "s": "H",
  "u": "assets/logos/c54.webp"
 },
 {
  "n": "Kuwait Airways",
  "s": "H",
  "u": "assets/logos/c59.webp"
 },
 {
  "n": "Lina's & Dina's",
  "s": "H",
  "u": "assets/logos/c62.webp"
 },
 {
  "n": "Holiday Inn",
  "s": "H",
  "u": "assets/logos/c65.webp"
 },
 {
  "n": "Mashawi",
  "s": "H",
  "u": "assets/logos/c71.webp"
 },
 {
  "n": "Baraka Dates",
  "s": "H",
  "u": "assets/logos/c72.webp"
 },
 {
  "n": "MADO",
  "s": "H",
  "u": "assets/logos/c73.webp"
 },
 {
  "n": "MADO Dondurma",
  "s": "H",
  "u": "assets/logos/c74.webp"
 },
 {
  "n": "Sheesh Othman",
  "s": "H",
  "u": "assets/logos/c82.webp"
 },
 {
  "n": "NOON",
  "s": "H",
  "u": "assets/logos/c83.webp"
 },
 {
  "n": "Crowne Plaza",
  "s": "H",
  "u": "assets/logos/c86.webp"
 },
 {
  "n": "Microsoft",
  "s": "T",
  "u": "assets/logos/c17.webp"
 },
 {
  "n": "Huawei",
  "s": "T",
  "u": "assets/logos/c18.webp"
 },
 {
  "n": "Behbehani",
  "s": "T",
  "u": "assets/logos/c40.webp"
 },
 {
  "n": "Dakheel Aljassar",
  "s": "T",
  "u": "assets/logos/c41.webp"
 },
 {
  "n": "atlasblue",
  "s": "T",
  "u": "assets/logos/c44.webp"
 },
 {
  "n": "Adel Behbehani General Trading",
  "s": "T",
  "u": "assets/logos/c46.webp"
 },
 {
  "n": "Behbehani Watch World",
  "s": "T",
  "u": "assets/logos/c47.webp"
 },
 {
  "n": "Behbehani Prestige",
  "s": "T",
  "u": "assets/logos/c48.webp"
 },
 {
  "n": "Images",
  "s": "T",
  "u": "assets/logos/c50.webp"
 },
 {
  "n": "Gulf Palms",
  "s": "T",
  "u": "assets/logos/c53.webp"
 },
 {
  "n": "Kefan Optics",
  "s": "T",
  "u": "assets/logos/c60.webp"
 },
 {
  "n": "Alpha Store",
  "s": "T",
  "u": "assets/logos/c61.webp"
 },
 {
  "n": "Astro Group",
  "s": "T",
  "u": "assets/logos/c63.webp"
 },
 {
  "n": "Astro Power Cables",
  "s": "T",
  "u": "assets/logos/c64.webp"
 },
 {
  "n": "Johnson & Johnson",
  "s": "T",
  "u": "assets/logos/c75.webp"
 },
 {
  "n": "CityStar",
  "s": "T",
  "u": "assets/logos/c76.webp"
 },
 {
  "n": "Superdry",
  "s": "T",
  "u": "assets/logos/c77.webp"
 },
 {
  "n": "House of Soap",
  "s": "T",
  "u": "assets/logos/c78.webp"
 },
 {
  "n": "The Face Shop",
  "s": "T",
  "u": "assets/logos/c79.webp"
 },
 {
  "n": "Salem Al-Ali Informatics Award",
  "s": "P",
  "u": "assets/logos/c33.webp"
 },
 {
  "n": "Capital Markets Authority",
  "s": "P",
  "u": "assets/logos/c56.webp"
 },
 {
  "n": "Kuwait Financial Intelligence Unit",
  "s": "P",
  "u": "assets/logos/c57.webp"
 },
 {
  "n": "Children's Cancer Center Lebanon",
  "s": "P",
  "u": "assets/logos/c66.webp"
 },
 {
  "n": "Kuwait English School",
  "s": "P",
  "u": "assets/logos/c67.webp"
 },
 {
  "n": "MKASC",
  "s": "P",
  "u": "assets/logos/c68.webp"
 },
 {
  "n": "Box Hill College Kuwait",
  "s": "P",
  "u": "assets/logos/c69.webp"
 },
 {
  "n": "Kuwait Society for Persons with Disability",
  "s": "P",
  "u": "assets/logos/c70.webp"
 }
];
  var SEC=[['all','All'],['A','Automotive'],['F','Banking & finance'],['R','Real estate & venues'],['H','Food & hospitality'],['T','Retail & tech'],['P','Public sector & education']];
  var secEl=document.getElementById('sectors'), wall=document.getElementById('logowall'), secBtns=[];
  function layoutWall(n){var W=1168,H=wall.clientHeight||380,g=8,best=null;for(var c=3;c<=16;c++){var w=(W-(c-1)*g)/c,r=Math.ceil(n/c),h=(H-(r-1)*g)/r;if(h<34)continue;var tw=Math.min(w,h*1.55,196),th=Math.min(h,tw/1.55);var sc=tw*th;if(!best||sc>best.s)best={c:c,w:tw,h:th,s:sc}}return best}
  function showSector(k){
    secBtns.forEach(function(b){b.setAttribute('aria-selected',b.dataset.k===k)});
    var list=CL.filter(function(x){return k==='all'||x.s===k}), L2=layoutWall(list.length);
    wall.style.gridTemplateColumns='repeat('+L2.c+','+Math.floor(L2.w)+'px)'; wall.style.gridAutoRows=Math.floor(L2.h)+'px';
    wall.innerHTML=list.map(function(x,i){return '<div class="lt" style="--i:'+Math.min(i,60)+'"><img alt="'+esc(x.n)+'" title="'+esc(x.n)+'" src="'+x.u+'"></div>'}).join('');
  }
  SEC.forEach(function(s){var n=s[0]==='all'?CL.length:CL.filter(function(x){return x.s===s[0]}).length;var b=document.createElement('button');b.setAttribute('role','tab');b.dataset.k=s[0];b.innerHTML=esc(s[1])+' <em>'+n+'</em>';b.onclick=function(){showSector(s[0])};secEl.appendChild(b);secBtns.push(b)});

  /* services cards */
  var SV=[
    ['brand','Brand creation','#123A69','Your name, logo, colours and voice, built so people recognise you instantly.','New businesses, rebrands'],
    ['social','Social media','#125D99','We plan, make and post your content, and talk to your followers every day.','Staying visible'],
    ['digital','Digital marketing','#144074','Online ads that find the right people and bring them to buy.','Sales and leads'],
    ['media','Media buying','#1B4E86','The best screens, billboards and sites for your ads, at the best price.','Big campaigns'],
    ['infl','Influencers','#0F3563','We find the right creators, brief them and manage everything.','Trust and buzz'],
    ['film','Film & photo','#0F3563','Ads, videos and photos, made by our in-house production team.','Anything people watch'],
    ['events','Events & launches','#1B4E86','Launches and events people talk about, from the idea to the last guest.','New products, openings'],
    ['mall','Mall activations','#144074','Displays and experiences in malls that stop shoppers in their tracks.','Footfall'],
    ['podcast','Podcasts','#125D99','We produce and manage your podcast so your expertise gets heard.','Thought leadership'],
    ['ai','AI content & tools','#123A69','AI films, visuals and smart tools that save time and money.','More content, faster']
  ];
  var cards=document.getElementById('cards');
  SV.forEach(function(v){var b=document.createElement('button');b.className='card';b.setAttribute('aria-label',v[1]+': '+v[3]);
    b.innerHTML='<span class="card-in"><span class="face front" style="--c:'+v[2]+'"><i>+</i><img alt="" src="'+IMG[v[0]]+'"><b>'+esc(v[1])+'</b></span><span class="face back"><b>'+esc(v[1])+'</b><p>'+esc(v[3])+'</p><em>Good for: '+esc(v[4])+'</em></span></span>';
    b.onclick=function(){b.classList.toggle('flipped')}; cards.appendChild(b)});

  /* AI formats */
  var F=[
    ['Time Shift','A presenter, on location, today.','The past, rebuilt around them as they talk.','Heritage brands, anniversaries, national days.'],
    ['Impossible Location','The product and the talent, lit for real.','Any place, any sky, around them.','Cars, travel, luxury, product launches.'],
    ['Living Product','The hero product, in real close-up detail.','The story growing out of the product itself.','Fragrance, food, beauty, retail.'],
    ['Scale on Demand','The athlete, the performer, the moment.','The stadium, the crowd, the atmosphere.','Sports, telecom, events, national campaigns.'],
    ['Future Place','Real families, on the real plot.','The finished project, rising out of the ground.','Real estate, developers, hospitality.'],
    ['Endless Versions','One hero film, made properly.','Every cut-down, language, size and season.','Retail, banking, telecom, always-on brands.']
  ];
  var tabs=document.getElementById('tabs'), fph=[].slice.call(document.querySelectorAll('#fMedia .ph')), rows=document.getElementById('fRows'), fi=0, tB=[];
  function fillF(i){document.getElementById('fShoot').textContent=F[i][1];document.getElementById('fBuild').textContent=F[i][2];document.getElementById('fFor').textContent=F[i][3];document.getElementById('fName').textContent=F[i][0]}
  function showF(i){tB.forEach(function(b,j){b.setAttribute('aria-selected',j===i)});fph.forEach(function(p,j){p.classList.toggle('on',j===i)});if(i===fi){fillF(i);return}fi=i;rows.classList.add('fade');setTimeout(function(){fillF(i);rows.classList.remove('fade')},200)}
  F.forEach(function(f,i){var b=document.createElement('button');b.setAttribute('role','tab');b.textContent=f[0];b.onclick=function(){showF(i)};tabs.appendChild(b);tB.push(b)});
  showF(0);

  /* quotes */
  var qs=[].slice.call(document.querySelectorAll('.q')), qnav=document.getElementById('qnav'), qi=0, qTimer=null, qd=[];
  function showQ(i){qi=i;qs.forEach(function(q,j){q.classList.toggle('on',j===i)});qd.forEach(function(d,j){d.setAttribute('aria-current',j===i)})}
  qs.forEach(function(q,i){var d=document.createElement('button');d.className='qd';d.setAttribute('aria-label','Quote '+(i+1));d.onclick=function(){showQ(i);clearInterval(qTimer)};qnav.appendChild(d);qd.push(d)});
  showQ(0);

  var tr=document.getElementById('track'); tr.innerHTML+=tr.innerHTML; [].slice.call(tr.children).slice(tr.children.length/2).forEach(function(n){n.setAttribute('aria-hidden','true');n.alt=''});

  /* work wall */
  var WI={gmc_film:'assets/w_gmc_film.webp',gmc_social:'assets/w_gmc_social.webp',fl_snd:'assets/w_fl_snd.webp',fl_store:'assets/w_fl_store.webp',sadouh1:'assets/w_sadouh1.webp',sadouh2:'assets/w_sadouh2.webp',noisette:'assets/w_noisette.webp',kif:'assets/w_kif.webp',jadwily:'assets/w_jadwily.webp',btb:'assets/w_btb.webp',loyac:'assets/w_loyac.webp',ford:'assets/w_ford.webp',fatima:'assets/w_fatima.webp',cbk:'assets/w_cbk.webp',gwaisha:'assets/w_gwaisha.webp',italian:'assets/w_italian.webp',baraka:'assets/w_baraka.webp',petpad1:'assets/w_petpad1.webp',petpad2:'assets/w_petpad2.webp',nexus:'assets/w_nexus.webp',mashawi:'assets/w_mashawi.webp',honda1:'assets/w_honda1.webp',honda2:'assets/w_honda2.webp',honda3:'assets/w_honda3.webp',alessa:'assets/p_alessa.webp'};
  function isrc(r){if(r.charAt(0)==='#'){var p=r.slice(1).split(':');return stage.querySelectorAll('[data-id="'+p[0]+'"] .media .ph')[+p[1]||0].src}return WI[r]}
  var CATN={camp:'Campaigns & events',social:'Social media',film:'Film & photo',ai:'AI & animation'}, CATL={camp:'campaign & event',social:'social media',film:'film & photo',ai:'AI & animation'};
  /* the projects. ig = Instagram post code, go = full case-study slide, res = results key */
  var W={
    gmc:{c:'GMC Behbehani',t:'Summer campaign',y:2023,k:'camp',im:['#gmc:0'],d:'One summer campaign across social media, online ads, billboards and banners, to make GMC feel younger without losing its tough image.',go:'gmc'},
    subaru:{c:'Subaru',t:'Online relaunch',y:2022,k:'camp',im:['#subaru:0','#subaru:1','#subaru:2'],d:'Social media and digital ads for the whole range, from the Forester to the WRX and BRZ.',go:'subaru'},
    alpha:{c:'Alpha Store',t:'Social & digital',y:2023,k:'social',im:['#alpha:0','#alpha:1','#alpha:2','#alpha:3','#alpha:4'],d:'Social media, digital ads, product shoots and video for Kuwait’s Apple authorised service provider.',go:'alpha'},
    bait:{c:'Bait Al Sabon',t:'Summer shoot',y:2023,k:'film',im:['#bait:0'],d:'A summer outdoor photo and video shoot for a handmade skincare brand, turned into social content.',go:'bait'},
    honda:{c:'Honda Alghanim',t:'Launches & lead generation',y:2022,k:'camp',im:['honda2','honda1','honda3'],d:'The Civic Type R launch, with 3D event design, photos, video and live coverage, plus always-on lead campaigns on Meta, Google and TikTok.',res:'honda'},
    fl_snd:{c:'Foot Locker',t:'Saudi National Day',y:2026,k:'camp',im:['fl_snd'],d:'Content for Foot Locker Middle East’s Saudi National Day celebration.',ig:'Ddn-1jPsNtU'},
    ford:{c:'Ford Alghanim',t:'A weekend with Ford',y:2026,k:'camp',im:['ford'],d:'An exciting weekend with Ford Alghanim, a client of ours for over a decade.',ig:'DbQm10asyJV'},
    gmc_social:{c:'GMC Behbehani',t:'Power in every frame',y:2026,k:'social',im:['gmc_social'],d:'Social media content for GMC: power in every frame.',ig:'Dak1NRSDBLk'},
    alessa:{c:'Al-Essa Medical',t:'Social media',y:2023,k:'social',im:['alessa'],d:'Bringing a trusted healthcare name online: social media, showroom coverage, photo shoots and video.',res:'alessa',light:1},
    fl_store:{c:'Foot Locker',t:'Social video',y:2026,k:'social',im:['fl_store'],d:'Social video content for Foot Locker Middle East.',ig:'Db6ZE0vMEkt'},
    noisette:{c:'Noisette Chocolate',t:'Social media',y:2026,k:'social',im:['noisette'],d:'Social media for Noisette Chocolate. Within two weeks, likes per post went from 22 to 265.',ig:'DdRMy5NjCkK',res:'noisette'},
    loyac:{c:'Loyac',t:'Social video',y:2026,k:'social',im:['loyac'],d:'A social video for Loyac Kuwait.',ig:'DbaGOp0M4lU'},
    italian:{c:'Italian Home',t:'Social media',y:2026,k:'social',im:['italian'],d:'Social media content for Italian Home.',ig:'DaXjXx8jFcf'},
    baraka:{c:'Baraka Dates',t:'Ramadan campaigns & social',y:2026,k:'social',im:['baraka'],d:'Ramadan campaigns on Meta, Snapchat and TikTok, influencer collaborations and social content.',ig:'DaNwO7njP-r',res:'baraka'},
    petpad:{c:'PetPad',t:'App launch',y:2026,k:'social',im:['petpad2','petpad1'],d:'Launching PetPad, a social app for pets, on social media from zero posts.',ig:'DdEBSAaDJV6'},
    gmc_film:{c:'GMC Behbehani',t:'Through the generations',y:2026,k:'film',im:['gmc_film'],d:'A brand film for GMC about a truck that passes through the generations.',ig:'Dax2xTGM2ee'},
    btb:{c:'Bumper to Bumper',t:'TV commercial',y:2026,k:'film',im:['btb'],d:'Our TV commercial shoot for BTB All Makes, with Timeline Pro.',ig:'DbftU8TMhqW'},
    fatima:{c:'Fatima Atelier',t:'Ramadan collection',y:2026,k:'film',im:['fatima'],d:'Content for Fatima Atelier’s Ramadan collection.',ig:'Da5Q-AMDC2_'},
    mashawi:{c:'Mashawi',t:'Food content',y:2026,k:'film',im:['mashawi'],d:'Food content for Mashawi.',ig:'DWUP5-bjEV4'},
    sadouh:{c:'Play Sadouh',t:'AI videos',y:2026,k:'ai',im:['sadouh1','sadouh2'],d:'Fun, AI-made videos for Play Sadouh.',ig:'Dd3QazwMSx_'},
    kif:{c:'KIF Expo',t:'AI production',y:2026,k:'ai',im:['kif'],d:'An AI production for KIF Expo.',ig:'DdOphqQse4Z'},
    jadwily:{c:'Jadwily',t:'App video',y:2026,k:'ai',im:['jadwily'],d:'A video for the Jadwily app.',ig:'DdJFld1s55q'},
    cbk:{c:'Al Tijari (CBK)',t:'Travel card animation',y:2026,k:'ai',im:['cbk'],d:'An animated video for Commercial Bank of Kuwait’s multi-currency travel card.',ig:'DauT-TZsLo3'},
    gwaisha:{c:'Gwaisha',t:'100% AI film',y:2026,k:'ai',im:['gwaisha'],d:'A film for Gwaisha by Abdulaziz Al Arbash, made entirely with AI.',ig:'Dar3oqJDAk4'},
    nexus:{c:'Nexus',t:'AI influencer',y:2026,k:'ai',im:['nexus'],d:'An AI influencer, created for Nexus.',ig:'DaSxESeDD1c'}
  };
  /* tiles: project, image index, size (f = big, w = wide), grid area (row/col/row/col) */
  var WT=[
    ['gmc',0,'f','1/1/3/3','55% 55%'],['alpha',0,'f','1/9/3/11','50% 32%'],['subaru',0,'f','2/5/4/7','50% 70%'],['bait',0,'f','3/3/5/5','50% 40%'],['honda',0,'f','3/11/5/13','50% 60%'],
    ['sadouh',0,'w','1/7/2/9'],['petpad',0,'w','3/9/4/11','50% 35%'],['jadwily',0,'w','4/1/5/3'],['kif',0,'w','4/7/5/9'],
    ['fl_snd',0],['noisette',0],['gmc_film',0],['baraka',0],['nexus',0],['fatima',0],
    ['cbk',0],['italian',0],['gwaisha',0],['btb',0],['mashawi',0],['sadouh',1],
    ['petpad',1],['ford',0],['alessa',0],['gmc_social',0],
    ['alpha',2],['loyac',0],['subaru',1],['fl_store',0]
  ];
  var wGrid=document.getElementById('wGrid'), wCount=document.getElementById('wCount'), wHint=wCount.parentNode, keys=Object.keys(W), tiles=[];
  WT.forEach(function(x,i){var it=W[x[0]],b=document.createElement('button');b.className='wt'+(x[2]?' '+x[2]:'')+(it.light?' light':'');b.dataset.k=x[0];b.dataset.ii=x[1];b.style.cssText=(x[3]?'grid-area:'+x[3]+';':'')+'--i:'+i;
    b.setAttribute('aria-label',it.c+': '+it.t);
    b.innerHTML='<img alt="" src="'+isrc(it.im[x[1]])+'"'+(x[4]?' style="object-position:'+x[4]+'"':'')+'><span class="wt-l"><b>'+esc(it.c)+'</b><em>'+esc(it.t)+'</em></span>'+(x[2]==='f'&&it.go?'<span class="wt-tag">Case study</span>':'');
    wGrid.appendChild(b);tiles.push(b)});
  var wF=document.getElementById('wFilters'), fB=[], wCat='all';
  [['all','All']].concat(Object.keys(CATN).map(function(k){return [k,CATN[k]]})).forEach(function(c){var b=document.createElement('button');b.setAttribute('role','tab');b.dataset.k=c[0];b.textContent=c[1];b.onclick=function(){setCat(c[0])};wF.appendChild(b);fB.push(b)});
  function setCat(k){
    wCat=k; fB.forEach(function(b){b.setAttribute('aria-selected',b.dataset.k===k)});
    wGrid.classList.toggle('filtering',k!=='all'); tiles.forEach(function(t){t.classList.toggle('lit',k!=='all'&&W[t.dataset.k].k===k)});
    var n=k==='all'?keys.length:keys.filter(function(x){return W[x].k===k}).length;
    wHint.innerHTML='<b>'+n+'</b> '+(k==='all'?'recent projects. Tap any one to open it.':esc(CATL[k])+' projects, in colour. Tap one to open it.');
  }
  var popT=null;
  function popStop(){clearInterval(popT);popT=null}
  function popStart(){popStop();popT=setInterval(function(){if(wCat!=='all'||openModal)return;var t=tiles[Math.floor(Math.random()*tiles.length)];if(t.classList.contains('pop'))return;t.classList.add('pop');setTimeout(function(){t.classList.remove('pop')},1900)},700)}
  function wallEnter(){setCat('all');popStart()}
  wGrid.addEventListener('click',function(e){var t=e.target.closest('.wt');if(t)openItem(t.dataset.k,+t.dataset.ii)});

  /* project pop-up */
  var lb=document.getElementById('lb'), lbMedia=document.getElementById('lbMedia'), lbInfo=lb.querySelector('.lb-info'), lbI=0, lbTimer=null;
  function lbShow(n){var ims=lbMedia.querySelectorAll('.im'),th=lbMedia.querySelectorAll('.lb-thumbs button');[].forEach.call(ims,function(m,j){m.classList.toggle('on',j===n)});[].forEach.call(th,function(b,j){b.setAttribute('aria-current',j===n)});var bg=lbMedia.querySelector('.bgimg');if(bg)bg.src=ims[n].src;lbMedia._i=n}
  function fillLb(ii){
    var k=keys[lbI], it=W[k], srcs=it.im.map(isrc);
    lbMedia.className='lb-media'+(it.light?' light':'');
    lbMedia.innerHTML='<img class="bgimg" alt="" src="'+srcs[0]+'">'+srcs.map(function(s,j){return '<img class="im" alt="'+esc(it.c+', '+it.t+(srcs.length>1?' ('+(j+1)+')':''))+'" src="'+s+'">'}).join('')+'<div class="lb-thumbs"></div>';
    var th=lbMedia.querySelector('.lb-thumbs');
    if(srcs.length>1)srcs.forEach(function(s,j){var b=document.createElement('button');b.setAttribute('aria-label','Image '+(j+1));b.innerHTML='<img alt="" src="'+s+'">';b.onclick=function(e){e.stopPropagation();clearInterval(lbTimer);lbShow(j)};th.appendChild(b)});
    lbShow(Math.min(ii||0,srcs.length-1)); clearInterval(lbTimer);
    if(srcs.length>1)lbTimer=setInterval(function(){lbShow((lbMedia._i+1)%srcs.length)},3200);
    document.getElementById('lbCat').textContent=CATN[it.k]+' · '+it.y;
    document.getElementById('lbClient').textContent=it.c;
    document.getElementById('lbTitle').textContent=it.t;
    document.getElementById('lbDesc').textContent=it.d;
    var r=document.getElementById('lbRes'); if(it.res){r.hidden=false;renderResults(r,it.res);r.querySelectorAll('[data-count]').forEach(countUp)}else{r.hidden=true;r.innerHTML=''}
    var a=''; if(it.go)a+='<button class="btn" data-go="'+it.go+'">Read the full story <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button>';
    if(it.ig)a+='<a class="btn ghost" href="https://www.instagram.com/p/'+it.ig+'/" target="_blank" rel="noopener">See it on Instagram <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg></a>';
    document.getElementById('lbAct').innerHTML=a;
    document.getElementById('lbPos').textContent=(lbI+1)+' / '+keys.length;
  }
  function openItem(k,ii){lbI=Math.max(0,keys.indexOf(k));fillLb(ii);lb.classList.add('on');openModal=lb;setTimeout(function(){lb.querySelector('.close').focus()},50)}
  function lbStep(d){lbI=(lbI+d+keys.length)%keys.length;lbInfo.classList.add('fade');setTimeout(function(){fillLb(0);lbInfo.classList.remove('fade')},200)}
  document.getElementById('lbPrev').onclick=function(e){e.stopPropagation();lbStep(-1)};
  document.getElementById('lbNext').onclick=function(e){e.stopPropagation();lbStep(1)};
  lb.addEventListener('click',function(e){if(e.target===lb)closeModal()});

  /* digital results (from the digital marketing team's portfolio) */
  var NUM=[
    {c:'Honda Alghanim',logo:'Honda Alghanim',v:'25,000+',l:'leads in 12 months',sub:'Average cost per lead under 15 KWD, well below the market.',goal:'Keep quality leads coming in for several models, all year round.',did:'Always-on campaigns with video and carousel ads for offers and new launches, and constant A/B testing to bring the cost per lead down.',where:['Meta','Google','TikTok']},
    {c:'Baraka Dates',logo:'Baraka Dates',v:'40,000+',l:'KWD in Ramadan sales',sub:'+20% sales growth year on year, kept after the campaign.',goal:'Grow seasonal sales and strengthen the brand online.',did:'Ramadan campaigns, influencer collaborations and storytelling ads, plus an online store set up to sell directly.',where:['Meta','Snapchat','TikTok','E-commerce']},
    {c:'Kuwait Airways',logo:'Kuwait Airways',v:'25M+',l:'impressions in one winter',sub:'200K+ clicks through to booking.',goal:'Drive bookings and visibility in the peak travel season.',did:'A full-funnel winter campaign: high-impact video ads built around winter destinations, from awareness to booking.',where:['Meta','YouTube','Programmatic']},
    {c:'GMC Behbehani',logo:'GMC',v:'1,800+',l:'qualified leads',sub:'Cost per lead kept steady, within competitive benchmarks.',goal:'Bring in quality leads for new GMC launches.',did:'Lead campaigns with creatives made for Kuwait’s car buyers, optimised continuously to keep the cost per lead low.',where:['Meta','Google','TikTok']},
    {c:'Box Hill College',logo:'Box Hill College Kuwait',v:'3,000+',l:'student enquiries',sub:'A clear lift in awareness during the admissions cycle.',goal:'Boost student enrolments for the academic year.',did:'Lead campaigns aimed at parents and students, in more than one language, with retargeting for people who had already shown interest.',where:['Meta','Google','Retargeting']}
  ];
  var nBox=document.getElementById('ncards'), nDet=document.getElementById('ndet'), nI=-1, nT=null;
  function logoOf(n){for(var i=0;i<CL.length;i++)if(CL[i].n===n)return CL[i].u;return ''}
  var nBtns=NUM.map(function(x,i){var b=document.createElement('button');b.className='nc';
    var m=x.v.match(/^([^\d]*)([\d][\d,]*\.?\d*)(.*)$/);
    b.innerHTML='<span class="lg"><img alt="'+esc(x.c)+'" src="'+logoOf(x.logo)+'"></span><span class="nwho">'+esc(x.c)+'</span><b data-prefix="'+m[1]+'" data-count="'+m[2].replace(/,/g,'')+'" data-suffix="'+m[3]+'">'+esc(x.v)+'</b><span class="l">'+esc(x.l)+'</span><span class="sub">'+esc(x.sub)+'</span>';
    b.onclick=function(){stopNum();setNum(i)}; nBox.appendChild(b); return b});
  function setNum(i){var first=nI<0;nI=i;nBtns.forEach(function(b,j){b.classList.toggle('on',j===i);b.setAttribute('aria-pressed',j===i)});var x=NUM[i];nDet.classList.add('fade');
    setTimeout(function(){document.getElementById('nGoal').textContent=x.goal;document.getElementById('nDid').textContent=x.did;document.getElementById('nWhere').innerHTML=x.where.map(function(w){return '<span>'+esc(w)+'</span>'}).join('');nDet.classList.remove('fade')},first?0:200)}
  function stopNum(){clearInterval(nT);nT=null}
  function playNum(){stopNum();setNum(0);var i=0;nT=setInterval(function(){i++;if(i>=NUM.length){stopNum();return}setNum(i)},4200)}
  setNum(0);

  /* "prepared for" from the link, e.g. #for-Alghanim-Industries */
  var h=decodeURIComponent((location.hash||'').slice(1));
  if(/^for-/i.test(h)){forMode=true;document.getElementById('forName').textContent=h.slice(4).replace(/[-_]+/g,' ').trim();document.getElementById('forLine').hidden=false;}
  else{var n=parseInt(h,10);if(n>1&&n<=slides.length){slides[0].classList.remove('is-active');cur=n-1;slides[cur].classList.add('is-active')}}
  sync(); onEnter(slides[cur]);
})();
