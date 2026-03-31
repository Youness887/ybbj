const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// التأكد من وجود المتغيرات قبل بدء التشغيل
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const botToken = process.env.BOT_TOKEN;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('البوت يعمل، بانتظار بيانات من تلغرام...');
  }

  try {
    const { message } = req.body;
    if (!message || !message.chat) return res.status(200).send('لا توجد رسالة');

    const chatId = message.chat.id;

    if (message.text === '/start') {
      // 1. محاولة إدخال المستخدم في القاعدة
      const { data, error } = await supabase
        .from('users')
        .insert([{ chat_id: chatId }]);

      // معالجة خطأ Supabase الخاص (مثل تكرار الـ ID أو جدول غير موجود)
      if (error) {
        console.error('❌ Supabase Error:', error.message);
        // إذا كان الخطأ أن المستخدم موجود مسبقاً (Unique constraint) لا نعتبره فشلاً
        if (error.code !== '23505') { 
             throw new Error(`Supabase logic error: ${error.message}`);
        }
      }

      // 2. محاولة إرسال رسالة عبر تلغرام
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: "تم تفعيل البوت بنجاح! 🚀"
      }).catch(err => {
        console.error('❌ Telegram API Error:', err.response?.data || err.message);
      });
    }

    return res.status(200).json({ status: 'success' });

  } catch (err) {
    // التقاط أي خطأ غير متوقع (مثل سقوط الخادم أو نقص التوكن)
    console.error('🔥 Global Crash Error:', err.message);
    return res.status(200).json({ error: 'Internal Server Error', details: err.message });
  }
}
