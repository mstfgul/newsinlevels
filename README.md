---
noteId: "72846eb0782911f1977bab4eab240b06"
tags: []

---

# AnyText — tanıtım sitesi

**Canlı:** https://anytext.art

Bu site artık bir içerik ürünü değil — **AnyText iOS uygulamasının** basit bir
tanıtım/karşılama sayfası. Site eskiden kendi başına günlük haber/sanat/film/kitap/
alıntı/tarih içeriği üreten bağımsız bir okuma ürünüydü (GitHub Actions + OpenAI ile);
o ürün artık AnyText'in kendisi (ayrı bir repo, `mobile/`), bu yüzden üretim hattı ve
tüm o içerik sayfaları kaldırıldı.

Sitede üç sayfa var:

- **`/`** — uygulamanın tanıtım metni ("coming soon", App Store bağlantısı henüz yok).
- **`/privacy/`** — gizlilik politikası, 7 dilde (tr/en/fr/it/es/de/nl) — Apple App Store
  incelemesi için gerekli.
- **`/support/`** — destek sayfası, aynı 7 dilde — abonelik yönetimi, hesap silme, hata
  bildirimi gibi soruların cevabı.

Gizlilik/destek içeriği `app/privacy/content.ts` ve `app/support/content.ts`'te yaşıyor;
dil seçici (`components/LegalLanguagePicker.tsx`) sayfa içi, URL değişmiyor.

## Mimari

Düz bir Next.js (App Router) sitesi — sunucu tarafında üretim/otomasyon yok, tamamen
statik. Vercel'e bağlı, `main`'e push'ta otomatik deploy olur. Tasarım dili (Bricolage
Grotesque + Literata + IBM Plex Mono + Caveat fontları, açık "kağıt"/koyu "kara tahta"
tema, el yazısı notlar, kırmızı kalem çizimi) `app/globals.css`'teki CSS custom
property'lerde tanımlı.

## Yerelde çalıştırma

```bash
npm install
npm run dev            # http://localhost:3000
```

```bash
npm run build           # prod derleme doğrulaması
```
