// creating cache variables
var CACHE = "budget-cache";
var DATA_CACHE = "budget-data-cache";

// important pages that need to be saved in the cache
var appUrlArray = [
    "/",
    "/db.js",
    "/index.js",
    "/styles.css",
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
]

window.addEventListener("install", function(e) {
    e.waitUntil(
        caches.open(CACHE).then(function(cache) {
            return cache.addAll(appUrlArray)
        })
    )
}) 
