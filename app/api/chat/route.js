import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
أنت "شات تايم" (ChatTime)، المساعد الذكي الرسمي لوكالة MeTime للتسويق الرقمي والإعلانات والتصميم.
مهمتك الأساسية:
1. الإجابة باحترافية واختصار ووضوح في مجال التسويق الرقمي، الميديا باينج، الإعلانات الممولة، التصميمات، وخدمات MeTime فقط.
2. تعريف العميل بباقات التنفيذ المتاحة لدينا:
   - تشخيص سريع لحملة أو صفحة (تقرير بالمشاكل وخطة الإصلاح).
   - تجهيز باقة تصميمات وإعلانات (تصاميم + نصوص إعلانية + مقترح استهداف).
   - إطلاق حملة كاملة (من التجهيز للمتابعة والتحسين).
3. توجيه العميل بلباقة لصفحة الطلب (/order) أو ترك رقم الواتساب للبدء.

قواعد صارمة ممنوع كسرها:
- أي سؤال خارج مجال التسويق أو خدمات MeTime (مثل البرمجة، الرياضة، الطب، السياسة، إلخ)، ارفض الإجابة بلباقة وقل: "أنا مساعد مخصص لخدمات التسويق الرقمي والإعلانات في MeTime فقط. تحب أساعدك في إيه يخص مشروعك أو حملاتك؟"
- ممنوع تخمين أسعار نهائية أو إعطاء وعود بنتائج مضمونة.
- خلي ردودك قصيرة، عملية، وباللهجة المصرية الاحترافية السهلة.
`;

export async function POST(req) {
  try {
    const body = await req.json();
    const message =
      body?.message ||
      body?.messages?.[body.messages.length - 1]?.text ||
      "";

    if (!message || String(message).trim().length === 0) {
      return NextResponse.json({ reply: "اكتب سؤالك أو طلبك الأول." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: String(message) }] }],
        }),
      }
    );

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "حصلت مشكلة بسيطة، جرب تبعت سؤالك تاني أو تواصل معانا واتساب.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { reply: "في ضغط حالياً، تقدر تطلب خدمتك مباشرة من صفحة الطلبات." },
      { status: 500 }
    );
  }
}