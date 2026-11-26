/* MCG AI Readiness Assessment: interface */
(function () {
  var COPY = window.MCG_COPY, SC = window.MCGScoring;
  var lang = /[?&]lang=ar\b/.test(location.search) ? 'ar' : 'en';
  var st = { screen: 'start', track: null, qi: 0, answers: [], res: null, lock: false };
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function C() { return COPY[lang]; }
  function T() { return C()[st.track]; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function get(o, p) { return p.split('.').reduce(function (a, k) { return a && a[k]; }, o); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- language ---------- */
  function applyStatic() {
    var h = document.documentElement; h.lang = lang; h.dir = C().dir;
    [].forEach.call(document.querySelectorAll('[data-t]'), function (el) { var v = get(C().ui, el.dataset.t); if (typeof v === 'string') el.textContent = v; });
    document.title = C().ui.title + ' · MCG AI';
  }
  $('lang').addEventListener('click', function () {
    lang = lang === 'en' ? 'ar' : 'en'; applyStatic();
    if (st.screen === 'quiz') renderQ(false); else if (st.screen === 'res') renderRes(false);
  });

  /* ---------- screens ---------- */
  function show(name) {
    $('sStart').hidden = name !== 'start'; $('sQuiz').hidden = name !== 'quiz'; $('sRes').hidden = name !== 'res';
    st.screen = name; $('restart').hidden = name === 'start';
    window.scrollTo(0, 0);
  }
  function reset() { st = { screen: 'start', track: null, qi: 0, answers: [], res: null, lock: false }; show('start'); }
  $('restart').addEventListener('click', reset);
  $('rRestart').addEventListener('click', reset);
  [].forEach.call(document.querySelectorAll('.track'), function (b) {
    b.addEventListener('click', function () { st.track = b.dataset.track; st.qi = 0; st.answers = []; st.res = null; show('quiz'); renderQ(true); });
  });

  /* ---------- questions ---------- */
  function flat() { var out = []; T().dims.forEach(function (d, di) { d.qs.forEach(function (q) { out.push({ dim: di, q: q }); }); }); return out; }
  function sizes() { return T().dims.map(function (d) { return d.qs.length; }); }
  function renderQ(anim) {
    var qs = flat(), it = qs[st.qi], d = T().dims[it.dim], n = qs.length;
    $('qDim').innerHTML = '<span dir="ltr">' + pad(it.dim + 1) + ' / ' + pad(T().dims.length) + '</span> · ' + esc(d.name);
    $('qCount').textContent = C().ui.questionOf(st.qi + 1, n);
    $('qBar').style.width = (st.qi / n * 100) + '%';
    var acc = 0, tk = ''; sizes().slice(0, -1).forEach(function (s) { acc += s; tk += '<b style="inset-inline-start:' + (acc / n * 100) + '%"></b>'; }); $('qTicks').innerHTML = tk;
    $('qText').textContent = it.q.q;
    $('qAns').innerHTML = it.q.a.map(function (a, i) {
      return '<button class="ans' + (st.answers[st.qi] === i ? ' sel' : '') + '" type="button" data-i="' + i + '"><span class="k mono">' + (i + 1) + '</span><span class="t">' + esc(a) + '</span></button>';
    }).join('');
    if (anim) { var b = $('qBody'); b.classList.remove('in'); void b.offsetWidth; b.classList.add('in'); }
  }
  function swap(fn) {
    var b = $('qBody');
    if (reduce) { fn(); st.lock = false; return; }
    b.classList.remove('in'); b.classList.add('out');
    setTimeout(function () { fn(); b.classList.remove('out'); void b.offsetWidth; b.classList.add('in'); st.lock = false; }, 190);
  }
  function choose(i) {
    if (st.lock || st.screen !== 'quiz') return; st.lock = true;
    var n = flat().length; st.answers[st.qi] = i;
    [].forEach.call($('qAns').children, function (b, j) { b.classList.toggle('sel', j === i); });
    $('qBar').style.width = ((st.qi + 1) / n * 100) + '%';
    setTimeout(function () {
      if (st.qi < n - 1) swap(function () { st.qi++; renderQ(false); });
      else finish();
    }, reduce ? 120 : 360);
  }
  function back() {
    if (st.lock) return;
    if (st.qi === 0) { reset(); return; }
    st.lock = true; swap(function () { st.qi--; renderQ(false); });
  }
  $('qAns').addEventListener('click', function (e) { var b = e.target.closest('.ans'); if (b) choose(+b.dataset.i); });
  $('qBack').addEventListener('click', back);
  document.addEventListener('keydown', function (e) {
    if (st.screen !== 'quiz' || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = { '1': 0, '2': 1, '3': 2, '4': 3, '١': 0, '٢': 1, '٣': 2, '٤': 3 }[e.key];
    if (k !== undefined) { e.preventDefault(); choose(k); }
    else if (e.key === 'Backspace') { e.preventDefault(); back(); }
  });

  /* ---------- results ---------- */
  function finish() {
    st.res = SC.scoreAssessment(sizes(), st.answers);
    show('res'); renderRes(true); st.lock = false;
  }
  function wrap2(s) {
    if (s.length < 15) return [s];
    var w = s.split(' '), best = [s], diff = 1e9;
    for (var i = 1; i < w.length; i++) { var a = w.slice(0, i).join(' '), b = w.slice(i).join(' '), d = Math.abs(a.length - b.length); if (d < diff) { diff = d; best = [a, b]; } }
    return best;
  }
  function radar(dims, scores) {
    var cx = 180, cy = 168, R = 104, n = dims.length, h = '';
    function pt(i, r) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; }
    [25, 50, 75, 100].forEach(function (g) { h += '<polygon class="gridl" points="' + dims.map(function (_, i) { return pt(i, R * g / 100).join(','); }).join(' ') + '"/>'; });
    dims.forEach(function (_, i) { var p = pt(i, R); h += '<line class="axis" x1="' + cx + '" y1="' + cy + '" x2="' + p[0] + '" y2="' + p[1] + '"/>'; });
    var poly = scores.map(function (s, i) { return pt(i, R * Math.max(s, 3) / 100).join(','); }).join(' ');
    h += '<polygon class="shape" id="rShape" points="' + poly + '"/>';
    scores.forEach(function (s, i) { var p = pt(i, R * Math.max(s, 3) / 100); h += '<circle class="pt" cx="' + p[0] + '" cy="' + p[1] + '" r="3.2"/>'; });
    dims.forEach(function (d, i) {
      var p = pt(i, R + 20), a = -Math.PI / 2 + i * 2 * Math.PI / n, c = Math.cos(a), anc = c > .3 ? 'start' : c < -.3 ? 'end' : 'middle';
      var lines = wrap2(d.name), y0 = p[1] + (Math.sin(a) < -.5 ? -(lines.length) * 13 : Math.sin(a) > .5 ? 8 : -(lines.length - 1) * 6);
      h += '<text text-anchor="' + anc + '" x="' + p[0] + '" y="' + y0 + '">' + lines.map(function (l, j) { return '<tspan x="' + p[0] + '" dy="' + (j ? 13 : 0) + '">' + esc(l) + '</tspan>'; }).join('') + '<tspan class="val" x="' + p[0] + '" dy="14">' + scores[i] + '</tspan></text>';
    });
    return h;
  }
  function renderRes(anim) {
    var u = C().ui, t = T(), r = st.res, lv = t.levels[r.level];
    $('rKicker').textContent = u.resultsKicker + ' · ' + u[st.track].title;
    $('rLevel').textContent = lv.name; $('rDesc').textContent = lv.desc;
    $('rScale').innerHTML = t.levels.map(function (l, i) { return '<span class="' + (i === r.level ? 'on' : '') + '">' + esc(l.name) + '</span>'; }).join('');
    /* ring and count-up */
    var arc = $('rArc'), target = 326.73 * (1 - r.overall / 100);
    if (anim && !reduce) {
      arc.style.transition = 'none'; arc.style.strokeDashoffset = 326.73; void arc.getBoundingClientRect(); arc.style.transition = '';
      requestAnimationFrame(function () { arc.style.strokeDashoffset = target; });
      var t0 = null; (function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1400), e = 1 - Math.pow(1 - p, 3); $('rScore').textContent = Math.round(r.overall * e); if (p < 1) requestAnimationFrame(step); })(performance.now());
    } else { arc.style.strokeDashoffset = target; $('rScore').textContent = r.overall; }
    /* bars */
    $('rBars').innerHTML = t.dims.map(function (d, i) { return '<div class="bar"><div class="row"><span>' + esc(d.name) + '</span><span>' + r.dims[i].score + '</span></div><div class="tr"><i style="width:' + (anim && !reduce ? 0 : r.dims[i].score) + '%"></i></div></div>'; }).join('');
    if (anim && !reduce) setTimeout(function () { [].forEach.call($('rBars').querySelectorAll('.tr i'), function (el, i) { el.style.transitionDelay = (i * .08) + 's'; el.style.width = r.dims[i].score + '%'; }); }, 60);
    /* radar */
    var svg = $('rRadar'); svg.setAttribute('direction', 'ltr'); svg.setAttribute('aria-label', u.shape);
    svg.innerHTML = radar(t.dims, r.dims.map(function (d) { return d.score; }));
    if (anim && !reduce) { var sh = $('rShape'); sh.style.transform = 'scale(.2)'; sh.style.opacity = '0'; requestAnimationFrame(function () { requestAnimationFrame(function () { sh.style.transform = 'scale(1)'; sh.style.opacity = '1'; }); }); }
    /* recommendations: weakest first */
    $('recTitle').textContent = u.recTitle[st.track];
    $('rRecs').innerHTML = r.order.map(function (di, k) {
      var d = t.dims[di], s = r.dims[di];
      return '<li class="rec"><span class="n">' + pad(k + 1) + '</span><div><div class="meta"><b>' + esc(d.name) + '</b><span class="sc" dir="ltr">' + s.score + ' / 100</span><span class="mono tier t-' + s.tier + '">' + esc(u.tiers[s.tier]) + '</span></div><p>' + esc(t.recs[d.key][s.tier]) + '</p></div></li>';
    }).join('');
    $('rMoves').innerHTML = t.moves[r.level].map(function (m, i) { return '<div class="mv br"><span class="mono">' + pad(i + 1) + '</span><p>' + esc(m) + '</p></div>'; }).join('');
    $('talkTitle').innerHTML = esc(u.talkTitle).replace('{logo}', '<img class="lg" src="../assets/logo_white.webp" alt="MCG">');
    $('rNote').textContent = u.note.all + (st.track === 'business' ? u.note.business : '');
  }

  /* ---------- unattended: back to the start after 150 seconds without a touch or key ---------- */
  var last = Date.now();
  ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach(function (ev) { window.addEventListener(ev, function () { last = Date.now(); }, { passive: true }); });
  var toastT;
  function toast(msg) { var el = $('toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2600); }
  setInterval(function () { if (st.screen !== 'start' && Date.now() - last > 150000) { reset(); toast(C().ui.idle); last = Date.now(); } }, 1000);

  /* ---------- background: nodes joined by right-angled lines, with signals travelling along them ---------- */
  (function () {
    var cv = $('bg'), ctx = cv.getContext('2d'), W, H, D, edges = [], nodes = [], sig = [];
    function build() {
      W = innerWidth; H = innerHeight; D = Math.min(2, devicePixelRatio || 1); cv.width = W * D; cv.height = H * D;
      var cell = Math.max(90, Math.min(160, W / 11)), cols = Math.ceil(W / cell) + 1, rows = Math.ceil(H / cell) + 1; nodes = []; edges = [];
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) if (Math.random() < .42) nodes.push({ x: Math.round(c * cell + Math.random() * cell * .6), y: Math.round(r * cell + Math.random() * cell * .6) });
      nodes.forEach(function (a, i) {
        var near = nodes.map(function (b, j) { return { j: j, d: Math.abs(a.x - b.x) + Math.abs(a.y - b.y) }; }).filter(function (o) { return o.j !== i && o.d < cell * 2.3; }).sort(function (p, q) { return p.d - q.d; }).slice(0, Math.random() < .5 ? 1 : 2);
        near.forEach(function (o) { if (o.j < i) return; var b = nodes[o.j], m = Math.random() < .5 ? { x: b.x, y: a.y } : { x: a.x, y: b.y }, pts = [a, m, b], len = 0; for (var k = 1; k < 3; k++) len += Math.abs(pts[k].x - pts[k - 1].x) + Math.abs(pts[k].y - pts[k - 1].y); if (len > 0) edges.push({ p: pts, len: len }); });
      });
      sig = []; for (var s = 0; s < Math.min(16, edges.length); s++) sig.push(newSig());
    }
    function newSig() { return { e: Math.floor(Math.random() * edges.length), t: 0, v: 50 + Math.random() * 70, dir: Math.random() < .5 }; }
    function at(e, d) { var p = e.p; for (var k = 1; k < p.length; k++) { var seg = Math.abs(p[k].x - p[k - 1].x) + Math.abs(p[k].y - p[k - 1].y); if (d <= seg || k === p.length - 1) { var f = seg ? Math.min(1, d / seg) : 0; return [p[k - 1].x + (p[k].x - p[k - 1].x) * f, p[k - 1].y + (p[k].y - p[k - 1].y) * f]; } d -= seg; } return [p[0].x, p[0].y]; }
    var lastT = performance.now();
    function frame(now) {
      var dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
      ctx.setTransform(D, 0, 0, D, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(43,196,242,.085)'; ctx.lineWidth = 1; ctx.beginPath();
      edges.forEach(function (e) { ctx.moveTo(e.p[0].x + .5, e.p[0].y + .5); ctx.lineTo(e.p[1].x + .5, e.p[1].y + .5); ctx.lineTo(e.p[2].x + .5, e.p[2].y + .5); }); ctx.stroke();
      ctx.fillStyle = 'rgba(143,221,250,.32)'; nodes.forEach(function (n) { ctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3); });
      if (!reduce) sig.forEach(function (s, i) {
        var e = edges[s.e]; if (!e) return; s.t += s.v * dt; if (s.t > e.len + 40) { sig[i] = newSig(); return; }
        for (var k = 0; k < 8; k++) { var d = s.t - k * 5; if (d < 0 || d > e.len) continue; var pp = at(e, s.dir ? d : e.len - d); ctx.fillStyle = 'rgba(43,196,242,' + (0.75 * (1 - k / 8)) + ')'; ctx.beginPath(); ctx.arc(pp[0], pp[1], k ? 1.4 : 2.2, 0, 6.283); ctx.fill(); }
      });
      if (!reduce && !document.hidden) requestAnimationFrame(frame);
    }
    build(); requestAnimationFrame(frame);
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 150); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden && !reduce) { lastT = performance.now(); requestAnimationFrame(frame); } });
  })();

  applyStatic();
})();
