// apps/web/e2e/smoke.test.ts
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Smoke tests", () => {
  test("Landing page loads", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator("h1")).toContainText("Compete");
  });

  test("Login page renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    await expect(page.locator("input[type=email]")).toBeVisible();
    await expect(page.locator("input[type=password]")).toBeVisible();
    await expect(page.locator("button[type=submit]")).toBeVisible();
  });

  test("Signup page renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signup`);
    await expect(page.locator("input[type=email]")).toBeVisible();
    await expect(page.locator("input[type=password]")).toBeVisible();
  });

  test("Health check endpoint", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/health`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.db).toBe("connected");
  });

  test("Join page renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/join`);
    await expect(page.locator("input")).toBeVisible();
  });

  test("Login with demo account", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    await page.fill("input[type=email]", "ahmed@demo.com");
    await page.fill("input[type=password]", "password123");
    await page.click("button[type=submit]");
    await page.waitForURL(`${BASE_URL}/dashboard`);
    await expect(page.locator("h1")).toContainText("My Groups");
  });

  test("API returns 401 without auth", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/groups/demo-family`);
    expect(res.status()).toBe(401);
  });
});
