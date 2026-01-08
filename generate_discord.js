const OpenAI = require('openai');
const fetch = require('node-fetch');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Rastgele gecikme (0-15 dakika arası) - "Tam saat başı" hissini kırmak için
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateMerak() {
    const today = new Date();
    const dateTurkish = today.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long'
    });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Sen 'Merak Üretici' adında bir botsun. Görevin, insanlar için ilgi çekici, öğretici ve merak uyandırıcı, az bilinen bir bilgi (fact) üretmek. 
                    Dilin Türkçe olmalı. Bilgi kısa, öz ve dikkat çekici bir başlıkla sunulmalı.
                    Bugünün tarihi: ${dateTurkish}. Eğer bugüne özel (tarihte bugün, mevsim, özel gün vb.) ilginç bir bağlantı kurabiliyorsan kur, yoksa genel bir ilginç bilgi ver.`
                },
                {
                    role: "user",
                    content: "Bugün için rastgele ve ilginç bir merak konusu üret."
                }
            ],
            temperature: 0.8,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI Error:', error);
        return null;
    }
}

async function sendToDiscord(content) {
    if (!content) return;

    const payload = {
        content: `🔔 **Günün Merak Dozu!**\n\n${content}`,
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

// Günlük deterministik olarak 4 rastgele saat seçer (9 ile 19 arası)
function getWinningHoursForToday() {
    const dateSeed = new Date().toISOString().split('T')[0];
    const seed = dateSeed.split('-').reduce((a, b) => parseInt(a) + parseInt(b), 0);

    // Basit bir seeded random (Lcg) mantığı ile 4 saat seçimi
    const hours = [];
    let currentSeed = seed;

    while (hours.length < 4) {
        currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
        const hour = 9 + (currentSeed % 11); // 9-19 arası
        if (!hours.includes(hour)) {
            hours.push(hour);
        }
    }
    return hours.sort((a, b) => a - b);
}

async function main() {
    if (!process.env.OPENAI_API_KEY || !process.env.DISCORD_WEBHOOK_URL) {
        console.error('HATA: OPENAI_API_KEY veya DISCORD_WEBHOOK_URL eksik!');
        process.exit(1);
    }

    const currentHourTRT = (new Date().getUTCHours() + 3) % 24;
    const winningHours = getWinningHoursForToday();

    console.log(`Bugünün şanslı saatleri: ${winningHours.join(', ')}`);
    console.log(`Şu anki saat (TSİ): ${currentHourTRT}`);

    // Workflow_dispatch (manuel) çalıştırılmışsa veya o günkü şanslı saatlerden biriyse çalıştır
    if (process.env.GITHUB_EVENT_NAME === 'workflow_dispatch' || winningHours.includes(currentHourTRT)) {
        // Tam saat başında atmamak için rastgele 0-10 dk bekle
        const jitter = Math.floor(Math.random() * 600000);
        console.log(`${jitter / 60000} dakika sonra gönderilecek...`);
        await sleep(jitter);

        const content = await generateMerak();
        if (content) {
            await sendToDiscord(content);
        }
    } else {
        console.log('Bu saatte paylaşım yapılmayacak.');
    }
}

main();

