import { expect, test } from "@playwright/test";

test("renders the supplied article, author and image in a labelled card", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Article preview | Royer Adames");
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("article", { name: /Shift the overall look and feel/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Shift the overall look and feel by adding these wonderful touches to furniture in your home");
  await expect(page.getByText(/Ever been in a room and felt like something was missing\?/)).toBeVisible();
  await expect(page.getByText("Michelle Appleton", { exact: true })).toBeVisible();
  await expect(page.locator("time")).toHaveAttribute("datetime", "2020-06-28");
  const image = page.getByRole("img", { name: /green chest of drawers/ });
  expect(await image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
  await expect(page.getByRole("contentinfo").last()).toContainText("Frontend Mentor");
});

test("declares one site name in the footer, og:site_name and WebSite JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".site-name")).toHaveText("Article preview");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Article preview");
  const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
  expect(jsonLd).toEqual({ "@context": "https://schema.org", "@type": "WebSite", name: "Article preview", url: "https://article-preview-component-fm.royeradames.com/" });
});

test("share button toggles the share menu with mouse and shows the active colours", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto("/");
  const share = page.getByRole("button", { name: "Share this article" });
  const menu = page.getByRole("list", { name: "Share on" });
  await expect(share).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeHidden();
  await share.click();
  await expect(share).toHaveAttribute("aria-expanded", "true");
  await expect(menu).toBeVisible();
  await expect(share).toHaveCSS("color", "rgb(255, 255, 255)");
  const links = menu.getByRole("link");
  await expect(links).toHaveCount(3);
  await expect(links.nth(0)).toHaveAccessibleName("Facebook (opens in a new tab)");
  await expect(links.nth(0)).toHaveAttribute("href", /facebook\.com\/sharer\/sharer\.php\?u=http%3A%2F%2F127\.0\.0\.1/);
  await expect(links.nth(1)).toHaveAttribute("href", /twitter\.com\/intent\/tweet\?url=/);
  await expect(links.nth(2)).toHaveAttribute("href", /pinterest\.com\/pin\/create\/button\/\?url=/);
  const popover = page.locator(".share-menu");
  const shareBox = (await share.boundingBox())!;
  const popBox = (await popover.boundingBox())!;
  expect(popBox.y + popBox.height).toBeLessThan(shareBox.y);
  expect(Math.abs((popBox.x + popBox.width / 2) - (shareBox.x + shareBox.width / 2))).toBeLessThanOrEqual(1);
  await page.mouse.click(10, 10);
  await expect(menu).toBeHidden();
  await expect(share).toHaveAttribute("aria-expanded", "false");
});

test("keyboard opens the menu, tabs through the networks and Escape returns focus", async ({ page }) => {
  await page.goto("/");
  const share = page.getByRole("button", { name: "Share this article" });
  await share.focus();
  await page.keyboard.press("Enter");
  await expect(share).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Facebook (opens in a new tab)" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Twitter (opens in a new tab)" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(share).toBeFocused();
  await expect(share).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Space");
  await expect(share).toHaveAttribute("aria-expanded", "true");
  for (let i = 0; i < 4; i++) await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Frontend Mentor", exact: true })).toBeFocused();
  await expect(page.getByRole("list", { name: "Share on" })).toBeHidden();
});

test("mobile share opens as a bar over the author row", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await page.getByRole("button", { name: "Share this article" }).click();
  const bar = (await page.locator(".share-menu").boundingBox())!;
  const card = (await page.locator(".preview-card").boundingBox())!;
  expect(Math.round(bar.width)).toBe(Math.round(card.width));
  expect(Math.round(bar.y + bar.height)).toBe(Math.round(card.y + card.height));
  await expect(page.locator(".share-menu")).toHaveCSS("background-color", "rgb(72, 85, 106)");
});

test("stays inside 400, 768 and 1440 viewports, open or closed, with the family text and target floors", async ({ page }) => {
  for (const width of [375, 400, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Share this article" }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const menuBox = (await page.locator(".share-menu").boundingBox())!;
    expect(menuBox.x).toBeGreaterThanOrEqual(0);
    expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(width - 16);
    const buttonBox = (await page.getByRole("button", { name: "Share this article" }).boundingBox())!;
    const lastLink = (await page.getByRole("link", { name: "Pinterest (opens in a new tab)" }).boundingBox())!;
    if (width < 768) expect(lastLink.x + lastLink.width).toBeLessThanOrEqual(buttonBox.x);
    const smallText = await page.locator("h1, p, span, time, a, footer").evaluateAll(elements =>
      elements.filter(element => element.getClientRects().length > 0 && !element.classList.contains("sr-only") && element.textContent?.trim() && parseFloat(getComputedStyle(element).fontSize) < 16).map(element => element.textContent));
    expect(smallText).toEqual([]);
    for (const control of await page.locator("a:visible, button:visible").all()) {
      const box = await control.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(24);
      expect(box?.width).toBeGreaterThanOrEqual(24);
    }
  }
});

test("article content renders without JavaScript and nothing is written", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  const writes: string[] = [];
  page.on("request", request => { if (request.method() !== "GET") writes.push(request.url()); });
  try {
    await page.goto("http://127.0.0.1:4526/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Michelle Appleton", { exact: true })).toBeVisible();
    expect(writes).toEqual([]);
  } finally {
    await context.close();
  }
});

/* QA sweep October 8 (ICN1): at 320-360 the author name wraps, and the centred avatar drifted below the first line. */
test("the author photo lines up with the first line of the author text at every width", async ({ page }) => {
  for (const width of [320, 340, 360, 375, 400, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const offset = await page.locator(".author").evaluate(author => {
      const photo = author.querySelector("img")!.getBoundingClientRect();
      // Text-node rects only (as the sweep detector measures), so a block box spanning both name lines can't pass for the first line.
      const walker = document.createTreeWalker(author.querySelector("p")!, NodeFilter.SHOW_TEXT);
      const rects: DOMRect[] = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.nodeValue?.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        rects.push(...range.getClientRects());
      }
      const first = rects.sort((a, b) => a.top - b.top)[0];
      const centre = (photo.top + photo.bottom) / 2;
      return centre < first.top - 2 ? centre - first.top : centre > first.bottom + 2 ? centre - first.bottom : 0;
    });
    expect(offset, `avatar centre outside the first line at ${width}`).toBe(0);
  }
});
