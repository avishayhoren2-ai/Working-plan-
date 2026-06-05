# 📲 הפיכת FlameFit לאפליקציה שמתקינים למסך הבית (PWA) ב-Lovable

כדי שההתקנה תעבוד עם **אייקון הלהבה** ובמסך מלא, צריך 3 דברים: קבצים ב-`public/`,
קטע ב-`index.html`, ורישום Service Worker (כבר נמצא בקוד `FlameFit.tsx`).

---

## שלב 1 — העלאת הקבצים לתיקיית `public/`
העתק את כל הקבצים האלה לתיקיית **`public/`** של פרויקט ה-Lovable:

```
public/manifest.json
public/sw.js
public/icon.svg
public/icon-192.png
public/icon-512.png
public/icon-maskable.png
public/apple-touch-icon.png
```

> ב-Lovable: גרור את הקבצים ל-`public/`, או בקש מהצ'אט: "Add these files to the public folder".
> כל מה שב-`public/` מוגש מהשורש (למשל `public/icon-192.png` → `/icon-192.png`).

---

## שלב 2 — הוספת הקוד הבא ל-`index.html` בתוך `<head>`
(ב-Lovable: פתח את `index.html` והדבק לפני `</head>`)

```html
<!-- FlameFit PWA -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#0a0d12" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="icon" type="image/svg+xml" href="/icon.svg" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="FlameFit" />
```

---

## שלב 3 — Service Worker
**כבר מטופל בקוד** `FlameFit.tsx` (יש בו `useEffect` שרושם את `/sw.js`).
רק ודא שהקובץ `public/sw.js` הועלה (שלב 1). זהו.

---

## ✅ בדיקה
1. **פרסם** את האפליקציה ב-Lovable (Publish) — חובה HTTPS, ש-Lovable מספק.
2. פתח את הקישור בנייד:
   - **אנדרואיד/Chrome:** יופיע כפתור "התקן" באפליקציה (או תפריט ⋮ → "התקנת אפליקציה").
   - **אייפון/Safari:** כפתור שיתוף ⬆️ → "הוסף למסך הבית".
3. האפליקציה תיפתח במסך מלא עם **אייקון הלהבה** 🔥.

> טיפ: ההתקנה ועבודה לא-מקוונת פועלות רק ב-**גרסה המפורסמת** (Published), לא תמיד בתצוגה
> המקדימה של העורך. אם עדכנת קבצים — רענן פעמיים כדי לעקוף את מטמון ה-Service Worker.
