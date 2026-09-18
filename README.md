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

Sitede dört sayfa var:

- **`/`** — DailyArt esinli sanatsal ana sayfa (ST-103): Instrument Serif masthead + App Store
  rozeti + altta 10 eserlik "eser duvarı" (kaydırmaya bağlı parallax, giriş animasyonu, hover,
  tıklayınca tam ekran görüntüleyici). Açık tema = kağıt masası (bantlı eğik kupürler), koyu tema
  = tam siyah gece galerisi (aynı kupürler bantsız/düz). Sonra sırayla: seviye merdiveni demosu
  (`LevelDemo`, görünüme girince A1→C2 otomatik tur), kelimeye dokunma demosu (`WordDemo`, 14 sözlük
  dili), sabit telefon scrollytelling (`PhoneStory`, `public/demo/` ekran kayıtları açık+koyu), on
  türlük ızgara (`KindsGrid`), dil marquee'si (`LanguageMarquee`), hikâye teaser'ı, kapanış CTA.
  Bileşenler `components/home/`, veri `lib/{gallery,languages,demo-glossary,level-samples}.ts`.
  Animasyon: `motion` (framer-motion'ın devamı) + CSS keyframe'leri; `prefers-reduced-motion`
  her yerde (MotionProvider `reducedMotion="user"` + globals.css).
- **`/story/`** — Mustafa'nın kendi sesinden, neden bu uygulamayı yaptığını anlatan kısa
  bir hikaye, 7 dilde (tr/en/fr/it/es/de/nl).
- **`/privacy/`** — gizlilik politikası, 7 dilde (tr/en/fr/it/es/de/nl) — Apple App Store
  incelemesi için gerekli.
- **`/support/`** — destek sayfası, aynı 7 dilde — abonelik yönetimi, hesap silme, hata
  bildirimi gibi soruların cevabı.

Gizlilik/destek/hikaye içeriği sırasıyla `app/privacy/content.ts`, `app/support/content.ts`,
`app/story/content.ts`'te yaşıyor; dil seçici (`components/LegalLanguagePicker.tsx`) sayfa
içi, URL değişmiyor.

## Mimari

Düz bir Next.js (App Router) sitesi — sunucu tarafında üretim/otomasyon yok, tamamen
statik. Vercel'e bağlı, `main`'e push'ta otomatik deploy olur. Tasarım dili (Bricolage
Grotesque + Literata + IBM Plex Mono + Caveat + Instrument Serif fontları, açık
"kağıt"/koyu "kara tahta" tema, el yazısı notlar, kırmızı kalem çizimi, gerçek sanat
eserlerinden bantlı kupürler — `components/Clipping.tsx`) `app/globals.css`'teki CSS
custom property'lerde tanımlı.

## Galeri (public/gallery)

50 kamu malı eser, `scripts/gallery-list.mjs`'teki küratörlü listeden `scripts/fetch-gallery.mjs`
ile üretilir: Wikimedia Commons `imageinfo`+`extmetadata` (lisans PD/CC0 değilse reddedilir),
1600px thumb indirilir, `sharp` ile 640px + 1400px WebP'ye çevrilir, `lib/gallery.ts` manifesti +
`public/gallery/CREDITS.md` yazılır. `--sheet` kontak sayfası üretir (git'e girmez), `--only id`
tek eseri yeniler, `--force` yeniden indirir. Havuzdaki (`qid`) eserler için `../mobile/functions/
pipeline/art-famous-data.js` okunur (`--pool` ile yol değiştirilebilir).

```bash
PATH=/usr/local/bin:$PATH node scripts/fetch-gallery.mjs --sheet
```

`APP_STORE_URL` `lib/site.ts`'te — link gelene kadar rozet tıklanmaz.

## Demo videoları (public/demo)

`{today,reader,collection}-{light,dark}.mp4` + `.webp` poster. Kaynak: uygulamanın onboarding ekran
kayıtları (`../mobile/AnyText/AnyText/Resources/Videos/`), ffmpeg ile `scale=-2:1280,fps=30`,
libx264 crf 27, `+faststart`, sessiz; poster ilk kare (ffmpeg PNG → sharp WebP). Yeni ham iPhone
kayıtları gelince aynı tarifle değiştirilir; dosya adları sabittir (`PhoneStory` bunlara bakar).

## Yerelde çalıştırma

> Bu Mac'te Homebrew node kırık; her komutun önüne `PATH=/usr/local/bin:$PATH` koy (node 22).

```bash
npm install
npm run dev            # http://localhost:3000
```

```bash
npm run build           # prod derleme doğrulaması
```
