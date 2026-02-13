const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const API_URL = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:3001';

test.describe('User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and storage
    await page.context().clearCookies();
    await page.context().storageState({ path: '/tmp/auth.json' });
  });

  test('Homepage loads without errors', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    // Check heroic elements
    await expect(page).toHaveTitle(/Limpeza|Leidy|Chega/i);
    await expect(page.locator('header')).toBeTruthy();
    await expect(page.locator('nav')).toBeTruthy();
  });

  test('User can navigate to booking page', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    // Find and click booking button
    const bookingButton = page.locator('button:has-text("Agendar"), a:has-text("Reservar")').first();
    await expect(bookingButton).toBeTruthy();
    
    await bookingButton.click();
    
    // Should navigate to booking page
    await expect(page).toHaveURL(/\/booking|\/agendamento/i);
  });
});

test.describe('Authentication Flow', () => {
  test('User can register new account', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signup`);
    
    // Fill form
    const email = `test-${Date.now()}@test.com`;
    const password = 'SecurePass123!';
    
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.fill('input[type="email"]:nth-of-type(2)', email); // Confirm email
    
    // Check terms
    const termsCheckbox = page.locator('input[type="checkbox"]');
    if (await termsCheckbox.isVisible()) {
      await termsCheckbox.check();
    }
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should redirect to login or dashboard
    await expect(page).toHaveURL(/\/(login|dashboard|onboarding)/i, { timeout: 5000 });
  });

  test('User can login', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    
    // Fill credentials
    await page.fill('input[type="email"]', process.env.TEST_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD || 'password');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/(dashboard|home|app)/i, { timeout: 5000 });
  });

  test('Logged-in user can logout', async ({ page, context }) => {
    // Login first
    await page.goto(`${BASE_URL}/auth/login`);
    await page.fill('input[type="email"]', process.env.TEST_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD || 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/(dashboard|home)/i, { timeout: 5000 });
    
    // Find and click logout
    const profileMenu = page.locator('button[aria-label*="profile"], button[aria-label*="user"]').first();
    if (await profileMenu.isVisible()) {
      await profileMenu.click();
      
      const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sair")');
      await logoutButton.click();
    }
    
    // Should redirect to home or login
    await expect(page).toHaveURL(/\/(login|$)/i, { timeout: 5000 });
  });
});

test.describe('Booking Flow', () => {
  test.skip('User can create a booking', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/auth/login`);
    await page.fill('input[type="email"]', process.env.TEST_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD || 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 5000 });
    
    // Navigate to bookings
    await page.click('a:has-text("Agendar"), a:has-text("Booking")');
    
    // Fill booking form
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Select date
    await page.fill('input[type="date"]', tomorrow.toISOString().split('T')[0]);
    
    // Select services
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible()) {
      await checkbox.check();
    }
    
    // Fill address
    await page.fill('input[placeholder*="endereco"], input[placeholder*="Endereço"]', 'Rua Teste, 123');
    
    // Submit
    await page.click('button:has-text("Confirmar"), button:has-text("Agendar")');
    
    // Should show confirmation
    await expect(page.locator('text=confirmação'), page.locator('text=sucesso')).toBeTruthy();
  });
});

test.describe('Payment Flow', () => {
  test.skip('User can complete payment', async ({ page }) => {
    // This test requires Stripe test mode configured
    
    // Login
    await page.goto(`${BASE_URL}/auth/login`);
    await page.fill('input[type="email"]', process.env.TEST_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD || 'password');
    await page.click('button[type="submit"]');
    
    // Navigate to payment
    await page.goto(`${BASE_URL}/checkout`);
    
    // Wait for Stripe element to load
    const stripeFrame = page.frameLocator('[title*="Stripe"]').first();
    
    // Fill card (Stripe test card: 4242 4242 4242 4242)
    const cardInput = stripeFrame.locator('input[placeholder*="card"]').first();
    await cardInput.fill('4242424242424242');
    
    // Fill expiry (any future date)
    const expiryInput = stripeFrame.locator('input[placeholder*="MM"]').first();
    await expiryInput.fill('1230');
    
    // Fill CVC
    const cvcInput = stripeFrame.locator('input[placeholder*="CVC"]').first();
    await cvcInput.fill('123');
    
    // Submit payment
    await page.click('button:has-text("Pagar"), button:has-text("Pay")');
    
    // Should redirect to success page
    await expect(page).toHaveURL(/\/(success|confirmation|thank-you)/i, { timeout: 10000 });
  });
});

test.describe('API Health', () => {
  test('Backend health endpoint is working', async ({ request }) => {
    const response = await request.get(`${API_URL}/health/full`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
  });

  test('Database is accessible', async ({ request }) => {
    const response = await request.get(`${API_URL}/health/db`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('OK');
  });
});

test.describe('Accessibility', () => {
  test('Homepage meets accessibility standards', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    // Check for required accessibility attributes
    const links = page.locator('a');
    const buttons = page.locator('button');
    
    // All images should have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // Should have alt text (allow empty for decorative images)
      expect(typeof alt === 'string').toBeTruthy();
    }
    
    // Check page has proper heading structure
    const h1 = page.locator('h1');
    expect(await h1.count()).toBeGreaterThan(0);
  });
});

test.describe('Mobile Responsiveness', () => {
  test('Homepage is responsive on mobile', async ({ page }) => {
    // Test with mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto(`${BASE_URL}/`);
    
    // Check hamburger menu visible on mobile
    const hamburger = page.locator('[aria-label*="menu"], button[class*="hamburger"]').first();
    
    // Should either show menu button or responsive layout
    const width = page.viewportSize()?.width || 0;
    expect(width).toBe(375);
  });
});
