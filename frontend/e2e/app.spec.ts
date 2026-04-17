import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should show TankCheck title and bottom navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'TankCheck' })).toBeVisible();
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    await expect(nav.locator('text=Suche')).toBeVisible();
    await expect(nav.locator('text=Favoriten')).toBeVisible();
    await expect(nav.locator('text=Alarme')).toBeVisible();
    await expect(nav.locator('text=Einstellungen')).toBeVisible();
  });

  test('should show geolocation consent dialog on first visit', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Standort freigeben').first()).toBeVisible({ timeout: 5000 });
  });

  test('should show fuel type selector', async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 52.52, longitude: 13.405 });
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('tankcheck_geo_consent', 'true');
    });
    await page.reload();
    await expect(page.locator('text=Diesel')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate to favorites page', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav').locator('text=Favoriten').click();
    await expect(page).toHaveURL('/favorites');
    await expect(page.locator('text=Favoriten').first()).toBeVisible();
  });

  test('should navigate to alerts page', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav').locator('text=Alarme').click();
    await expect(page).toHaveURL('/alerts');
    await expect(page.getByRole('heading', { name: 'Preisalarme', exact: true })).toBeVisible();
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav').locator('text=Einstellungen').click();
    await expect(page).toHaveURL('/settings');
  });
});

test.describe('Favorites Page', () => {
  test('should show empty state when no favorites', async ({ page }) => {
    await page.goto('/favorites');
    await expect(page.locator('text=Noch keine Favoriten')).toBeVisible();
  });
});

test.describe('Alerts Page', () => {
  test('should show empty state when no alerts', async ({ page }) => {
    await page.goto('/alerts');
    await expect(page.locator('text=Noch keine Preisalarme')).toBeVisible();
  });
});

test.describe('Settings Page', () => {
  test('should show settings options', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('text=Kraftstoffart')).toBeVisible();
    await expect(page.locator('text=Suchradius')).toBeVisible();
  });

  test('should show attribution links', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('text=Tankerkönig')).toBeVisible();
    await expect(page.locator('text=OpenStreetMap')).toBeVisible();
  });

  test('should show privacy information', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('text=Datenschutz')).toBeVisible();
    await expect(page.locator('text=Standortdaten')).toBeVisible();
  });
});

test.describe('PWA', () => {
  test('should have web app manifest', async ({ page }) => {
    await page.goto('/');
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute('href', '/manifest.json');
  });

  test('manifest should be valid JSON', async ({ request }) => {
    const response = await request.get('/manifest.json');
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.name).toContain('TankCheck');
    expect(json.display).toBe('standalone');
    expect(json.icons).toBeDefined();
    expect(json.icons.length).toBeGreaterThan(0);
  });

  test('should have theme color meta tag', async ({ page }) => {
    await page.goto('/');
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content', '#2563eb');
  });
});

test.describe('Mobile Viewport', () => {
  test('should render bottom nav at viewport bottom', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    const box = await nav.boundingBox();
    const viewport = page.viewportSize();
    expect(box).toBeTruthy();
    expect(viewport).toBeTruthy();
    if (box && viewport) {
      expect(box.y + box.height).toBeCloseTo(viewport.height, -1);
    }
  });
});

test.describe('Offline Page', () => {
  test('offline.html should be accessible', async ({ request }) => {
    const response = await request.get('/offline.html');
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text).toContain('offline');
  });
});
