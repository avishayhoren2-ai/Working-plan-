/* =============================================================
   נתוני התכנית — אימוני HIIT לשריפת שומן
   מותאם: גבר בן 47 · 100 ק"ג · קרע ברצועות הברך
   עיקרון מנחה: עצימות גבוהה (HIIT) בעומס נמוך על הברך —
   ללא ריצה, ללא קפיצות, ללא לאנג'ים/סקוואט עמוקים, ללא סיבובי ברך.
   ============================================================= */

const PROFILE = {
  name: "מתאמן",
  age: 47,
  weight: 100,
  goal: "שריפת שומן",
  note: "תכנית בטוחה לברך — ללא ריצה וללא תרגילים בעלי עומס (impact) על הברך",
};

/* בנק תרגילים — כל תרגיל מסומן כבטוח לברך, עם הוראות וגיוון.
   level: עצימות 1-3 · impact: 'low' תמיד (ברך) */
const EX = {
  // —— חימום ——
  marchInPlace: {
    name: "צעידה במקום",
    cat: "חימום",
    desc: "צועדים במקום בקצב נמרץ, מרימים ברכיים בנוחות (בלי כאב). מניפים ידיים.",
    cues: "גב זקוף · בלי לקפוץ · נשימה רציפה",
    kneeSafe: true,
  },
  armCircles: {
    name: "סיבובי כתפיים וזרועות",
    cat: "חימום",
    desc: "סיבובים גדולים של הזרועות קדימה ואחורה לחימום מפרקי הכתף.",
    cues: "תנועה מבוקרת · להגדיל טווח בהדרגה",
    kneeSafe: true,
  },
  hipHinge: {
    name: "הטיית אגן (Hip Hinge)",
    cat: "חימום",
    desc: "ברכיים רכות וקבועות, דוחפים את האגן אחורה וחוזרים. מחמם ירך וגב תחתון בלי כיפוף ברך.",
    cues: "הברך לא זזה · התנועה מהאגן",
    kneeSafe: true,
  },

  // —— פלג גוף עליון ——
  pushUp: {
    name: "שכיבות סמיכה",
    cat: "פלג עליון",
    desc: "שכיבות סמיכה. אפשר על הברכיים (עם מגבת מתחת לברך) או בנטייה מול קיר/ספסל להקלה.",
    cues: "גוף ישר · מרפקים ~45° · בלי לשקוע במותן",
    kneeSafe: true,
  },
  bentRow: {
    name: "חתירה בהטיה (משקולת/בקבוק)",
    cat: "פלג עליון",
    desc: "הטיית אגן אחורה, גב ישר, מושכים משקולות לכיוון המותן ולוחצים שכמות.",
    cues: "מרפקים צמודים · משיכה מהגב לא מהיד",
    kneeSafe: true,
  },
  shoulderPress: {
    name: "לחיצת כתפיים בעמידה",
    cat: "פלג עליון",
    desc: "משקולות בגובה הכתפיים, לוחצים מעל הראש ויורדים בשליטה.",
    cues: "בטן אסופה · בלי קשת בגב · נשיפה בדחיפה",
    kneeSafe: true,
  },
  bicepCurl: {
    name: "כפיפת מרפקים (Curl)",
    cat: "פלג עליון",
    desc: "משקולות לצד הגוף, כופפים מרפקים ומרימים לכיוון הכתפיים בשליטה.",
    cues: "מרפקים קבועים · בלי תנופה",
    kneeSafe: true,
  },
  tricepKickback: {
    name: "פשיטת מרפק (Triceps)",
    cat: "פלג עליון",
    desc: "הטיה קדימה עם גב ישר, מרפק צמוד לגוף, פושטים את היד אחורה.",
    cues: "מרפק יציב · סחיטה בסיום",
    kneeSafe: true,
  },
  boxing: {
    name: "אגרופי איגרוף (Shadow Boxing)",
    cat: "פלג עליון",
    desc: "עמידה יציבה, מנחיתים אגרופים מהירים קדימה — ג'אב/קרוס. מצוין לדופק בלי עומס על הברך.",
    cues: "רגליים יציבות · ליבה אסופה · קצב מהיר",
    kneeSafe: true,
  },

  // —— ליבה ——
  plank: {
    name: "פלאנק (קרש)",
    cat: "ליבה",
    desc: "אחיזה על אמות הידיים והבהונות, גוף בקו ישר. אפשר על הברכיים להקלה.",
    cues: "בטן וישבן אסופים · בלי לשקוע במותן",
    kneeSafe: true,
  },
  deadBug: {
    name: "Dead Bug",
    cat: "ליבה",
    desc: "שכיבה על הגב, ידיים ורגליים למעלה, מורידים יד ורגל נגדיות לסירוגין תוך הצמדת גב תחתון לרצפה.",
    cues: "גב תחתון צמוד לרצפה · תנועה איטית",
    kneeSafe: true,
  },
  birdDog: {
    name: "Bird-Dog",
    cat: "ליבה",
    desc: "על ארבע, מותחים יד ורגל נגדיות ומחזיקים שנייה. מחזק ליבה וגב בלי עומס על הברך.",
    cues: "אגן יציב · בלי לסובב את הגוף",
    kneeSafe: true,
  },
  sidePlank: {
    name: "פלאנק צד",
    cat: "ליבה",
    desc: "אחיזה על אמה אחת בצד, גוף ישר. אפשר להניח את הברך התחתונה להקלה.",
    cues: "אגן מורם · קו ישר מהראש לרגליים",
    kneeSafe: true,
  },
  gluteBridge: {
    name: "גשר ישבן (Glute Bridge)",
    cat: "ליבה",
    desc: "שכיבה על הגב, כפות רגליים על הרצפה, מרימים אגן וסוחטים ישבן. ידידותי ומחזק סביב הברך.",
    cues: "סחיטת ישבן למעלה · בלי קשת במותן",
    kneeSafe: true,
  },

  // —— מטבולי / דופק (ללא קפיצות) ——
  standingPunchKnee: {
    name: "אגרוף + משיכת ברך עדינה",
    cat: "מטבולי",
    desc: "אגרוף קדימה עם משיכת ברך נמוכה ונוחה לכיוון הבטן (בלי קפיצה, בלי כאב).",
    cues: "טווח נוח לברך · קצב מהיר ויציב",
    kneeSafe: true,
  },
  fastFeetSeated: {
    name: "תופי בטן / קצב ידיים מהיר",
    cat: "מטבולי",
    desc: "בעמידה יציבה, מהלומות ידיים מהירות מאוד למטה (כמו תיפוף) להעלאת דופק בלי מאמץ על הברך.",
    cues: "רגליים נייחות · להתפוצץ במהירות הידיים",
    kneeSafe: true,
  },
  standingOblique: {
    name: "כיפופי צד בעמידה",
    cat: "מטבולי",
    desc: "מרפק יורד לכיוון מותן ומושך ברך הצידה בעדינות לסירוגין — חיטוב מותניים בקצב.",
    cues: "טווח קטן ונוח · ליבה עובדת",
    kneeSafe: true,
  },
  wallPush: {
    name: "דחיפות קיר נפיצות",
    cat: "מטבולי",
    desc: "עמידה בנטייה מול הקיר, דחיפות מהירות ונפיצות החוצה. מעלה דופק ומפעיל פלג עליון.",
    cues: "ליבה אסופה · קצב מהיר ושליטה",
    kneeSafe: true,
  },

  // —— תרגילי כוח עצימים (בטוחים לברך) ——
  renegadeRow: {
    name: "חתירת רנגייד (פלאנק + משיכה)",
    cat: "פלג עליון",
    desc: "בעמדת פלאנק על שתי משקולות, מושכים משקולת אחת לכל צד לסירוגין. תרגיל כוח אינטנסיבי לכל הגוף.",
    cues: "אגן יציב · בלי סיבוב · ליבה נעולה · רגליים רחבות לייצוב",
    kneeSafe: true,
  },
  rdl: {
    name: "דדליפט רומני (RDL) עם משקולות",
    cat: "פלג עליון",
    desc: "ברכיים רכות וקבועות, הטיית אגן אחורה והורדת משקולות לאורך הרגליים, וחזרה בסחיטת ישבן. עוצמתי לשרשרת האחורית — בלי כיפוף ברך.",
    cues: "הברך לא נעה · גב ישר · התנועה מהאגן",
    kneeSafe: true,
  },
  uprightRow: {
    name: "חתירה אנכית (Upright Row)",
    cat: "פלג עליון",
    desc: "משקולות לפני הגוף, מושכים כלפי מעלה עד גובה החזה כשהמרפקים מובילים. מפעיל כתפיים וגב עליון בעצימות.",
    cues: "מרפקים מעל פרקי כף היד · תנועה מבוקרת",
    kneeSafe: true,
  },
  plankShoulderTap: {
    name: "פלאנק + נגיעת כתף",
    cat: "ליבה",
    desc: "בפלאנק יציב, נוגעים לסירוגין ביד בכתף הנגדית בלי לנענע את האגן. מחזק ליבה וכתפיים בעצימות.",
    cues: "אגן יציב · רגליים רחבות לייצוב · קצב מבוקר",
    kneeSafe: true,
  },
  superman: {
    name: "סופרמן (הרמת גב)",
    cat: "ליבה",
    desc: "שכיבה על הבטן, מרימים ידיים ורגליים ישרות מהרצפה וסוחטים את הגב והישבן.",
    cues: "מבט לרצפה · סחיטה בשיא · בלי כאב בגב",
    kneeSafe: true,
  },
  flutterKick: {
    name: "בעיטות פרפר (Flutter Kicks)",
    cat: "ליבה",
    desc: "שכיבה על הגב, רגליים ישרות מעט מעל הרצפה, בעיטות קטנות ומהירות לסירוגין. שורף בטן תחתונה.",
    cues: "גב תחתון צמוד לרצפה · ידיים מתחת לישבן לתמיכה",
    kneeSafe: true,
  },

  // —— שחרור ומתיחות ——
  chestStretch: {
    name: "מתיחת חזה וכתפיים",
    cat: "שחרור",
    desc: "פתיחת ידיים לצדדים/אחיזה מאחורי הגב למתיחת חזה.",
    cues: "נשימות עמוקות · בלי כאב",
    kneeSafe: true,
  },
  catCow: {
    name: "חתול-פרה (גב)",
    cat: "שחרור",
    desc: "על ארבע, מקמרים ומעגלים את הגב לסירוגין לשחרור עמוד שדרה.",
    cues: "תנועה רכה עם הנשימה",
    kneeSafe: true,
  },
  hamstringStretch: {
    name: "מתיחת ירך אחורית (בישיבה)",
    cat: "שחרור",
    desc: "ישיבה, רגל ישרה (בלי לנעול ברך בכוח), נשענים קדימה בעדינות.",
    cues: "גב ישר · מתיחה נוחה ולא כואבת",
    kneeSafe: true,
  },
};

/* פורמט אינטרוול: {ex, work, rest}  (שניות) */
function block(exKeys, work, rest) {
  return exKeys.map((k) => ({ ex: k, work, rest }));
}

/* תוכניות אימון — כל אימון = סבבים של אינטרוולים */
const WORKOUTS = {
  upper: {
    id: "upper",
    title: "HIIT פלג גוף עליון",
    subtitle: "דחיפה · משיכה · ליבה",
    color: "#A3E635",
    rounds: 4,
    estMin: 36,
    warmup: ["armCircles", "marchInPlace", "hipHinge"],
    intervals: block(
      ["pushUp", "bentRow", "shoulderPress", "renegadeRow", "uprightRow", "boxing", "plank"],
      45,
      15
    ),
    cooldown: ["chestStretch", "catCow"],
  },
  metabolic: {
    id: "metabolic",
    title: "HIIT מטבולי לשריפה",
    subtitle: "דופק גבוה · עומס נמוך על הברך",
    color: "#FF6B35",
    rounds: 5,
    estMin: 32,
    warmup: ["marchInPlace", "armCircles", "hipHinge"],
    intervals: block(
      ["boxing", "wallPush", "standingPunchKnee", "fastFeetSeated", "standingOblique"],
      35,
      15
    ),
    cooldown: ["chestStretch", "hamstringStretch"],
  },
  core: {
    id: "core",
    title: "HIIT ליבה ויציבה",
    subtitle: "בטן · גב · ישבן",
    color: "#22D3EE",
    rounds: 4,
    estMin: 30,
    warmup: ["catCow", "birdDog", "marchInPlace"],
    intervals: block(
      ["plank", "deadBug", "gluteBridge", "plankShoulderTap", "flutterKick", "superman", "sidePlank"],
      40,
      15
    ),
    cooldown: ["catCow", "hamstringStretch"],
  },
  fullbody: {
    id: "fullbody",
    title: "HIIT גוף מלא",
    subtitle: "כוח + דופק משולב",
    color: "#C084FC",
    rounds: 4,
    estMin: 40,
    warmup: ["marchInPlace", "armCircles", "hipHinge"],
    intervals: block(
      ["pushUp", "boxing", "bentRow", "rdl", "gluteBridge", "shoulderPress", "wallPush", "plankShoulderTap"],
      45,
      15
    ),
    cooldown: ["chestStretch", "catCow", "hamstringStretch"],
  },
  power: {
    id: "power",
    title: "HIIT כוח מאסיבי",
    subtitle: "עצימות גבוהה · כל הגוף",
    color: "#F43F5E",
    rounds: 5,
    estMin: 42,
    warmup: ["marchInPlace", "armCircles", "hipHinge", "birdDog"],
    intervals: block(
      ["pushUp", "renegadeRow", "rdl", "shoulderPress", "boxing", "plankShoulderTap"],
      45,
      15
    ),
    cooldown: ["chestStretch", "catCow", "hamstringStretch"],
  },
  recovery: {
    id: "recovery",
    title: "התאוששות פעילה",
    subtitle: "ניידות · מתיחות · נשימה",
    color: "#34D399",
    rounds: 2,
    estMin: 18,
    warmup: ["marchInPlace"],
    intervals: block(["catCow", "birdDog", "gluteBridge", "deadBug"], 40, 25),
    cooldown: ["chestStretch", "hamstringStretch", "catCow"],
  },
};

/* תכנית שבועית (6 ימים + מנוחה) */
const WEEK = [
  { day: "ראשון", w: "upper", label: "פלג עליון" },
  { day: "שני", w: "power", label: "כוח מאסיבי" },
  { day: "שלישי", w: "recovery", label: "התאוששות" },
  { day: "רביעי", w: "core", label: "ליבה" },
  { day: "חמישי", w: "fullbody", label: "גוף מלא" },
  { day: "שישי", w: "metabolic", label: "מטבולי" },
  { day: "שבת", w: null, label: "מנוחה" },
];

const TIPS = [
  "שתו 0.5 ליטר מים לפני האימון ו-2.5–3.5 ליטר ביום — מים מאיצים שריפת שומן.",
  "עצרו מיד אם יש כאב חד בברך. אי-נוחות שרירית קלה זה בסדר — כאב מפרקי לא.",
  "שינה של 7–8 שעות חיונית: חוסר שינה מעלה רעב ומאט ירידה במשקל.",
  "גירעון קלורי מתון (300–500 קק\"ל) + חלבון גבוה = שריפת שומן עם שמירת שריר.",
  "כ-1.6–2 גרם חלבון לכל ק\"ג משקל גוף יעד עוזר לשובע ולשמירת מסת שריר.",
  "HIIT יוצר 'אפטרברן' (EPOC) — הגוף ממשיך לשרוף קלוריות שעות אחרי האימון.",
  "הוסיפו 8–10 אלף צעדים ביום (הליכה בעומס נמוך) להגדלת ההוצאה הקלורית.",
  "תיעוד האימונים מגביר התמדה — סמנו כל אימון שהשלמתם.",
];
