import { expect, test } from "@playwright/test";

test("article text and open share label meet normal text contrast", async ({ page }) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const selector of [".excerpt", ".author time", ".share-label"]) {
      if (selector === ".share-label") await page.getByRole("button", { name: "Share this article" }).click();
      const result = await page.locator(selector).evaluate(element => {
        const luminance = (color: string) => {
          const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
          if (!channels || channels.length !== 3) throw new Error(`Unsupported computed color ${color}`);
          const linear = channels.map(channel => {
            const value = channel / 255;
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
        };
        let surface: Element | null = element;
        while (surface && ["rgba(0, 0, 0, 0)", "transparent"].includes(getComputedStyle(surface).backgroundColor)) surface = surface.parentElement;
        if (!surface) throw new Error("No opaque surface for text");
        const color = getComputedStyle(element).color;
        const background = getComputedStyle(surface).backgroundColor;
        const foregroundLuminance = luminance(color);
        const backgroundLuminance = luminance(background);
        return { color, background, fontSize: getComputedStyle(element).fontSize, ratio: (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05) };
      });
      expect.soft(result.ratio, `${selector} at ${width}: ${JSON.stringify(result)}`).toBeGreaterThanOrEqual(4.5);
    }
  }
});
