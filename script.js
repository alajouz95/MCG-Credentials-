/* ===== Results: fill these in. Use a short value like "+38%", "2.4M" or "12,000". Empty = shown as "result to add". ===== */
var RESULTS={
  gmc:   [{v:'',l:'more showroom visits'},{v:'',l:'new leads for sales'},{v:'',l:'people reached'}],
  subaru:[{v:'',l:'lift in sales'},{v:'',l:'more engagement'},{v:'',l:'online growth'}],
  alpha: [{v:'',l:'lift in sales'},{v:'',l:'more engagement'},{v:'',l:'new followers'}],
  bait:  [{v:'',l:'more engagement'},{v:'',l:'video views'},{v:'',l:'people reached'}],
  honda: [{v:'',l:'guests at the launch'},{v:'',l:'people reached'}],
  alessa:[{v:'',l:'new followers'},{v:'',l:'more engagement'}]
};
(function(){
  var stage=document.getElementById('stage'), vp=document.getElementById('vp');
  var slides=[].slice.call(stage.querySelectorAll('.slide')), cur=0, rotated=false;
  var IMG={brand:'assets/img-042.webp',social:'assets/img-021.webp',digital:'assets/img-043.webp',media:'assets/img-044.webp',infl:'assets/img-045.webp',film:'assets/img-046.webp',events:'assets/img-020.webp',mall:'assets/img-047.webp',podcast:'assets/img-048.webp',ai:'assets/img-049.webp',about:'assets/img-050.webp'};

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
  stage.addEventListener('click',function(e){var a=e.target.closest('[data-go]'); if(a){e.preventDefault();go(+a.dataset.go)}});

  /* keyboard */
  document.addEventListener('keydown',function(e){
    if(openModal){if(e.key==='Escape')closeModal();return}
    if(e.key==='Escape'){closeMenu();return}
    if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();go(cur+1)}
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(cur-1)}
    else if(e.key==='Home'){go(0)} else if(e.key==='End'){go(slides.length-1)}
  });
  /* swipe (works when the stage is turned sideways too) */
  var sx,sy,st,down=false;
  vp.addEventListener('pointerdown',function(e){down=true;sx=e.clientX;sy=e.clientY;st=Date.now()});
  vp.addEventListener('pointerup',function(e){
    if(!down||openModal) return; down=false;
    var dx=e.clientX-sx, dy=e.clientY-sy; if(rotated){var t=dx;dx=dy;dy=-t;}
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3&&Date.now()-st<900) go(cur+(dx<0?1:-1));
  });
  vp.addEventListener('pointercancel',function(){down=false});

  /* fullscreen */
  var fsB=document.getElementById('fs');
  if(!(document.fullscreenEnabled||document.webkitFullscreenEnabled)) fsB.hidden=true;
  fsB.onclick=function(){try{if(document.fullscreenElement||document.webkitFullscreenElement){(document.exitFullscreen||document.webkitExitFullscreen).call(document)}else{var el=document.documentElement,r=(el.requestFullscreen||el.webkitRequestFullscreen).call(el);if(r&&r.catch)r.catch(function(){})}}catch(e){}};

  /* modal */
  var openModal=null;
  stage.querySelectorAll('[data-open]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var m=document.getElementById(b.dataset.open);m.classList.add('on');openModal=m;m.querySelector('[data-close]').focus()}});
  function closeModal(){if(openModal){openModal.classList.remove('on');openModal=null}}
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
    if(s.classList.contains('s-clients-grid')) showSector('all');
  }

  /* goals */
  var GOALS=[
    {t:'More people should know us',k:'Awareness',c:'var(--cyan)',s:[['social','Social media','Daily content that keeps you in people’s feeds.'],['media','Media buying','Your ads on the right screens, billboards and sites.'],['infl','Influencers','Trusted voices who introduce you to their followers.']],go:7,p:'GMC Behbehani'},
    {t:'I want more sales',k:'Sales',c:'var(--orange)',s:[['digital','Digital ads','Online ads aimed at people who are ready to buy.'],['social','Social media','Content that turns followers into customers.'],['mall','Mall activations','Experiences that bring shoppers straight to you.']],go:8,p:'Subaru'},
    {t:'I’m launching something new',k:'Launch',c:'var(--pink)',s:[['events','Events & launches','A launch moment people talk about.'],['film','Film & photo','Launch videos and photos, made in-house.'],['social','Social coverage','Live coverage, so everyone sees it.']],go:11,p:'the Honda Type R launch'},
    {t:'My brand needs a fresh look',k:'Brand',c:'var(--sky)',s:[['brand','Brand creation','A name, logo, look and voice that fit you.'],['film','Film & photo','New photos and videos in your new style.'],['social','Social media','Rolling the new look out everywhere.']],go:10,p:'Bait Al Sabon'},
    {t:'I need great content, every month',k:'Content',c:'var(--orange)',s:[['social','Social media','A monthly plan, made and posted for you.'],['film','Film & photo','Regular shoots by our in-house team.'],['ai','AI content','More content, faster, at a lower cost.']],go:9,p:'Alpha Store'},
    {t:'I want to use AI',k:'AI',c:'var(--pink)',s:[['ai','AI + real shoots','Films that mix real footage with AI-built worlds.'],['digital','AI tools','Smart assistants and automations for your team.'],['about','AI training','Workshops that get your team using AI with confidence.']],go:12,p:'our AI work'}
  ];
  var gBox=document.getElementById('goals'), ans=document.getElementById('ansBody'), gBtns=[];
  function esc(x){return x.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function fillGoal(i){var g=GOALS[i];ans.innerHTML='<h3>'+esc(g.t)+'.</h3>'+g.s.map(function(r){return '<div class="svc-row"><img alt="" src="'+IMG[r[0]]+'"><div><b>'+esc(r[1])+'</b><span>'+esc(r[2])+'</span></div></div>'}).join('')+'<button class="link" data-go="'+g.go+'">See '+esc(g.p)+' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button>'}
  var gi=0;
  function pickGoal(i){gBtns.forEach(function(b,j){b.setAttribute('aria-pressed',j===i)});if(i===gi&&ans.innerHTML){return}gi=i;ans.classList.add('fade');setTimeout(function(){fillGoal(i);ans.classList.remove('fade')},200)}
  GOALS.forEach(function(g,i){var b=document.createElement('button');b.className='goal';b.style.setProperty('--c',g.c);b.innerHTML='<b>'+esc(g.t)+'</b><span>'+g.k+'</span>';b.onclick=function(){pickGoal(i)};gBox.appendChild(b);gBtns.push(b)});
  fillGoal(0); gBtns[0].setAttribute('aria-pressed','true');


  /* how we think */
  var STEPS=[
    ['Listen','We start with your business, not with ads.','What do you sell, to whom, and what is in the way? We ask the simple questions first, and we listen properly.','A one-page brief we agree on together.'],
    ['Dig','We find the one thing that matters.','We study your customers, your competitors and the market in Kuwait until we find the insight worth building on.','The insight, in one sentence.'],
    ['Idea','One big idea that works everywhere.','An idea strong enough for a billboard, a reel, a mall and an event, and simple enough to explain in one line.','Creative routes you can see, with AI previews.'],
    ['Make','Made in-house, with care.','Our own team writes, designs, films, builds and books the media, so the quality stays in one place.','Content, campaigns and events, on time.'],
    ['Grow','Measure, learn, do more of what works.','We track the numbers, explain what they mean in plain words, and put more behind what is working.','Clear reports and a plan for what comes next.']
  ];
  var SX=[110,340,584,828,1058], SY=[140,52,140,52,140];
  var stopsEl=document.getElementById('stops'), lit=document.getElementById('routeLit'), base=document.getElementById('routeBase'), runner=document.getElementById('runner'), td=document.querySelector('.think-detail');
  var L=base.getTotalLength(), stopLen=SX.map(function(x,i){var best=0,bd=1e9;for(var l=0;l<=L;l+=2){var p=base.getPointAtLength(l),d=(p.x-x)*(p.x-x)+(p.y-SY[i])*(p.y-SY[i]);if(d<bd){bd=d;best=l}}return best});
  lit.style.strokeDasharray=L; lit.style.strokeDashoffset=L;
  var sBtns=STEPS.map(function(s,i){var b=document.createElement('button');b.className='stop'+(i%2?' up':'');b.style.left=(SX[i]/1168*100)+'%';b.style.top=(SY[i]/200*100)+'%';b.innerHTML='<span class="dot">'+(i+1)+'</span><span class="lbl">'+s[0]+'</span>';b.setAttribute('aria-label','Step '+(i+1)+': '+s[0]);b.onclick=function(){stopAuto();setStep(i)};stopsEl.appendChild(b);return b});
  var step=-1, runLen=stopLen[0], raf=null, autoT=null;
  function moveRunner(to){cancelAnimationFrame(raf);var from=runLen,t0=null,dur=1100;function f(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/dur),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;runLen=from+(to-from)*e;var p=base.getPointAtLength(runLen);runner.setAttribute('cx',p.x);runner.setAttribute('cy',p.y);if(k<1)raf=requestAnimationFrame(f)}raf=requestAnimationFrame(f)}
  function setStep(i){
    var first=step<0; step=i;
    sBtns.forEach(function(b,j){b.classList.toggle('on',j===i);b.classList.toggle('done',j<i)});
    lit.style.strokeDashoffset=L-stopLen[i]; moveRunner(stopLen[i]);
    var s=STEPS[i]; td.classList.add('fade');
    setTimeout(function(){document.getElementById('tNum').textContent='0'+(i+1);document.getElementById('tHead').textContent=s[1];document.getElementById('tBody').textContent=s[2];document.getElementById('tGet').textContent=s[3];td.classList.remove('fade')},first?0:220);
  }
  function stopAuto(){clearInterval(autoT);autoT=null}
  function playThink(){stopAuto();lit.style.transition='none';lit.style.strokeDashoffset=L;runLen=0;lit.getBoundingClientRect();lit.style.transition='';setStep(0);var i=0;autoT=setInterval(function(){i++;if(i>=STEPS.length){stopAuto();return}setStep(i)},3400)}
  document.getElementById('replay').onclick=function(){playThink()};
  setStep(0);

  /* who we work with */
  var CL=[{"n":"Honda","s":"A","u":"assets/img-051.webp"},{"n":"Honda Marine","s":"A","u":"assets/img-052.webp"},{"n":"Honda Alghanim","s":"A","u":"assets/img-053.webp"},{"n":"Honda Alghanim Motorcycles","s":"A","u":"assets/img-054.webp"},{"n":"Lotus Alghanim","s":"A","u":"assets/img-055.webp"},{"n":"GMC","s":"A","u":"assets/img-056.webp"},{"n":"Subaru","s":"A","u":"assets/img-057.webp"},{"n":"Caltex","s":"A","u":"assets/img-058.webp"},{"n":"Livan","s":"A","u":"assets/img-059.webp"},{"n":"Geely","s":"A","u":"assets/img-060.webp"},{"n":"BYD Alghanim","s":"A","u":"assets/img-061.webp"},{"n":"Mitsubishi","s":"A","u":"assets/img-062.webp"},{"n":"GWM","s":"A","u":"assets/img-063.webp"},{"n":"Pirelli","s":"A","u":"assets/img-064.webp"},{"n":"CFMOTO","s":"A","u":"assets/img-065.webp"},{"n":"Automall","s":"A","u":"assets/img-066.webp"},{"n":"Ali Alghanim & Sons Automotive","s":"A","u":"assets/img-067.webp"},{"n":"ACDelco","s":"A","u":"assets/img-068.webp"},{"n":"VGV","s":"A","u":"assets/img-069.webp"},{"n":"Isuzu","s":"A","u":"assets/img-070.webp"},{"n":"Zayani","s":"A","u":"assets/img-071.webp"},{"n":"Kuwait Motor Town","s":"A","u":"assets/img-072.webp"},{"n":"motorgy","s":"A","u":"assets/img-073.webp"},{"n":"Mercedes-Benz","s":"A","u":"assets/img-074.webp"},{"n":"Haval","s":"A","u":"assets/img-075.webp"},{"n":"Soueast","s":"A","u":"assets/img-076.webp"},{"n":"Riddara","s":"A","u":"assets/img-077.webp"},{"n":"Enaya Insurance","s":"F","u":"assets/img-078.webp"},{"n":"International Financial Advisors","s":"F","u":"assets/img-079.webp"},{"n":"Kuwait Investment Company","s":"F","u":"assets/img-080.webp"},{"n":"Al-Deera Holding","s":"F","u":"assets/img-081.webp"},{"n":"Union of Investment Companies","s":"F","u":"assets/img-082.webp"},{"n":"Beyout Investment Group","s":"F","u":"assets/img-083.webp"},{"n":"KFH Capital","s":"F","u":"assets/img-084.webp"},{"n":"KFH Trade","s":"F","u":"assets/img-085.webp"},{"n":"KFH Brokerage","s":"F","u":"assets/img-086.webp"},{"n":"KFH","s":"F","u":"assets/img-087.webp"},{"n":"Gulf Insurance Group","s":"F","u":"assets/img-088.webp"},{"n":"Commercial Facilities","s":"F","u":"assets/img-089.webp"},{"n":"Al Muzaini Exchange","s":"F","u":"assets/img-090.webp"},{"n":"Kuwait Credit Bank","s":"F","u":"assets/img-091.webp"},{"n":"Real Estate House","s":"R","u":"assets/img-092.webp"},{"n":"Wafra Real Estate","s":"R","u":"assets/img-093.webp"},{"n":"Kuwait International Fair","s":"R","u":"assets/img-094.webp"},{"n":"Al Tasheelat Real Estate","s":"R","u":"assets/img-095.webp"},{"n":"Souq Al Mubarakiya","s":"R","u":"assets/img-096.webp"},{"n":"Al Bustan","s":"R","u":"assets/img-097.webp"},{"n":"Souq Sharq","s":"R","u":"assets/img-098.webp"},{"n":"IFA Hotels & Resorts","s":"H","u":"assets/img-099.webp"},{"n":"Venue 56","s":"H","u":"assets/img-100.webp"},{"n":"Kuwait Airways","s":"H","u":"assets/img-101.webp"},{"n":"Lina's & Dina's","s":"H","u":"assets/img-102.webp"},{"n":"Holiday Inn","s":"H","u":"assets/img-103.webp"},{"n":"Mashawi","s":"H","u":"assets/img-104.webp"},{"n":"Baraka Dates","s":"H","u":"assets/img-105.webp"},{"n":"MADO","s":"H","u":"assets/img-106.webp"},{"n":"MADO Dondurma","s":"H","u":"assets/img-107.webp"},{"n":"Sheesh Othman","s":"H","u":"assets/img-108.webp"},{"n":"NOON","s":"H","u":"assets/img-109.webp"},{"n":"Crowne Plaza","s":"H","u":"assets/img-110.webp"},{"n":"Microsoft","s":"T","u":"assets/img-111.webp"},{"n":"Huawei","s":"T","u":"assets/img-112.webp"},{"n":"Behbehani","s":"T","u":"assets/img-113.webp"},{"n":"Dakheel Aljassar","s":"T","u":"assets/img-114.webp"},{"n":"atlasblue","s":"T","u":"assets/img-115.webp"},{"n":"Adel Behbehani General Trading","s":"T","u":"assets/img-116.webp"},{"n":"Behbehani Watch World","s":"T","u":"assets/img-117.webp"},{"n":"Behbehani Prestige","s":"T","u":"assets/img-118.webp"},{"n":"Images","s":"T","u":"assets/img-119.webp"},{"n":"Gulf Palms","s":"T","u":"assets/img-120.webp"},{"n":"Kefan Optics","s":"T","u":"assets/img-121.webp"},{"n":"Alpha Store","s":"T","u":"assets/img-122.webp"},{"n":"Astro Group","s":"T","u":"assets/img-123.webp"},{"n":"Astro Power Cables","s":"T","u":"assets/img-124.webp"},{"n":"Johnson & Johnson","s":"T","u":"assets/img-125.webp"},{"n":"CityStar","s":"T","u":"assets/img-126.webp"},{"n":"Superdry","s":"T","u":"assets/img-127.webp"},{"n":"House of Soap","s":"T","u":"assets/img-128.webp"},{"n":"The Face Shop","s":"T","u":"assets/img-129.webp"},{"n":"Salem Al-Ali Informatics Award","s":"P","u":"assets/img-130.webp"},{"n":"Capital Markets Authority","s":"P","u":"assets/img-131.webp"},{"n":"Kuwait Financial Intelligence Unit","s":"P","u":"assets/img-132.webp"},{"n":"Children's Cancer Center Lebanon","s":"P","u":"assets/img-133.webp"},{"n":"Kuwait English School","s":"P","u":"assets/img-134.webp"},{"n":"MKASC","s":"P","u":"assets/img-135.webp"},{"n":"Box Hill College Kuwait","s":"P","u":"assets/img-136.webp"},{"n":"Kuwait Society for Persons with Disability","s":"P","u":"assets/img-137.webp"}];
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

  /* "prepared for" from the link, e.g. #for-Alghanim-Industries */
  var h=decodeURIComponent((location.hash||'').slice(1));
  if(/^for-/i.test(h)){forMode=true;document.getElementById('forName').textContent=h.slice(4).replace(/[-_]+/g,' ').trim();document.getElementById('forLine').hidden=false;}
  else{var n=parseInt(h,10);if(n>1&&n<=slides.length){slides[0].classList.remove('is-active');cur=n-1;slides[cur].classList.add('is-active')}}
  sync(); onEnter(slides[cur]);
})();
