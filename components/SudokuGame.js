'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const WHATSAPP = 'https://wa.me/201551451375';

const SOL4 = [
  [0, 1, 2, 3],
  [2, 3, 0, 1],
  [1, 0, 3, 2],
  [3, 2, 1, 0],
];
const SOL6 = [
  [0, 1, 2, 3, 4, 5],
  [3, 4, 5, 0, 1, 2],
  [1, 2, 0, 4, 5, 3],
  [4, 5, 3, 1, 2, 0],
  [2, 0, 1, 5, 3, 4],
  [5, 3, 4, 2, 0, 1],
];

const LEVELS = [
  {
    name: 'مبتدئ',
    size: 4,
    boxR: 0,
    boxC: 0,
    solution: SOL4,
    given: [
      [1, 0, 1, 1],
      [0, 1, 1, 0],
      [1, 1, 0, 1],
      [1, 0, 1, 1],
    ],
    cell: 'h-14 w-[4.4rem] text-[11px] sm:w-20 sm:text-xs',
    rule: 'مفيش عمل يتكرر في نفس الصف أو العمود.',
    themes: [
      {
        title: 'أعمال سينمائية ومسرحيات 🎬🎭',
        hint: 'أفلام الزعيم عادل إمام ومسرحيات الأستاذ محمد صبحي: رتّبها في الشبكة.',
        symbols: ['الإرهابي', 'الزعيم', 'تخاريف', 'كارمن'],
      },
      {
        title: 'أعمال سينمائية ومسرحيات 🎬🎭',
        hint: 'جولة جديدة من أفلام عادل إمام ومسرحيات محمد صبحي: رتّبها في الشبكة.',
        symbols: ['زهايمر', 'الأفوكاتو', 'وجهة نظر', 'ماما أمريكا'],
      },
    ],
  },
  {
    name: 'متوسط',
    size: 4,
    boxR: 2,
    boxC: 2,
    solution: SOL4,
    given: [
      [1, 0, 0, 1],
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 0, 0],
    ],
    cell: 'h-12 w-12 text-xl',
    rule: 'الحرف ما يتكررش في الصف ولا العمود ولا المربع الصغير (2×2).',
    themes: [
      {
        title: 'المستوى المتوسط - حروف 🔤',
        hint: 'حروف إنجليزي A B C D: زودنا قاعدة المربعات الصغيرة.',
        symbols: ['A', 'B', 'C', 'D'],
      },
    ],
  },
  {
    name: 'صعب',
    size: 6,
    boxR: 2,
    boxC: 3,
    solution: SOL6,
    given: [
      [1, 0, 0, 0, 1, 0],
      [0, 1, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 1],
    ],
    cell: 'h-11 w-11 text-lg',
    rule: 'الرقم ما يتكررش في الصف ولا العمود ولا المربع (2×3).',
    themes: [
      {
        title: 'المستوى الصعب - أرقام 🔢',
        hint: 'أرقام من 1 لـ6 وخانات جاهزة قليلة. ركّز.',
        symbols: ['1', '2', '3', '4', '5', '6'],
      },
    ],
  },
];

function buildBoard(level, theme) {
  return level.solution.map((row, r) =>
    row.map((v, c) => (level.given[r][c] ? theme.symbols[v] : ''))
  );
}

function getGroups(level) {
  const { size, boxR, boxC } = level;
  const groups = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    const col = [];
    for (let j = 0; j < size; j++) {
      row.push([i, j]);
      col.push([j, i]);
    }
    groups.push(row, col);
  }
  if (boxR) {
    for (let br = 0; br < size; br += boxR) {
      for (let bc = 0; bc < size; bc += boxC) {
        const box = [];
        for (let r = 0; r < boxR; r++)
          for (let c = 0; c < boxC; c++) box.push([br + r, bc + c]);
        groups.push(box);
      }
    }
  }
  return groups;
}

function findConflicts(board, level) {
  const bad = new Set();
  getGroups(level).forEach((cells) => {
    for (let a = 0; a < cells.length; a++) {
      for (let b = a + 1; b < cells.length; b++) {
        const [r1, c1] = cells[a];
        const [r2, c2] = cells[b];
        if (board[r1][c1] && board[r1][c1] === board[r2][c2]) {
          bad.add(`${r1}-${c1}`);
          bad.add(`${r2}-${c2}`);
        }
      }
    }
  });
  return bad;
}

const COLORS = ['#D4AF37', '#f5d76e', '#ffffff', '#e6c24a', '#ff9f1c', '#22c55e'];

// احتفال كونفيتي عادي (لكل مستوى)
function Confetti({ burst }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!burst) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const sources = [0.15, 0.5, 0.85];
    const parts = [];
    sources.forEach((sx) => {
      for (let i = 0; i < 70; i++) {
        parts.push({
          x: canvas.width * sx,
          y: canvas.height * 0.75,
          vx: (Math.random() - 0.5) * 18,
          vy: -Math.random() * 20 - 8,
          size: 6 + Math.random() * 7,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.4,
        });
      }
    });

    const DURATION = 3500;
    const start = performance.now();
    let raf;

    function frame(t) {
      const elapsed = t - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach((p) => {
        p.vy += 0.35;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - elapsed / DURATION);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (elapsed < DURATION) {
        raf = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [burst]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-50" />;
}

// مشهد النهاية: لوجو ضخم بيطير + ألعاب نارية متواصلة
function Finale({ onClose, onReplay, onForm }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const sparks = [];
    let last = 0;
    let raf;

    function explode(x, y) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < 45; i++) {
        const a = (Math.PI * 2 * i) / 45;
        const s = 2 + Math.random() * 5;
        sparks.push({
          x, y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 1,
          color,
        });
      }
    }

    function frame(now) {
      ctx.clearRect(0, 0, W, H);

      if (now - last > 450) {
        last = now;
        explode(W * (0.1 + Math.random() * 0.8), H * (0.1 + Math.random() * 0.5));
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.vy += 0.06;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.012;
        if (p.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95"
    >
      <style>{`
        @keyframes finaleGrow {
          0% { transform: scale(0.1); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes logoFly {
          0%   { transform: translate(0, 0) rotate(0deg); }
          20%  { transform: translate(55px, -30px) rotate(8deg); }
          40%  { transform: translate(30px, -60px) rotate(2deg); }
          60%  { transform: translate(-30px, -60px) rotate(-6deg); }
          80%  { transform: translate(-55px, -30px) rotate(-8deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes finalePulse {
          0%, 100% { filter: drop-shadow(0 0 25px rgba(212,175,55,0.7)); }
          50% { filter: drop-shadow(0 0 70px rgba(212,175,55,1)); }
        }
      `}</style>

      <canvas ref={ref} className="pointer-events-none absolute inset-0" />

      <button
        onClick={onClose}
        className="absolute left-4 top-4 z-10 rounded-full border border-[#D4AF37] px-4 py-2 text-sm font-bold text-[#D4AF37] hover:bg-[#D4AF37]/10"
      >
        إغلاق ✕
      </button>

      <div
        className="relative z-10"
        style={{ animation: 'finaleGrow 1.6s ease-out forwards' }}
      >
        <div style={{ animation: 'logoFly 5s ease-in-out 1.6s infinite' }}>
          <div style={{ animation: 'finalePulse 2.2s ease-in-out infinite' }}>
            <Image
              src="/logo.png"
              alt="MeTime Logo"
              width={420}
              height={420}
              className="h-[48vh] w-auto max-w-[80vw] object-contain"
              priority
            />
          </div>
        </div>
      </div>

      <h2 className="relative z-10 mt-4 px-4 text-center text-2xl font-bold text-[#D4AF37] md:text-4xl">
        🏆 مبروك! خلصت المستويات التلاتة
      </h2>
      <p className="relative z-10 mt-2 px-4 text-center text-base text-gray-200 md:text-xl">
        أنت بطل.. وسيب لنا تسويق براندك!
      </p>

      <div className="relative z-10 mt-6 flex flex-wrap justify-center gap-3 px-4">
        <button
          onClick={onForm}
          className="rounded-full bg-[#D4AF37] px-6 py-2 text-sm font-bold text-black hover:bg-[#e6c24a]"
        >
          اطلب استشارة مجانية
        </button>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-green-600 px-6 py-2 text-sm font-bold text-white hover:bg-green-500"
        >
          تواصل واتساب 💬
        </a>
        <button
          onClick={onReplay}
          className="rounded-full border border-[#D4AF37] px-6 py-2 text-sm font-bold text-[#D4AF37] hover:bg-[#D4AF37]/10"
        >
          العب من جديد 🔁
        </button>
      </div>
    </div>
  );
}

export default function SudokuGame() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [themeIdx, setThemeIdx] = useState(0);
  const level = LEVELS[levelIdx];
  const theme = level.themes[themeIdx % level.themes.length];
  const isLast = levelIdx === LEVELS.length - 1;

  const [board, setBoard] = useState(() => buildBoard(LEVELS[0], LEVELS[0].themes[0]));
  const [selected, setSelected] = useState(null);
  const [burst, setBurst] = useState(0);
  const [finale, setFinale] = useState(false);

  const initial = buildBoard(level, theme);
  const conflicts = findConflicts(board, level);
  const filled = board.every((row) => row.every((c) => c !== ''));
  const won = filled && conflicts.size === 0;

  useEffect(() => {
    if (!won) return;
    if (isLast) {
      setFinale(true);
    } else {
      setBurst((b) => b + 1);
    }
  }, [won, isLast]);

  function setCell(value) {
    if (!selected || won) return;
    const [r, c] = selected;
    if (initial[r][c] !== '') return;
    setBoard(
      board.map((row, ri) =>
        row.map((cell, ci) => (ri === r && ci === c ? value : cell))
      )
    );
  }

  function goNext() {
    let nl = levelIdx + 1;
    let nt = 0;
    if (isLast) {
      nl = 0;
      nt = themeIdx + 1;
    }
    const nLevel = LEVELS[nl];
    const nTheme = nLevel.themes[nt % nLevel.themes.length];
    setLevelIdx(nl);
    setThemeIdx(nt);
    setBoard(buildBoard(nLevel, nTheme));
    setSelected(null);
  }

  function reset() {
    setBoard(buildBoard(level, theme));
    setSelected(null);
  }

  function goToForm() {
    setFinale(false);
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  function replay() {
    setFinale(false);
    goNext();
  }

  return (
    <section dir="rtl" className="w-full px-4 py-10">
      <Confetti burst={burst} />
      {finale && (
        <Finale
          onClose={() => setFinale(false)}
          onReplay={replay}
          onForm={goToForm}
        />
      )}

      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-8 rounded-2xl border border-[#D4AF37]/40 bg-black/70 p-6 shadow-2xl backdrop-blur-sm md:flex-row">
        <div className="flex-1 space-y-3 text-right">
          <span className="inline-block rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1 text-xs font-bold text-[#D4AF37]">
            ✨ استراحة MeTime السينمائية
          </span>

          <div className="flex gap-2">
            {LEVELS.map((l, i) => (
              <span
                key={l.name}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  i === levelIdx
                    ? 'bg-[#D4AF37] text-black'
                    : i < levelIdx
                    ? 'border border-[#D4AF37] text-[#D4AF37]'
                    : 'border border-zinc-600 text-gray-400'
                }`}
              >
                {i + 1}. {l.name}
              </span>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-[#D4AF37]">{theme.title}</h3>
          <p className="text-sm leading-relaxed text-gray-300">{theme.hint}</p>
          <p className="text-xs text-gray-400">{level.rule}</p>

          {won && (
            <div className="rounded-xl border border-[#D4AF37] bg-[#D4AF37]/15 p-3 text-sm font-bold text-[#D4AF37]">
              {isLast
                ? '🏆 خلصت المستويات التلاتة! أنت بطل.. وسيب لنا تسويق براندك!'
                : `🎉 عالمي! خلصت مستوى ${level.name}. جاهز للأصعب؟`}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          {!won ? (
            <>
              <div
                dir="rtl"
                className="grid gap-2 rounded-xl border border-[#D4AF37]/40 bg-zinc-950 p-2.5"
                style={{ gridTemplateColumns: `repeat(${level.size}, auto)` }}
              >
                {board.map((row, r) =>
                  row.map((cell, c) => {
                    const fixed = initial[r][c] !== '';
                    const isSel = selected && selected[0] === r && selected[1] === c;
                    const isBad = conflicts.has(`${r}-${c}`);
                    let cls =
                      'bg-zinc-900 text-white border border-zinc-700 hover:border-[#D4AF37]';
                    if (fixed) cls = 'bg-zinc-800 text-[#D4AF37] cursor-default';
                    else if (isBad) cls = 'bg-red-900/60 text-red-200 border border-red-500';
                    else if (isSel) cls = 'bg-[#D4AF37] text-black scale-105';
                    return (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => !fixed && setSelected([r, c])}
                        className={`flex items-center justify-center rounded-lg px-1 text-center font-bold leading-tight transition ${level.cell} ${cls}`}
                      >
                        {cell}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="flex max-w-xs flex-wrap justify-center gap-2">
                {theme.symbols.map((s) => (
                  <button
                    key={s}
                    onClick={() => setCell(s)}
                    className="rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37]/15 px-3 py-2 text-xs font-bold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
                  >
                    {s}
                  </button>
                ))}
                <button
                  onClick={() => setCell('')}
                  className="rounded-lg border border-zinc-600 px-3 py-2 text-xs text-gray-300 hover:border-[#D4AF37]"
                >
                  مسح
                </button>
                <button
                  onClick={reset}
                  className="rounded-lg border border-zinc-600 px-3 py-2 text-xs text-gray-300 hover:border-[#D4AF37]"
                >
                  من الأول
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#D4AF37] bg-zinc-950 p-5 shadow-2xl">
              <div className="animate-bounce">
                <Image
                  src="/logo.png"
                  alt="MeTime Logo"
                  width={96}
                  height={96}
                  className="object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.9)]"
                />
              </div>
              <span className="text-xs font-bold text-[#D4AF37]">MeTime – Get It Now</span>
              <div className="flex flex-wrap justify-center gap-2">
                {isLast ? (
                  <button
                    onClick={() => setFinale(true)}
                    className="rounded-full bg-[#D4AF37] px-4 py-1.5 text-xs font-bold text-black hover:bg-[#e6c24a]"
                  >
                    شاهد الاحتفال 🎆
                  </button>
                ) : (
                  <button
                    onClick={goNext}
                    className="rounded-full bg-[#D4AF37] px-4 py-1.5 text-xs font-bold text-black hover:bg-[#e6c24a]"
                  >
                    المستوى الأصعب ⬆️
                  </button>
                )}
                <button
                  onClick={goToForm}
                  className="rounded-full border border-[#D4AF37] px-4 py-1.5 text-xs font-bold text-[#D4AF37] hover:bg-[#D4AF37]/10"
                >
                  اطلب استشارة مجانية
                </button>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-green-500"
                >
                  تواصل واتساب 💬
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}