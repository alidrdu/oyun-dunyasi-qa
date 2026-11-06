const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');
const { openApp, expectScreen, pickMulti } = require('./helpers');

const ASSETS = path.resolve(__dirname, '../../app/src/main/assets');

test.describe('7 Fark: bulmaca verisi', () => {
  test('her seviyede bulmaca var ve her bulmacada en az 7 fark tanımlı', async ({ page }) => {
    await openApp(page);
    const levels = await page.evaluate(() => window.LEVELS);
    expect(levels.length).toBeGreaterThanOrEqual(1);
    for (const lv of levels) {
      expect(lv.puzzles.length, `seviye ${lv.id} boş`).toBeGreaterThan(0);
      for (const p of lv.puzzles) {
        expect(p.diffs.length, `${p.id}: fark sayısı`).toBeGreaterThanOrEqual(7);
      }
    }
  });

  // BULGU: Oyunun adı "7 Fark" ama bulmacaların çoğunda 7'den fazla fark var (7-10 arası).
  // Oyun bunu doğru işliyor (nokta sayısı fark sayısına göre oluşuyor); isim/içerik uyuşmazlığı.
  // Bu test mevcut dağılımı kayıt altına alır, değişirse haber verir.
  test('BİLGİ: tam 7 farkı olan bulmaca sayısı (isim ile içerik uyuşmazlığı)', async ({ page }) => {
    await openApp(page);
    const counts = await page.evaluate(() => [].concat(...window.LEVELS.map((l) => l.puzzles.map((p) => p.diffs.length))));
    const exactlySeven = counts.filter((n) => n === 7).length;
    test.info().annotations.push({ type: 'bulgu', description: `${counts.length} bulmacanın yalnızca ${exactlySeven} tanesinde tam 7 fark var; dağılım: ${counts.join(',')}` });
    expect(Math.min(...counts)).toBe(7);
    expect(Math.max(...counts)).toBeLessThanOrEqual(10);
  });

  test('oyun, fark sayısı kadar ilerleme noktası oluşturur', async ({ page }) => {
    await openApp(page);
    await page.locator('#card-diff').click();
    await pickMulti(page, [0]);
    await page.locator('#mgo').click();
    await page.locator('#lvBox .lvl').first().click();
    await page.locator('#gGrid .gth').first().click();
    await expectScreen(page, 'diff');
    const expected = await page.evaluate(() => window.LEVELS[0].puzzles[0].diffs.length);
    await expect(page.locator('#dDots .dot')).toHaveCount(expected);
  });

  test('fark koordinatları 0-1 aralığında ve yarıçap pozitif', async ({ page }) => {
    await openApp(page);
    const levels = await page.evaluate(() => window.LEVELS);
    for (const lv of levels) for (const p of lv.puzzles) for (const d of p.diffs) {
      expect(d.x, `${p.id} x`).toBeGreaterThanOrEqual(0);
      expect(d.x, `${p.id} x`).toBeLessThanOrEqual(1);
      expect(d.y, `${p.id} y`).toBeGreaterThanOrEqual(0);
      expect(d.y, `${p.id} y`).toBeLessThanOrEqual(1);
      expect(d.r, `${p.id} r`).toBeGreaterThan(0);
    }
  });

  test('bulmaca ID’leri benzersiz ve görsel dosyaları (a, b, küçük resim) mevcut', async ({ page }) => {
    await openApp(page);
    const levels = await page.evaluate(() => window.LEVELS);
    const ids = new Set();
    for (const lv of levels) for (const p of lv.puzzles) {
      expect(ids.has(p.id), `yinelenen id: ${p.id}`).toBe(false);
      ids.add(p.id);
      for (const key of ['t', 'a', 'b']) {
        expect(fs.existsSync(path.join(ASSETS, p[key])), `${p.id}.${key} dosyası yok: ${p[key]}`).toBe(true);
      }
    }
  });
});

test.describe('7 Fark: akış', () => {
  test('karakter seç -> seviyeler -> galeri -> bulmaca açılır', async ({ page }) => {
    const errors = await openApp(page);
    await page.locator('#card-diff').click();
    await pickMulti(page, [0]);
    await page.locator('#mgo').click();
    await expectScreen(page, 'dlev');
    await page.locator('#lvBox .lvl').first().click();
    await expectScreen(page, 'dgal');
    await page.locator('#gGrid .gth').first().click();
    await expectScreen(page, 'diff');
    expect(errors).toEqual([]);
  });

  test('7 Fark’ta karakter seçimi tekildir (ikinci seçim birinciyi değiştirir)', async ({ page }) => {
    await openApp(page);
    await page.locator('#card-diff').click();
    await pickMulti(page, [0, 1]);
    await expect(page.locator('#mchars .char.sel')).toHaveCount(1);
  });

  test('çözülmüş bulmacalar seviye ekranında "x/5" olarak sayılır', async ({ page }) => {
    await openApp(page, { storage: { 'oyun.diff.solved': JSON.stringify(['e01', 'e02']) } });
    await page.locator('#card-diff').click();
    await pickMulti(page, [0]);
    await page.locator('#mgo').click();
    await expect(page.locator('#lvBox .lvl').first()).toContainText('2/5');
  });

  test('galeride çözülen bulmacada ✔ işareti görünür', async ({ page }) => {
    await openApp(page, { storage: { 'oyun.diff.solved': JSON.stringify(['e01']) } });
    await page.locator('#card-diff').click();
    await pickMulti(page, [0]);
    await page.locator('#mgo').click();
    await page.locator('#lvBox .lvl').first().click();
    await expect(page.locator('#gGrid .gth .tick')).toHaveCount(1);
  });
});
