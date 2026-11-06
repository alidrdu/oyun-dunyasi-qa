const { test, expect } = require('@playwright/test');
const { openApp, expectScreen } = require('./helpers');

// Seçimler: 0 = taş, 1 = kağıt, 2 = makas
async function startRps(page) {
  await page.locator('#card-rps').click();
  await expectScreen(page, 'pick');
  await page.locator('#pickL .char').nth(0).click();
  await page.locator('#pickR .char').nth(1).click();
  await expect(page.locator('#go')).toHaveClass(/show/);
  await page.locator('#go').click();
  await expectScreen(page, 'rps');
}

test.describe('Taş Kağıt Makas', () => {
  test('iki oyuncu seçilmeden ▶️ düğmesi görünmez', async ({ page }) => {
    await openApp(page);
    await page.locator('#card-rps').click();
    await expect(page.locator('#go')).not.toHaveClass(/show/);
    await page.locator('#pickL .char').nth(0).click();
    await expect(page.locator('#go')).not.toHaveClass(/show/);
    await page.locator('#pickR .char').nth(1).click();
    await expect(page.locator('#go')).toHaveClass(/show/);
  });

  test('sol oyuncunun seçtiği karakter sağ tarafta "alınmış" işaretlenir', async ({ page }) => {
    await openApp(page);
    await page.locator('#card-rps').click();
    await page.locator('#pickL .char').nth(0).click();
    await expect(page.locator('#pickR .char').nth(0)).toHaveClass(/taken/);
  });

  test('kağıt taşı yener: sol oyuncu 1 puan alır', async ({ page }) => {
    const errors = await openApp(page);
    await startRps(page);
    await page.locator('#chL .choice[data-c="1"]').click(); // sol: kağıt
    await page.locator('#chR .choice[data-c="0"]').click(); // sağ: taş
    await expect(page.locator('#starL b')).toHaveText('1', { timeout: 8000 });
    await expect(page.locator('#starR b')).toHaveText('0');
    expect(errors).toEqual([]);
  });

  test('makas kağıdı yener: sağ oyuncu 1 puan alır', async ({ page }) => {
    await openApp(page);
    await startRps(page);
    await page.locator('#chL .choice[data-c="1"]').click(); // sol: kağıt
    await page.locator('#chR .choice[data-c="2"]').click(); // sağ: makas
    await expect(page.locator('#starR b')).toHaveText('1', { timeout: 8000 });
    await expect(page.locator('#starL b')).toHaveText('0');
  });

  test('berabere kalınca kimse puan almaz', async ({ page }) => {
    await openApp(page);
    await startRps(page);
    await page.locator('#chL .choice[data-c="2"]').click();
    await page.locator('#chR .choice[data-c="2"]').click();
    await expect(page.locator('#banL')).toHaveText('🤝', { timeout: 8000 });
    await expect(page.locator('#starL b')).toHaveText('0');
    await expect(page.locator('#starR b')).toHaveText('0');
  });

  test('aynı oyuncu bir turda ikinci kez seçim yapamaz', async ({ page }) => {
    await openApp(page);
    await startRps(page);
    await page.locator('#chL .choice[data-c="0"]').click();
    await expect(page.locator('#chL')).toHaveClass(/off/);
    // ikinci tıklama sayılmamalı: sağ taş seçerse berabere (0-0), kağıt'a dönüşmemeli
    await page.locator('#chL .choice[data-c="1"]').click({ force: true });
    await page.locator('#chR .choice[data-c="0"]').click();
    await expect(page.locator('#banL')).toHaveText('🤝', { timeout: 8000 });
  });

  test('geri/ev düğmesi menüye döner ve puanlar sıfırlanır', async ({ page }) => {
    await openApp(page);
    await startRps(page);
    await page.locator('#chL .choice[data-c="1"]').click();
    await page.locator('#chR .choice[data-c="0"]').click();
    await expect(page.locator('#starL b')).toHaveText('1', { timeout: 8000 });
    await page.locator('#rps [data-home]').click();
    await expectScreen(page, 'menu');
    await page.locator('#card-rps').click();
    await page.locator('#pickL .char').nth(0).click();
    await page.locator('#pickR .char').nth(1).click();
    await page.locator('#go').click();
    await expect(page.locator('#starL b')).toHaveText('0');
  });
});
