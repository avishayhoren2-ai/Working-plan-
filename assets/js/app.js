/* ================= לוגיקת האפליקציה + טיימר HIIT ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const todayIdx = new Date().getDay(); // 0=ראשון

/* ---------- אחסון מקומי (התקדמות) ---------- */
const store = {
  get() {
    try { return JSON.parse(localStorage.getItem("hiit_progress") || "{}"); }
    catch { return {}; }
  },
  set(v) { localStorage.setItem("hiit_progress", JSON.stringify(v)); },
};
function logDone(id) {
  const d = store.get();
  const key = new Date().toISOString().slice(0, 10);
  d.log = d.log || {};
  d.log[key] = d.log[key] || [];
  if (!d.log[key].includes(id)) d.log[key].push(id);
  d.total = (d.total || 0) + 1;
  store.set(d);
}
function todayDone() {
  const d = store.get();
  const key = new Date().toISOString().slice(0, 10);
  return (d.log && d.log[key]) || [];
}
function streak() {
  const d = store.get();
  if (!d.log) return 0;
  let s = 0;
  for (let i = 0; i < 60; i++) {
    const dt = new Date(); dt.setDate(dt.getDate() - i);
    const key = dt.toISOString().slice(0, 10);
    if (d.log[key] && d.log[key].length) s++;
    else if (i > 0) break;
  }
  return s;
}
function weekCount() {
  const d = store.get(); if (!d.log) return 0;
  let c = 0;
  for (let i = 0; i < 7; i++) {
    const dt = new Date(); dt.setDate(dt.getDate() - i);
    const key = dt.toISOString().slice(0, 10);
    if (d.log[key]) c += d.log[key].length;
  }
  return c;
}

/* ---------- ניווט בין עמודים ---------- */
function go(page) {
  $$(".page").forEach((p) => p.classList.toggle("active", p.id === "page-" + page));
  $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.go === page));
  window.scrollTo(0, 0);
}
$$(".tab").forEach((t) => t.addEventListener("click", () => go(t.dataset.go)));

/* ---------- רינדור דף הבית ---------- */
function iconFor(w) {
  return { upper: "💪", metabolic: "🔥", core: "🎯", fullbody: "⚡", recovery: "🌿" }[w] || "🏋️";
}
function renderHome() {
  const done = todayDone();
  // אימון היום
  const t = WEEK[todayIdx];
  const heroEl = $("#hero-today");
  if (t.w) {
    const w = WORKOUTS[t.w];
    heroEl.innerHTML = `
      <div class="eyebrow">האימון של היום · יום ${t.day}</div>
      <h2>${w.title}</h2>
      <p>${w.subtitle} · ${w.estMin} דק' · ${w.rounds} סבבים</p>
      <div class="chips">
        <span class="chip"><span class="dot"></span>בטוח לברך</span>
        <span class="chip">🔥 HIIT</span>
        <span class="chip">🏠 בבית</span>
      </div>`;
    heroEl.onclick = () => openDetail(t.w);
    heroEl.style.cursor = "pointer";
  } else {
    heroEl.innerHTML = `
      <div class="eyebrow">יום ${t.day}</div>
      <h2>יום מנוחה 🛌</h2>
      <p>התאוששות חשובה לא פחות מהאימון. תנו לגוף ולברך להתחדש.</p>`;
    heroEl.onclick = null;
  }

  // רשימת אימונים
  const list = $("#workout-list");
  list.innerHTML = "";
  Object.values(WORKOUTS).forEach((w) => {
    const isDone = done.includes(w.id);
    const c = document.createElement("div");
    c.className = "workout-card fade-list" + (isDone ? " done" : "");
    c.innerHTML = `
      <span class="accent" style="background:${w.color}"></span>
      <div class="wc-icon">${iconFor(w.id)}</div>
      <div class="wc-body">
        <h4>${w.title}</h4>
        <div class="wc-sub">${w.subtitle}</div>
        <div class="wc-meta">
          <span>⏱️ ${w.estMin} דק'</span>
          <span>🔁 ${w.rounds} סבבים</span>
          <span>🏋️ ${w.intervals.length} תרגילים</span>
        </div>
        <span class="badge-done">✓ הושלם היום</span>
      </div>
      <div class="go">‹</div>`;
    c.addEventListener("click", () => openDetail(w.id));
    list.appendChild(c);
  });

  // טיפ יומי
  $("#daily-tip").textContent = TIPS[new Date().getDate() % TIPS.length];

  // סטטיסטיקה
  const st = streak();
  $("#stat-streak").textContent = st;
  $("#stat-week").textContent = weekCount();
  $("#stat-total").textContent = store.get().total || 0;
  const s2 = $("#stat-streak2");
  if (s2) s2.textContent = st + " ימים 🔥";
}

/* ---------- תכנית שבועית ---------- */
function renderWeek() {
  const el = $("#week-list");
  el.innerHTML = "";
  WEEK.forEach((d, i) => {
    const w = d.w ? WORKOUTS[d.w] : null;
    const row = document.createElement("div");
    row.className = "week-row fade-list" + (i === todayIdx ? " today" : "");
    row.innerHTML = `
      <div class="week-day"><b>${d.day}</b>${i === todayIdx ? "<small>היום</small>" : ""}</div>
      <div class="wbar" style="background:${w ? w.color : "#FF6B35"}"></div>
      <div class="week-info">
        <h5>${w ? w.title : "יום מנוחה"}</h5>
        <span>${w ? `${w.subtitle} · ${w.estMin} דק'` : "התאוששות והתחדשות"}</span>
      </div>
      ${w ? '<div class="week-go">‹</div>' : '<div class="rest-tag">מנוחה</div>'}`;
    if (w) row.addEventListener("click", () => openDetail(d.w));
    el.appendChild(row);
  });
}

/* ---------- פרטי אימון (preview) ---------- */
let currentWorkout = null;
function openDetail(id) {
  const w = WORKOUTS[id];
  currentWorkout = w;
  const head = $("#detail-head");
  head.style.background = `linear-gradient(150deg, ${w.color}33, var(--card))`;
  head.style.borderColor = w.color + "66";
  head.innerHTML = `
    <h2>${iconFor(id)} ${w.title}</h2>
    <p>${w.subtitle}</p>
    <div class="dmeta">
      <div><b>${w.estMin}</b>דקות</div>
      <div><b>${w.rounds}</b>סבבים</div>
      <div><b>${w.intervals.length}</b>תרגילים</div>
    </div>`;

  const body = $("#detail-body");
  const exHtml = (key, idx) => {
    const e = EX[key];
    return `<div class="ex-item fade-list">
      <div class="n">${idx}</div>
      <div class="ei-body">
        <h5>${e.name}</h5>
        <p>${e.desc}</p>
        <div class="ei-cues">💡 ${e.cues}</div>
      </div></div>`;
  };
  let html = `<div class="group-label">🔥 חימום (${w.warmup.length})</div>`;
  w.warmup.forEach((k, i) => (html += exHtml(k, i + 1)));
  html += `<div class="group-label">💥 גוף האימון · ${w.rounds} סבבים</div>`;
  w.intervals.forEach((it, i) => (html += exHtml(it.ex, i + 1)));
  html += `<div class="group-label">🌿 שחרור (${w.cooldown.length})</div>`;
  w.cooldown.forEach((k, i) => (html += exHtml(k, i + 1)));
  body.innerHTML = html;

  $("#tabbar").classList.add("hidden");
  go("detail");
  $("#start-bar").style.display = "block";
}
$("#back-detail").addEventListener("click", () => {
  $("#tabbar").classList.remove("hidden");
  $("#start-bar").style.display = "none";
  go("home");
});

/* ================= מנוע הטיימר ================= */
const Player = {
  steps: [], idx: 0, remain: 0, total: 0, timer: null, paused: false, round: 1, rounds: 1,
};

function buildSteps(w) {
  const steps = [];
  steps.push({ type: "ready", label: "היכונו", ex: null, dur: 10 });
  // חימום
  w.warmup.forEach((k) => steps.push({ type: "warmup", label: "חימום", ex: k, dur: 30 }));
  // סבבים
  for (let r = 1; r <= w.rounds; r++) {
    w.intervals.forEach((it, i) => {
      steps.push({ type: "work", label: "עבודה", ex: it.ex, dur: it.work, round: r });
      const last = r === w.rounds && i === w.intervals.length - 1;
      if (!last) steps.push({ type: "rest", label: "מנוחה", ex: null, dur: it.rest, round: r, next: w.intervals[(i + 1) % w.intervals.length].ex });
    });
  }
  // שחרור
  w.cooldown.forEach((k) => steps.push({ type: "cool", label: "שחרור", ex: k, dur: 30 }));
  return steps;
}

function startWorkout() {
  const w = currentWorkout;
  Player.steps = buildSteps(w);
  Player.idx = 0; Player.rounds = w.rounds; Player.paused = false;
  $("#player").classList.add("active");
  $("#p-title").textContent = w.title;
  $(".ring .prog").style.stroke = w.color;
  loadStep();
}

function loadStep() {
  const s = Player.steps[Player.idx];
  if (!s) return finishWorkout();
  Player.remain = s.dur; Player.total = s.dur;

  const label = $("#phase-label");
  label.className = "phase-label " + (s.type === "work" ? "work" : s.type === "rest" ? "rest" : s.type === "ready" ? "ready" : "");
  label.textContent = s.type === "work" ? "עבודה 💥" : s.type === "rest" ? "מנוחה 💨" : s.type === "ready" ? "היכונו" : s.label;

  // מידע על התרגיל
  const exBox = $("#ex-now");
  if (s.ex) {
    const e = EX[s.ex];
    exBox.innerHTML = `<h3>${e.name}</h3><p>${e.desc}</p><div class="knee">🦵 בטוח לברך — ${e.cues}</div>`;
  } else if (s.type === "rest") {
    const ne = s.next ? EX[s.next] : null;
    exBox.innerHTML = `<h3>מנוחה</h3><p>נשמו עמוק, שתו מים.</p>${ne ? `<div class="knee">⏭️ הבא: ${ne.name}</div>` : ""}`;
  } else {
    exBox.innerHTML = `<h3>מתכוננים…</h3><p>תופסים עמדה יציבה. מתחילים עוד רגע 💪</p>`;
  }

  // סבב
  const total = currentWorkout.rounds;
  const r = s.round ? `סבב ${s.round}/${total}` : s.type === "warmup" ? "חימום" : s.type === "cool" ? "שחרור" : "";
  $("#p-round").textContent = r;

  updateRing();
  beep(s.type === "work" ? "high" : "low");
  if (!Player.paused) run();
}

function run() {
  clearInterval(Player.timer);
  Player.timer = setInterval(() => {
    if (Player.paused) return;
    Player.remain--;
    if (Player.remain <= 3 && Player.remain > 0) beep("tick");
    updateRing();
    if (Player.remain <= 0) {
      clearInterval(Player.timer);
      Player.idx++;
      loadStep();
    }
  }, 1000);
}

function updateRing() {
  const R = 130, C = 2 * Math.PI * R;
  const frac = Player.total ? Player.remain / Player.total : 0;
  const prog = $(".ring .prog");
  prog.style.strokeDasharray = C;
  prog.style.strokeDashoffset = C * (1 - frac);
  const m = Math.floor(Player.remain / 60), sec = Player.remain % 60;
  $("#p-time").textContent = Player.remain >= 60 ? `${m}:${String(sec).padStart(2, "0")}` : Player.remain;
}

function finishWorkout() {
  clearInterval(Player.timer);
  logDone(currentWorkout.id);
  $("#player-inner").innerHTML = `
    <div class="done-screen">
      <div class="big">🎉</div>
      <h2>כל הכבוד!</h2>
      <p>סיימת את "${currentWorkout.title}".<br>שרפת שומן ושמרת על הברך 🦵✅</p>
      <p style="margin-top:18px;color:var(--lime);font-weight:700">רצף נוכחי: ${streak()} ימים 🔥</p>
      <button class="btn-primary" style="margin-top:26px;max-width:300px" onclick="closePlayer()">סיום</button>
    </div>`;
  if (navigator.vibrate) navigator.vibrate([120, 60, 120, 60, 200]);
}

function closePlayer() {
  clearInterval(Player.timer);
  $("#player").classList.remove("active");
  $("#player-inner").innerHTML = PLAYER_HTML;
  bindPlayerCtrls();
  $("#tabbar").classList.remove("hidden");
  $("#start-bar").style.display = "none";
  renderHome(); renderWeek();
  go("home");
}

/* כפתורי שליטה */
function bindPlayerCtrls() {
  $("#p-close").addEventListener("click", () => { if (confirm("לצאת מהאימון?")) closePlayer(); });
  $("#p-play").addEventListener("click", () => {
    Player.paused = !Player.paused;
    $("#p-play").textContent = Player.paused ? "▶" : "⏸";
    if (!Player.paused) run();
  });
  $("#p-prev").addEventListener("click", () => { Player.idx = Math.max(0, Player.idx - 1); clearInterval(Player.timer); loadStep(); });
  $("#p-next").addEventListener("click", () => { Player.idx++; clearInterval(Player.timer); loadStep(); });
}

/* ---------- צליל (Web Audio) ---------- */
let actx = null;
function beep(kind) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.connect(g); g.connect(actx.destination);
    const f = kind === "high" ? 880 : kind === "tick" ? 660 : 440;
    o.frequency.value = f; o.type = "sine";
    g.gain.setValueAtTime(0.001, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, actx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.18);
    o.start(); o.stop(actx.currentTime + 0.2);
  } catch (e) {}
}

const PLAYER_HTML = $("#player-inner")?.innerHTML || "";

/* ---------- אתחול ---------- */
$("#start-workout").addEventListener("click", () => { beep("high"); startWorkout(); });
bindPlayerCtrls();
renderHome();
renderWeek();

// פרופיל
$("#reset-progress")?.addEventListener("click", () => {
  if (confirm("לאפס את כל ההתקדמות?")) { localStorage.removeItem("hiit_progress"); renderHome(); }
});

/* ---------- PWA: התקנה + Service Worker ---------- */
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); deferredPrompt = e;
  $("#install-btn").classList.add("show");
});
$("#install-btn").addEventListener("click", async () => {
  if (!deferredPrompt) {
    alert("להתקנה: פתחו את תפריט הדפדפן ובחרו 'הוסף למסך הבית'");
    return;
  }
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  $("#install-btn").classList.remove("show");
});
window.addEventListener("appinstalled", () => $("#install-btn").classList.remove("show"));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
