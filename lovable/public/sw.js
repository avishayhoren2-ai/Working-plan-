/* FlameFit Service Worker — מאפשר התקנה למסך הבית + עבודה לא-מקוונת */
const CACHE = "flamefit-v2";

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["/", "/index.html", "/manifest.json", "/icon.svg"]).catch(() => {})));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // ניווטים: רשת-תחילה, ובלי להחזיר תגובה עם הפניה (מונע שגיאת Safari)
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => (res && res.redirected ? new Response(res.body, { status: res.status, statusText: res.statusText, headers: res.headers }) : res))
        .catch(() => caches.match("/index.html").then((r) => r || caches.match("/")))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) => {
      const net = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic" && !res.redirected) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || net;
    })
  );
});
