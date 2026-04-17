export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Every hour
      } catch (error) {
        console.error('SW registration failed:', error);
      }
    });
  }
}
