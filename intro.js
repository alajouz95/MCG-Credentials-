/* MCG intro: scroll to turn a spark into the MCG logo, then dive into the credentials.
   Plays on plain visits (thisismcg.com). Links with a #hash, ?nointro, or reduced motion skip it. */
(function(){
  var H=document.documentElement;
  if(!H.classList.contains('intro'))return;
  var box=document.getElementById('intro'), cv=document.getElementById('inCv'), ctx=cv.getContext('2d');
  var T=[0,1,2,3,4].map(function(i){return document.getElementById('inT'+i)}), hint=document.getElementById('inHint'), bar=document.getElementById('inBar');
  var coarse=window.matchMedia&&matchMedia('(pointer:coarse)').matches;
  document.getElementById('inHintTx').textContent=coarse?'Swipe up':'Scroll';

  /* the story, as scroll progress from 0 to 1 */
  var P1=.30, P2=.36, P3=.60, P4=.80;               /* boom, burst peak, logo formed, dive */
  var COL=['#FFFFFF','#1FA7E0','#E94C97','#F29123'];  /* white, blue, pink, orange */
  var NAVY='7,22,48';

  var W,Hh,DPR,N,diag,cx,cy,LW,LH,sprites=[];
  var a0,r0,dl,spd,sw,ba,br,sz,fc,tu,tv,tc,jit;      /* per-particle values */
  var dots=[[0,0],[0,0],[0,0]], logoReady=false, logoImg=new Image();

  function sprite(c){var s=document.createElement('canvas'),n=32;s.width=s.height=n;var g=s.getContext('2d'),r=g.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);r.addColorStop(0,'#fff');r.addColorStop(.18,c);r.addColorStop(.45,c+'55');r.addColorStop(1,c+'00');g.fillStyle=r;g.fillRect(0,0,n,n);return s}
  COL.forEach(function(c){sprites.push(sprite(c))});

  function rnd(i,k){var x=Math.sin(i*127.1+k*311.7)*43758.5453;return x-Math.floor(x)}
  function setup(){
    W=window.innerWidth;Hh=window.innerHeight;DPR=Math.min(2,window.devicePixelRatio||1);
    cv.width=Math.round(W*DPR);cv.height=Math.round(Hh*DPR);
    diag=Math.sqrt(W*W+Hh*Hh);cx=W/2;cy=Hh*.44;
    LW=Math.min(W*.8,620);LH=LW*236/600;
    var n=Math.round(Math.min(3200,Math.max(1400,W*Hh/220)));
    if(n!==N){N=n;
      a0=new Float32Array(N);r0=new Float32Array(N);dl=new Float32Array(N);spd=new Float32Array(N);sw=new Float32Array(N);ba=new Float32Array(N);br=new Float32Array(N);sz=new Float32Array(N);fc=new Uint8Array(N);tu=new Float32Array(N);tv=new Float32Array(N);tc=new Uint8Array(N);jit=new Float32Array(N);
      for(var i=0;i<N;i++){a0[i]=rnd(i,1)*6.2832;r0[i]=.18+Math.pow(rnd(i,2),.6)*.62;dl[i]=rnd(i,3);spd[i]=.4+rnd(i,4);sw[i]=rnd(i,5)<.5?-1:1;ba[i]=rnd(i,6)*6.2832;br[i]=.22+Math.pow(rnd(i,7),.7)*.75;sz[i]=.8+rnd(i,8)*1.6;var f=rnd(i,9);fc[i]=f<.36?3:f<.7?2:1;jit[i]=rnd(i,10)*6.2832;tu[i]=rnd(i,11);tv[i]=rnd(i,12);tc[i]=0}
      logoReady=false;
    }
    if(logoImg.complete&&logoImg.naturalWidth)sampleLogo();
    var lb=cy+LH/2;
    T[2].style.top=T[3].style.top=(lb+Math.max(26,Hh*.04))+'px';
    T[1].style.top=Math.max(60,cy-LH/2-Hh*.16)+'px';
  }
  /* read the logo's pixels: white letters, plus the blue, pink and orange dots */
  function sampleLogo(){
    var w=300,h=Math.round(w*236/600),c=document.createElement('canvas');c.width=w;c.height=h;var g=c.getContext('2d');g.drawImage(logoImg,0,0,w,h);
    var d;try{d=g.getImageData(0,0,w,h).data}catch(e){return}
    var pts=[],cols=[],acc=[[0,0,0],[0,0,0],[0,0,0]];
    for(var y=0;y<h;y+=1)for(var x=0;x<w;x+=1){var k=(y*w+x)*4;if(d[k+3]<150)continue;var r=d[k],gg=d[k+1],b=d[k+2],ci=0;
      if(Math.min(r,gg,b)<190){if(b>r+30)ci=1;else if(b>90&&r>150)ci=2;else if(r>150)ci=3}
      if(ci===0&&(x%2||y%2))continue;           /* keep every colour pixel, thin the white ones */
      pts.push(x/w,y/h);cols.push(ci);if(ci){acc[ci-1][0]+=x/w;acc[ci-1][1]+=y/h;acc[ci-1][2]++}}
    var m=cols.length;if(!m)return;
    for(var i=0;i<N;i++){var j=(i*7919)%m;tu[i]=pts[j*2];tv[i]=pts[j*2+1];tc[i]=cols[j]}
    /* make sure each coloured dot gets plenty of particles */
    var per=Math.round(N*.035);[1,2,3].forEach(function(ci,q){var list=[];for(var j=0;j<m;j++)if(cols[j]===ci)list.push(j);if(!list.length)return;for(var k=0;k<per;k++){var i=(N-1)-(q*per+k);var jj=list[k%list.length];tu[i]=pts[jj*2]+(rnd(i,14)-.5)*.004;tv[i]=pts[jj*2+1]+(rnd(i,15)-.5)*.01;tc[i]=ci}});
    acc.forEach(function(a,q){if(a[2])dots[q]=[a[0]/a[2],a[1]/a[2]]});
    logoReady=true;
  }
  logoImg.onload=function(){setup()};
  logoImg.src=box.dataset.logo;
  setup();
  window.addEventListener('resize',setup);

  function cl(x){return x<0?0:x>1?1:x}
  function eio(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
  function win(p,a,b,c,d){return p<a||p>d?0:p<b?(p-a)/(b-a):p<=c?1:(d-p)/(d-c)}

  var target=0,p=0,last=performance.now(),boomed=false,done=false,t0=last;
  box.scrollTop=0;
  box.addEventListener('scroll',function(){var m=box.scrollHeight-box.clientHeight;target=m>0?cl(box.scrollTop/m):0},{passive:true});
  try{box.focus({preventScroll:true})}catch(e){}

  function finish(){
    if(done)return;done=true;H.classList.add('intro-out');
    setTimeout(function(){H.classList.remove('intro','intro-out');if(box.parentNode)box.parentNode.removeChild(box);try{window.dispatchEvent(new Event('mcg:introdone'))}catch(e){}},700);
  }
  document.getElementById('inSkip').addEventListener('click',finish);

  function frame(now){
    if(done&&!H.classList.contains('intro'))return;
    var dt=Math.max(0,Math.min(64,now-last));last=now;var time=Math.max(0,(now-t0)/1000);
    p+=(target-p)*(1-Math.pow(1-.085,dt/16.7));if(Math.abs(target-p)<.0004)p=target;
    if(!boomed&&p>=P1){boomed=true;if(navigator.vibrate)try{navigator.vibrate([18,30,40])}catch(e){}}
    if(p<P1-.02)boomed=false;
    if(target>=.995&&p>=.975)finish();

    var trail=p<P1?.42:p<P2+.04?.2:p<P3?.3:p<P4?.5:.24;
    ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalCompositeOperation='source-over';
    ctx.fillStyle='rgba('+NAVY+','+trail+')';ctx.fillRect(0,0,W,Hh);

    /* a little shake just before the boom */
    var sh=p>P1-.06&&p<P1?((p-(P1-.06))/.06)*7:0;if(sh){ctx.translate((Math.random()-.5)*sh,(Math.random()-.5)*sh)}
    ctx.globalCompositeOperation='lighter';

    var lx=cx-LW/2,ly=cy-LH/2, R=diag*.5, i,x,y,s,c,al;
    /* the dive zooms into the pink dot */
    var k=p>P4?cl((p-P4)/(1-P4)):0, Z=1+Math.pow(k,2.4)*70, fx=lx+dots[1][0]*LW, fy=ly+dots[1][1]*LH;

    for(i=0;i<N;i++){
      var tx=lx+tu[i]*LW, ty=ly+tv[i]*LH, ci=fc[i]; s=sz[i]; al=1;
      if(p<P1){                                   /* charge: dust spirals into the spark */
        var q=p/P1, ti=cl((q-dl[i]*.55)/.45), e=ti*ti, ang=a0[i]+time*.06*spd[i]*sw[i]+e*6*sw[i], rad=r0[i]*R*(1-e);
        x=cx+Math.cos(ang)*rad; y=cy+Math.sin(ang)*rad*.92; al=(.16+.6*e)*(rad<6?rad/6:1); s*=.8+e*.5;
      }else if(p<P2){                             /* boom */
        var b=(p-P1)/(P2-P1), eb=1-Math.pow(1-b,4);
        x=cx+Math.cos(ba[i])*br[i]*R*eb; y=cy+Math.sin(ba[i])*br[i]*R*eb; s*=1.25;
      }else{
        var bx=cx+Math.cos(ba[i])*br[i]*R, by=cy+Math.sin(ba[i])*br[i]*R;
        if(p<P3){                                 /* the pieces fly into the logo */
          var t=cl(((p-P2)/(P3-P2)-dl[i]*.35)/.65), et=eio(t), dx=tx-bx, dy=ty-by, cu=Math.sin(Math.PI*t)*.28*sw[i];
          x=bx+dx*et-dy*cu; y=by+dy*et+dx*cu;
          if(tc[i]===0){if(t>.45+jit[i]*.07)ci=0}else if(t>.35)ci=tc[i];
          s*=1.15-.35*et;
        }else{                                    /* the logo, breathing */
          ci=tc[i];x=tx+Math.sin(time*1.7+jit[i])*.5;y=ty+Math.cos(time*1.3+jit[i])*.5;s*=.8;
          if(k>0){var px=fx+(x-fx)*Z, py=fy+(y-fy)*Z, qx=fx+(x-fx)*Z*.82, qy=fy+(y-fy)*Z*.82;
            if((px<-40||px>W+40||py<-40||py>Hh+40)&&(qx<-40||qx>W+40||qy<-40||qy>Hh+40))continue;
            ctx.strokeStyle=COL[ci];ctx.globalAlpha=.55;ctx.lineWidth=Math.max(.6,s*Math.min(3,Z/8));ctx.beginPath();ctx.moveTo(qx,qy);ctx.lineTo(px,py);ctx.stroke();ctx.globalAlpha=1;x=px;y=py;s*=Math.min(6,1+Z/12)}
        }
      }
      var r=s*2.6;ctx.globalAlpha=al;ctx.drawImage(sprites[ci],x-r,y-r,r*2,r*2);
    }
    ctx.globalAlpha=1;

    /* the spark */
    if(p<P1){var q2=p/P1, cr=3+30*Math.pow(q2,2.2)+Math.sin(time*3.2)*(1+q2*3), hue=['242,145,35','233,76,151','31,167,224'][((Math.floor(time*1.5+q2*6)%3)+3)%3];
      var g=ctx.createRadialGradient(cx,cy,0,cx,cy,cr*4.5);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.18,'rgba(255,255,255,.95)');g.addColorStop(.32,'rgba('+hue+',.75)');g.addColorStop(1,'rgba('+hue+',0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,cr*4.5,0,6.2832);ctx.fill()}
    /* shockwave and flash */
    if(p>=P1&&p<P2+.05){var b2=cl((p-P1)/(P2+.05-P1)), rr=(1-Math.pow(1-b2,3))*diag*.75;
      ctx.strokeStyle='rgba(255,255,255,'+(.7*(1-b2))+')';ctx.lineWidth=2+18*(1-b2);ctx.beginPath();ctx.arc(cx,cy,rr,0,6.2832);ctx.stroke();
      ctx.strokeStyle='rgba(233,76,151,'+(.5*(1-b2))+')';ctx.lineWidth=6*(1-b2)+1;ctx.beginPath();ctx.arc(cx,cy,rr*.82,0,6.2832);ctx.stroke();
      var fl=cl(1-(p-P1)/.03);if(fl>0){ctx.globalCompositeOperation='source-over';ctx.fillStyle='rgba(255,255,255,'+(.7*fl)+')';ctx.fillRect(-20,-20,W+40,Hh+40);ctx.globalCompositeOperation='lighter'}}
    /* while the logo holds: rings grow out of the three dots */
    if(p>=P3&&p<P4+.04){var hw=win(p,P3,P3+.03,P4-.02,P4+.04);for(var dq=0;dq<3;dq++){var dx2=lx+dots[dq][0]*LW,dy2=ly+dots[dq][1]*LH;for(var rg=0;rg<2;rg++){var ph=((time*.55+dq*.33+rg*.5)%1);ctx.strokeStyle='rgba('+['31,167,224','233,76,151','242,145,35'][dq]+','+(hw*.55*(1-ph))+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(dx2,dy2,6+ph*LW*.22,0,6.2832);ctx.stroke()}}}
    /* once the pieces land, the real logo fades in underneath so it reads sharp */
    if(p>P3-.05&&logoImg.complete&&logoImg.naturalWidth){var la=cl((p-(P3-.05))/.06)*(k>0?cl(1-k*3.2):1);if(la>0){ctx.globalCompositeOperation='source-over';ctx.globalAlpha=la*.92;
      if(k>0){ctx.save();ctx.translate(fx,fy);ctx.scale(Z,Z);ctx.drawImage(logoImg,lx-fx,ly-fy,LW,LH);ctx.restore()}else ctx.drawImage(logoImg,lx,ly,LW,LH);
      ctx.globalAlpha=1;ctx.globalCompositeOperation='lighter'}}
    /* the portal: the pink dot opens up into the credentials */
    if(k>.25){var pr=Math.pow((k-.25)/.75,2.2)*diag*1.15+6;ctx.globalCompositeOperation='source-over';
      var pg=ctx.createRadialGradient(fx,fy,pr*.55,fx,fy,pr);pg.addColorStop(0,'rgba(8,26,53,1)');pg.addColorStop(.7,'rgba(233,76,151,.9)');pg.addColorStop(.86,'rgba(242,145,35,.6)');pg.addColorStop(1,'rgba(31,167,224,0)');
      ctx.fillStyle=pg;ctx.beginPath();ctx.arc(fx,fy,pr,0,6.2832);ctx.fill()}
    ctx.setTransform(1,0,0,1,0,0);

    /* words */
    var ws=[win(p,-1,0,.07,.12),win(p,.13,.17,.25,.29),win(p,.46,.5,.58,.62),win(p,.63,.67,.77,.8),win(p,.86,.89,.94,.97)];
    for(var w=0;w<5;w++){var o=ws[w];T[w].style.opacity=o;T[w].style.transform='translateY('+((1-o)*14)+'px)';T[w].style.visibility=o>0?'visible':'hidden'}
    hint.style.opacity=cl(1-target*30);
    bar.style.transform='scaleX('+p+')';
    box.style.opacity=k>.88?cl(1-(k-.88)/.12):'';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
