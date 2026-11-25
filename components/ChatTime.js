"use client";
import { useEffect, useRef, useState } from "react";

const GREETING = {
  role: "bot",
  text: "أهلاً بيك في شات تايم 👋 اسألني عن حملاتك الإعلانية أو باقات MeTime.",
};

export default function ChatTime() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "حصل خطأ في الاتصال، جرب مرة تانية." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50" dir="rtl">
      {open ? (
        <div className="w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="bg-black text-white px-4 py-3 flex justify-between items-center">
            <span className="font-bold text-sm">شات تايم — MeTime AI</span>
            <button onClick={() => setOpen(false)} aria-label="إغلاق الشات" className="text-gray-300 hover:text-white">
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

          <div className="px-3 py-2 border-t bg-white text-xs text-center">
            <a href="/order" className="font-medium underline">
              جاهز تبدأ؟ اطلب خدمتك من هنا
            </a>
          </div>

          <div className="p-2 border-t bg-white flex gap-2">
            <input
              type="text"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="اكتب سؤالك هنا..."
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
          💬 شات تايم
        </button>
      )}
    </div>
  );
}