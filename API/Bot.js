const axios = require('axios');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { message } = req.body;

        if (message && message.text === '/start') {
            const chatId = message.chat.id;
            const token = process.env.BOT_TOKEN; // ضعه في إعدادات Vercel

            const text = "أهلاً بك في بوت العروض! 📢 ستصلك هنا أفضل فرص الربح والتسويق بالعمولة فور صدورها.";
            
            await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
                chat_id: chatId,
                text: text
            });
        }
        return res.status(200).send('OK');
    }
    res.status(200).send('Bot is running...');
};
