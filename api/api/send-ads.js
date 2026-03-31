const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// ربط قاعدة البيانات
const supabase = createClient(process.env.https://iqtflitvgvjskbdrjqkc.supabase.co, process.env.H7wSvGhgRdcvfdvSlPDrQw_YhirOp21);

export default async function handler(req, res) {
  // السماح فقط بطلبات POST من لوحة تحكمك
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, token } = req.body;

  try {
    // 1. جلب قائمة كل الـ Chat IDs من الجدول
    const { data: users, error } = await supabase
      .from('users')
      .select('chat_id');

    if (error) throw error;
    if (!users || users.length === 0) {
      return res.status(200).json({ success: false, error: 'لا يوجد مشتركين في القاعدة بعد!' });
    }

    // 2. إرسال الرسالة لكل مشترك (عملية جماعية)
    const sendPromises = users.map(user => {
      return axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: user.chat_id,
        text: message,
        parse_mode: 'HTML' // يتيح لك وضع روابط وتنسيق نص
      }).catch(err => console.log(`فشل الإرسال للمستخدم ${user.chat_id}`));
    });

    await Promise.all(sendPromises);

    // 3. الرد على لوحة التحكم بالنجاح
    return res.status(200).json({ 
      success: true, 
      count: users.length 
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
