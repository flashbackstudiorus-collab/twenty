self.addEventListener('push', (event) => {
  let payload = { title: 'Auto-lab CRM', body: '', url: '/' };
  try {
    payload = { ...payload, ...event.data.json() };
  } catch (e) {
    payload.body = event.data ? event.data.text() : '';
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/images/icons/android/android-launchericon-192-192.png',
      badge: '/images/icons/android/android-launchericon-96-96.png',
      data: { url: payload.url },
      tag: payload.url,
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || '/', self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const sameOrigin = clients.find((c) => c.url.startsWith(self.location.origin));
      if (sameOrigin && 'navigate' in sameOrigin) {
        return sameOrigin.navigate(url).then((c) => c && c.focus());
      }
      return self.clients.openWindow(url);
    }),
  );
});
