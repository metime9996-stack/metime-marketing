"use client";
import { useEffect, useRef, useState } from "react";

const GREETING = {
  role: "bot",
  text: "أهلاً بيك في مي تايم 👋 اسألني عن حملاتك الإعلانية أو اطلب تصميمك.",
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

    setOpen(true);
    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");

    const asksDesign = isDesignRequest(text);

    if (asksDesign && designCount >= DESIGN_LIMIT) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "كده خلصت التصميمين المجانيين المسموح بيهم 👍 من التصميم التالت وطالع بيكون بفلوس أو باشتراك شهري. تقدر تشترك أو تطلب باقة تصميمات من صفحة الطلب.",
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
            text: "الرد التلقائي محتاج سماح وصول من إعدادات الحماية (Clerk) على مسار /api/chat. تقدر تطلب خدمتك مباشرة من صفحة الطلبات.",
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
    <div className="w-full max-w-md mx-auto mt-4 relative z-30" dir="rtl">
      {/* البار السماوي نفس لون الحلقة */}
      <div className="flex items-center gap-2 rounded-full bg-cyan-400/15 border border-cyan-400/70 shadow-[0_0_25px_rgba(34,211,238,0.35)] px-4 py-2.5 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-cyan-300 font-bold text-lg leading-none px-1 hover:text-white"
          title="فتح أو إغلاق المحادثة"
        >
          +
        </button>
        <input
          type="text"
          value={input}
          maxLength={500}
          onFocus={() => setOpen(true)}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="اسأل مي تايم..."
          className="flex-1 bg-transparent text-white placeholder-cyan-200/80 text-sm focus:outline-none"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={loading}
          className="bg-cyan-400 text-black font-bold text-xs px-4 py-1.5 rounded-full hover:bg-cyan-300 transition disabled:opacity-50"
        >
          {loading ? "..." : "إرسال"}
        </button>
      </div>

      {/* صندوق الردود يفتح تحت البار لما تكتب أو تضغط + */}
      {open && (
        <div className="mt-2 bg-[#0b1218]/95 border border-cyan-400/50 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.25)] overflow-hidden backdrop-blur-md">
          <div className="px-4 py-2 border-b border-cyan-400/20 flex justify-between items-center text-xs text-cyan-300">
            <span className="font-bold">Ask MeTime</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          <div className="p-3 max-h-60 overflow-y-auto space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-cyan-400 text-black font-medium mr-auto"
                    : "bg-white/10 border border-cyan-400/20 text-gray-100 ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="text-xs text-cyan-300">بيكتب الرد...</div>}
            <div ref={endRef} />
          </div>

          <div className="px-3 py-2 border-t border-cyan-400/20 text-xs text-center text-cyan-200 flex items-center justify-center gap-3">
            <a href="/order?package=design-ads" className="font-semibold underline hover:text-white">
              اشتراك / طلب تصميم
            </a>
            <span>•</span>
            <a href="/order" className="underline hover:text-white">
              كل الباقات
            </a>
          </div>
        </div>
      )}
    </div>
  );
}