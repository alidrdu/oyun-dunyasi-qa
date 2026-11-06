const { test, expect } = require('@playwright/test');
const { openApp, expectScreen } = require('./helpers');

// Menüdeki kart -> tıklayınca açılması gereken ekran
const GAMES = [
  ['card-rps', 'pick'],
  ['card-fast', 'mpick'],
  ['card-mine', 'mpick'],
  ['card-mem', 'mpick'],
  ['card-diff', 'mpick'],
  ['card-cups', 'mpick'],
  ['card-hockey', 'mpick'],
  ['card-simon', 'mpick'],
  ['card-bask', 'mpick'],
  ['card-mole', 'mpick'],
  ['card-fruit', 'mpick'],
  ['card-race', 'mpick'],
];

test.describe('Menü', () => {
  test('uygulama açılır, başlık ve 12 oyun kartı görünür, JS hatası yok', async ({ page }) => {
    const errors = await openApp(page);
    await expect(page.locator('#menuTitle')).not.toBeEmpty();
    await expect(page.locator('#menu .card')).toHaveCount(12);
    for (const [id] of GAMES) await expect(page.locator('#' + id)).toBeVisible();
    expect(errors).toEqual([]);
  });

  for (const [card, screen] of GAMES) {
    test(`${card} kartı ${screen} ekranını açar ve 🏠 menüye döndürür`, async ({ page }) => {
      const errors = await openApp(page);
      await page.locator('#' + card).click();
      await expectScreen(page, screen);
      await page.locator(`#${screen} [data-home]`).first().click();
      await expectScreen(page, 'menu');
      expect(errors).toEqual([]);
    });
  }

  test('oyunlar arası gezinti sonrası aynı anda yalnızca bir ekran aktiftir', async ({ page }) => {
    await openApp(page);
    await page.locator('#card-rps').click();
    await expect(page.locator('.screen.active')).toHaveCount(1);
    await page.locator('#pick [data-home]').click();
    await expect(page.locator('.screen.active')).toHaveCount(1);
  });
});
