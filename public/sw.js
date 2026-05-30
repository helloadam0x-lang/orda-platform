const CACHE_NAME = 'orda-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

self.addEventListener('push', function(event) {
  if (!event.data) return
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || 'orda-notification',
    renotify: true,
    requireInteraction: data.requireInteraction || false,
    data: { url: data.url || '/dashboard', orderId: data.orderId },
    actions: data.actions || [],
  }
  event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  const url = event.notification.data?.url || '/dashboard'
  if (event.action === 'view') {
    event.waitUntil(clients.openWindow(url))
  } else {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          const dashClient = clientList.find(c => c.url.includes('/dashboard'))
          if (dashClient) return dashClient.focus()
          return clients.openWindow(url)
        })
    )
  }
})
