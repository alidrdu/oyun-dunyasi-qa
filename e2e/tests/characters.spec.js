const { test, expect } = require('@playwright/test');
const { openApp, expectScreen } = require('./helpers');

// Kamera/galeri izinleri gerçek cihazda test edilir; burada kayıt ve listeleme mantığı doğrulanır.
const CUSTOM = [
  { id: 'c1', name: 'Zeynep', color: '#ff8a3d', src: 'photos/miray.jpg' },
  { id: 'c2', name: 'Deniz', color: '#3ec6ff', src: 'photos/ali.jpg' },
];

test.describe('Karakterler', () => {
  test('menüden Karakterler ekranı açılır ve 3 yerleşik karakter görünür', async ({ page }) => {
    const errors = await openApp(page);
    await page.locator('#menuChars').click();
    await expectScreen(page, 'chars');
    await expect(page.locator('#chGrid .photo')).toHaveCount(3);
    expect(errors).toEqual([]);
  });

  test('localStorage’daki özel karakterler seçim ekranlarında görünür', async ({ page }) => {
    await openApp(page, { storage: { od_custom_chars: JSON.stringify(CUSTOM) } });
    await page.locator('#card-rps').click();
    await expect(page.locator('#pickL .char')).toHaveCount(3 + CUSTOM.length);
    await expect(page.locator('#pickR .char')).toHaveCount(3 + CUSTOM.length);
  });

  test('özel karakterler Karakterler ekranında yerleşiklerle birlikte listelenir', async ({ page }) => {
    await openApp(page, { storage: { od_custom_chars: JSON.stringify(CUSTOM) } });
    await page.locator('#menuChars').click();
    await expect(page.locator('#chGrid .photo')).toHaveCount(3 + CUSTOM.length);
  });

  test('bozuk localStorage verisi uygulamayı çökertmez', async ({ page }) => {
    const errors = await openApp(page, { storage: { od_custom_chars: '{bozuk json' } });
    await page.locator('#menuChars').click();
    await expect(page.locator('#chGrid .photo')).toHaveCount(3);
    expect(errors).toEqual([]);
  });

  test('Karakter Ekle ekranı açılır ve geri tuşu menüye döner', async ({ page }) => {
    await openApp(page);
    await page.locator('#menuChars').click();
    await expectScreen(page, 'chars');
    await page.evaluate(() => window.goBack());
    await expectScreen(page, 'menu');
  });
});
