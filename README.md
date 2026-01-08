# Merak AI Discord Generator

Bu proje, her saat başı OpenAI kullanarak ilginç bilgiler üretir ve bunları bir Discord kanalına gönderir.

## Kurulum ve Yapılandırma

Bu projenin GitHub Actions üzerinden çalışabilmesi için GitHub deponuzun (repository) **Settings > Secrets and variables > Actions** kısmına aşağıdaki iki secret'ı eklemeniz gerekir:

1.  `OPENAI_API_KEY`: OpenAI API anahtarınız.
2.  `DISCORD_WEBHOOK_URL`: Discord kanalınızın webhook URL'i.

## Özellikler

- **Akıllı Zamanlama:** Her gün TSİ 09:00 - 19:00 saatleri arasına yayılmış, rastgele belirlenen **4 farklı vakitte** paylaşım yapar.
- **Doğal Görünüm:** Paylaşımlar tam saat başında değil, seçilen saatin ilk 10 dakikası içinde rastgele bir anda (jitter) gerçekleşir.
- **Bağlamsal İçerik:** OpenAI prompt'u o günün tarihini ve gününü bilir; özel günlere veya tarihteki önemli olaylara değinebilir.
- **GPT-4o-mini:** En güncel, hızlı ve ekonomik dil modelini kullanır.

## Nasıl Çalışır?

- GitHub Actions (`.github/workflows/hourly-merak-discord.yml`) TSİ 09:00 - 19:00 arası her saat başı tetiklenir.
- `generate_discord.js` dosyası o günün tarihini kullanarak deterministik bir şekilde 4 şanslı saat belirler.
- Eğer çalışma saati bu 4 saatten biriyse, OpenAI üzerinden Türkçe ilginç bir bilgi üretilir ve Discord'a gönderilir.
- Manuel tetikleme (`workflow_dispatch`) durumunda şanslı saat beklenmeksizin anında gönderim yapılır.

## Yerel Geliştirme

Yerel olarak test etmek isterseniz:

```bash
# Node.js versiyonunu ayarlayın (eğer nvm yüklüyse)
nvm use

# Bağımlılıkları yükleyin
npm install

# Environment variable'ları set ederek çalıştırın
export OPENAI_API_KEY="your_key"
export DISCORD_WEBHOOK_URL="your_webhook"
node generate_discord.js
```

