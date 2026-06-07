/* Service Worker — FlameFit PWA (offline + התקנה למסך הבית) */
const CACHE = "flamefit-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/css/style.css",
  "./assets/js/data.js",
  "./assets/js/app.js",
  "./assets/icons/icon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-180.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  // ניווטים (טעינת הדף): רשת-תחילה, ולעולם לא להחזיר תגובה עם הפניה (redirect)
  // — מונע את שגיאת Safari "Response served by service worker has redirections".
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => {
          // אם התקבלה הפניה — בונים מחדש תגובה "נקייה" בלי דגל redirected
          if (res && res.redirected) {
            return new Response(res.body, { status: res.status, statusText: res.statusText, headers: res.headers });
          }
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  e.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic" && !res.redirected) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
