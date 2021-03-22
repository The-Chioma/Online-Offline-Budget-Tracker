// creating cache variables
const CACHE = "budget-cache";
const DATA_CACHE = "budget-data-cache";

// important pages that need to be saved in the cache
const appUrlArray = [
  "/",
  "/db.js",
  "/index.js",
  "/styles.css",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

//adding event listener to install cache
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => {
      cache.addAll(appUrlArray);
    })
  );
});

//fetches the request and displays cached data
self.addEventListener("fetch", (e) => {
  if (e.request.url.includes("/api/")) {
    e.respondWith(
      caches
        .open(DATA_CACHE)
        .then((cache) => {
          return fetch(e.request)
            .then((res) => {
              if (res.status === 200) {
                cache.put(e.request.url, res.clone());
              }
              return res;
            })
            .catch(() => {
              return cache.match(e.request);
            });
        })
        .catch((err) => console.log(err))
    ).catch;
    return;
  }

  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request).then((res) => {
        return res;
      });
    })
  );
});
