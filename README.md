# Oyun Dünyası – QA Projesi

Tablet için bir çocuk oyunu koleksiyonu (12 oyun, 1–4 kişi aynı ekranda) ve bu uygulama için yazdığım
**Playwright uçtan uca (e2e) test paketi.**

> Uygulama, kişisel bir proje olarak ürün tasarımı bana ait olmak üzere yapay zekâ desteğiyle (Claude) geliştirildi.
> Test stratejisi, kapsam kararları ve bulguların değerlendirilmesi bana aittir; testlerin kodlanmasında da yapay zekâ desteği kullandım.

## Öne çıkanlar
- **47 e2e test**, tablet boyutunda (1280×800) dokunmatik tarayıcıda çalışır, hepsi geçer.
- **Mutasyon kontrolü:** Kazanan kuralı bilerek bozulmuş bir kopyada ilgili 3 test başarısız oldu. Yani testler gerçekten hata yakalıyor, sadece "yeşil" üretmiyor.
- **Gerçek bulgu:** "7 Fark" oyununda 15 bulmacanın yalnızca 5'inde tam 7 fark var (diğerlerinde 8–10). Oyun bunu doğru işliyor; isim/içerik uyuşmazlığı. Ayrıntı: [`e2e/README.md`](e2e/README.md).
- Gerçek Android tablette elle test de yapıldı (kamera/galeri, ses, çoklu parmak dokunuş gibi cihaza bağlı kısımlar otomasyon kapsamı dışında).

## Çalıştırma
```bash
cd e2e
npm install
npx playwright install chromium
npm test
```

## Klasörler
| Yol | İçerik |
|---|---|
| `app/src/main/assets/` | Oyunların tamamı: `index.html` (HTML/CSS/JS), `puzzles.js` ve bulmaca görselleri |
| `e2e/` | Playwright testleri, test planı, kapsam dışı bırakılanlar, bulgular, hata raporu şablonu |

## Notlar
- Karakter fotoğrafları gizlilik nedeniyle depoda yoktur. Oyun, görsel yüklenemezse emoji ile devam eder; testler buna göre yazıldı.
- Android APK ve derleme dosyaları depoya dahil edilmedi.
