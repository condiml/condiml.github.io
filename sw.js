const CACHE_NAME = 'watermeloz-v2';
const urlsToCache = [
	'/',
	'/index.html',
	'/assets/index-CPsE0OGf.css',
	'/assets/index-CUrEQgII.js',
	'/assets/music-player.css',
	'/assets/music-player.js',
	'/assets/overlay.css',
	'/assets/overlay-handler.js',
	'/assets/discord-status.css',
	'/assets/discord-status.js',
	'/watermeloz.jpeg',
	'/nhacnen.mp3',
	'/favicon.ico',
	'/site.webmanifest',
	'https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css',
	'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap'
];

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => {
				return cache.addAll(urlsToCache);
			})
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
			.then(response => {
				// Return cached version or fetch from network
				return response || fetch(event.request).then(response => {
					// Don't cache responses from external resources or failed requests
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}

					// Clone the response as it can only be consumed once
					const responseToCache = response.clone();

					caches.open(CACHE_NAME)
						.then(cache => {
							cache.put(event.request, responseToCache);
						});

					return response;
				}).catch(error => {
					console.error('Fetch failed:', error);
					// Return cached version if available, even if stale
					return caches.match(event.request);
				});
			})
	);
});

// Clean up old caches
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (cacheName !== CACHE_NAME) {
						console.log('Deleting old cache:', cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});
