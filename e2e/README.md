# Oyun Dünyası – Uçtan Uca (E2E) Testler

[Playwright](https://playwright.dev) ile yazılmış, uygulamanın `index.html` dosyasını tablet boyutunda
(1280×800, dokunmatik) açıp kullanıcı akışlarını doğrulayan testler. Uygulama koduna dokunmaz.

## Çalıştırma

```bash
cd e2e
npm install
npx playwright install chromium
npm test            # tüm testler
npm run report      # HTML raporu
```

Başka bir `index.html` sürümünü test etmek için: `APP_FILE=/yol/index.html npm test`

## Kapsam (47 test)

| Dosya | Ne doğrular |
|---|---|
| `menu.spec.js` | Menü açılır, 12 oyun kartı görünür, her kart doğru ekranı açar, 🏠 menüye döner, JS hatası yok |
| `rps.spec.js` | Taş-Kağıt-Makas: karakter seçimi, kazanan kuralı, beraberlik, çift seçim engeli, puan sıfırlama |
| `multiplayer.spec.js` | Oyuncu seçim kuralları (min/maks kişi, Hokey tam 2, Hızlı Bas en az 2), geri tuşu akışı |
| `characters.spec.js` | Karakter listesi, özel karakterlerin localStorage'dan yüklenmesi, bozuk veride çökmeme |
| `diff.spec.js` | 7 Fark: bulmaca verisi bütünlüğü (koordinat, benzersiz id, görsel dosyaları), seviye/galeri akışı, çözülen sayacı |

### Kasıtlı olarak kapsam dışı (gerçek cihazda elle test edilir)
- Kamera ve galeri izinleri, fotoğraf kırpma (cihaz özelliği)
- Ses efektleri
- Canvas oyunlarında (Hokey, Basket, Meyve Sepeti, Oval Pist) çoklu parmak dokunuşu ve zamanlama dengesi
- Gerçek tablette performans ve dokunmatik hassasiyeti

## Yöntem notları
- Menü kartları sürekli animasyonludur; testlerde CSS animasyonları kapatılır (oyun mantığı animasyon olaylarına bağlı değildir).
- Testlerin hata yakaladığı **mutasyon kontrolüyle** doğrulandı: kazanan kuralı bilerek tersine çevrilen bir kopyada 3 test başarısız oldu.

## Bulgular

| # | Bulgu | Önem | Durum |
|---|---|---|---|
| 1 | "7 Fark" oyununda 15 bulmacanın yalnızca 5'inde tam 7 fark var; diğerlerinde 8–10 fark tanımlı (oyun bunu doğru işliyor, ilerleme noktaları fark sayısına göre oluşuyor). Oyun adı ile içerik uyuşmuyor. | Düşük | Açık (ürün kararı) |

## Hata raporu şablonu

```
Başlık:
Ortam: (cihaz / Android sürümü / APK tarihi)
Adımlar:
1.
2.
Beklenen:
Gerçekleşen:
Önem: Kritik / Yüksek / Orta / Düşük
Ek: (ekran görüntüsü, video, log)
```
