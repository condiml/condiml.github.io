const CACHE_NAME = 'uiguy-v1';
const urlsToCache = [
	'/',
	'/index.html',
	'/links.css',
	'/motion.js',
	'/peterbenoit.jpeg',
	'/favicon.ico',
	'/site.webmanifest',
	'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css',
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
					// Don't cache responses from external resources
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
				});
			})
	);
});
