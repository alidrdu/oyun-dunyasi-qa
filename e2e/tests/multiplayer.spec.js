const { test, expect } = require('@playwright/test');
const { openApp, expectScreen, pickMulti } = require('./helpers');

// Oyun kartı -> (başlatmak için gereken min./maks. karakter, açılacak ekran)
// Kaynak: refreshMpick() ve buildMpick() mantığı.
const MODES = [
  { card: 'card-fast', screen: 'fast', min: 2, max: 3 },
  { card: 'card-mine', screen: 'mine', min: 1, max: 3 },
  { card: 'card-mem', screen: 'mem', min: 1, max: 3 },
  { card: 'card-cups', screen: 'cups', min: 1, max: 3 },
  { card: 'card-simon', screen: 'simon', min: 1, max: 3 },
  { card: 'card-bask', screen: 'bask', min: 1, max: 3 },
  { card: 'card-mole', screen: 'mole', min: 1, max: 3 },
];

test.describe('Çok oyunculu seçim ekranı', () => {
  for (const m of MODES) {
    test(`${m.card}: en az ${m.min} oyuncu seçilince ▶️ çıkar ve oyun açılır`, async ({ page }) => {
      const errors = await openApp(page);
      await page.locator('#' + m.card).click();
      await expect(page.locator('#mgo')).not.toHaveClass(/show/);
      await pickMulti(page, Array.from({ length: m.min }, (_, i) => i));
      await expect(page.locator('#mgo')).toHaveClass(/show/);
      await page.locator('#mgo').click();
      await expectScreen(page, m.screen);
      expect(errors).toEqual([]);
    });
  }

  test('Hızlı Bas: tek oyuncuyla ▶️ görünmez', async ({ page }) => {
    await openApp(page);
    await page.locator('#card-fast').click();
    await pickMulti(page, [0]);
    await expect(page.locator('#mgo')).not.toHaveClass(/show/);
  });

  test('seçili karakter tekrar tıklanınca seçim kalkar', async ({ page }) => {
    await openApp(page);
    await page.locator('#card-mine').click();
    const first = page.locator('#mchars .char').nth(0);
    await first.click();
    await expect(first).toHaveClass(/sel/);
    await first.click();
    await expect(first).not.toHaveClass(/sel/);
    await expect(page.locator('#mgo')).not.toHaveClass(/show/);
  });

  test('en fazla 3 karakter seçili kalır (4. seçimde ilk seçilen düşer)', async ({ page }) => {
    // Varsayılan 3 karakter + 1 özel karakter ekleyerek 4 kişilik havuz oluşturuyoruz
    await openApp(page, {
      storage: {
        od_custom_chars: JSON.stringify([{ id: 'c1', name: 'Test', color: '#88f', src: 'photos/ali.jpg' }]),
      },
    });
    await page.locator('#card-mine').click();
    await pickMulti(page, [0, 1, 2, 3]);
    await expect(page.locator('#mchars .char.sel')).toHaveCount(3);
    await expect(page.locator('#mchars .char').nth(0)).not.toHaveClass(/sel/);
    await expect(page.locator('#mchars .char').nth(3)).toHaveClass(/sel/);
  });

  test('Hokey tam 2 oyuncu ister', async ({ page }) => {
    await openApp(page);
    await page.locator('#card-hockey').click();
    await pickMulti(page, [0]);
    await expect(page.locator('#mgo')).not.toHaveClass(/show/);
    await pickMulti(page, [1]);
    await expect(page.locator('#mgo')).toHaveClass(/show/);
    await page.locator('#mgo').click();
    await expectScreen(page, 'hockey');
  });

  test('geri düğmesi (Android geri tuşu) oyundan oyuncu seçimine döner', async ({ page }) => {
    await openApp(page);
    await page.locator('#card-mine').click();
    await pickMulti(page, [0]);
    await page.locator('#mgo').click();
    await expectScreen(page, 'mine');
    await page.evaluate(() => window.goBack());
    await expectScreen(page, 'mpick');
    await page.evaluate(() => window.goBack());
    await expectScreen(page, 'menu');
  });
});
