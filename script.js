/* ===== Results: fill these in. Use a short value like "+38%", "2.4M" or "12,000". Empty = shown as "result to add". ===== */
var RESULTS={
  /* Real figures only (from MCG's digital team and client reports). Add a client here only when the number is confirmed. */
  gmc:   [{v:'1,800+',l:'qualified leads'}],
  honda: [{v:'25,000+',l:'leads in 12 months'},{v:'<15 KWD',l:'average cost per lead'}],
  baraka:[{v:'+20%',l:'sales growth, year on year'}],
  kac:[{v:'25M+',l:'impressions'},{v:'200K+',l:'clicks to booking'}],
  boxhill:[{v:'3,000+',l:'student enquiries'}],
  noisette:[{v:'12x',l:'more likes per post'},{v:'+350',l:'new followers in two weeks'}]
};
(function(){
  var stage=document.getElementById('stage'), vp=document.getElementById('vp');
  var slides=[].slice.call(stage.querySelectorAll('.slide')), cur=0, rotated=false;
  var IMG={brand:'assets/svc_brand_s.webp',social:'assets/svc_social_s.webp',digital:'assets/svc_digital.webp',media:'assets/svc_media.webp',infl:'assets/svc_influencers.webp',film:'assets/svc_film_s.webp',events:'assets/svc_events_s.webp',mall:'assets/svc_mall.webp',podcast:'assets/svc_podcast.webp',ai:'assets/svc_ai_s.webp',about:'assets/svc_about_s.webp'};

  /* --- fit the 1280x720 stage; turn it sideways on portrait phones --- */
  var coarse=window.matchMedia&&window.matchMedia('(pointer:coarse)').matches, turnEl=document.getElementById('turn'), turnShown=false;
  var flow=false;
  function fit(){
    var w=window.innerWidth,h=window.innerHeight;
    /* landscape on every screen, like before (the scrolling phone layout is switched off) */
    rotated=coarse&&h>w*1.1;
    var s=rotated?Math.min(h/1280,w/720):Math.min(w/1280,h/720);
    stage.style.setProperty('--s',s); stage.classList.toggle('rot',rotated);
    if(rotated&&!turnShown){turnShown=true;turnEl.classList.add('on');setTimeout(function(){turnEl.classList.remove('on')},3200);}
  }
  turnEl.addEventListener('click',function(){turnEl.classList.remove('on')});
  window.addEventListener('resize',fit);

  /* --- the tour: which slides are in it depends on what the client picked --- */
  var picks=[], order=[];
  function isVis(s){if(s.dataset.off)return false;var v=s.dataset.svc;return !v||!picks.length||picks.indexOf(v)>=0}
  var dotsEl=document.getElementById('dots'), list=document.getElementById('menuList'), menu=document.getElementById('menu'), menuBtn=document.getElementById('menuBtn');
  var prevB=document.getElementById('prev'), nextB=document.getElementById('next'), mItems=[];
  function buildNav(){
    order=[];slides.forEach(function(s,i){if(isVis(s))order.push(i)});
    dotsEl.innerHTML='';list.innerHTML='';mItems=[];
    order.forEach(function(i,p){var s=slides[i];
      var d=document.createElement('button');d.dataset.i=i;d.setAttribute('aria-label',(p+1)+': '+s.dataset.name);d.onclick=function(){go(i)};dotsEl.appendChild(d);
      var li=document.createElement('li'),b=document.createElement('button');b.dataset.i=i;b.innerHTML='<span>'+(p+1)+'</span>'+esc(s.dataset.name);b.onclick=function(){go(i);closeMenu()};li.appendChild(b);list.appendChild(li);mItems.push(b)});
    sync();
  }
  function closeMenu(){menu.classList.remove('on');menuBtn.setAttribute('aria-expanded','false')}
  menuBtn.onclick=function(e){e.stopPropagation();var on=menu.classList.toggle('on');menuBtn.setAttribute('aria-expanded',on)};
  stage.addEventListener('click',function(e){if(menu.classList.contains('on')&&!menu.contains(e.target)&&!menuBtn.contains(e.target))closeMenu()});

  var forMode=false;
  /* the next or previous slide in the tour (works even if the current slide was reached by a link) */
  function nb(d){var p=order.indexOf(cur),k;if(p>=0){p+=d;return p>=0&&p<order.length?order[p]:-1}
    if(d>0){for(k=0;k<order.length;k++)if(order[k]>cur)return order[k];return -1}
    for(k=order.length-1;k>=0;k--)if(order[k]<cur)return order[k];return -1}
  function sync(){
    [].forEach.call(dotsEl.children,function(d){d.setAttribute('aria-current',+d.dataset.i===cur)});
    mItems.forEach(function(b){b.setAttribute('aria-current',+b.dataset.i===cur)});
    prevB.disabled=nb(-1)<0; nextB.disabled=nb(1)<0;
    if(flow){slides.forEach(function(s){s.removeAttribute('aria-hidden');if('inert' in s)s.inert=false});return}
    slides.forEach(function(s,i){s.setAttribute('aria-hidden',i!==cur); if('inert' in s) s.inert=i!==cur;});
    if(!forMode){try{history.replaceState(null,'','#'+(cur+1))}catch(e){}}
  }
  function go(n){
    n=Math.max(0,Math.min(slides.length-1,n));
    if(flow){var s=slides[n];if(s.style.display==='none')s.style.display='';cur=n;s.scrollIntoView({behavior:'smooth',block:'start'});return}
    if(n===cur) return;
    stage.dataset.dir=n>cur?'fwd':'back';
    var old=slides[cur]; old.classList.remove('is-active'); old.classList.add('is-out'); setTimeout(function(){old.classList.remove('is-out')},850);
    slides[n].classList.add('is-active'); cur=n; sync(); onEnter(slides[n]);
  }
  function stepTour(d){var n=nb(d);if(n>=0)go(n)}
  prevB.onclick=function(){stepTour(-1)}; nextB.onclick=function(){stepTour(1)};

  /* --- phones: one scrolling page; sections animate in as they scroll into view --- */
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){if(!flow)return;es.forEach(function(e){if(!e.isIntersecting)return;var s=e.target;s.classList.add('is-active');if(!s._entered){s._entered=1;onEnter(s)}})},{threshold:.12}):null;
  function applyVis(){slides.forEach(function(s){s.style.display=flow&&!isVis(s)?'none':''})}
  function setFlow(f){
    if(f!==flow){flow=f;document.documentElement.classList.toggle('flow',f);
      if(f){slides.forEach(function(s){s.classList.remove('is-out');s.classList.remove('is-active');s._entered=0;if(io)io.observe(s);else s.classList.add('is-active')});closeMenu()}
      else{if(io)io.disconnect();slides.forEach(function(s,i){s.classList.toggle('is-active',i===cur)});}
      applyVis();if(typeof applyWShown==='function')applyWShown();sync()}
    return f}
  function slideIdx(id){for(var i=0;i<slides.length;i++)if(slides[i].dataset.id===id&&!slides[i].dataset.off)return i;return -1}
  function goTo(v){var p=String(v).split(':');if(p[0]==='case'){var fi=slideIdx('case-'+p[1]);if(fi>=0){closeModal();go(fi);return}var ci=slideIdx('cases');closeModal();if(ci>=0)go(ci);setTimeout(function(){openCase(p[1])},ci===cur?0:450);return}var n=/^\d+$/.test(p[0])?+p[0]:slideIdx(p[0]);if(n<0)return;closeModal();go(n);if(p[1])setTimeout(function(){if(p[1].charAt(0)==='@')setCat(p[1].slice(1));else openItem(p[1],0)},650)}
  stage.addEventListener('click',function(e){var a=e.target.closest('[data-go]'); if(a){e.preventDefault();e.stopPropagation();goTo(a.dataset.go)}});

  /* keyboard */
  document.addEventListener('keydown',function(e){
    if(openModal){if(e.key==='Escape')closeModal();else if(openModal===lb&&e.key==='ArrowRight')lbStep(1);else if(openModal===lb&&e.key==='ArrowLeft')lbStep(-1);else if(openModal===cv&&e.key==='ArrowRight')caseStep(1);else if(openModal===cv&&e.key==='ArrowLeft')caseStep(-1);return}
    if(flow)return;
    if(e.key==='Escape'){closeMenu();return}
    if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();stepTour(1)}
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();stepTour(-1)}
    else if(e.key==='Home'){go(order[0])} else if(e.key==='End'){go(order[order.length-1])}
  });
  /* swipe (works when the stage is turned sideways too) */
  var sx,sy,st,down=false;
  var inStrip=false;
  vp.addEventListener('pointerdown',function(e){down=true;sx=e.clientX;sy=e.clientY;st=Date.now();inStrip=!!e.target.closest('#strip')});
  vp.addEventListener('pointerup',function(e){
    if(!down) return; down=false;
    var dx=e.clientX-sx, dy=e.clientY-sy; if(rotated){var t=dx;dx=dy;dy=-t;}
    var sw=Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3&&Date.now()-st<900;
    if(openModal){if(sw&&openModal===lb)lbStep(dx<0?1:-1);else if(sw&&openModal===cv)caseStep(dx<0?1:-1);return}
    if(flow)return;
    if(sw&&inStrip){var np=sPage+(dx<0?1:-1);if(np>=0&&np<sPages){stripGo(np);justSwiped=Date.now();return}}
    if(sw) stepTour(dx<0?1:-1);
  });
  vp.addEventListener('pointercancel',function(){down=false});

  /* fullscreen */
  var fsB=document.getElementById('fs');
  if(!(document.fullscreenEnabled||document.webkitFullscreenEnabled)) fsB.hidden=true;
  fsB.onclick=function(){try{if(document.fullscreenElement||document.webkitFullscreenElement){(document.exitFullscreen||document.webkitExitFullscreen).call(document)}else{var el=document.documentElement,r=(el.requestFullscreen||el.webkitRequestFullscreen).call(el);if(r&&r.catch)r.catch(function(){})}}catch(e){}};

  /* modal */
  var openModal=null;
  stage.querySelectorAll('[data-open]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var m=document.getElementById(b.dataset.open);m.classList.add('on');openModal=m;m.querySelector('[data-close]').focus()}});
  function closeModal(){document.documentElement.classList.remove('lock');if(openModal){if(openModal===lb)clearInterval(lbTimer);if(openModal===cv){clearInterval(cvTimer);if(!forMode){try{history.replaceState(null,'','#'+(cur+1))}catch(e){}}}openModal.classList.remove('on');openModal=null}}
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
      if(r.v&&m){d.className='res'+(r.v.length>6?' long':'');var b=document.createElement('b');b.dataset.prefix=m[1];b.dataset.count=m[2].replace(/,/g,'');b.dataset.suffix=m[3];b.textContent=r.v;d.appendChild(b);}
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
    if(s.classList.contains('s-clients-grid')) showSector('all');
    if(s.classList.contains('s-aid')) aiPlay(); else if(!flow) aiStop();
    if(s.classList.contains('s-team')) oPlay(); else oStop();
  }

  /* goals */
  var GOALS=[
    {t:'More people should know us',k:'Awareness',c:'var(--cyan)',s:[['social','Social media','Daily content that keeps you in people’s feeds.'],['media','Media buying','Your ads on the right screens, billboards and sites.'],['infl','Influencers','Trusted voices who introduce you to their followers.']],go:'case:gmc',p:'the GMC case study'},
    {t:'I want more sales',k:'Sales',c:'var(--orange)',s:[['digital','Digital ads','Online ads aimed at people who are ready to buy.'],['social','Social media','Content that turns followers into customers.'],['mall','Mall activations','Experiences that bring shoppers straight to you.']],go:'case:honda',p:'the Honda case study'},
    {t:'I’m launching something new',k:'Launch',c:'var(--pink)',s:[['events','Events & launches','A launch moment people talk about.'],['film','Film & photo','Launch videos and photos, made in-house.'],['social','Social coverage','Live coverage, so everyone sees it.']],go:'case:byd',p:'the BYD launch'},
    {t:'My brand needs a fresh look',k:'Brand',c:'var(--sky)',s:[['brand','Brand creation','A name, logo, look and voice that fit you.'],['film','Film & photo','New photos and videos in your new style.'],['social','Social media','Rolling the new look out everywhere.']],go:'case:bait',p:'Bait Al Sabon'},
    {t:'I need great content, every month',k:'Content',c:'var(--orange)',s:[['social','Social media','A monthly plan, made and posted for you.'],['film','Film & photo','Regular shoots by our in-house team.'],['ai','AI content','More content, faster, at a lower cost.']],go:'case:mado',p:'the MADO case study'},
    {t:'I want to use AI',k:'AI',c:'var(--pink)',s:[['ai','AI + real shoots','Films that mix real footage with AI-built worlds.'],['digital','AI tools','Smart assistants and automations for your team.'],['about','AI training','Workshops that get your team using AI with confidence.']],go:'svc-ai',p:'our AI department'}
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


  /* our team: the structure chart. Lines are drawn from the real positions of the people and teams. */
  var OIC={
    strat:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".8"/>',
    creative:'<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
    social:'<path d="M4 5h16v11H9l-5 4z"/><path d="M12 13.4l-2.2-2.1a1.35 1.35 0 0 1 2.2-1.6 1.35 1.35 0 0 1 2.2 1.6z"/>',
    digital:'<path d="M4 19h16"/><path d="M6 15l4-4 3 3 6-6"/><path d="M15 8h4v4"/>',
    film:'<rect x="3" y="7" width="13" height="10" rx="2"/><path d="M16 11l5-3v8l-5-3"/>',
    events:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.8 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
    ai:'<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><path d="M12 7.5l1.6 2.9 2.9 1.6-2.9 1.6L12 16.5l-1.6-2.9L7.5 12l2.9-1.6z"/>'
  };
  var DEPS=[
    ['strat','Strategy & accounts','Your day-to-day team. They learn your business, plan the work and keep every project on track.',['Account managers','Strategists','Project managers'],''],
    ['creative','Creative & design','The ideas and the look: campaigns, key visuals and brand work.',['Art directors','Designers','Copywriters'],'work:@brand'],
    ['social','Social media','Content made and posted every day, plus influencers and your community.',['Content creators','Community managers','Influencer managers'],'work:@social'],
    ['digital','Digital & media','Ads that bring in leads and sales, and media bought at the best price.',['Performance marketers','Media buyers'],'work:@digital'],
    ['film','Film & photo','Our in-house production team, from the script to the final edit.',['Directors','Camera crew','Editors','Motion designers'],'work:@film'],
    ['events','Events & activations','Launches, events, booths and kiosks, from the 3D design to the night itself.',['Event producers','3D designers'],'work:@events'],
    ['ai','AI department','AI images, AI films and hybrid shoots, for our clients and for other agencies.',['AI artists','AI editors','Producers'],'svc-ai']
  ];
  var oChart=document.getElementById('oChart'), oLines=document.getElementById('oLines'), oDeps=document.getElementById('oDeps'), oDet=document.getElementById('oDet'), oSel=-1, oT=null, oP=[];
  oDeps.innerHTML=DEPS.map(function(d,j){return '<button class="od" style="--j:'+j+'" data-j="'+j+'"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+OIC[d[0]]+'</svg></i><b>'+esc(d[1])+'</b><span class="dd">'+esc(d[2])+'</span></button>'}).join('');
  [].forEach.call(oChart.querySelectorAll('.op'),function(f,j){f.style.setProperty('--j',j)});
  function oPos(el){var x=0,y=0,e=el;while(e&&e!==oChart){x+=e.offsetLeft;y+=e.offsetTop;e=e.offsetParent}return {x:x+el.offsetWidth/2,t:y,b:y+el.offsetHeight}}
  function oDraw(){
    var NS='http://www.w3.org/2000/svg', f=oPos(oChart.querySelector('.r1 .op')), L=[].map.call(oChart.querySelectorAll('.r2 .op'),function(e){return {img:oPos(e.querySelector('img')),all:oPos(e)}}), D=[].map.call(oDeps.children,oPos);
    var y1=(f.b+L[0].img.t)/2, lb=Math.max.apply(null,L.map(function(l){return l.all.b})), y2=(lb+D[0].t)/2, cx=L[Math.floor(L.length/2)].all.x;
    oLines.innerHTML='';oP=[];
    function add(d,g,dep){var p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.dataset.g=g;if(dep!=null)p.dataset.dep=dep;oLines.appendChild(p);oP.push(p);return p}
    L.forEach(function(l){add('M'+f.x+' '+(f.b+4)+'V'+y1+'H'+l.img.x+'V'+(l.img.t-4),0)});
    L.forEach(function(l){add('M'+l.all.x+' '+(l.all.b+4)+'V'+y2,1,null).classList.add('lead')});
    D.forEach(function(d,j){add('M'+cx+' '+y2+'H'+d.x+'V'+(d.t-4),2,j)});
  }
  function oAnim(){oP.forEach(function(p){var n=p.getTotalLength();p.style.transition='none';p.style.strokeDasharray=n;p.style.strokeDashoffset=n});oLines.getBoundingClientRect();
    oP.forEach(function(p){p.style.transition='stroke-dashoffset .8s cubic-bezier(.45,.05,.25,1) '+(.45+(+p.dataset.g)*.35)+'s, stroke .35s, stroke-width .35s';p.style.strokeDashoffset=0})}
  function oSet(i){
    var first=oSel<0; oSel=i; var d=DEPS[i];
    [].forEach.call(oDeps.children,function(b,j){b.classList.toggle('sel',j===i);b.setAttribute('aria-pressed',j===i)});
    oP.forEach(function(p){p.classList.toggle('hot',p.dataset.dep==i||p.classList.contains('lead'))});
    oDet.classList.add('fade');
    setTimeout(function(){oDet.innerHTML='<p class="eyebrow">Team '+(i+1)+' of '+DEPS.length+'</p><h3>'+esc(d[1])+'</h3><p>'+esc(d[2])+'</p><div class="oroles">'+d[3].map(function(r){return '<span>'+esc(r)+'</span>'}).join('')+'</div>'+(d[4]?'<button class="go2" data-go="'+d[4]+'">See their work '+GO+'</button>':'');oDet.classList.remove('fade')},first?0:200);
  }
  function oStop(){clearInterval(oT);oT=null}
  function oPlay(){oStop();if(flow)return;oSel=-1;oDet.innerHTML='';var i=0;setTimeout(function(){if(!slides[cur].classList.contains('s-team'))return;oSet(0);oT=setInterval(function(){i=(i+1)%DEPS.length;oSet(i)},3200)},1300)}
  oDeps.addEventListener('click',function(e){var b=e.target.closest('.od');if(!b||flow)return;oStop();oSet(+b.dataset.j)});
  oDeps.addEventListener('mouseover',function(e){var b=e.target.closest('.od');if(!b||flow||!oT&&oSel==b.dataset.j)return;if(oT){oStop()}oSet(+b.dataset.j)});

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
  document.getElementById('wallMore').onclick=function(e){e.stopPropagation();wall.classList.add('all');this.hidden=true};
  function layoutWall(n){var W=1168,H=wall.clientHeight||380,g=8,best=null;for(var c=3;c<=16;c++){var w=(W-(c-1)*g)/c,r=Math.ceil(n/c),h=(H-(r-1)*g)/r;if(h<34)continue;var tw=Math.min(w,h*1.55,196),th=Math.min(h,tw/1.55);var sc=tw*th;if(!best||sc>best.s)best={c:c,w:tw,h:th,s:sc}}return best}
  function showSector(k){
    secBtns.forEach(function(b){b.setAttribute('aria-selected',b.dataset.k===k)});
    var list=CL.filter(function(x){return k==='all'||x.s===k}), L2=layoutWall(list.length);
    wall.style.gridTemplateColumns='repeat('+L2.c+','+Math.floor(L2.w)+'px)'; wall.style.gridAutoRows=Math.floor(L2.h)+'px';
    wall.innerHTML=list.map(function(x,i){return '<div class="lt" style="--i:'+Math.min(i,60)+'"><img alt="'+esc(x.n)+'" title="'+esc(x.n)+'" src="'+x.u+'"></div>'}).join('');
  }
  SEC.forEach(function(s){var n=s[0]==='all'?CL.length:CL.filter(function(x){return x.s===s[0]}).length;var b=document.createElement('button');b.setAttribute('role','tab');b.dataset.k=s[0];b.innerHTML=esc(s[1])+' <em>'+n+'</em>';b.onclick=function(){showSector(s[0])};secEl.appendChild(b);secBtns.push(b)});

  /* the ten services: key, name, tile colour, one line for the picker */
  var SV=[
    ['brand','Brand & creative','#123A69','Your look, your voice, and the campaigns that carry them.'],
    ['social','Social media','#125D99','Content made and posted for you, every day.'],
    ['digital','Digital marketing','#144074','Online ads that bring in leads and sales.'],
    ['media','Media buying','#1B4E86','The right screens and sites, at the best price.'],
    ['infl','Influencers','#0F3563','The right creators, briefed and managed.'],
    ['film','Film & photo','#0F3563','Ads, films and photos by our own crew.'],
    ['events','Events & launches','#1B4E86','Launches and events people talk about.'],
    ['mall','Mall activations','#144074','Kiosks, booths and in-mall experiences.'],
    ['podcast','Podcasts','#125D99','Your podcast, produced and grown.'],
    ['ai','AI department','#123A69','AI images, AI films and hybrid shoots.']
  ];

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

  /* work wall: "All" shows a curated mosaic; each filter fills the screen with its own projects */
  var WI={italian_c:'assets/w_italian_c.webp',fatima_c:'assets/w_fatima_c.webp',mcg_mothers_0:'assets/n_mcg_mothers_0.webp',p_gmc:'assets/p_gmc.webp',p_subaru1:'assets/p_subaru1.webp',p_subaru2:'assets/p_subaru2.webp',p_subaru3:'assets/p_subaru3.webp',p_bait:'assets/p_bait.webp',gmc_film:'assets/w_gmc_film.webp',gmc_social:'assets/w_gmc_social.webp',fl_snd:'assets/w_fl_snd.webp',fl_store:'assets/w_fl_store.webp',sadouh1:'assets/w_sadouh1.webp',sadouh2:'assets/w_sadouh2.webp',noisette:'assets/w_noisette.webp',kif:'assets/w_kif.webp',jadwily:'assets/w_jadwily.webp',btb:'assets/w_btb.webp',loyac:'assets/w_loyac.webp',ford:'assets/w_ford.webp',fatima:'assets/w_fatima.webp',cbk:'assets/w_cbk.webp',gwaisha:'assets/w_gwaisha.webp',italian:'assets/w_italian.webp',baraka:'assets/w_baraka.webp',petpad1:'assets/w_petpad1.webp',petpad2:'assets/w_petpad2.webp',nexus:'assets/w_nexus.webp',mashawi:'assets/w_mashawi.webp',honda1:'assets/w_honda1.webp',honda2:'assets/w_honda2.webp',honda3:'assets/w_honda3.webp',alessa:'assets/p_alessa.webp',behbehani_tire_0:'assets/n_behbehani_tire_0.webp',behbehani_tire_1:'assets/n_behbehani_tire_1.webp',behbehani_tire_2:'assets/n_behbehani_tire_2.webp',gmc_social_0:'assets/n_gmc_social_0.webp',gmc_social_1:'assets/n_gmc_social_1.webp',gmc_social_2:'assets/n_gmc_social_2.webp',mado_0:'assets/n_mado_0.webp',mado_1:'assets/n_mado_1.webp',mado_2:'assets/n_mado_2.webp',subaru_social_0:'assets/n_subaru_social_0.webp',subaru_social_1:'assets/n_subaru_social_1.webp',subaru_social_2:'assets/n_subaru_social_2.webp',enaya_0:'assets/n_enaya_0.webp',enaya_1:'assets/n_enaya_1.webp',enaya_2:'assets/n_enaya_2.webp',honda_social_0:'assets/n_honda_social_0.webp',honda_social_1:'assets/n_honda_social_1.webp',honda_social_2:'assets/n_honda_social_2.webp',honda_marine_0:'assets/n_honda_marine_0.webp',honda_marine_1:'assets/n_honda_marine_1.webp',honda_marine_2:'assets/n_honda_marine_2.webp',honda_bikes_0:'assets/n_honda_bikes_0.webp',honda_bikes_1:'assets/n_honda_bikes_1.webp',honda_bikes_2:'assets/n_honda_bikes_2.webp',honda_power_0:'assets/n_honda_power_0.webp',honda_power_1:'assets/n_honda_power_1.webp',honda_power_2:'assets/n_honda_power_2.webp',baraka_0:'assets/n_baraka_0.webp',baraka_1:'assets/n_baraka_1.webp',baraka_2:'assets/n_baraka_2.webp',linas_0:'assets/n_linas_0.webp',linas_1:'assets/n_linas_1.webp',linas_2:'assets/n_linas_2.webp',astro_0:'assets/n_astro_0.webp',astro_1:'assets/n_astro_1.webp',astro_2:'assets/n_astro_2.webp',cfc_0:'assets/n_cfc_0.webp',cfc_1:'assets/n_cfc_1.webp',cfc_2:'assets/n_cfc_2.webp',microsoft_0:'assets/n_microsoft_0.webp',microsoft_1:'assets/n_microsoft_1.webp',microsoft_2:'assets/n_microsoft_2.webp',microsoft_3:'assets/n_microsoft_3.webp',microsoft_4:'assets/n_microsoft_4.webp',honda_cd_1:'assets/n_honda_cd_1.webp',honda_cd_0:'assets/n_honda_cd_0.webp',honda_cd_2:'assets/n_honda_cd_2.webp',honda_cd_3:'assets/n_honda_cd_3.webp',honda_cd_4:'assets/n_honda_cd_4.webp',honda_cd_5:'assets/n_honda_cd_5.webp',honda_cd_6:'assets/n_honda_cd_6.webp',cccl_1:'assets/n_cccl_1.webp',cccl_0:'assets/n_cccl_0.webp',cccl_2:'assets/n_cccl_2.webp',cccl_3:'assets/n_cccl_3.webp',cccl_4:'assets/n_cccl_4.webp',byd_0:'assets/n_byd_0.webp',byd_1:'assets/n_byd_1.webp',byd_2:'assets/n_byd_2.webp',byd_3:'assets/n_byd_3.webp',byd_4:'assets/n_byd_4.webp',hcivic_0:'assets/n_hcivic_0.webp',hcivic_1:'assets/n_hcivic_1.webp',hcivic_2:'assets/n_hcivic_2.webp',hcivic_3:'assets/n_hcivic_3.webp',hcivic_4:'assets/n_hcivic_4.webp',liwan_0:'assets/n_liwan_0.webp',liwan_1:'assets/n_liwan_1.webp',liwan_2:'assets/n_liwan_2.webp',kiosks_0:'assets/n_kiosks_0.webp',kiosks_1:'assets/n_kiosks_1.webp',kiosks_2:'assets/n_kiosks_2.webp',kiosks_3:'assets/n_kiosks_3.webp',kiosks_4:'assets/n_kiosks_4.webp',kiosks_5:'assets/n_kiosks_5.webp',bww_0:'assets/n_bww_0.webp',honda_ride_0:'assets/n_honda_ride_0.webp',honda_film_0:'assets/n_honda_film_0.webp',mashawi_film_0:'assets/n_mashawi_film_0.webp',honda_series_0:'assets/n_honda_series_0.webp',atlas_0:'assets/n_atlas_0.webp',mado_ai_0:'assets/n_mado_ai_0.webp',linas_ai_0:'assets/n_linas_ai_0.webp',baraka_ai_0:'assets/n_baraka_ai_0.webp',mado_dondurma_0:'assets/n_mado_dondurma_0.webp',enaya_ai_0:'assets/n_enaya_ai_0.webp',linas_summer_0:'assets/n_linas_summer_0.webp',kfh_0:'assets/n_kfh_0.webp',mashawi_anim_0:'assets/n_mashawi_anim_0.webp',kif_anim_0:'assets/n_kif_anim_0.webp',hamleys_0:'assets/n_hamleys_0.webp',kif_booth_0:'assets/n_kif_booth_0.webp',bahry_0:'assets/n_bahry_0.webp',thinners_0:'assets/n_thinners_0.webp',mcg_eid_0:'assets/n_mcg_eid_0.webp',venue_kv_0:'assets/n_venue_kv_0.webp',venue_kv_1:'assets/n_venue_kv_1.webp',venue_kv_2:'assets/n_venue_kv_2.webp',venue_kv_3:'assets/n_venue_kv_3.webp',venue_kv_4:'assets/n_venue_kv_4.webp',venue_kv_5:'assets/n_venue_kv_5.webp',gmc_kv_0:'assets/n_gmc_kv_0.webp',gmc_kv_1:'assets/n_gmc_kv_1.webp',gmc_kv_2:'assets/n_gmc_kv_2.webp',baraka_kv_0:'assets/n_baraka_kv_0.webp',baraka_kv_1:'assets/n_baraka_kv_1.webp',baraka_kv_2:'assets/n_baraka_kv_2.webp',baraka_kv_3:'assets/n_baraka_kv_3.webp',baraka_kv_4:'assets/n_baraka_kv_4.webp',pirelli_kv_0:'assets/n_pirelli_kv_0.webp',pirelli_kv_1:'assets/n_pirelli_kv_1.webp',pirelli_kv_2:'assets/n_pirelli_kv_2.webp',kac_kv_0:'assets/n_kac_kv_0.webp',kac_kv_1:'assets/n_kac_kv_1.webp',kac_kv_2:'assets/n_kac_kv_2.webp',kac_kv_3:'assets/n_kac_kv_3.webp',kac_kv_4:'assets/n_kac_kv_4.webp',kac_kv_5:'assets/n_kac_kv_5.webp',images_kv_0:'assets/n_images_kv_0.webp',images_kv_1:'assets/n_images_kv_1.webp',images_kv_2:'assets/n_images_kv_2.webp',images_kv_3:'assets/n_images_kv_3.webp',images_kv_4:'assets/n_images_kv_4.webp',images_kv_5:'assets/n_images_kv_5.webp',images_kv_6:'assets/n_images_kv_6.webp',images_kv_7:'assets/n_images_kv_7.webp'};
  function isrc(r){if(r.charAt(0)==='#'){var p=r.slice(1).split(':');return stage.querySelectorAll('[data-id="'+p[0]+'"] .media .ph')[+p[1]||0].src}return WI[r]}
  var FLT=[['all','All'],['camp','Campaigns'],['events','Events'],['social','Social media'],['film','Film & video'],['ai','AI & animation'],['prod','Production']];
  var CATN={camp:'Campaigns & creative',events:'Events & launches',social:'Social media',film:'Film & video',ai:'AI & animation',prod:'Production & booths'}, CATL={camp:'campaign',events:'event',social:'social media',film:'film & video',ai:'AI & animation',prod:'production'};
  /* the projects. ig = Instagram post, li = LinkedIn post, go = slide to open, res = results key, y = year */
  var W={
    gmc:{c:'GMC Behbehani',t:'Summer campaign',y:2023,k:'camp',im:['p_gmc'],d:'One summer campaign across social media, online ads, billboards and banners, to make GMC feel younger without losing its tough image.'},
    subaru:{c:'Subaru',t:'Online relaunch',y:2022,k:'camp',im:['p_subaru1','p_subaru2','p_subaru3'],d:'Social media and digital ads for the whole range, from the Forester to the WRX and BRZ.'},
    bait:{c:'Bait Al Sabon',t:'Summer shoot',y:2023,k:'film',im:['p_bait'],d:'A summer outdoor photo and video shoot for a handmade skincare brand, turned into social content.'},
    microsoft:{c:'Microsoft Kuwait',t:'Innovate4Kuwait',y:2025,k:'events',im:['microsoft_0','microsoft_1','microsoft_2','microsoft_3','microsoft_4'],d:'Microsoft Kuwait’s Innovate4Kuwait event, with government and Microsoft leaders on stage.',li:'https://www.linkedin.com/posts/microsoft_microsoftkuwait-innovate4kuwait-activity-7335599246101925889-BU7N'},
    honda:{c:'Honda Alghanim',t:'Civic Type R launch',y:2023,k:'events',im:['honda2','honda1','honda3'].concat(['hcivic_0','hcivic_1','hcivic_2','hcivic_3','hcivic_4']),d:'The Civic Type R launch, with 3D event design, photos, video and live coverage, plus always-on lead campaigns on Meta, Google and TikTok.',ig:'CsX-ToEgkHA',res:'honda'},
    honda_cd:{c:'Honda Alghanim',t:'Customers’ Day',y:2024,k:'events',im:['honda_cd_1','honda_cd_0','honda_cd_2','honda_cd_3','honda_cd_4','honda_cd_5','honda_cd_6'],d:'Honda’s Thank You Day for its customers: a beach evening with stage shows, fire performers and the Honda story.',ig:'DCV3EtVsQ6_'},
    byd:{c:'BYD Alghanim',t:'Desert launch',y:2025,k:'events',im:['byd_0','byd_1','byd_2','byd_3','byd_4'],d:'A BYD launch night in a desert canyon, with light shows, live music and the cars on display.',ig:'DHbe5TNIzXi'},
    cccl:{c:'Children’s Cancer Center of Lebanon',t:'Fundraising gala',y:2025,k:'events',im:['cccl_1','cccl_0','cccl_2','cccl_3','cccl_4'],d:'A fundraising gala for the Children’s Cancer Center of Lebanon, with live music and speeches.',li:'https://www.linkedin.com/posts/mcgkw_we-were-honored-to-support-the-childrens-activity-7342453814483939328-ZlQU'},
    ford:{c:'Ford Alghanim',t:'A weekend with Ford',y:2026,k:'events',im:['ford'],d:'An exciting weekend with Ford Alghanim, a client of ours for over a decade.',ig:'DbQm10asyJV'},
    fl_snd:{c:'Foot Locker',t:'Saudi National Day',y:2026,k:'camp',im:['fl_snd'],d:'Content for Foot Locker Middle East’s Saudi National Day celebration.',ig:'Ddn-1jPsNtU'},
    kac_kv:{c:'Kuwait Airways',t:'Winter campaign',y:2025,k:'camp',im:['kac_kv_0','kac_kv_1','kac_kv_2','kac_kv_3','kac_kv_4','kac_kv_5'],d:'“Before you travel!”: a winter campaign that ran across Meta, YouTube and programmatic.',res:'kac'},
    gmc_kv:{c:'GMC Behbehani',t:'Price campaigns',y:2025,k:'camp',im:['gmc_kv_0','gmc_kv_1','gmc_kv_2'],d:'Offer-led campaigns for the GMC Yukon, Denali and Terrain.'},
    baraka_kv:{c:'Baraka Dates',t:'Travel campaign',y:2025,k:'camp',im:['baraka_kv_0','baraka_kv_1','baraka_kv_2','baraka_kv_3','baraka_kv_4'],d:'“Pack right with Baraka”: dates that travel with you.'},
    pirelli_kv:{c:'Behbehani Tire',t:'Pirelli offers',y:2025,k:'camp',im:['pirelli_kv_0','pirelli_kv_1','pirelli_kv_2'],d:'Buy 2, get 2: tyre offers for Pirelli.'},
    images_kv:{c:'Images',t:'10 years campaign',k:'camp',im:['images_kv_0','images_kv_1','images_kv_2','images_kv_3','images_kv_4','images_kv_5','images_kv_6','images_kv_7'],d:'A tenth-anniversary campaign for Images, starring history’s great minds.'},
    venue_kv:{c:'Bowling & games venue',t:'Promotions',k:'camp',im:['venue_kv_0','venue_kv_1','venue_kv_2','venue_kv_3','venue_kv_4','venue_kv_5'],d:'Bold, playful offers for bowling, games and food: Thirsty Thursdays, Strikes & Slices and more.'},
    gmc_social:{c:'GMC Behbehani',t:'Social media',y:2026,k:'social',im:['gmc_social_0','gmc_social_1','gmc_social_2'],d:'Always-on social media for GMC: launches, offers and reels. Power in every frame.',ig:'Dak1NRSDBLk'},
    behbehani_tire:{c:'Behbehani Tire',t:'Social media',y:2025,k:'social',im:['behbehani_tire_0','behbehani_tire_1','behbehani_tire_2'],d:'Social media for Behbehani Tire and Pirelli: product posts, offers and reels.',ig:'DKHiHgCPAIs'},
    mado:{c:'MADO Kuwait',t:'Social media',y:2025,k:'social',im:['mado_0','mado_1','mado_2'],d:'Social media for MADO Kuwait: food and dessert content, seasonal campaigns and reels.',ig:'DJRq_f3oFoi'},
    subaru_social:{c:'Subaru Kuwait',t:'Social media',y:2025,k:'social',im:['subaru_social_0','subaru_social_1','subaru_social_2'],d:'Always-on social media for Subaru Kuwait: model launches, offers and reels.',ig:'DLZ7h8AvuoA'},
    enaya:{c:'Enaya Insurance',t:'Social media',y:2025,k:'social',im:['enaya_0','enaya_1','enaya_2'],d:'Social media for Enaya Insurance, making insurance simple and friendly.',ig:'DJZSqiQoDtW'},
    honda_social:{c:'Honda Alghanim',t:'Social media',y:2025,k:'social',im:['honda_social_0','honda_social_1','honda_social_2'],d:'Social media for Honda cars: launches like Honda Connect, offers and reels.',ig:'DJObRaBMhhA'},
    honda_marine:{c:'Honda Marine',t:'Social media',y:2025,k:'social',im:['honda_marine_0','honda_marine_1','honda_marine_2'],d:'Social media for Honda Marine: outboard engines, service offers and the boating season.',ig:'DLCiL_oM6Ae'},
    honda_bikes:{c:'Honda Bikes',t:'Social media',y:2024,k:'social',im:['honda_bikes_0','honda_bikes_1','honda_bikes_2'],d:'Social media for Honda motorcycles, from the Africa Twin to the X-ADV.',ig:'C_0BCwes8VM'},
    honda_power:{c:'Honda Power',t:'Social media',y:2024,k:'social',im:['honda_power_0','honda_power_1','honda_power_2'],d:'Social media for Honda power products: generators, outdoor equipment and showroom days.',ig:'DBdBmyas6Wg'},
    linas:{c:'Lina’s & Dina’s',t:'Social media',y:2025,k:'social',im:['linas_0','linas_1','linas_2'],d:'Social media for Lina’s & Dina’s: healthy food, product launches and reels.',ig:'DLHgeHII4w-'},
    astro:{c:'Astro Power Cables',t:'Social media',y:2025,k:'social',im:['astro_0','astro_1','astro_2'],d:'Social media for Astro Power Cables, turning an industrial brand into stories people watch.',ig:'DEchKCrCeXI'},
    cfc:{c:'Commercial Facilities Co.',t:'Social media',y:2025,k:'social',im:['cfc_0','cfc_1','cfc_2'],d:'Social media for Commercial Facilities Co.: financing made simple, with presenter-led reels.',ig:'DJEOcWQoQm5'},
    baraka:{c:'Baraka Dates',t:'Ramadan campaigns & social',y:2026,k:'social',im:['baraka_0','baraka_1','baraka_2'],d:'Ramadan campaigns on Meta, Snapchat and TikTok, influencer collaborations and social content.',ig:'DaNwO7njP-r',res:'baraka'},
    alessa:{c:'Al-Essa Medical',t:'Social media',y:2023,k:'social',im:['alessa'],d:'Bringing a trusted healthcare name online: social media, showroom coverage, photo shoots and video.',light:1},
    fl_store:{c:'Foot Locker',t:'Social video',y:2026,k:'social',im:['fl_store'],d:'Social video content for Foot Locker Middle East.',ig:'Db6ZE0vMEkt'},
    noisette:{c:'Noisette Chocolate',t:'Social media',y:2026,k:'social',im:['noisette'],d:'Social media for Noisette Chocolate. Within two weeks, likes per post went from 22 to 265.',ig:'DdRMy5NjCkK',res:'noisette'},
    loyac:{c:'Loyac',t:'Social video',y:2026,k:'social',im:['loyac'],d:'A social video for Loyac Kuwait.',ig:'DbaGOp0M4lU'},
    italian:{c:'Italian Home',t:'Social media',y:2026,k:'social',im:['italian_c'],d:'Social media content for Italian Home.',ig:'DaXjXx8jFcf'},
    petpad:{c:'PetPad',t:'App launch',y:2026,k:'social',im:['petpad2','petpad1'],d:'Launching PetPad, a social app for pets, on social media from zero posts.',ig:'DdEBSAaDJV6'},
    gmc_film:{c:'GMC Behbehani',t:'Through the generations',y:2026,k:'film',im:['gmc_film'],d:'A brand film for GMC about a truck that passes through the generations.',ig:'Dax2xTGM2ee'},
    btb:{c:'Bumper to Bumper',t:'TV commercial',y:2026,k:'film',im:['btb'],d:'Our TV commercial shoot for BTB All Makes, with Timeline Pro.',ig:'DbftU8TMhqW'},
    fatima:{c:'Fatima Atelier',t:'Ramadan collection',y:2026,k:'film',im:['fatima_c'],d:'Content for Fatima Atelier’s Ramadan collection.',ig:'Da5Q-AMDC2_'},
    mashawi:{c:'Mashawi',t:'Food content',y:2026,k:'film',im:['mashawi'],d:'Food content for Mashawi.',ig:'DWUP5-bjEV4'},
    bww:{c:'Behbehani Watch World',t:'Brand film',y:2024,k:'film',im:['bww_0'],d:'A brand film for Behbehani Watch World, built around the question “Why not?”.',ig:'DAN4MI3ooSR'},
    honda_ride:{c:'Honda Alghanim',t:'Annual ride film',y:2024,k:'film',im:['honda_ride_0'],d:'A film of Honda’s annual motorcycle ride.',ig:'C4VxQG9oiv2'},
    honda_film:{c:'Honda Alghanim',t:'Brand film',y:2023,k:'film',im:['honda_film_0'],d:'A brand film made to lift the Honda brand in Kuwait.',ig:'CxOeYxZN-nV'},
    honda_series:{c:'Honda Alghanim',t:'Video series',y:2023,k:'film',im:['honda_series_0'],d:'A presenter-led video series for Honda.',ig:'CzbKP7rMk9W'},
    mashawi_film:{c:'Mashawi',t:'Food film',y:2023,k:'film',im:['mashawi_film_0'],d:'A food film for Mashawi that makes you want to order straight away.',ig:'CqqDiWANVHW'},
    mcg_mothers:{c:'MCG',t:'Mother’s Day film',y:2020,k:'film',im:['mcg_mothers_0'],d:'A Mother’s Day film from our own team.',ig:'B9wFRHIARwt'},
    atlas:{c:'Atlas Blue',t:'Pools film',y:2024,k:'film',im:['atlas_0'],d:'A film showing off Atlas Blue’s pools.',ig:'DA6EB7lNAM2'},
    sadouh:{c:'Play Sadouh',t:'AI videos',y:2026,k:'ai',im:['sadouh1','sadouh2'],d:'Fun, AI-made videos for Play Sadouh.',ig:'Dd3QazwMSx_'},
    kif:{c:'KIF Expo',t:'AI production',y:2026,k:'ai',im:['kif'],d:'An AI production for KIF Expo.',ig:'DdOphqQse4Z'},
    jadwily:{c:'Jadwily',t:'App video',y:2026,k:'ai',im:['jadwily'],d:'A video for the Jadwily app.',ig:'DdJFld1s55q'},
    cbk:{c:'Al Tijari (CBK)',t:'Travel card animation',y:2026,k:'ai',im:['cbk'],d:'An animated video for Commercial Bank of Kuwait’s multi-currency travel card.',ig:'DauT-TZsLo3'},
    gwaisha:{c:'Gwaisha',t:'100% AI film',y:2026,k:'ai',im:['gwaisha'],d:'A film for Gwaisha by Abdulaziz Al Arbash, made entirely with AI.',ig:'Dar3oqJDAk4'},
    nexus:{c:'Nexus',t:'AI influencer',y:2026,k:'ai',im:['nexus'],d:'An AI influencer, created for Nexus.',ig:'DaSxESeDD1c'},
    mado_ai:{c:'MADO Kuwait',t:'AI film',y:2025,k:'ai',im:['mado_ai_0'],d:'An AI film for MADO Kuwait with a heritage feel.',ig:'DKhxL2eoBZ4'},
    mado_dondurma:{c:'MADO Dondurma',t:'AI film',y:2025,k:'ai',im:['mado_dondurma_0'],d:'A giant ice cream, built for Eid: an AI film for MADO Dondurma.',ig:'DKe1R47olvl'},
    linas_ai:{c:'Lina’s & Dina’s',t:'AI product film',y:2025,k:'ai',im:['linas_ai_0'],d:'AI characters bringing Lina’s & Dina’s new jars to life.',ig:'DLC06y2ItUK'},
    linas_summer:{c:'Lina’s & Dina’s',t:'AI summer campaign',y:2025,k:'ai',im:['linas_summer_0'],d:'Summer offers for Lina’s & Dina’s, made with AI.',ig:'DLiHf-6I4HW'},
    baraka_ai:{c:'Baraka Dates',t:'AI travel visual',y:2025,k:'ai',im:['baraka_ai_0'],d:'An AI-made visual for Baraka Dates: travelling to Lebanon with Baraka.',ig:'DKfILh4PJSg'},
    enaya_ai:{c:'Enaya Insurance',t:'AI film',y:2025,k:'ai',im:['enaya_ai_0'],d:'An AI-made football film for Enaya Insurance.',ig:'DL7UySstKkf'},
    mcg_eid:{c:'MCG',t:'Eid film, made with AI',y:2025,k:'ai',im:['mcg_eid_0'],d:'Our own Eid greeting, made entirely with AI.',ig:'DKh4_xjN-rn'},
    hamleys:{c:'Hamleys Kuwait',t:'Launch animation',y:2025,k:'ai',im:['hamleys_0'],d:'Announcing that the world’s finest toy store had arrived in Kuwait.',ig:'DKMEb0FT9Tc'},
    kfh:{c:'KFH',t:'Rewards 3D animation',y:2024,k:'ai',im:['kfh_0'],d:'A 3D animation explaining how to get the most from reward points.',ig:'DDZYCgcNFkH'},
    mashawi_anim:{c:'Mashawi',t:'3D animation',y:2024,k:'ai',im:['mashawi_anim_0'],d:'A 3D animated film for Mashawi.',ig:'DBGnqYYoVAV'},
    kif_anim:{c:'KIF Expo',t:'Animated film',y:2025,k:'ai',im:['kif_anim_0'],d:'An animated film for KIF Expo.',ig:'DJ53oinotm7'},
    kif_booth:{c:'KIF Expo',t:'Perfume expo, in 3D',y:2024,k:'ai',im:['kif_booth_0'],d:'A 3D film for KIF Expo’s perfume exhibition.',ig:'DCj-28Itqy7'},
    bahry:{c:'Bahry',t:'Animation',y:2025,k:'ai',im:['bahry_0'],d:'An animated film for Bahry, the platform for sea lovers.',ig:'DLsfK8KqoAP'},
    thinners:{c:'Thinners',t:'2D animation',y:2025,k:'ai',im:['thinners_0'],d:'A 2D animation for Thinners.',ig:'DLaXAGGMYhJ'},
    liwan:{c:'Liwan',t:'Exhibition booth',y:2025,k:'prod',im:['liwan_0','liwan_1','liwan_2'],d:'An exhibition booth design for Liwan.',ig:'DOLZ4Z9jPx5'},
    kiosks:{c:'Mall kiosks',t:'illy, Westinghouse, Gulf Moda and more',k:'prod',im:['kiosks_0','kiosks_1','kiosks_2','kiosks_3','kiosks_4','kiosks_5'],d:'Kiosks and displays for brands in Kuwait’s malls, from design to build.'}
  };
  /* which projects sit under which service (a project can sit under more than one). Order = order on the page. */
  var SVI={
    brand:['images_kv','baraka_kv','venue_kv','kac_kv','gmc_kv','pirelli_kv','bait','petpad','gmc'],
    social:['baraka','mado','gmc_social','linas','noisette','honda_social','subaru_social','enaya','behbehani_tire','honda_marine','honda_bikes','honda_power','astro','cfc','alessa','fl_snd','fl_store','loyac','italian','petpad','venue_kv'],
    digital:['honda','kac_kv','gmc','gmc_kv','baraka','subaru','pirelli_kv','baraka_kv'],
    media:['kac_kv','gmc','honda','gmc_kv'],
    infl:['baraka','nexus'],
    film:['gmc_film','bww','btb','bait','honda_film','mashawi_film','honda_ride','honda_series','fatima','mashawi','atlas','fl_store','loyac','mcg_mothers'],
    events:['microsoft','byd','honda_cd','honda','cccl','ford'],
    mall:['kiosks','liwan'],
    podcast:[],
    ai:['gwaisha','mado_dondurma','linas_ai','mado_ai','nexus','baraka_ai','linas_summer','enaya_ai','sadouh','hamleys','kfh','mashawi_anim','kif','kif_anim','kif_booth','cbk','jadwily','bahry','thinners','mcg_eid']
  };
  var SVS={brand:'Brand',social:'Social',digital:'Digital',media:'Media',infl:'Influencers',film:'Film & photo',events:'Events',mall:'Malls & booths',podcast:'Podcasts',ai:'AI'};
  var SVL={brand:'brand & creative',social:'social media',digital:'digital',media:'media',infl:'influencer',film:'film & photo',events:'event',mall:'mall & booth',podcast:'podcast',ai:'AI'};
  var SVN={brand:'Brand & creative',social:'Social media',digital:'Digital marketing',media:'Media buying',infl:'Influencers',film:'Film & photo',events:'Events',mall:'Mall activations',podcast:'Podcasts',ai:'AI'};
  /* "Highlights" is a short, varied pick; each service tab shows all of its projects. 12 per page. */
  var PICK=['microsoft','honda','mado_dondurma','byd','gmc','kac_kv','gwaisha','honda_cd','bait','mado_ai','subaru','hamleys','cccl','images_kv','kif_booth','fl_snd','mashawi_anim','linas_ai','btb','baraka_kv','gmc_film','bww','kiosks','gmc_social'];
  var FOCUS={gmc:'55% 55%',honda:'45% 55%',microsoft:'40% 50%',byd:'50% 60%',kac_kv:'45% 50%',subaru:'50% 70%',bait:'50% 40%'};
  var VT={mall:[['kiosks',0],['kiosks',1],['kiosks',2],['kiosks',3],['kiosks',4],['kiosks',5],['liwan',0],['liwan',1]]};
  var FLTS={};FLT.forEach(function(f){FLTS[f[0]]=f[1]});
  var keys=Object.keys(W), EVERY=PICK.concat(keys.filter(function(k){return PICK.indexOf(k)<0}));
  var wGrid=document.getElementById('wGrid'), viewKeys=keys, wCat='all', PER=12, PAGEW=1208, sPage=0, sPages=1, justSwiped=0;
  var sPrev=document.getElementById('sPrev'), sNext=document.getElementById('sNext'), sBar=document.getElementById('sBar'), sPos=document.getElementById('sPos'), wHint=document.getElementById('wHint'), wF=document.getElementById('wFilters');
  function svcList(k){return VT[k]||(SVI[k]||[]).map(function(id){return [id,0]})}
  function uniqKeys(list){var a=[];list.forEach(function(x){if(a.indexOf(x[0])<0)a.push(x[0])});return a}
  /* "Your picks": take turns between the picked services, so the mix stays varied */
  function pickList(){var L=picks.map(svcList),out=[],seen={},more=true;for(var r=0;more;r++){more=false;L.forEach(function(l){if(r<l.length){more=true;var x=l[r],id=x[0]+':'+x[1];if(!seen[id]){seen[id]=1;out.push(x)}}})}return out}
  function viewList(k){if(k==='all')return PICK.map(function(id){return [id,0]});if(k==='every')return EVERY.map(function(id){return [id,0]});if(k==='picks')return pickList();return svcList(k)}
  function wTabs(){var a=[];if(picks.length&&pickList().length){a.push(['picks','Your picks']);picks.forEach(function(k){if(svcList(k).length)a.push([k,SVS[k]])})}else{a.push(['all','Highlights']);SV.forEach(function(v){if(svcList(v[0]).length)a.push([v[0],SVS[v[0]]])})}a.push(['every','Everything']);return a}
  function buildTabs(){wF.innerHTML='';wTabs().forEach(function(c){var b=document.createElement('button');b.setAttribute('role','tab');b.dataset.k=c[0];if(c[0]==='picks')b.className='mine';b.innerHTML=esc(c[1])+'<em>'+viewList(c[0]).length+'</em>';b.onclick=function(){setCat(c[0])};wF.appendChild(b)})}
  function cardHTML(x,i){var it=W[x[0]],f=FOCUS[x[0]]&&!x[1]?' style="object-position:'+FOCUS[x[0]]+'"':'';return '<button class="gc'+(it.light?' light':'')+'" data-k="'+x[0]+'" data-ii="'+x[1]+'" style="--i:'+(i%PER)+'" aria-label="'+esc(it.c+': '+it.t)+'"><span class="im"><img alt="" src="'+isrc(it.im[x[1]]||it.im[0])+'"'+f+'></span><span class="meta"><b>'+esc(it.c)+'</b><span>'+esc(it.t)+'</span></span></button>'}
  function stripGo(p){sPage=Math.max(0,Math.min(sPages-1,p));wGrid.style.transform='translateX('+(-sPage*PAGEW)+'px)';sBar.style.width=(100/sPages)+'%';sBar.style.left=(sPage*100/sPages)+'%';sPrev.disabled=sPage===0;sNext.disabled=sPage>=sPages-1;sPos.textContent=(sPage+1)+' / '+sPages;
    var pg=wGrid.children[sPage];if(pg){pg.classList.remove('anim');void pg.offsetWidth;pg.classList.add('anim')}}
  function render(k){var list=viewList(k),h='';viewKeys=uniqKeys(list);
    for(var i=0;i<list.length;i+=PER)h+='<div class="wpage">'+list.slice(i,i+PER).map(cardHTML).join('')+'</div>';
    wGrid.style.transition='none';wGrid.innerHTML=h;sPages=Math.max(1,Math.ceil(list.length/PER));wShown=1;applyWShown();stripGo(0);void wGrid.offsetWidth;wGrid.style.transition='';return list.length}
  var wShown=1, wMore=document.getElementById('wMore');
  function applyWShown(){[].forEach.call(wGrid.children,function(pg,i){pg.hidden=flow&&i>=wShown;if(flow&&i<wShown)pg.classList.add('anim')});wMore.hidden=wShown>=wGrid.children.length}
  wMore.onclick=function(e){e.stopPropagation();wShown++;applyWShown()};
  function setCat(k){wCat=k;[].forEach.call(wF.children,function(b){b.setAttribute('aria-selected',b.dataset.k===k)});var n=render(k);
    wHint.innerHTML=k==='all'?'A few favourites. Tap one to open it.':k==='picks'?'<b>'+n+'</b> projects picked for you. Tap one to open it.':k==='every'?'All <b>'+n+'</b> projects. Tap one to open it.':'<b>'+n+'</b> '+esc(SVL[k])+' projects. Tap one to open it.'}
  sPrev.onclick=function(e){e.stopPropagation();stripGo(sPage-1)}; sNext.onclick=function(e){e.stopPropagation();stripGo(sPage+1)};
  function popStop(){}
  function wallEnter(){if(!wF.children.length)buildTabs();setCat(wTabs()[0][0])}
  wGrid.addEventListener('click',function(e){if(Date.now()-justSwiped<450)return;var t=e.target.closest('.gc');if(t)openItem(t.dataset.k,+t.dataset.ii)});

  /* project pop-up */
  var lb=document.getElementById('lb'), lbMedia=document.getElementById('lbMedia'), lbInfo=lb.querySelector('.lb-info'), lbI=0, lbTimer=null, ARR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  function lbShow(n){var ims=lbMedia.querySelectorAll('.im'),th=lbMedia.querySelectorAll('.lb-thumbs button');[].forEach.call(ims,function(m,j){m.classList.toggle('on',j===n)});[].forEach.call(th,function(b,j){b.setAttribute('aria-current',j===n)});var bg=lbMedia.querySelector('.bgimg');if(bg)bg.src=ims[n].poster||ims[n].src;lbMedia._i=n}
  function fillLb(ii){
    var k=viewKeys[lbI], it=W[k], srcs=it.im.map(isrc);
    lbMedia.className='lb-media'+(it.light?' light':'');
    if(it.v)srcs=[srcs[0]].concat(srcs);
    lbMedia.innerHTML='<img class="bgimg" alt="" src="'+srcs[0]+'">'+srcs.map(function(s,j){if(it.v&&!j)return '<video class="im" src="'+it.v+'" poster="'+s+'" autoplay muted loop playsinline></video>';return '<img class="im" alt="'+esc(it.c+', '+it.t+(srcs.length>1?' ('+(j+1)+')':''))+'" src="'+s+'">'}).join('')+'<div class="lb-thumbs"></div>';
    var th=lbMedia.querySelector('.lb-thumbs');
    if(srcs.length>1)srcs.slice(0,8).forEach(function(s,j){var b=document.createElement('button');b.setAttribute('aria-label','Image '+(j+1));b.innerHTML='<img alt="" src="'+s+'">';b.onclick=function(e){e.stopPropagation();clearInterval(lbTimer);lbShow(j)};th.appendChild(b)});
    lbShow(Math.min(ii||0,srcs.length-1)); clearInterval(lbTimer);
    if(srcs.length>1&&!it.v)lbTimer=setInterval(function(){lbShow((lbMedia._i+1)%srcs.length)},3200);
    document.getElementById('lbCat').textContent=svcOf(k).map(function(s){return SVN[s]}).join(' · ')+(it.y>=2024?' · '+it.y:'');
    document.getElementById('lbClient').textContent=it.c;
    document.getElementById('lbTitle').textContent=it.t;
    document.getElementById('lbDesc').textContent=it.d;
    var r=document.getElementById('lbRes'); if(it.res){r.hidden=false;renderResults(r,it.res);r.querySelectorAll('[data-count]').forEach(countUp)}else{r.hidden=true;r.innerHTML=''}
    var a=''; if(caseOf[k])a+='<button class="btn" data-go="case:'+caseOf[k]+'">See the case study <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button>';
    if(it.go)a+='<button class="btn ghost" data-go="'+it.go+'">'+esc(it.gol||'Read the full story')+' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button>';
    if(it.ig)a+='<a class="btn ghost" href="https://www.instagram.com/p/'+it.ig+'/" target="_blank" rel="noopener">Watch it on Instagram '+ARR+'</a>';
    if(it.li)a+='<a class="btn ghost" href="'+it.li+'" target="_blank" rel="noopener">See it on LinkedIn '+ARR+'</a>';
    document.getElementById('lbAct').innerHTML=a;
    document.getElementById('lbPos').textContent=(lbI+1)+' / '+viewKeys.length;
  }
  function openItem(k,ii,list){if(list)viewKeys=list.slice();else if(viewKeys.indexOf(k)<0)viewKeys=keys;lbI=Math.max(0,viewKeys.indexOf(k));fillLb(ii);lb.classList.add('on');openModal=lb;if(flow){document.documentElement.classList.add('lock');lb.scrollTop=0}setTimeout(function(){lb.querySelector('.close').focus()},50)}
  function lbStep(d){lbI=(lbI+d+viewKeys.length)%viewKeys.length;lbInfo.classList.add('fade');setTimeout(function(){fillLb(0);lbInfo.classList.remove('fade')},200)}
  document.getElementById('lbPrev').onclick=function(e){e.stopPropagation();lbStep(-1)};
  document.getElementById('lbNext').onclick=function(e){e.stopPropagation();lbStep(1)};
  lb.addEventListener('click',function(e){if(e.target===lb)closeModal()});

  /* case studies: one page per client, built from the projects above */
  var CASES=[
    {id:'honda',c:'Honda Alghanim',logo:'Honda Alghanim',ey:'Automotive · Events · Film · Social',h:'Launches, films and leads, all year round.',p:'We work across the whole Honda family in Kuwait: cars, motorcycles, marine engines and power products.',did:['The Civic Type R launch and Honda’s Customers’ Day','A brand film, an annual ride film and a video series','Social media for Honda cars, Marine, Bikes and Power','Always-on lead campaigns on Meta, Google and TikTok'],res:'honda',items:['honda','honda_cd','honda_film','honda_ride','honda_series','honda_social','honda_marine','honda_bikes','honda_power']},
    {id:'gmc',c:'GMC Behbehani',logo:'GMC',ey:'Automotive · Campaigns · Film · Social',h:'A younger GMC, without losing its edge.',p:'Make GMC feel younger and fresher, without losing its tough, professional-grade image.',did:['A summer campaign across social media, online ads, billboards and banners','Offer-led campaigns for the Yukon, Denali and Terrain','“Through the generations”, a brand film','Always-on social media and lead campaigns on Meta, Google and TikTok'],res:'gmc',items:['gmc','gmc_kv','gmc_film','gmc_social']},
    {id:'baraka',c:'Baraka Dates',logo:'Baraka Dates',ey:'Food · Campaigns · Social · AI',h:'Ramadan, travel and every day in between.',p:'Growing a much-loved dates brand in season and all year round.',did:['Ramadan campaigns on Meta, Snapchat and TikTok','Influencer collaborations and storytelling ads','An online store set up to sell directly','The “Pack right with Baraka” travel campaign and AI-made visuals'],res:'baraka',items:['baraka_kv','baraka_ai','baraka']},
    {id:'kac',c:'Kuwait Airways',logo:'Kuwait Airways',ey:'Aviation · Digital campaign',h:'“Before you travel!”',p:'A winter campaign to drive bookings and visibility in the peak travel season.',did:['A full-funnel campaign, from awareness to booking','High-impact video ads built around winter destinations','Ads across Meta, YouTube and programmatic'],res:'kac',items:['kac_kv']},
    {id:'microsoft',c:'Microsoft Kuwait',logo:'Microsoft',ey:'Technology · Event',h:'Innovate4Kuwait.',p:'Microsoft Kuwait’s Innovate4Kuwait event, for government and business leaders.',did:['The Innovate4Kuwait event','Speakers from the Kuwaiti government and Microsoft','Event photography and video'],items:['microsoft']},
    {id:'byd',c:'BYD Alghanim',logo:'BYD Alghanim',ey:'Automotive · Event',h:'A launch night in a desert canyon.',p:'Launching BYD with a night people would remember.',did:['A launch event set in a desert canyon','Light shows and live music','The cars on display, with photography and video'],items:['byd']},
    {id:'mado',c:'MADO',logo:'MADO',ey:'Food & desserts · Social · AI',h:'Desserts people stop scrolling for.',p:'Social media and AI films for MADO Kuwait and MADO Dondurma.',did:['Social media and reels for MADO Kuwait','An AI film with a heritage feel','A giant AI ice cream, built for Eid, for MADO Dondurma'],items:['mado_ai','mado_dondurma','mado']},
    {id:'linas',c:'Lina’s & Dina’s',logo:'Lina\'s & Dina\'s',ey:'Healthy food · Social · AI',h:'Healthy food, made fun.',p:'Social media and AI content for a healthy food brand.',did:['Social media and reels','AI characters for the new jars launch','An AI summer offers campaign'],items:['linas','linas_ai','linas_summer']},
    {id:'subaru',c:'Subaru',logo:'Subaru',ey:'Automotive · Campaign · Social',h:'Subaru, made for today’s car buyer.',p:'Bring Subaru’s online presence up to speed with how people shop for cars today.',did:['Social media and digital ads for the range, from the Forester to the WRX and BRZ','Always-on social media for Subaru Kuwait: model launches, offers and reels'],items:['subaru','subaru_social']},
    {id:'pirelli',c:'Behbehani Tire · Pirelli',logo:'Pirelli',ey:'Automotive · Social · Campaigns',h:'Tyres people actually talk about.',p:'Social media and offers for Behbehani Tire and Pirelli.',did:['Social media and reels','“Buy 2, get 2” offer campaigns'],items:['behbehani_tire','pirelli_kv']},
    {id:'enaya',c:'Enaya Insurance',logo:'Enaya Insurance',ey:'Insurance · Social · AI',h:'Insurance, made simple and friendly.',p:'Social media and AI content for Enaya Insurance.',did:['Social media and reels','An AI-made football film'],items:['enaya','enaya_ai']},
    {id:'kif',c:'KIF Expo',logo:'Kuwait International Fair',ey:'Exhibitions · AI · Animation',h:'Exhibitions, brought to life with AI and 3D.',p:'AI and 3D content for KIF Expo’s exhibitions.',did:['An AI production','An animated film','A 3D film for the perfume exhibition'],items:['kif','kif_anim','kif_booth']},
    {id:'mashawi',c:'Mashawi',logo:'Mashawi',ey:'Restaurants · Film · Animation',h:'Food you can almost taste.',p:'Films, photos and animation for Mashawi.',did:['Food films and photography','Food content for social media','A 3D animated film'],items:['mashawi','mashawi_film','mashawi_anim']},
    {id:'bait',c:'Bait Al Sabon',badge:'assets/b_bait.webp',ey:'Skincare · Photo & video',h:'Handmade skincare, told honestly.',p:'Tell the story of traditional, handmade skincare without making it feel old-fashioned or overdone.',did:['A summer outdoor photo and video shoot','Content for social media'],items:['bait']},
    {id:'footlocker',c:'Foot Locker',ey:'Retail · Campaign · Social',h:'Saudi National Day, in style.',p:'Content for Foot Locker Middle East.',did:['Content for Foot Locker’s Saudi National Day celebration','Social video for Foot Locker Middle East'],items:['fl_snd','fl_store']},
    {id:'images',c:'Images',logo:'Images',ey:'Retail · Campaign',h:'Ten years, told by history’s great minds.',p:'A tenth-anniversary campaign for Images.',did:['A tenth-anniversary campaign','A series of eight illustrated visuals'],items:['images_kv']},
    {id:'noisette',c:'Noisette Chocolate',ey:'Food · Social media',h:'From 22 likes to 265, in two weeks.',p:'Social media for a chocolate brand, with results in the first two weeks.',did:['Social media management','Content and reels'],res:'noisette',items:['noisette']},
    {id:'cccl',c:'Children’s Cancer Center of Lebanon',logo:'Children\'s Cancer Center Lebanon',ey:'Charity · Event',h:'A fundraising gala we were proud to support.',p:'A fundraising gala for the Children’s Cancer Center of Lebanon.',did:['A fundraising gala with live music and speeches','Event photography and video'],items:['cccl']},
    {id:'boxhill',c:'Box Hill College',logo:'Box Hill College Kuwait',ey:'Education · Digital campaign',h:'3,000+ student enquiries.',p:'Boosting student enrolments for the academic year.',did:['Lead campaigns aimed at parents and students','Ads in more than one language','Retargeting for people who had already shown interest'],res:'boxhill',items:[]}
  ];
  var CASE={}, caseOf={};
  CASES.forEach(function(cs,i){cs.i=i;CASE[cs.id]=cs;cs.items.forEach(function(k){caseOf[k]=cs.id})});
  function clLogo(n){if(!n)return '';for(var i=0;i<CL.length;i++)if(CL[i].n===n)return CL[i].u;return ''}
  function caseImgs(cs){var a=[],seen={};cs.items.forEach(function(k){var s=isrc(W[k].im[0]);if(!seen[s]){seen[s]=1;a.push(s)}});cs.items.forEach(function(k){W[k].im.slice(1).forEach(function(r){var s=isrc(r);if(!seen[s]){seen[s]=1;a.push(s)}})});return a.slice(0,10)}
  /* index */
  var cGrid=document.getElementById('cGrid'), ccs=[], GO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
  document.getElementById('cCount').textContent=CASES.length;
  cGrid.style.gridTemplateRows='repeat('+Math.ceil((CASES.length+1)/5)+',minmax(0,1fr))';
  CASES.forEach(function(cs,i){var im=caseImgs(cs),lg=clLogo(cs.logo)||cs.badge||'',b=document.createElement('button');
    b.className='cc'+(i===0?' wide':'')+(im.length?'':' light');b.style.setProperty('--i',i);b.setAttribute('aria-label','Case study: '+cs.c);
    var n=cs.items.length;
    b.innerHTML='<img alt="" src="'+(im[0]||lg)+'">'+(lg&&im.length?'<span class="cl"><img alt="" src="'+lg+'"></span>':'')+'<span class="ct"><em>'+esc(cs.ey.split(' · ')[0])+(n>1?' · '+n+' projects':'')+'</em><b>'+esc(cs.c)+'</b></span><span class="go">'+GO+'</span>';
    b.onclick=function(){openCase(cs.id)};cGrid.appendChild(b);ccs.push(b)});
  var cPopT=null;
  function cPopStop(){clearInterval(cPopT);cPopT=null}
  function cPopStart(){cPopStop();cPopT=setInterval(function(){if(openModal)return;var t=ccs[Math.floor(Math.random()*ccs.length)];if(t.classList.contains('pop'))return;t.classList.add('pop');setTimeout(function(){t.classList.remove('pop')},2000)},800)}
  /* case page */
  var cv=document.getElementById('cv'), cvMedia=document.getElementById('cvMedia'), cvI=0, cvTimer=null;
  function cvShow(n){var ph=cvMedia.querySelectorAll('.ph'),th=cvMedia.querySelectorAll('.thumbs button');[].forEach.call(ph,function(p,j){p.classList.toggle('on',j===n)});[].forEach.call(th,function(b,j){b.setAttribute('aria-current',j===n)});cvMedia._i=n}
  function fillCase(i){
    var cs=CASES[i], im=caseImgs(cs), lg=clLogo(cs.logo)||cs.badge||''; cvI=i;
    cvMedia.className='media'+(im.length?'':' light');
    var srcs=im.length?im:[lg];
    cvMedia.innerHTML=srcs.map(function(s,j){return '<img class="ph'+(j?'':' on')+'" alt="'+esc(cs.c)+(srcs.length>1?' ('+(j+1)+')':'')+'" src="'+s+'">'}).join('')+'<div class="thumbs"></div>';
    var th=cvMedia.querySelector('.thumbs');
    if(srcs.length>1)srcs.forEach(function(s,j){var b=document.createElement('button');b.setAttribute('aria-label','Image '+(j+1));b.innerHTML='<img alt="" src="'+s+'">';b.onclick=function(e){e.stopPropagation();clearInterval(cvTimer);cvShow(j)};th.appendChild(b)});
    cvShow(0); clearInterval(cvTimer); if(srcs.length>1)cvTimer=setInterval(function(){cvShow((cvMedia._i+1)%srcs.length)},3600);
    document.getElementById('cvLogo').innerHTML=lg?'<img alt="'+esc(cs.c)+'" src="'+lg+'">':'';
    document.getElementById('cvEy').textContent=cs.ey;
    document.getElementById('cvH').textContent=cs.h;
    document.getElementById('cvP').textContent=cs.p;
    document.getElementById('cvDid').innerHTML=cs.did.map(function(d){return '<li>'+esc(d)+'</li>'}).join('');
    var r=document.getElementById('cvRes'); if(cs.res&&RESULTS[cs.res]){renderResults(r,cs.res);r.querySelectorAll('[data-count]').forEach(countUp)}else r.innerHTML='';document.getElementById('cvResW').hidden=!r.innerHTML;
    var links=[];cs.items.forEach(function(k){var it=W[k];if(it.ig)links.push(['https://www.instagram.com/p/'+it.ig+'/',it.t]);else if(it.li)links.push([it.li,it.t])});
    document.getElementById('cvWatch').innerHTML=links.slice(0,6).map(function(l){return '<a href="'+l[0]+'" target="_blank" rel="noopener">▶ '+esc(l[1])+' '+ARR+'</a>'}).join('');
    document.getElementById('cvPos').textContent=(i+1)+' / '+CASES.length;
    if(!forMode){try{history.replaceState(null,'','#case-'+cs.id)}catch(e){}}
  }
  function openCase(id){var cs=CASE[id];if(!cs)return;if(openModal&&openModal!==cv)closeModal();fillCase(cs.i);cv.classList.add('on');openModal=cv;if(flow){document.documentElement.classList.add('lock');cv.scrollTop=0}setTimeout(function(){cv.querySelector('.close').focus()},50)}
  function caseStep(d){var n=(cvI+d+CASES.length)%CASES.length;cv.classList.add('swap');setTimeout(function(){fillCase(n);cv.classList.remove('swap')},220)}
  document.getElementById('cvPrev').onclick=function(e){e.stopPropagation();caseStep(-1)};
  document.getElementById('cvNext').onclick=function(e){e.stopPropagation();caseStep(1)};
  document.getElementById('cvAll').onclick=function(e){e.stopPropagation();closeModal();goTo('cases')};

  /* featured case studies: five slides in the tour, refilled to match what the client picked */
  function renderCaseSlide(sec,cs){
    var media=sec.querySelector('.media'), panel=sec.querySelector('.panel'), im=caseImgs(cs).slice(0,8), lg=clLogo(cs.logo)||cs.badge||'', srcs=im.length?im:(lg?[lg]:[]);
    media.className='media'+(im.length?'':' light');
    media.innerHTML=srcs.map(function(s,j){return '<img class="ph'+(j?'':' on')+'" alt="'+esc(cs.c)+' ('+(j+1)+')" src="'+s+'">'}).join('')+'<div class="thumbs"></div>';
    var ph=[].slice.call(media.querySelectorAll('.ph')), th=media.querySelector('.thumbs');
    media._show=function(i){ph.forEach(function(p,j){p.classList.toggle('on',j===i)});[].forEach.call(th.children,function(b,j){b.setAttribute('aria-current',j===i)});media._i=i};
    if(srcs.length>1)srcs.forEach(function(s,i){var b=document.createElement('button');b.setAttribute('aria-label','Image '+(i+1));b.innerHTML='<img alt="" src="'+s+'">';b.onclick=function(e){e.stopPropagation();media._show(i);clearInterval(galTimer)};th.appendChild(b)});
    media._show(0);
    var links=[];cs.items.forEach(function(k){var it=W[k];if(it.ig)links.push(['https://www.instagram.com/p/'+it.ig+'/',it.t]);else if(it.li)links.push([it.li,it.t])});
    panel.innerHTML='<div class="p-top rise" style="--d:0">'+(lg?'<span class="cv-logo"><img alt="'+esc(cs.c)+'" src="'+lg+'"></span>':'')+'<p class="eyebrow">Case study · '+esc(cs.ey.split(' · ')[0])+'</p></div>'+
      '<h2 class="h2 rise" style="--d:1">'+esc(cs.h)+'</h2><div class="cstep rise" style="--d:2"><p class="eyebrow">The brief</p><p class="body">'+esc(cs.p)+'</p></div>'+
      '<div class="cv-did rise" style="--d:3"><p class="eyebrow">What we did</p><ul>'+cs.did.map(function(d){return '<li>'+esc(d)+'</li>'}).join('')+'</ul></div>'+
      (cs.res&&RESULTS[cs.res]?'<div class="cstep rise" style="--d:4"><p class="eyebrow">The result</p><div class="results"></div></div>':'')+
      (links.length?'<div class="cv-watch rise" style="--d:5">'+links.slice(0,3).map(function(l){return '<a href="'+l[0]+'" target="_blank" rel="noopener">▶ '+esc(l[1])+' '+ARR+'</a>'}).join('')+'</div>':'')+
      '<button class="more rise" style="--d:6" data-go="cases">All '+CASES.length+' case studies '+GO+'</button>';
    if(cs.res&&RESULTS[cs.res])renderResults(panel.querySelector('.results'),cs.res);
  }
  var caseSlots=[].slice.call(document.querySelectorAll('.s-case'));
  caseSlots.forEach(function(sec){var cs=CASE[sec.dataset.case];if(cs)renderCaseSlide(sec,cs)});
  var DEF=caseSlots.map(function(s){return s.dataset.case});
  var IND={honda:'auto',gmc:'auto',byd:'auto',subaru:'auto',pirelli:'auto',baraka:'food',mado:'food',linas:'food',mashawi:'food',noisette:'food',kac:'travel',microsoft:'tech',enaya:'finance',kif:'expo',bait:'beauty',footlocker:'retail',images:'retail',cccl:'charity',boxhill:'education'};
  function svcOf(k){var a=[];for(var s in SVI)if(SVI[s].indexOf(k)>=0)a.push(s);return a}
  function caseScore(cs){if(!cs.items.length&&cs.id!=='boxhill')return 0;var m=0;cs.items.forEach(function(k){if(svcOf(k).some(function(s){return picks.indexOf(s)>=0}))m++});if(cs.id==='boxhill'&&picks.indexOf('digital')>=0)m=1;return m?Math.min(m,2)+(cs.res&&RESULTS[cs.res]?.5:0):0}
  /* best matches first, but avoid three car brands in a row: each repeat of an industry costs a little */
  function featured(){if(!picks.length)return DEF;var c=[];CASES.forEach(function(cs){var s=caseScore(cs);if(s>0)c.push({cs:cs,s:s})});if(c.length<2)return DEF;
    var out=[],used={};while(out.length<caseSlots.length&&c.length){var bi=0,bv=-1e9;c.forEach(function(x,i){var v=x.s-1.5*(used[IND[x.cs.id]]||0);if(v>bv){bv=v;bi=i}});var x=c.splice(bi,1)[0];out.push(x.cs.id);used[IND[x.cs.id]]=(used[IND[x.cs.id]]||0)+1}return out}
  function fillFeatured(){var ids=featured();caseSlots.forEach(function(sec,i){var id=ids[i];if(!id){sec.dataset.off='1';return}delete sec.dataset.off;if(sec.dataset.case!==id){var cs=CASE[id];sec.dataset.case=id;sec.dataset.id='case-'+id;sec.dataset.name='Case: '+cs.c;renderCaseSlide(sec,cs)}})}

  /* one slide per service: what it is, how we do it, who it's for, and the proof */
  var SVD={
    brand:{n:'Brand & creative',h:'Campaign ideas with a look people remember.',p:'We give your brand one clear idea and a look to match, then carry it into every campaign, post and billboard.',good:['New brands','Rebrands','Big campaigns'],m:[['Discover','Your business, customers and competitors.'],['Define','One clear idea of who you are.'],['Design','The look, the words and the key visuals.'],['Roll out','Every format, for every channel.']],hi:['images_kv','baraka_kv','venue_kv']},
    social:{n:'Social media',h:'Daily content for brands like MADO, GMC and Honda.',p:'We plan, make and post your content, reply to your followers, and show you what’s working every month.',good:['Staying visible','Growing a following','Launches'],m:[['Plan','A monthly calendar built on your goals.'],['Create','Posts, reels and stories, made in-house.'],['Post & reply','We publish and talk to your followers.'],['Report','The numbers, in plain words.']],hi:['baraka','mado','gmc_social']},
    digital:{n:'Digital marketing',h:'25,000+ leads for Honda, in one year.',p:'Online ads aimed at the people most likely to buy, on Meta, Google, TikTok and Snapchat, tested and improved every week.',good:['Leads','Online sales','Bookings']},
    media:{n:'Media buying',h:'25M+ impressions for Kuwait Airways, in one winter.',p:'We plan and book your ads across billboards, TV, radio and online, and negotiate so your budget goes further.',good:['Big campaigns','Launches','National reach'],m:[['Plan','Where your customers really look.'],['Negotiate','Better rates and better spots.'],['Book & run','We book it and check it runs.'],['Report','What ran, who saw it, what it did.']],hi:['kac_kv','gmc','honda']},
    infl:{n:'Influencers',h:'From Ramadan creators for Baraka to an AI influencer for Nexus.',p:'We find creators whose followers are your customers, brief them, manage the content and measure what it did. We even build AI influencers.',good:['Trust','Buzz','Launches'],m:[['Match','Creators whose followers fit you.'],['Brief','A clear brief that still feels real.'],['Manage','Contracts, approvals and timing.'],['Measure','Reach, engagement and sales.']],hi:['baraka','nexus']},
    film:{n:'Film & photo',h:'TV ads and brand films, shot by our own crew.',p:'From the idea and script to the shoot and the final edit, our in-house production team makes TV ads, brand films, reels and photos.',good:['TV ads','Brand films','Reels & photos'],m:[['Idea','A story worth watching.'],['Shoot','Our own crew, on set or on location.'],['Edit','Editing, colour, sound and motion.'],['Deliver','Every size, for every platform.']],hi:['gmc_film','bww','btb']},
    events:{n:'Events & launches',h:'From a desert-canyon launch for BYD to a beach night for Honda.',p:'We come up with the concept, design the space, run the night and cover it live, from the first idea to the last guest.',good:['Product launches','Openings','Conferences & galas'],m:[['Concept','The idea and the guest experience.'],['Design','3D designs of the stage and space.'],['Produce','Suppliers, build and run of show.'],['Cover','Photos, video and live coverage.']],hi:['byd','honda_cd','microsoft']},
    mall:{n:'Mall activations & booths',h:'Kiosks and booths for illy, Westinghouse and more.',p:'Kiosks, booths and in-mall experiences, designed in 3D, then built and installed by us.',good:['Footfall','Product trials','Exhibitions'],m:[['Concept','An idea that makes people stop.'],['Design','3D designs you can approve.'],['Build','Production and installation.'],['Run','On the day, and covered for social.']],hi:[['kiosks',0],['kiosks',2],['liwan',0]]},
    podcast:{n:'Podcasts',h:'Your expertise, heard.',p:'We shape the show, record it, edit it and help it grow, so your know-how reaches the people who matter to you.',good:['Thought leadership','Founders & CEOs','B2B brands'],m:[['Shape','The format, the guests and the name.'],['Record','Cameras and sound, done properly.'],['Edit','Full episodes, plus short clips.'],['Grow','Publishing and promotion.']]},
    ai:{n:'Our AI department'}
  };
  SVD.digital.m=[['Target','The right people, by interest and place.'],['Test','Several ads at once, to find the winners.'],['Optimise','More budget behind what works.'],['Report','Cost per lead and sales, in plain words.']];
  /* digital marketing: real figures from our digital team (no sales amounts, by request) */
  var RC=[
    {cs:'honda',logo:'Honda Alghanim',v:'25,000+',l:'leads in 12 months',sub:'Average cost per lead under 15 KWD.'},
    {cs:'kac',logo:'Kuwait Airways',v:'25M+',l:'impressions in one winter',sub:'200K+ clicks through to booking.'},
    {cs:'gmc',logo:'GMC',v:'1,800+',l:'qualified leads',sub:'For new GMC launches.'},
    {cs:'boxhill',logo:'Box Hill College Kuwait',v:'3,000+',l:'student enquiries',sub:'For one academic year.'},
    {cs:'baraka',logo:'Baraka Dates',v:'+20%',l:'sales growth, year on year',sub:'Growth that lasted after Ramadan.'}
  ];
  var GLOW=['rgba(31,167,224,.24)','rgba(233,76,151,.2)','rgba(242,145,35,.18)'];
  function statOf(it){var r=it.res&&RESULTS[it.res];return r&&r[0]&&r[0].v?'<span class="stat"><b>'+esc(r[0].v)+'</b><span>'+esc(r[0].l)+'</span></span>':''}
  function svcCard(x,j){var it=W[x[0]],f=FOCUS[x[0]]&&!x[1]?' style="object-position:'+FOCUS[x[0]]+'"':'';return '<button class="svc-c'+(it.light?' light':'')+'" style="--j:'+j+'" data-k="'+x[0]+'" data-ii="'+x[1]+'" aria-label="'+esc(it.c+': '+it.t)+'"><span class="im">'+(it.v&&!x[1]?'<video src="'+it.v+'" poster="'+isrc(it.im[0])+'" autoplay muted loop playsinline></video>':'<img alt="" src="'+isrc(it.im[x[1]]||it.im[0])+'"'+f+'>')+statOf(it)+'</span><span class="meta"><b>'+esc(it.c)+'</b><span>'+esc(it.t)+'</span></span></button>'}
  var svxEls=[].slice.call(document.querySelectorAll('.s-svx'));
  svxEls.forEach(function(sec,si){
    var k=sec.dataset.svc, d=SVD[k], n=svcList(k).length, right, all='';
    sec.style.setProperty('--g',GLOW[si%3]);
    if(k==='digital') right='<div class="svx-res">'+RC.map(function(r,j){var m=r.v.match(/^([^\d]*)([\d][\d,]*\.?\d*)(.*)$/);return '<button class="rc'+(j<2?' big':'')+'" style="--j:'+j+'" data-cs="'+r.cs+'" aria-label="'+esc(CASE[r.cs].c+': '+r.v+' '+r.l)+'"><span class="lg"><img alt="'+esc(CASE[r.cs].c)+'" src="'+clLogo(r.logo)+'"></span><span class="go">'+GO+'</span><b data-prefix="'+m[1]+'" data-count="'+m[2].replace(/,/g,'')+'" data-suffix="'+m[3]+'">'+esc(r.v)+'</b><span class="l">'+esc(r.l)+'</span><span class="sub">'+esc(CASE[r.cs].c)+' · '+esc(r.sub)+'</span></button>'}).join('')+'</div>';
    else if(!n) right='<div class="svx-empty"><img alt="" src="'+IMG[k]+'"><b>Examples on request</b><p>We’ll happily walk you through our podcast work on a call.</p><button class="btn" data-go="contact">Ask us for examples '+GO+'</button></div>';
    else right='<div class="svx-cards">'+d.hi.map(function(h,j){return svcCard(typeof h==='string'?[h,0]:h,j)}).join('')+'</div>';
    if(n&&(k==='digital'||n>d.hi.length)) all='<button class="link" data-go="work:@'+k+'">See all '+n+' '+esc(SVL[k])+' projects '+GO+'</button>';
    sec.innerHTML='<div class="svx"><div class="svx-l">'+(n?'<img class="svx-ill rise" style="--d:0" alt="" src="'+IMG[k]+'">':'')+
      '<div class="kicker rise" style="--d:0"><span class="rule"></span><p class="eyebrow svx-n">'+esc(d.n)+'</p></div>'+
      '<h2 class="h2 rise" style="--d:1">'+esc(d.h)+'</h2><p class="lede rise" style="--d:2">'+esc(d.p)+'</p>'+
      '<div class="svx-good rise" style="--d:3"><span>Good for</span>'+d.good.map(function(g){return '<em>'+esc(g)+'</em>'}).join('')+'</div>'+
      '<div class="svm rise" style="--d:4"><p class="eyebrow">How we do it</p>'+d.m.map(function(m,j){return '<div style="--j:'+j+'"><i>0'+(j+1)+'</i><b>'+esc(m[0])+'</b><span>'+esc(m[1])+'</span></div>'}).join('')+'</div>'+
      '</div><div class="svx-r rise" style="--d:2">'+right+all+'</div></div>';
    sec.addEventListener('click',function(e){var c=e.target.closest('.svc-c');if(c){openItem(c.dataset.k,+c.dataset.ii,uniqKeys(svcList(k)));return}var r=e.target.closest('.rc');if(r)openCase(r.dataset.cs)});
  });

  /* our AI department */
  var AIT=[
    {t:'Image generation',s:'Key visuals, product shots and whole campaigns, made with AI.',ims:['baraka_ai_0','linas_summer_0','nexus','enaya_ai_0'],cta:'See examples',open:'baraka_ai',list:['baraka_ai','linas_summer','nexus','enaya_ai','mado_dondurma']},
    {t:'Video generation',s:'Films, animations and AI influencers, made entirely with AI.',ims:['gwaisha','mado_dondurma_0','mado_ai_0','linas_ai_0','hamleys_0'],cta:'See examples',open:'gwaisha',list:SVI.ai},
    {t:'Hybrid: real + AI',s:'We film what must be real. AI builds the world around it.',src:['assets/hybrid_hero.webp'],cta:'See the six formats',go:'ai',wide:1}
  ];
  var aidT=document.getElementById('aidTiles'), aiT=null;
  aidT.innerHTML=AIT.map(function(a,j){var srcs=a.src||a.ims.map(isrc);return '<button class="at'+(a.wide?' wide':'')+'" style="--j:'+j+'" data-j="'+j+'" aria-label="'+esc(a.t+': '+a.s)+'">'+(a.v?'<video class="on" src="'+a.v+'" poster="'+srcs[0]+'" autoplay muted loop playsinline></video>':srcs.map(function(s,i){return '<img alt=""'+(i?'':' class="on"')+' src="'+s+'">'}).join(''))+'<span class="tx"><i>0'+(j+1)+'</i><b>'+esc(a.t)+'</b><span>'+esc(a.s)+'</span><em>'+esc(a.cta)+' '+GO+'</em></span></button>'}).join('');
  function aiStop(){clearInterval(aiT);aiT=null}
  function aiPlay(){aiStop();var k=0;aiT=setInterval(function(){k++;[].forEach.call(aidT.children,function(tile,j){var ims=tile.querySelectorAll('img');if(ims.length<2)return;var n=(k+j)%ims.length;[].forEach.call(ims,function(m,i){m.classList.toggle('on',i===n)})})},3400)}
  aidT.addEventListener('click',function(e){var b=e.target.closest('.at');if(!b)return;var a=AIT[+b.dataset.j];if(a.go)goTo(a.go);else openItem(a.open,0,a.list)});
  document.getElementById('aidLogos').innerHTML=['MADO','Lina\'s & Dina\'s','Kuwait International Fair','Enaya Insurance','Baraka Dates','Mashawi'].map(function(n){var u=clLogo(n);return u?'<span><img alt="'+esc(n)+'" title="'+esc(n)+'" src="'+u+'"></span>':''}).join('');
  document.getElementById('aidAll').firstChild.textContent='See all '+SVI.ai.length+' AI projects ';

  /* what we do: the client picks what they want to see, and the tour reshapes around it */
  var ptiles=document.getElementById('ptiles'), pBtns={}, SVORD=SV.map(function(v){return v[0]});
  var SVF={brand:'branding',social:'social media',digital:'digital marketing',media:'media buying',infl:'influencers',film:'films',events:'events',mall:'mall activations',podcast:'podcasts',ai:'AI'};
  SV.forEach(function(v){var b=document.createElement('button');b.className='pt';b.style.setProperty('--c',v[2]);b.setAttribute('aria-pressed','false');
    b.innerHTML='<span class="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><img alt="" src="'+IMG[v[0]]+'"><b>'+esc(v[1])+'</b><span>'+esc(v[3])+'</span>';
    b.onclick=function(){var i=picks.indexOf(v[0]);if(i<0)picks.push(v[0]);else picks.splice(i,1);applyPicks()};ptiles.appendChild(b);pBtns[v[0]]=b});
  document.getElementById('pGo').onclick=function(e){e.stopPropagation();if(flow)cur=slideIdx('services');stepTour(1)};
  document.getElementById('pClear').onclick=function(e){e.stopPropagation();picks=[];applyPicks()};
  [].forEach.call(document.querySelectorAll('.tp'),function(f,i){f.style.setProperty('--j',i)});
  function andList(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1]}
  function applyPicks(){
    picks.sort(function(a,b){return SVORD.indexOf(a)-SVORD.indexOf(b)});
    for(var k in pBtns)pBtns[k].setAttribute('aria-pressed',picks.indexOf(k)>=0);
    ptiles.classList.toggle('some',picks.length>0);
    document.getElementById('pGoT').textContent=picks.length?(picks.length===1?'Show me this service':'Show me these '+picks.length+' services'):'Show me everything';
    document.getElementById('pClear').hidden=!picks.length;
    fillFeatured(); buildTabs(); buildNav(); applyVis();
    if(wF.children.length)setCat(wTabs()[0][0]);
    document.getElementById('pNote').innerHTML=picks.length?'Your tour is now <b>'+order.length+' slides</b>, focused on '+esc(andList(picks.map(function(k){return SVF[k]})))+'.':'Pick one or more. Or just press next to see everything.';
    var vis=svxEls.filter(isVis), ai=!picks.length||picks.indexOf('ai')>=0, tot=vis.length+(ai?1:0);
    svxEls.forEach(function(sec){var i=vis.indexOf(sec);sec.querySelector('.svx-n').textContent=SVD[sec.dataset.svc].n+(i>=0?' · '+(i+1)+' of '+tot:'')});
    document.getElementById('aidEy').textContent=ai?'Our AI department · '+tot+' of '+tot:'One more thing · Our AI department';
    document.getElementById('focusLine').hidden=!picks.length;
    document.getElementById('focusName').textContent=andList(picks.map(function(k){return SVF[k]}));
  }

  /* links: #for-Client-Name, #show=social,digital,ai (or both: #for-Client-Name&show=social,ai), #case-honda, #5 */
  var h=decodeURIComponent((location.hash||'').slice(1)), hp=h.split('&');
  var ALIAS={influencer:'infl',influencers:'infl','media-buying':'media','digital-marketing':'digital',malls:'mall',booths:'mall',activations:'mall',video:'film',photo:'film',films:'film',branding:'brand',creative:'brand',event:'events',launches:'events',podcasts:'podcast',leads:'digital',sales:'digital',launch:'events',look:'brand',store:'mall',known:'social'};
  hp.forEach(function(x){
    if(/^for-/i.test(x)){forMode=true;document.getElementById('forName').textContent=x.slice(4).replace(/[-_]+/g,' ').trim();document.getElementById('forLine').hidden=false;}
    else if(/^show=/i.test(x)){forMode=true;x.slice(5).split(/[,+ ]+/).forEach(function(s){s=s.toLowerCase();s=ALIAS[s]||s;if(SVD[s]&&picks.indexOf(s)<0)picks.push(s)})}
  });
  applyPicks();
  fit();
  if(!forMode&&!flow){
    if(/^case-/i.test(h)&&slideIdx(h)>=0){slides[0].classList.remove('is-active');cur=slideIdx(h);slides[cur].classList.add('is-active')}
    else if(/^case-/i.test(h)&&CASE[h.slice(5)]){slides[0].classList.remove('is-active');cur=slideIdx('cases');slides[cur].classList.add('is-active');setTimeout(function(){openCase(h.slice(5))},300)}
    else{var n=parseInt(h,10);if(n>1&&n<=slides.length){var k=n-1;while(k<slides.length-1&&!isVis(slides[k]))k++;slides[0].classList.remove('is-active');cur=k;slides[cur].classList.add('is-active')}}
  }
  sync(); if(!flow)onEnter(slides[cur]);
})();
