const OpenAI = require('openai');
const config = require('../config');

class AIService {
    constructor() {
        this.client = new OpenAI({
            apiKey: config.ai.apiKey,
            baseURL: config.ai.baseURL
        });
    }

    /**
     * Generates a "Merak" (Curiosity) fact using the AI model.
     * @returns {Promise<string>} - The generated content.
     */
    async generateMerak() {
        const today = new Date();
        const dateTurkish = today.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        });

        const systemPrompt = `Sen 'Merak Üretici' adında bir botsun. Görevin, insanlar için ilgi çekici, öğretici ve merak uyandırıcı, az bilinen bir bilgi (fact) üretmek. 
Dilin Türkçe olmalı. Bilgi kısa, öz ve dikkat çekici bir başlıkla sunulmalı.

FORMAT ŞABLONU:
**BAŞLIK**
[İçerik]

Bugünün tarihi: ${dateTurkish}. Eğer bugüne özel (tarihte bugün, mevsim, özel gün vb.) ilginç bir bağlantı kurabiliyorsan kur, yoksa genel bir ilginç bilgi ver.

ÖRNEK:
**Süper Güçlü Bir Yapıştırıcı: Mıknatıs Bakterisi**
Magnetospirillum adlı bakteri, vücudunda manyetit kristalleri üreterek Dünya'nın manyetik alanını hissedebilir ve buna göre yön bulabilir. Bu "biyomanyetizma" sayesinde suda dikey hareket ederler.`;

        try {
            const response = await this.client.chat.completions.create({
                model: config.ai.model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: "Bugün için rastgele ve ilginç bir merak konusu üret. Tarihle bağlantılı olmaya çalış." }
                ],
                temperature: config.ai.temperature,
                max_tokens: config.ai.maxTokens,
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('DeepSeek/OpenAI API Error:', error);
            // Fallback content
            return `**${dateTurkish} İlginç Bilgisi**\nBugün dünyada yaklaşık 8,7 milyon canlı türü olduğu tahmin ediliyor, ancak bunların sadece 1,2 milyonu bilimsel olarak tanımlanmış durumda!`;
        }
    }
}

module.exports = new AIService();
