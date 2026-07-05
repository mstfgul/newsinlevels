---
noteId: "72846eb0782911f1977bab4eab240b06"
tags: []

---

# News in Levels

Gerçek haberlerle dil öğrenme uygulaması. Her gün 3 gerçek haber çekilir ve OpenAI ile
**İngilizce, Almanca ve Fransızca** dillerinde **A1–C2** CEFR seviyelerine uyarlanır —
her seviye için kelime listesiyle birlikte.

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
- **`.github/workflows/daily-news.yml`** — günlük pipeline (cron + elle tetikleme).
- **`.github/workflows/deploy.yml`** — her push'ta GitHub Pages'e dağıtım.

## Kurulum (GitHub)

1. GitHub'da bir repo oluşturup projeyi push edin.
2. Repo ayarlarında **Settings → Secrets and variables → Actions → New repository secret**:
   - `OPENAI_API_KEY` = OpenAI API anahtarınız
3. **Settings → Pages → Source: GitHub Actions** seçin.
4. İlk haberleri hemen üretmek için **Actions → Daily news pipeline → Run workflow**.

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

Günde 3 haber × 3 dil = 9 `gpt-4o-mini` çağrısı ≈ günde ~50-60 bin token —
aylık maliyet genellikle 1 doların altında kalır.

`data/articles/2026-07-05-*.json` bir demo makaledir; ilk gerçek pipeline
çalışmasından sonra silebilirsiniz.
