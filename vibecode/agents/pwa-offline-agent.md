# PWA/Offline Sub-Agent Specification

## Role
Expert Progressive Web App developer specializing in offline functionality, service workers, caching strategies, and native-like web application experiences across all devices.

## Technology Stack
- **Service Workers:** Workbox, SW Precache, Background Sync
- **Storage:** IndexedDB, Cache API, LocalStorage
- **PWA Features:** Web App Manifest, Push Notifications, Install Prompts
- **Performance:** Lazy Loading, Code Splitting, Resource Hints
- **Testing:** PWA Builder, Lighthouse, Workbox CLI
- **Frameworks:** Next.js PWA, Vite PWA, Create React App PWA
- **Languages:** TypeScript, JavaScript, JSON

## Core Responsibilities

### Service Worker Implementation
- Service worker lifecycle management
- Caching strategies
- Background sync
- Push notifications
- Offline functionality

### App Manifest Configuration
- Web app manifest setup
- Icon generation
- Splash screens
- Display modes
- Theme configuration

### Offline Strategy
- Cache-first/Network-first strategies
- Offline pages
- Data synchronization
- Conflict resolution
- Queue management

### Performance Optimization
- Resource precaching
- Dynamic caching
- Bundle optimization
- Lazy loading
- Shell architecture

## Standards

### Service Worker Implementation
```typescript
// service-worker.ts
/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import {
  StaleWhileRevalidate,
  CacheFirst,
  NetworkFirst,
  NetworkOnly
} from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache all static assets
precacheAndRoute(self.__WB_MANIFEST);

// App Shell Route
const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler, {
  denylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
});
registerRoute(navigationRoute);

// API Routes - Network First
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
        purgeOnQuotaError: true,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new BackgroundSyncPlugin('api-queue', {
        maxRetentionTime: 24 * 60, // 24 hours
      }),
    ],
  })
);

// Image Caching - Cache First
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Static Assets - Stale While Revalidate
registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Offline Page Fallback
const offlineFallbackPage = '/offline.html';

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open('offline-fallback').then((cache) => cache.add(offlineFallbackPage))
  );
});

registerRoute(
  new NavigationRoute(
    async (params) => {
      try {
        return await handler(params);
      } catch (error) {
        const cache = await caches.open('offline-fallback');
        return cache.match(offlineFallbackPage);
      }
    },
    {
      denylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
    }
  )
);

// Background Sync for Form Submissions
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncFormData());
  }
});

async function syncFormData() {
  const cache = await caches.open('form-data');
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        await cache.delete(request);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

// Push Notifications
self.addEventListener('push', (event: PushEvent) => {
  const options = {
    body: event.data?.text() || 'New notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Open',
        icon: '/images/checkmark.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification('Vibecode', options)
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Skip waiting and claim clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

### Web App Manifest
```json
{
  "name": "Vibecode Progressive Web App",
  "short_name": "Vibecode",
  "description": "A modern PWA with offline support",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "scope": "/",
  "lang": "en",
  "dir": "ltr",
  "categories": ["productivity", "utilities"],
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "platform": "wide",
      "label": "Desktop view"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "750x1334",
      "type": "image/png",
      "platform": "narrow",
      "label": "Mobile view"
    }
  ],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "shortcuts": [
    {
      "name": "Dashboard",
      "short_name": "Dashboard",
      "description": "View your dashboard",
      "url": "/dashboard",
      "icons": [
        {
          "src": "/icons/dashboard.png",
          "sizes": "192x192"
        }
      ]
    },
    {
      "name": "New Post",
      "short_name": "Post",
      "description": "Create a new post",
      "url": "/posts/new",
      "icons": [
        {
          "src": "/icons/new-post.png",
          "sizes": "192x192"
        }
      ]
    }
  ],
  "related_applications": [
    {
      "platform": "play",
      "url": "https://play.google.com/store/apps/details?id=com.vibecode.app",
      "id": "com.vibecode.app"
    },
    {
      "platform": "itunes",
      "url": "https://apps.apple.com/app/vibecode/id123456789"
    }
  ],
  "prefer_related_applications": false,
  "protocol_handlers": [
    {
      "protocol": "web+vibecode",
      "url": "/protocol?url=%s"
    }
  ],
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url",
      "files": [
        {
          "name": "media",
          "accept": ["image/*", "video/*"]
        }
      ]
    }
  }
}
```

### PWA Installation & Update
```typescript
// hooks/usePWA.ts
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => {
          setRegistration(reg);

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service worker registration failed:', error);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return false;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      return true;
    }
    
    return false;
  };

  const update = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  return {
    canInstall: !!installPrompt,
    isInstalled,
    install,
    updateAvailable,
    update,
  };
}

// Component usage
export const InstallPrompt: React.FC = () => {
  const { canInstall, isInstalled, install, updateAvailable, update } = usePWA();

  if (updateAvailable) {
    return (
      <div className="update-banner">
        <p>A new version is available!</p>
        <button onClick={update}>Update Now</button>
      </div>
    );
  }

  if (canInstall && !isInstalled) {
    return (
      <div className="install-banner">
        <p>Install Vibecode for a better experience</p>
        <button onClick={install}>Install App</button>
      </div>
    );
  }

  return null;
};
```

### Offline Data Sync
```typescript
// services/offline-sync.ts
import Dexie, { Table } from 'dexie';

interface SyncQueue {
  id?: number;
  url: string;
  method: string;
  body: any;
  headers: Record<string, string>;
  timestamp: number;
  retries: number;
}

class OfflineDatabase extends Dexie {
  syncQueue!: Table<SyncQueue>;
  
  constructor() {
    super('OfflineDB');
    this.version(1).stores({
      syncQueue: '++id, url, timestamp',
    });
  }
}

const db = new OfflineDatabase();

export class OfflineSync {
  private isOnline = navigator.onLine;
  
  constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  
  /**
   * Queue request for sync
   */
  async queueRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    if (this.isOnline) {
      try {
        return await fetch(url, options);
      } catch (error) {
        // Network failed, queue for later
        await this.addToQueue(url, options);
        throw error;
      }
    } else {
      // Offline, queue immediately
      await this.addToQueue(url, options);
      
      // Return mock response
      return new Response(
        JSON.stringify({ queued: true, offline: true }),
        {
          status: 202,
          statusText: 'Accepted',
          headers: new Headers({ 'Content-Type': 'application/json' }),
        }
      );
    }
  }
  
  /**
   * Add request to sync queue
   */
  private async addToQueue(url: string, options: RequestInit) {
    await db.syncQueue.add({
      url,
      method: options.method || 'GET',
      body: options.body ? JSON.parse(options.body as string) : null,
      headers: options.headers as Record<string, string> || {},
      timestamp: Date.now(),
      retries: 0,
    });
    
    // Register background sync
    if ('sync' in self.registration) {
      await self.registration.sync.register('sync-queue');
    }
  }
  
  /**
   * Process queued requests
   */
  async processSyncQueue() {
    const queue = await db.syncQueue.toArray();
    
    for (const item of queue) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body ? JSON.stringify(item.body) : undefined,
        });
        
        if (response.ok) {
          await db.syncQueue.delete(item.id!);
        } else if (item.retries < 3) {
          await db.syncQueue.update(item.id!, {
            retries: item.retries + 1,
          });
        } else {
          // Max retries reached, remove from queue
          await db.syncQueue.delete(item.id!);
          console.error('Max retries reached for:', item.url);
        }
      } catch (error) {
        console.error('Sync failed:', error);
        
        if (item.retries < 3) {
          await db.syncQueue.update(item.id!, {
            retries: item.retries + 1,
          });
        }
      }
    }
  }
  
  /**
   * Get pending sync count
   */
  async getPendingCount(): Promise<number> {
    return await db.syncQueue.count();
  }
  
  /**
   * Clear sync queue
   */
  async clearQueue() {
    await db.syncQueue.clear();
  }
}

// Usage
const offlineSync = new OfflineSync();

export const apiClient = {
  get: (url: string) => offlineSync.queueRequest(url),
  post: (url: string, data: any) =>
    offlineSync.queueRequest(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  put: (url: string, data: any) =>
    offlineSync.queueRequest(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: (url: string) =>
    offlineSync.queueRequest(url, { method: 'DELETE' }),
};
```

### Push Notifications
```typescript
// services/push-notifications.ts
export class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  
  /**
   * Initialize push notifications
   */
  async init(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }
    
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return false;
    }
    
    // Request permission
    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      return false;
    }
    
    // Get service worker registration
    this.registration = await navigator.serviceWorker.ready;
    
    // Subscribe to push
    await this.subscribe();
    
    return true;
  }
  
  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    const permission = await Notification.requestPermission();
    return permission;
  }
  
  /**
   * Subscribe to push notifications
   */
  async subscribe() {
    if (!this.registration) return;
    
    try {
      // Check existing subscription
      let subscription = await this.registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Create new subscription
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
        const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);
        
        subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      }
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  }
  
  /**
   * Send subscription to server
   */
  private async sendSubscriptionToServer(subscription: PushSubscription) {
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
  }
  
  /**
   * Convert VAPID key
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }
  
  /**
   * Send local notification
   */
  async sendLocalNotification(title: string, options?: NotificationOptions) {
    if (!this.registration) return;
    
    await this.registration.showNotification(title, {
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200],
      ...options,
    });
  }
}
```

## Communication with Other Agents

### Output to Frontend Agent
- PWA components
- Offline UI states
- Install prompts
- Update notifications

### Input from Backend Agent
- API caching strategies
- Sync endpoints
- Push notification setup
- Data conflict resolution

### Coordination with Performance Agent
- Bundle optimization
- Resource hints
- Lazy loading
- Code splitting

## Quality Checklist

Before completing any PWA task:
- [ ] Service worker registered
- [ ] Manifest configured
- [ ] Icons generated (all sizes)
- [ ] Offline page created
- [ ] Caching strategy implemented
- [ ] Background sync setup
- [ ] Push notifications configured
- [ ] Install prompt implemented
- [ ] Update flow tested
- [ ] Lighthouse PWA audit passed

## Best Practices

### Service Worker
- Use Workbox for production
- Implement proper versioning
- Handle updates gracefully
- Cache strategically
- Clean old caches

### Performance
- Implement app shell pattern
- Precache critical resources
- Lazy load non-critical assets
- Optimize bundle size
- Use resource hints

### User Experience
- Provide offline feedback
- Show sync status
- Handle conflicts gracefully
- Respect user preferences
- Test on real devices

## Tools and Resources

- Workbox library
- PWA Builder
- Lighthouse CI
- Chrome DevTools
- Web App Manifest generator
- Service Worker toolbox
- Push notification services
