---
noteId: "72846eb0782911f1977bab4eab240b06"
tags: []

---

# News in Levels

**Canlı:** https://newsinlevels.vercel.app

Gerçek haberlerle dil öğrenme uygulaması. Her gün 3 gerçek haber çekilir ve OpenAI ile
**İngilizce, Almanca, Fransızca ve Türkçe** dillerinde **A1–C2** CEFR seviyelerine
uyarlanır — her seviye için kelime listesi ve kategori etiketiyle birlikte. Makale
sayfasındaki **Compare** düğmesi aynı haberi iki seviyede veya iki dilde yan yana açar.

Ayrıca **Gallery**: her gün The Met'in açık erişim koleksiyonundan kamu malı bir tablo
seçilir, model tabloya *bakarak* (görsel girdiyle) aynı seviye ve dillerde bir analiz yazar.

## Mimari

```
BBC RSS ──► pipeline/fetch-news.mjs ──► OpenAI (dil × seviye) ──► data/*.json
                    ▲                                                │
        GitHub Actions (her gün 05:00 UTC)                           ▼
                                                    Next.js statik site ──► GitHub Pages
```

- **`pipeline/fetch-news.mjs`** — RSS'ten haber seçer, tam metni çıkarır, her dil için
  tek OpenAI çağrısıyla 6 seviyeyi ve kelime listelerini üretir (haber başına 3 çağrı).
- **`data/`** — üretilen makaleler (`articles/*.json`), liste (`index.json`) ve
  işlenmiş URL kaydı (`processed.json`). Actions bunları repoya commit eder.
- **`app/`** — Next.js (statik export). Dil ve seviye seçimi tarayıcıda anında değişir,
  tercihler localStorage'da saklanır.
- **`pipeline/fetch-art.mjs`** — The Met Open Access API'sinden rastgele kamu malı bir
  tablo seçer, sanatçının Wikipedia özetiyle zemin hazırlar ve görseli modele gösterip
  seviyeli analiz üretir (`data/art/*.json`, `data/art-index.json`).
- **`.github/workflows/daily-news.yml`** — günlük haber pipeline'ı (05:00 UTC cron + elle).
  Yeni haberleri repoya commit eder; Vercel bu push'u görüp siteyi otomatik yeniden yayınlar.
- **`.github/workflows/daily-art.yml`** — günlük sanat pipeline'ı (05:30 UTC cron + elle).
- **`.github/workflows/backfill.yml`** — elle tetiklenir; eski makale ve tablolara eksik
  bir dili (örn. sonradan eklenen Türkçe) ve eksik kategorileri ekler:
  **Actions → Backfill language → Run workflow**.

## Kurulum

1. Repo ayarlarında **Settings → Secrets and variables → Actions → New repository secret**:
   - `OPENAI_API_KEY` = OpenAI API anahtarınız
2. [vercel.com/new](https://vercel.com/new) adresinden bu GitHub reposunu import edin
   (framework otomatik algılanır, ek ayar gerekmez).
3. İlk haberleri hemen üretmek için **Actions → Daily news pipeline → Run workflow**.

## Yerelde çalıştırma

```bash
npm install
npm run dev            # http://localhost:3000

# Pipeline'ı yerelde denemek için:
OPENAI_API_KEY=sk-... node pipeline/fetch-news.mjs
```

## Ayarlar (ortam değişkenleri)

| Değişken | Varsayılan | Açıklama |
|---|---|---|
| `ARTICLES_PER_RUN` | `3` | Çalıştırma başına haber sayısı |
| `OPENAI_MODEL` | `gpt-4o-mini` | Kullanılacak model |
| `FEED_URL` | BBC World RSS | Haber kaynağı RSS adresi |

## Maliyet notu

Günde 3 haber × (4 dil + 1 kategori çağrısı) = 15 `gpt-4o-mini` çağrısı ≈ günde
~70-90 bin token — aylık maliyet genellikle 1-2 doları geçmez.

`data/articles/2026-07-05-*.json` bir demo makaledir; ilk gerçek pipeline
çalışmasından sonra silebilirsiniz.
