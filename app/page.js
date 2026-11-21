"use client";
import React from 'react';
import Image from 'next/image';
import { Bebas_Neue } from 'next/font/google';
import TeamMarquee from '../components/TeamMarquee';
import SudokuGame from '../components/SudokuGame';
import ContactForm from '../components/ContactForm';

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  fallback: ['Impact', 'Arial Narrow', 'sans-serif'],
});

// ✏️ مسار المجسم (حطه في public/models/model.gif)
const MODEL_SRC = '/models/model.gif';

const NAV_LINKS = [
  { label: 'Services', id: 'services' },
  { label: 'About', id: 'services' },
  { label: 'Team', id: 'team' },
  { label: 'Play Sudoku', id: 'sudoku' },
  { label: 'Contact', id: 'contact' },
];

function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function HomePage() {
  const services = [
    {
      id: 'svc-social',
      title: "Social Media Management",
      description: "إدارة احترافية لحسابات السوشيال ميديا وزيادة التفاعل"
    },
    {
      id: 'svc-ads',
      title: "Meta & Google Ads",
      description: "حملات إعلانية ممولة تستهدف عملاء حقيقيين"
    },
    {
      id: 'svc-design',
      title: "Graphic Design",
      description: "تصميمات إبداعية تعكس هوية البراند"
    },
    {
      id: 'svc-motion',
      title: "Motion Graphics",
      description: "فيديوهات إعلانية احترافية تجذب الانتباه"
    },
    {
      id: 'svc-brand',
      title: "Brand Identity",
      description: "بناء هوية بصرية متكاملة لعلامتك التجارية"
    },
    {
      id: 'svc-web',
      title: "Website Development",
      description: "تصميم وتطوير مواقع احترافية عصرية"
    }
  ];

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/placeholder.jpg')"
      }}
    >
      {/* Hero: نفس تصميم الصورة */}
      <div
        dir="ltr"
        className="relative overflow-hidden bg-[#05080d] text-white border-b-4 [border-image:linear-gradient(to_right,#2fe0e6,#f0b84a)_1]"
      >
        {/* شريط التنقل */}
        <header className="relative z-20 flex items-center justify-between px-4 py-4 md:px-[4%]">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="MeTime Logo"
              width={52}
              height={52}
              className="rounded-full object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-2xl font-black italic tracking-tight md:text-3xl">
                <span className="text-[#2fe0e6]">Me</span>
                <span className="text-[#f0b84a]">Time</span>
              </span>
              <span className="mt-1 text-xs font-semibold tracking-wide text-white md:text-sm">
                Get It Now
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-4 md:gap-5 lg:gap-8">
            <div className="hidden items-center gap-4 md:flex lg:gap-8">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.label}
                  onClick={() => goTo(l.id)}
                  className="whitespace-nowrap text-sm text-gray-100 transition hover:text-[#2fe0e6] lg:text-base"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </nav>
        </header>

        {/* الكلام على الشمال + المجسم على اليمين */}
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-2 px-4 pb-8 pt-2 md:grid-cols-2 md:px-[4%] md:pt-0 lg:min-h-[88vh]">
          <div className="text-left">
            <h1
              className={`${bebas.className} text-[3.4rem] leading-[0.95] sm:text-6xl md:text-[4.2rem] lg:text-[6.2rem] xl:text-[7.4rem]`}
            >
              <span className="block text-white">ONE MIND.</span>
              <span className="block text-white">ONE PLACE.</span>
              <span className="block text-[#2fe0e6]">GLOBAL REACH.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg lg:text-xl">
              We connect creativity, technology, and marketing to take brands
              beyond boundaries.
            </p>

            <button
              onClick={() => goTo('contact')}
              className={`${bebas.className} mt-7 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#2fe0e6] to-[#e8b84a] px-7 py-3 text-xl text-black shadow-[0_0_35px_rgba(47,224,230,0.35)] transition hover:scale-105 lg:px-8 lg:py-4 lg:text-2xl`}
            >
              LET&apos;S GROW TOGETHER <span className="text-xl">↗</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <img
              src={MODEL_SRC}
              alt="MeTime 3D"
              className="relative max-h-[680px] w-full object-contain mix-blend-screen"
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 16%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 16%)',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="container mx-auto py-12 px-4 bg-black/40 backdrop-blur-sm">
        <h2 className="text-3xl font-semibold text-center mb-10 text-white border-b-2 border-[#D4AF37] w-fit mx-auto pb-2">
          Our Digital Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              id={service.id}
              className="scroll-mt-24 bg-black border border-[#D4AF37] rounded-xl p-6 shadow-lg hover:scale-105 transition duration-300"
            >
              <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">
                {service.title}
              </h3>
              <p className="text-gray-300 text-lg">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Meet The Team */}
      <div id="team">
        <TeamMarquee
          title="Meet The Team"
          speed={40}
        />
      </div>

      {/* Sudoku Game */}
      <div id="sudoku">
        <SudokuGame />
      </div>

      {/* Contact Form */}
      <div id="contact">
        <ContactForm />
      </div>
    </main>
  );
}