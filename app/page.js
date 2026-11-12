"use client";
import React from 'react';
import Image from 'next/image';

export default function HomePage() {
  const services = [
    {
      title: "Social Media Management",
      description: "إدارة احترافية لحسابات السوشيال ميديا وزيادة التفاعل"
    },
    {
      title: "Meta & Google Ads",
      description: "حملات إعلانية ممولة تستهدف عملاء حقيقيين"
    },
    {
      title: "Graphic Design",
      description: "تصميمات إبداعية تعكس هوية البراند"
    },
    {
      title: "Motion Graphics",
      description: "فيديوهات إعلانية احترافية تجذب الانتباه"
    },
    {
      title: "Brand Identity",
      description: "بناء هوية بصرية متكاملة لعلامتك التجارية"
    },
    {
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
      
      {/* Hero Section */}
      <div className="bg-black text-white py-16 px-10 border-b-4 border-[#D4AF37] relative">
        <div className="container mx-auto flex items-center justify-between">
          
          <div className="order-last border-2 border-[#D4AF37] p-1 rounded-full overflow-hidden bg-white">
            <Image
              src="/logo.png"
              alt="MeTime Logo"
              width={90}
              height={90}
              className="object-contain"
            />
          </div>

          <div className="flex-1 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#D4AF37]">
              Welcome to MeTime
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-medium">
              حلول تسويق إلكتروني متكاملة لنمو أعمالك
            </p>
          </div>

          <div className="w-[100px] hidden md:block"></div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto py-12 px-4 bg-black/40 backdrop-blur-sm min-h-screen">
        <h2 className="text-3xl font-semibold text-center mb-10 text-white border-b-2 border-[#D4AF37] w-fit mx-auto pb-2">
          Our Digital Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-black border border-[#D4AF37] rounded-xl p-6 shadow-lg hover:scale-105 transition duration-300"
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
    </main>
  );
}