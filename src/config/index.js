require('dotenv').config();

const config = {
    ai: {
        apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
        baseURL: 'https://api.deepseek.com',
        model: 'deepseek-chat',
        temperature: 0.8,
        maxTokens: 500
    },
    discord: {
        webhookUrl: process.env.DISCORD_WEBHOOK_URL,
        username: "Merak Üretici 🤖",
        avatarUrl: "https://raw.githubusercontent.com/google/material-design-icons/master/png/action/lightbulb/materialicons/48dp/1x/baseline_lightbulb_black_48dp.png",
        embedColor: 0x0099ff,
        footerText: "Her gün yeni bir bilgi öğren!",
        footerIconUrl: "https://cdn-icons-png.flaticon.com/512/2491/2491935.png"
    },
    scheduler: {
        startHour: 9,
        endHour: 19,
        choicesPerDay: 4,
        maxJitterMinutes: 10
    }
};

module.exports = config;
