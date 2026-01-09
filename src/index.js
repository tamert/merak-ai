const config = require('./config');
const aiService = require('./services/aiService');
const discordService = require('./services/discordService');
const { getWinningHoursForToday, sleep } = require('./utils/scheduler');

async function main() {
    // 1. Validation
    if (!config.ai.apiKey || !config.discord.webhookUrl) {
        console.error('HATA: DEEPSEEK_API_KEY veya DISCORD_WEBHOOK_URL eksik!');
        process.exit(1);
    }

    // 2. Schedule Check
    const currentHourTRT = (new Date().getUTCHours() + 3) % 24;
    const winningHours = getWinningHoursForToday(config.scheduler.startHour, config.scheduler.choicesPerDay);

    console.log(`Bugünün şanslı saatleri: ${winningHours.join(', ')}`);
    console.log(`Şu anki saat (TSİ): ${currentHourTRT}`);
    console.log(`API Kullanılıyor: DeepSeek (Model: ${config.ai.model})`);

    const isManualRun = process.env.GITHUB_EVENT_NAME === 'workflow_dispatch';
    const isScheduledTime = winningHours.includes(currentHourTRT);

    if (isManualRun || isScheduledTime) {
        // 3. Jitter (Random Delay) to avoid bot detection / precise timing
        const maxJitterMs = config.scheduler.maxJitterMinutes * 60 * 1000;
        const jitter = Math.floor(Math.random() * maxJitterMs);

        console.log(`${Math.round(jitter / 60000)} dakika sonra gönderilecek...`);
        await sleep(jitter);

        // 4. Generate Content
        console.log('İçerik üretiliyor...');
        const content = await aiService.generateMerak();

        // 5. Send to Discord
        if (content) {
            console.log('Discord\'a gönderiliyor...');
            await discordService.send(content);
        }
    } else {
        console.log('Bu saatte paylaşım yapılmayacak.');
    }
}

main().catch(err => {
    console.error('Unhandled Exception:', err);
    process.exit(1);
});
