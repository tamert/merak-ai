const fetch = require('node-fetch');
const config = require('../config');

class DiscordService {
    /**
     * Sends the generated content to Discord via Webhook.
     * @param {string} content - The markdown content to send.
     * @returns {Promise<void>}
     */
    async send(content) {
        if (!content) return;

        const payload = {
            content: `🔔 **Günün Merak Dozu!**\n\n${content}\n\n*DeepSeek AI ile üretilmiştir*`,
            username: config.discord.username,
            avatar_url: config.discord.avatarUrl,
            embeds: [{
                color: config.discord.embedColor,
                footer: {
                    text: config.discord.footerText,
                    icon_url: config.discord.footerIconUrl
                }
            }]
        };

        try {
            const response = await fetch(config.discord.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log('Discord\'a başarıyla gönderildi!');
            } else {
                console.error(`Discord Webhook Error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Discord Send Error:', error);
        }
    }
}

module.exports = new DiscordService();
