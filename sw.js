// Service worker: gör att appen går att installera och öppnas utan uppkoppling.
// Strategi "nätverk först": med uppkoppling hämtas alltid senaste versionen,
// utan uppkoppling används den sparade kopian. Väder- och SL-data cachas inte,
// de ska alltid vara färska.

var CACHE = "busskoll-v1";
var FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
                             .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    // "no-cache": fråga alltid servern om det finns en ny version (GitHub Pages
    // låter annars webbläsaren använda en gammal kopia i upp till 10 minuter).
    fetch(e.request, { cache: "no-cache" }).then(function (resp) {
      if (resp.ok) {
        var copy = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      }
      return resp;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || caches.match("./"); });
    })
  );
});
