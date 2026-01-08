const OpenAI = require('openai');
const fetch = require('node-fetch');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

async function generateMerak() {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4", // Veya istediğiniz bir model, örneğin "gpt-3.5-turbo"
            messages: [
                {
                    role: "system",
                    content: "Sen 'Merak Üretici' adında bir botsun. Görevin, insanlar için ilgi çekici, öğretici ve merak uyandırıcı, az bilinen bir bilgi (fact) üretmek. Dilin Türkçe olmalı. Bilgi kısa, öz ve dikkat çekici bir başlıkla sunulmalı."
                },
                {
                    role: "user",
                    content: "Bugün için rastgele ve ilginç bir merak konusu üret."
                }
            ],
            temperature: 0.8,
        });

        const merakContent = response.choices[0].message.content;
        return merakContent;
    } catch (error) {
        console.error('OpenAI Error:', error);
        return null;
    }
}

async function sendToDiscord(content) {
    if (!content) return;

    const payload = {
        content: `🔔 **Saatlik Merak Dozu!**\n\n${content}`,
        username: "Merak Üretici",
        avatar_url: "https://raw.githubusercontent.com/google/material-design-icons/master/png/action/lightbulb/materialicons/48dp/1x/baseline_lightbulb_black_48dp.png"
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log('Discord\'a başarıyla gönderildi!');
        } else {
            console.error('Discord Webhook Error:', response.statusText);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

async function main() {
    if (!process.env.OPENAI_API_KEY || !process.env.DISCORD_WEBHOOK_URL) {
        console.error('HATA: OPENAI_API_KEY veya DISCORD_WEBHOOK_URL eksik!');
        process.exit(1);
    }

    const content = await generateMerak();
    if (content) {
        await sendToDiscord(content);
    }
}

main();
