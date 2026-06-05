// ============================================================
// FlameFit — אפליקציית HIIT לשריפת שומן (בטוח לברך)
// מותאם: גבר בן 47 · 100 ק"ג · קרע ברצועות הברך
// ללא ריצה / קפיצות / לאנג'ים-סקוואט עמוקים / סיבובי ברך
//
// שימוש ב-Lovable:
//   הדבק קובץ זה כ-  src/App.tsx  (או כקומפוננטה ושים <FlameFit/>).
//   דורש רק React + Tailwind (קיימים ב-Lovable כברירת מחדל).
// ============================================================
import { useEffect, useRef, useState } from "react";

/* ---------- נתוני התכנית ---------- */
type Ex = { name: string; desc: string; cues: string };
const EX: Record<string, Ex> = {
  marchInPlace: { name: "צעידה במקום", desc: "צועדים במקום בקצב נמרץ, מרימים ברכיים בנוחות (בלי כאב). מניפים ידיים.", cues: "גב זקוף · בלי לקפוץ · נשימה רציפה" },
  armCircles: { name: "סיבובי כתפיים וזרועות", desc: "סיבובים גדולים של הזרועות קדימה ואחורה לחימום מפרקי הכתף.", cues: "תנועה מבוקרת · להגדיל טווח בהדרגה" },
  hipHinge: { name: "הטיית אגן (Hip Hinge)", desc: "ברכיים רכות וקבועות, דוחפים את האגן אחורה וחוזרים. מחמם ירך וגב תחתון בלי כיפוף ברך.", cues: "הברך לא זזה · התנועה מהאגן" },
  pushUp: { name: "שכיבות סמיכה", desc: "אפשר על הברכיים (עם מגבת מתחת לברך) או בנטייה מול קיר/ספסל להקלה.", cues: "גוף ישר · מרפקים ~45° · בלי לשקוע במותן" },
  bentRow: { name: "חתירה בהטיה (משקולת)", desc: "הטיית אגן אחורה, גב ישר, מושכים משקולות לכיוון המותן ולוחצים שכמות.", cues: "מרפקים צמודים · משיכה מהגב לא מהיד" },
  shoulderPress: { name: "לחיצת כתפיים בעמידה", desc: "משקולות בגובה הכתפיים, לוחצים מעל הראש ויורדים בשליטה.", cues: "בטן אסופה · בלי קשת בגב · נשיפה בדחיפה" },
  bicepCurl: { name: "כפיפת מרפקים (Curl)", desc: "משקולות לצד הגוף, כופפים מרפקים ומרימים לכיוון הכתפיים בשליטה.", cues: "מרפקים קבועים · בלי תנופה" },
  tricepKickback: { name: "פשיטת מרפק (Triceps)", desc: "הטיה קדימה עם גב ישר, מרפק צמוד לגוף, פושטים את היד אחורה.", cues: "מרפק יציב · סחיטה בסיום" },
  boxing: { name: "אגרופי איגרוף (Shadow Boxing)", desc: "עמידה יציבה, מנחיתים אגרופים מהירים קדימה — ג'אב/קרוס. מצוין לדופק בלי עומס על הברך.", cues: "רגליים יציבות · ליבה אסופה · קצב מהיר" },
  plank: { name: "פלאנק (קרש)", desc: "אחיזה על אמות הידיים והבהונות, גוף בקו ישר. אפשר על הברכיים להקלה.", cues: "בטן וישבן אסופים · בלי לשקוע במותן" },
  deadBug: { name: "Dead Bug", desc: "שכיבה על הגב, ידיים ורגליים למעלה, מורידים יד ורגל נגדיות לסירוגין תוך הצמדת גב תחתון לרצפה.", cues: "גב תחתון צמוד לרצפה · תנועה איטית" },
  birdDog: { name: "Bird-Dog", desc: "על ארבע, מותחים יד ורגל נגדיות ומחזיקים שנייה. מחזק ליבה וגב בלי עומס על הברך.", cues: "אגן יציב · בלי לסובב את הגוף" },
  sidePlank: { name: "פלאנק צד", desc: "אחיזה על אמה אחת בצד, גוף ישר. אפשר להניח את הברך התחתונה להקלה.", cues: "אגן מורם · קו ישר מהראש לרגליים" },
  gluteBridge: { name: "גשר ישבן (Glute Bridge)", desc: "שכיבה על הגב, כפות רגליים על הרצפה, מרימים אגן וסוחטים ישבן. ידידותי ומחזק סביב הברך.", cues: "סחיטת ישבן למעלה · בלי קשת במותן" },
  standingPunchKnee: { name: "אגרוף + משיכת ברך עדינה", desc: "אגרוף קדימה עם משיכת ברך נמוכה ונוחה לכיוון הבטן (בלי קפיצה, בלי כאב).", cues: "טווח נוח לברך · קצב מהיר ויציב" },
  fastHands: { name: "קצב ידיים מהיר", desc: "בעמידה יציבה, מהלומות ידיים מהירות מאוד למטה (כמו תיפוף) להעלאת דופק בלי מאמץ על הברך.", cues: "רגליים נייחות · להתפוצץ במהירות הידיים" },
  standingOblique: { name: "כיפופי צד בעמידה", desc: "מרפק יורד לכיוון מותן ומושך ברך הצידה בעדינות לסירוגין — חיטוב מותניים בקצב.", cues: "טווח קטן ונוח · ליבה עובדת" },
  wallPush: { name: "דחיפות קיר נפיצות", desc: "עמידה בנטייה מול הקיר, דחיפות מהירות ונפיצות החוצה. מעלה דופק ומפעיל פלג עליון.", cues: "ליבה אסופה · קצב מהיר ושליטה" },
  chestStretch: { name: "מתיחת חזה וכתפיים", desc: "פתיחת ידיים לצדדים/אחיזה מאחורי הגב למתיחת חזה.", cues: "נשימות עמוקות · בלי כאב" },
  catCow: { name: "חתול-פרה (גב)", desc: "על ארבע, מקמרים ומעגלים את הגב לסירוגין לשחרור עמוד שדרה.", cues: "תנועה רכה עם הנשימה" },
  hamstringStretch: { name: "מתיחת ירך אחורית (בישיבה)", desc: "ישיבה, רגל ישרה (בלי לנעול ברך בכוח), נשענים קדימה בעדינות.", cues: "גב ישר · מתיחה נוחה ולא כואבת" },
};

type Interval = { ex: string; work: number; rest: number };
type Workout = { id: string; title: string; subtitle: string; color: string; icon: string; rounds: number; estMin: number; warmup: string[]; intervals: Interval[]; cooldown: string[] };
const blk = (keys: string[], work: number, rest: number): Interval[] => keys.map((ex) => ({ ex, work, rest }));

const WORKOUTS: Record<string, Workout> = {
  upper: { id: "upper", title: "HIIT פלג גוף עליון", subtitle: "דחיפה · משיכה · ליבה", color: "#a3e635", icon: "💪", rounds: 3, estMin: 28, warmup: ["armCircles", "marchInPlace", "hipHinge"], intervals: blk(["pushUp", "bentRow", "shoulderPress", "boxing", "plank"], 40, 20), cooldown: ["chestStretch", "catCow"] },
  metabolic: { id: "metabolic", title: "HIIT מטבולי לשריפה", subtitle: "דופק גבוה · עומס נמוך על הברך", color: "#ff6b35", icon: "🔥", rounds: 4, estMin: 26, warmup: ["marchInPlace", "armCircles", "hipHinge"], intervals: blk(["boxing", "wallPush", "standingPunchKnee", "fastHands"], 30, 15), cooldown: ["chestStretch", "hamstringStretch"] },
  core: { id: "core", title: "HIIT ליבה ויציבה", subtitle: "בטן · גב · ישבן", color: "#22d3ee", icon: "🎯", rounds: 3, estMin: 24, warmup: ["catCow", "birdDog", "marchInPlace"], intervals: blk(["plank", "deadBug", "gluteBridge", "sidePlank", "standingOblique"], 35, 20), cooldown: ["catCow", "hamstringStretch"] },
  fullbody: { id: "fullbody", title: "HIIT גוף מלא", subtitle: "כוח + דופק משולב", color: "#c084fc", icon: "⚡", rounds: 3, estMin: 30, warmup: ["marchInPlace", "armCircles", "hipHinge"], intervals: blk(["pushUp", "boxing", "bentRow", "gluteBridge", "shoulderPress", "wallPush"], 40, 20), cooldown: ["chestStretch", "catCow", "hamstringStretch"] },
  recovery: { id: "recovery", title: "התאוששות פעילה", subtitle: "ניידות · מתיחות · נשימה", color: "#34d399", icon: "🌿", rounds: 2, estMin: 18, warmup: ["marchInPlace"], intervals: blk(["catCow", "birdDog", "gluteBridge", "deadBug"], 40, 25), cooldown: ["chestStretch", "hamstringStretch", "catCow"] },
};

const WEEK: { day: string; w: string | null }[] = [
  { day: "ראשון", w: "upper" }, { day: "שני", w: "metabolic" }, { day: "שלישי", w: "recovery" },
  { day: "רביעי", w: "core" }, { day: "חמישי", w: "fullbody" }, { day: "שישי", w: "metabolic" }, { day: "שבת", w: null },
];

const TIPS = [
  "שתו 0.5 ליטר מים לפני האימון ו-2.5–3.5 ליטר ביום — מים מאיצים שריפת שומן.",
  "עצרו מיד אם יש כאב חד בברך. אי-נוחות שרירית קלה זה בסדר — כאב מפרקי לא.",
  "שינה של 7–8 שעות חיונית: חוסר שינה מעלה רעב ומאט ירידה במשקל.",
  "גירעון קלורי מתון (300–500 קק\"ל) + חלבון גבוה = שריפת שומן עם שמירת שריר.",
  "כ-1.6–2 גרם חלבון לכל ק\"ג משקל גוף יעד עוזר לשובע ולשמירת מסת שריר.",
  "HIIT יוצר 'אפטרברן' (EPOC) — הגוף ממשיך לשרוף קלוריות שעות אחרי האימון.",
  "הוסיפו 8–10 אלף צעדים ביום (הליכה בעומס נמוך) להגדלת ההוצאה הקלורית.",
];

/* ---------- עזרי אחסון ---------- */
const todayKey = () => new Date().toISOString().slice(0, 10);
function getProg(): any { try { return JSON.parse(localStorage.getItem("flamefit") || "{}"); } catch { return {}; } }
function setProg(v: any) { localStorage.setItem("flamefit", JSON.stringify(v)); }
function logDone(id: string) {
  const d = getProg(); d.log = d.log || {}; d.log[todayKey()] = d.log[todayKey()] || [];
  if (!d.log[todayKey()].includes(id)) d.log[todayKey()].push(id);
  d.total = (d.total || 0) + 1; setProg(d);
}
function streak(): number {
  const d = getProg(); if (!d.log) return 0; let s = 0;
  for (let i = 0; i < 60; i++) { const dt = new Date(); dt.setDate(dt.getDate() - i); const k = dt.toISOString().slice(0, 10);
    if (d.log[k]?.length) s++; else if (i > 0) break; }
  return s;
}
function weekCount(): number {
  const d = getProg(); if (!d.log) return 0; let c = 0;
  for (let i = 0; i < 7; i++) { const dt = new Date(); dt.setDate(dt.getDate() - i); c += d.log[dt.toISOString().slice(0, 10)]?.length || 0; }
  return c;
}

/* ---------- צליל ---------- */
let actx: AudioContext | null = null;
function beep(kind: "high" | "low" | "tick") {
  try {
    actx = actx || new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain(); o.connect(g); g.connect(actx.destination);
    o.frequency.value = kind === "high" ? 880 : kind === "tick" ? 660 : 440; o.type = "sine";
    g.gain.setValueAtTime(0.001, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, actx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.18);
    o.start(); o.stop(actx.currentTime + 0.2);
  } catch {}
}

/* ---------- מנוע צעדים ---------- */
type Step = { type: "ready" | "warmup" | "work" | "rest" | "cool"; label: string; ex: string | null; dur: number; round?: number; next?: string };
function buildSteps(w: Workout): Step[] {
  const steps: Step[] = [{ type: "ready", label: "היכונו", ex: null, dur: 10 }];
  w.warmup.forEach((ex) => steps.push({ type: "warmup", label: "חימום", ex, dur: 30 }));
  for (let r = 1; r <= w.rounds; r++)
    w.intervals.forEach((it, i) => {
      steps.push({ type: "work", label: "עבודה", ex: it.ex, dur: it.work, round: r });
      const last = r === w.rounds && i === w.intervals.length - 1;
      if (!last) steps.push({ type: "rest", label: "מנוחה", ex: null, dur: it.rest, round: r, next: w.intervals[(i + 1) % w.intervals.length].ex });
    });
  w.cooldown.forEach((ex) => steps.push({ type: "cool", label: "שחרור", ex, dur: 30 }));
  return steps;
}

/* ============================================================ */
export default function FlameFit() {
  const [tab, setTab] = useState<"home" | "week" | "profile">("home");
  const [detail, setDetail] = useState<Workout | null>(null);
  const [playing, setPlaying] = useState<Workout | null>(null);
  const [, force] = useState(0); // לרענון סטטיסטיקות
  const todayIdx = new Date().getDay();
  const todayW = WEEK[todayIdx].w ? WORKOUTS[WEEK[todayIdx].w!] : null;
  const done = getProg().log?.[todayKey()] || [];

  return (
    <div dir="rtl" className="min-h-screen text-[#eef2f7] font-sans pb-28"
      style={{ background: "radial-gradient(1100px 500px at 100% -10%, rgba(163,230,53,.10), transparent 60%), radial-gradient(900px 500px at 0 0, rgba(34,211,238,.08), transparent 55%), #0a0d12", fontFamily: "Heebo, system-ui, sans-serif" }}>
      <div className="max-w-[520px] mx-auto px-4">
        {/* כותרת */}
        <header className="sticky top-0 z-30 flex items-center justify-between py-4"
          style={{ background: "linear-gradient(#0a0d12 70%, transparent)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl grid place-items-center text-xl"
              style={{ background: "linear-gradient(135deg,#a3e635,#22d3ee)", boxShadow: "0 6px 18px rgba(163,230,53,.35)" }}>🔥</div>
            <div>
              <h1 className="text-lg font-extrabold leading-none">FlameFit</h1>
              <span className="text-[11px] text-[#93a1b5]">HIIT לשריפת שומן · בטוח לברך</span>
            </div>
          </div>
        </header>

        {/* ===== בית ===== */}
        {tab === "home" && (
          <main className="animate-[fade_.35s_ease]">
            {/* Hero */}
            <section onClick={() => todayW && setDetail(todayW)}
              className="relative overflow-hidden rounded-3xl p-6 mb-4 border border-[#263041] cursor-pointer"
              style={{ background: "linear-gradient(150deg,#16202b,#11161f)", boxShadow: "0 14px 40px rgba(0,0,0,.45)" }}>
              <div className="text-xs font-bold text-[#a3e635]">האימון של היום · יום {WEEK[todayIdx].day}</div>
              {todayW ? (
                <>
                  <h2 className="text-2xl font-extrabold mt-1.5">{todayW.title}</h2>
                  <p className="text-[#93a1b5] text-[13px]">{todayW.subtitle} · {todayW.estMin} דק' · {todayW.rounds} סבבים</p>
                  <div className="flex gap-2 flex-wrap mt-3.5">
                    {["🦵 בטוח לברך", "🔥 HIIT", "🏠 בבית"].map((c) => (
                      <span key={c} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#1c2433] border border-[#263041]">{c}</span>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-extrabold mt-1.5">יום מנוחה 🛌</h2>
                  <p className="text-[#93a1b5] text-[13px]">התאוששות חשובה לא פחות מהאימון. תנו לגוף ולברך להתחדש.</p>
                </>
              )}
            </section>

            {/* סטטיסטיקה */}
            <div className="grid grid-cols-3 gap-2.5">
              {[["רצף ימים 🔥", streak()], ["השבוע", weekCount()], ["סה״כ אימונים", getProg().total || 0]].map(([l, v]) => (
                <div key={l as string} className="bg-[#161c27] border border-[#263041] rounded-2xl py-3.5 text-center">
                  <b className="text-2xl font-extrabold bg-gradient-to-br from-[#a3e635] to-[#22d3ee] bg-clip-text text-transparent">{v as number}</b>
                  <span className="block text-[11px] text-[#93a1b5] mt-0.5">{l as string}</span>
                </div>
              ))}
            </div>

            {/* טיפ */}
            <div className="mt-3.5 rounded-2xl p-4 flex gap-2.5 text-[13px] leading-relaxed border"
              style={{ background: "linear-gradient(135deg,rgba(255,107,53,.12),rgba(247,183,51,.06))", borderColor: "rgba(255,107,53,.3)" }}>
              <span>💡</span><span>{TIPS[new Date().getDate() % TIPS.length]}</span>
            </div>

            {/* רשימת אימונים */}
            <h3 className="text-base font-extrabold mt-6 mb-3 px-1">כל האימונים</h3>
            {Object.values(WORKOUTS).map((w) => (
              <div key={w.id} onClick={() => setDetail(w)}
                className="relative overflow-hidden cursor-pointer bg-[#161c27] border border-[#263041] rounded-[20px] p-4 mb-3 flex items-center gap-3.5 active:scale-[.985] transition">
                <span className="absolute inset-y-0 right-0 w-[5px] rounded" style={{ background: w.color }} />
                <div className="w-[52px] h-[52px] rounded-[15px] grid place-items-center text-2xl bg-[#1c2433] border border-[#263041]">{w.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-extrabold">{w.title}</h4>
                  <div className="text-xs text-[#93a1b5] mt-0.5">{w.subtitle}</div>
                  <div className="flex gap-3 mt-2 text-[11px] text-[#93a1b5]">
                    <span>⏱️ {w.estMin} דק'</span><span>🔁 {w.rounds} סבבים</span><span>🏋️ {w.intervals.length}</span>
                  </div>
                  {done.includes(w.id) && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#a3e635] bg-[#a3e6351f] px-2 py-0.5 rounded-full mt-1.5">✓ הושלם היום</span>}
                </div>
                <div className="text-xl text-[#93a1b5]">‹</div>
              </div>
            ))}

            <div className="text-[11px] text-[#93a1b5] leading-relaxed bg-[#161c27] border border-[#263041] rounded-2xl p-3.5 my-4">
              <b className="text-[#ff6b35]">⚠️ הבהרה רפואית:</b> התכנית מותאמת לעומס נמוך על הברך (ללא ריצה/קפיצות), אך אינה תחליף לייעוץ רפואי. בשל הקרע ברצועות הברך — מומלץ לקבל אישור מרופא אורתופד/פיזיותרפיסט לפני התחלה, ולעצור מיד בכל כאב חד.
            </div>
          </main>
        )}

        {/* ===== שבוע ===== */}
        {tab === "week" && (
          <main className="animate-[fade_.35s_ease]">
            <h3 className="text-[22px] font-extrabold mt-1.5 mb-4 px-1">📅 התכנית השבועית</h3>
            {WEEK.map((d, i) => {
              const w = d.w ? WORKOUTS[d.w] : null;
              return (
                <div key={d.day} onClick={() => w && setDetail(w)}
                  className={"flex items-center gap-3 bg-[#161c27] border rounded-2xl p-3.5 mb-2.5 " + (i === todayIdx ? "border-[#a3e635]" : "border-[#263041]") + (w ? " cursor-pointer" : "")}>
                  <div className="w-[54px] text-center">
                    <b className="block text-[13px]">{d.day}</b>
                    {i === todayIdx && <small className="text-[10px] text-[#93a1b5]">היום</small>}
                  </div>
                  <div className="w-1 h-9 rounded" style={{ background: w ? w.color : "#ff6b35" }} />
                  <div className="flex-1">
                    <h5 className="text-sm font-bold">{w ? w.title : "יום מנוחה"}</h5>
                    <span className="text-[11px] text-[#93a1b5]">{w ? `${w.subtitle} · ${w.estMin} דק'` : "התאוששות והתחדשות"}</span>
                  </div>
                  {w ? <div className="text-lg text-[#93a1b5]">‹</div> : <div className="text-[11px] text-[#ff6b35] font-bold">מנוחה</div>}
                </div>
              );
            })}
          </main>
        )}

        {/* ===== פרופיל ===== */}
        {tab === "profile" && (
          <main className="animate-[fade_.35s_ease]">
            <h3 className="text-[22px] font-extrabold mt-1.5 mb-4 px-1">👤 הפרופיל שלי</h3>
            <div className="bg-[#161c27] border border-[#263041] rounded-[18px] p-4 mb-3.5">
              {[["גיל", "47"], ["משקל", "100 ק\"ג"], ["מטרה", "שריפת שומן 🔥"], ["מגבלה", "קרע ברצועות הברך 🦵"], ["סגנון", "HIIT · עומס נמוך"], ["רצף נוכחי", `${streak()} ימים 🔥`]].map(([k, v], i, a) => (
                <div key={k} className={"flex justify-between py-2.5 text-sm" + (i < a.length - 1 ? " border-b border-[#263041]" : "")}>
                  <span className="text-[#93a1b5]">{k}</span><b>{v}</b>
                </div>
              ))}
            </div>
            <button onClick={() => { if (confirm("לאפס את כל ההתקדמות?")) { localStorage.removeItem("flamefit"); force((n) => n + 1); } }}
              className="w-full py-3 rounded-[14px] bg-[#161c27] border border-[#263041] text-[#ff6b35] font-bold text-sm">איפוס התקדמות</button>
          </main>
        )}
      </div>

      {/* ===== ניווט תחתון ===== */}
      {!playing && !detail && (
        <nav className="fixed bottom-0 inset-x-0 z-50 flex justify-around py-2 border-t border-[#263041]"
          style={{ background: "rgba(13,17,24,.92)", backdropFilter: "blur(14px)" }}>
          {([["home", "🏠", "בית"], ["week", "📅", "שבוע"], ["profile", "👤", "פרופיל"]] as const).map(([id, ic, lb]) => (
            <button key={id} onClick={() => setTab(id)}
              className={"flex flex-col items-center gap-0.5 text-[10px] font-semibold px-3.5 py-1 " + (tab === id ? "text-[#a3e635]" : "text-[#93a1b5]")}>
              <span className="text-xl">{ic}</span>{lb}
            </button>
          ))}
        </nav>
      )}

      {/* ===== פרטי אימון ===== */}
      {detail && !playing && <Detail w={detail} onBack={() => setDetail(null)} onStart={() => { beep("high"); setPlaying(detail); }} />}

      {/* ===== נגן ===== */}
      {playing && <Player w={playing} onClose={() => { setPlaying(null); setDetail(null); force((n) => n + 1); }} />}

      <style>{`@keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

/* ---------- מסך פרטי אימון ---------- */
function Detail({ w, onBack, onStart }: { w: Workout; onBack: () => void; onStart: () => void }) {
  const Row = ({ k, i }: { k: string; i: number }) => {
    const e = EX[k];
    return (
      <div className="flex gap-3 items-start p-3.5 bg-[#161c27] border border-[#263041] rounded-[14px] mb-2">
        <div className="w-[30px] h-[30px] rounded-[9px] bg-[#1c2433] grid place-items-center text-[13px] font-bold text-[#a3e635] shrink-0">{i}</div>
        <div>
          <h5 className="text-sm font-bold">{e.name}</h5>
          <p className="text-xs text-[#93a1b5] mt-1 leading-snug">{e.desc}</p>
          <div className="text-[11px] text-[#22d3ee] mt-1.5">💡 {e.cues}</div>
        </div>
      </div>
    );
  };
  return (
    <div dir="rtl" className="fixed inset-0 z-[55] overflow-y-auto bg-[#0a0d12] pb-28">
      <div className="max-w-[520px] mx-auto px-4">
        <div className="flex items-center justify-between mt-4 mb-3">
          <button onClick={onBack} className="text-[#22d3ee] text-sm font-semibold">‹ חזרה</button>
          <h3 className="text-base font-extrabold">פרטי האימון</h3><span className="w-10" />
        </div>
        <div className="rounded-[22px] p-5 mb-4 border" style={{ background: `linear-gradient(150deg, ${w.color}33, #161c27)`, borderColor: w.color + "66" }}>
          <h2 className="text-2xl font-extrabold">{w.icon} {w.title}</h2>
          <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,.85)" }}>{w.subtitle}</p>
          <div className="flex gap-4 mt-3.5">
            {[[w.estMin, "דקות"], [w.rounds, "סבבים"], [w.intervals.length, "תרגילים"]].map(([a, b]) => (
              <div key={b as string} className="text-xs"><b className="text-lg block">{a}</b>{b}</div>
            ))}
          </div>
        </div>
        <div className="text-xs font-bold text-[#93a1b5] mt-4 mb-2 px-1">🔥 חימום</div>
        {w.warmup.map((k, i) => <Row key={"w" + i} k={k} i={i + 1} />)}
        <div className="text-xs font-bold text-[#93a1b5] mt-4 mb-2 px-1">💥 גוף האימון · {w.rounds} סבבים</div>
        {w.intervals.map((it, i) => <Row key={"i" + i} k={it.ex} i={i + 1} />)}
        <div className="text-xs font-bold text-[#93a1b5] mt-4 mb-2 px-1">🌿 שחרור</div>
        {w.cooldown.map((k, i) => <Row key={"c" + i} k={k} i={i + 1} />)}
        <div className="h-24" />
      </div>
      <div className="fixed bottom-0 inset-x-0 p-4 z-40" style={{ background: "linear-gradient(transparent,#0a0d12 30%)" }}>
        <div className="max-w-[520px] mx-auto">
          <button onClick={onStart} className="w-full rounded-2xl py-4 font-extrabold text-base text-[#0a0d12]"
            style={{ background: "linear-gradient(135deg,#a3e635,#22d3ee)", boxShadow: "0 10px 30px rgba(163,230,53,.35)" }}>▶ התחל אימון</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- נגן הטיימר ---------- */
function Player({ w, onClose }: { w: Workout; onClose: () => void }) {
  const steps = useRef(buildSteps(w)).current;
  const [idx, setIdx] = useState(0);
  const [remain, setRemain] = useState(steps[0].dur);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const s = steps[idx];
  const total = s?.dur || 1;

  // טיק כל שנייה
  useEffect(() => {
    if (paused || finished) return;
    const t = setInterval(() => setRemain((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [paused, finished, idx]);

  // מעבר צעד / סיום
  useEffect(() => {
    if (finished) return;
    if (remain <= 3 && remain > 0) beep("tick");
    if (remain <= 0) {
      if (idx + 1 >= steps.length) { logDone(w.id); setFinished(true); navigator.vibrate?.([120, 60, 120, 60, 200]); }
      else { const n = idx + 1; setIdx(n); setRemain(steps[n].dur); beep(steps[n].type === "work" ? "high" : "low"); }
    }
  }, [remain]);

  const R = 130, C = 2 * Math.PI * R, frac = remain / total;
  const phaseColor = s?.type === "work" ? "#a3e635" : s?.type === "rest" ? "#22d3ee" : s?.type === "ready" ? "#ff6b35" : "#93a1b5";
  const phaseTxt = s?.type === "work" ? "עבודה 💥" : s?.type === "rest" ? "מנוחה 💨" : s?.type === "ready" ? "היכונו" : s?.label;
  const e = s?.ex ? EX[s.ex] : null;
  const next = s?.next ? EX[s.next] : null;
  const jump = (d: number) => { const n = Math.min(steps.length - 1, Math.max(0, idx + d)); setIdx(n); setRemain(steps[n].dur); };

  if (finished)
    return (
      <div dir="rtl" className="fixed inset-0 z-[60] bg-[#0a0d12] flex flex-col items-center justify-center text-center px-6">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-extrabold mt-3">כל הכבוד!</h2>
        <p className="text-[#93a1b5] text-sm mt-1.5">סיימת את "{w.title}".<br />שרפת שומן ושמרת על הברך 🦵✅</p>
        <p className="text-[#a3e635] font-bold mt-4">רצף נוכחי: {streak()} ימים 🔥</p>
        <button onClick={onClose} className="mt-7 max-w-[300px] w-full rounded-2xl py-4 font-extrabold text-[#0a0d12]"
          style={{ background: "linear-gradient(135deg,#a3e635,#22d3ee)" }}>סיום</button>
      </div>
    );

  return (
    <div dir="rtl" className="fixed inset-0 z-[60] bg-[#0a0d12] flex flex-col">
      <div className="flex items-center justify-between p-4">
        <button onClick={() => { if (confirm("לצאת מהאימון?")) onClose(); }} className="text-2xl text-[#93a1b5]">✕</button>
        <div className="text-center">
          <div className="text-sm font-bold">{w.title}</div>
          <div className="text-xs text-[#93a1b5]">{s?.round ? `סבב ${s.round}/${w.rounds}` : s?.type === "warmup" ? "חימום" : s?.type === "cool" ? "שחרור" : ""}</div>
        </div>
        <span className="w-6" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <div className="text-sm font-extrabold tracking-[2px] uppercase mb-2.5" style={{ color: phaseColor }}>{phaseTxt}</div>
        <div className="relative w-[280px] h-[280px] max-w-[78vw] max-h-[78vw]">
          <svg viewBox="0 0 300 300" className="w-full h-full -rotate-90">
            <circle cx="150" cy="150" r={R} fill="none" stroke="#1c2433" strokeWidth="14" />
            <circle cx="150" cy="150" r={R} fill="none" stroke={phaseColor} strokeWidth="14" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - frac)} style={{ transition: "stroke-dashoffset .95s linear, stroke .3s" }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[64px] font-extrabold tabular-nums leading-none">{remain >= 60 ? `${Math.floor(remain / 60)}:${String(remain % 60).padStart(2, "0")}` : remain}</div>
          </div>
        </div>
        <div className="text-center mt-6">
          {e ? (
            <>
              <h3 className="text-[26px] font-extrabold">{e.name}</h3>
              <p className="text-[13px] text-[#93a1b5] mt-1.5 max-w-[340px] leading-relaxed mx-auto">{e.desc}</p>
              <div className="text-[11px] text-[#a3e635] mt-2.5 font-semibold">🦵 בטוח לברך — {e.cues}</div>
            </>
          ) : (
            <>
              <h3 className="text-[26px] font-extrabold">{s?.type === "rest" ? "מנוחה" : "מתכוננים…"}</h3>
              <p className="text-[13px] text-[#93a1b5] mt-1.5">{s?.type === "rest" ? "נשמו עמוק, שתו מים." : "תופסים עמדה יציבה 💪"}</p>
              {next && <div className="text-[11px] text-[#a3e635] mt-2.5 font-semibold">⏭️ הבא: {next.name}</div>}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 p-5 pb-7">
        <button onClick={() => jump(-1)} className="w-[62px] h-[62px] rounded-full bg-[#161c27] border border-[#263041] text-xl grid place-items-center">⏮</button>
        <button onClick={() => setPaused((p) => !p)} className="w-[86px] h-[86px] rounded-full text-3xl grid place-items-center text-[#0a0d12]"
          style={{ background: "linear-gradient(135deg,#a3e635,#22d3ee)", boxShadow: "0 10px 30px rgba(163,230,53,.4)" }}>{paused ? "▶" : "⏸"}</button>
        <button onClick={() => jump(1)} className="w-[62px] h-[62px] rounded-full bg-[#161c27] border border-[#263041] text-xl grid place-items-center">⏭</button>
      </div>
    </div>
  );
}
