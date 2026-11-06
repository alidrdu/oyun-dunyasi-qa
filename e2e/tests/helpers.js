const path = require('path');
const { pathToFileURL } = require('url');
const { expect } = require('@playwright/test');

// APP_FILE ile başka bir index.html (ör. bilerek bozulmuş kopya) test edilebilir.
const APP_URL = pathToFileURL(path.resolve(process.env.APP_FILE || path.join(__dirname, '../../app/src/main/assets/index.html'))).href;

/**
 * Uygulamayı açar, sayfa hatalarını toplar ve menünün göründüğünü doğrular.
 * @param {import('@playwright/test').Page} page
 * @param {{ storage?: Record<string,string> }} [opts] açılıştan önce localStorage'a yazılacak değerler
 * @returns {Promise<string[]>} JavaScript hata mesajları (boş olmalı)
 */
async function openApp(page, opts = {}) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  if (opts.storage) {
    await page.addInitScript((kv) => {
      for (const k of Object.keys(kv)) localStorage.setItem(k, kv[k]);
    }, opts.storage);
  }
  // Menü kartları sürekli hareket ettiği için Playwright "kararlı değil" diye bekler.
  // Oyun mantığı CSS animasyon olaylarına bağlı olmadığından testlerde animasyonları kapatıyoruz.
  await page.addInitScript(() => {
    const css = '*,*::before,*::after{animation:none!important;transition:none!important}';
    const add = () => { const s = document.createElement('style'); s.textContent = css; document.documentElement.appendChild(s); };
    if (document.documentElement) add(); else document.addEventListener('DOMContentLoaded', add);
  });
  await page.goto(APP_URL);
  await expect(page.locator('#menu')).toHaveClass(/active/);
  return errors;
}

/** Verilen ekranın (div#id.screen) şu an aktif olduğunu doğrular. */
async function expectScreen(page, id) {
  await expect(page.locator('#' + id)).toHaveClass(/active/);
}

/** Karakter seçim ekranındaki (#mchars) n. karakteri seçer. */
async function pickMulti(page, indices) {
  const chars = page.locator('#mchars .char');
  for (const i of indices) await chars.nth(i).click();
}

module.exports = { APP_URL, openApp, expectScreen, pickMulti };
