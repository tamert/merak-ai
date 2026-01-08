# Merak AI Discord Generator

Bu proje, her saat başı OpenAI kullanarak ilginç bilgiler üretir ve bunları bir Discord kanalına gönderir.

## Kurulum ve Yapılandırma

Bu projenin GitHub Actions üzerinden çalışabilmesi için GitHub deponuzun (repository) **Settings > Secrets and variables > Actions** kısmına aşağıdaki iki secret'ı eklemeniz gerekir:

1.  `OPENAI_API_KEY`: OpenAI API anahtarınız.
2.  `DISCORD_WEBHOOK_URL`: Discord kanalınızın webhook URL'i.

## Nasıl Çalışır?

- GitHub Actions (`.github/workflows/hourly-merak-discord.yml`) her saat başı (`0 * * * *`) tetiklenir.
- `generate_discord.js` dosyası OpenAI GPT modeline bağlanır ve Türkçe ilginç bir bilgi üretir.
- Üretilen bilgi Discord Webhook üzerinden belirttiğiniz kanala gönderilir.

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

