"use client";
import { useEffect, useRef, useState } from "react";

const GREETING = {
  role: "bot",
  text: "أهلاً بيك في Ask MeTime 👋 قولّي محتاج إيه في التسويق أو التصميم، وهساعدك خطوة بخطوة.",
};

const DESIGN_LIMIT = 2;
const STORAGE_KEY = "metime_free_designs_used";

function isDesignRequest(text) {
  const t = text.toLowerCase();
  return (
    t.includes("تصميم") ||
    t.includes("ديزاين") ||
    t.includes("design") ||
    t.includes("لوجو") ||
    t.includes("logo") ||
    t.includes("بنر") ||
    t.includes("بوست") ||
    t.includes("هوية")
  );
}

export default function ChatTime() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [designCount, setDesignCount] = useState(0);
  const endRef = useRef(null);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY) || "0");
      if (!Number.isNaN(saved)) setDesignCount(saved);
    } catch {}
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");

    const asksDesign = isDesignRequest(text);

    if (asksDesign && designCount >= DESIGN_LIMIT) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "كده خلصت التصميمين المجانيين المسموح بيهم 👍 من التصميم التالت وطالع بيكون بفلوس أو باشتراك شهري. تحب تشترك أو تطلب باقة تصميمات من صفحة الطلب؟",
        },
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }),
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "الرد التلقائي محتاج سماح وصول من إعدادات الحماية (Clerk) على مسار /api/chat. تقدر تطلب خدمتك مباشرة من هنا أو تكلمنا على واتساب.",
          },
        ]);
        return;
      }

      const replyText =
        data && typeof data.reply === "string" && data.reply.trim()
          ? data.reply
          : "حصلت مشكلة بسيطة في الرد، جرب تاني دلوقتي.";

      if (asksDesign && res.ok) {
        const updated = designCount + 1;
        setDesignCount(updated);
        try {
          localStorage.setItem(STORAGE_KEY, String(updated));
        } catch {}

        const remaining = Math.max(DESIGN_LIMIT - updated, 0);
        const note =
          remaining > 0
            ? `\n\n(ملاحظة: ده تصميم رقم ${updated} من أصل ${DESIGN_LIMIT} مجانيين — متبقي لك ${remaining}).`
            : `\n\n(ملاحظة: ده التصميم المجاني رقم ${DESIGN_LIMIT} والأخير؛ التصميم الجاي بيكون بفلوس أو اشتراك).`;

        setMessages((prev) => [...prev, { role: "bot", text: replyText + note }]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: replyText }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "حصل خطأ في الاتصال، جرب مرة تانية." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-3 right-4 z-50" dir="rtl">
      {open ? (
        <div className="w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="bg-black text-white px-4 py-3 flex justify-between items-center">
            <span className="font-bold text-sm">Ask MeTime</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="إغلاق الشات"
              className="text-gray-300 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="p-3 h-72 overflow-y-auto space-y-2 text-sm bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-black text-white mr-auto"
                    : "bg-white border border-gray-200 text-gray-800 ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400">بيكتب الرد...</div>}
            <div ref={endRef} />
          </div>

          <div className="px-3 py-2 border-t bg-white text-xs text-center flex items-center justify-center gap-3">
            <a href="/order?package=design-ads" className="font-semibold underline">
              اشتراك / طلب تصميم
            </a>
            <span>•</span>
            <a href="/order" className="font-medium underline">
              كل الباقات
            </a>
          </div>

          <div className="p-2 border-t bg-white flex gap-2">
            <input
              type="text"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="اكتب سؤالك أو طلب التصميم..."
              className="flex-1 text-sm px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
            >
              إرسال
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-5 py-3 rounded-full shadow-lg text-sm font-bold hover:opacity-90"
        >
          💬 Ask MeTime
        </button>
      )}
    </div>
  );
}