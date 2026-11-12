"use client";
import { FaFacebook, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black border-t-2 border-[#D4AF37] py-8 text-white mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* النص التعريفي */}
        <div className="text-center md:text-right">
          <h3 className="text-[#D4AF37] text-2xl font-bold mb-1">عروض تسوقينا الحصرية</h3>
          {/* الجملة الجديدة بناءً على طلبك */}
          <p className="text-gray-400 text-lg">اختيارك الصح</p>
        </div>

        {/* روابط التواصل */}
        <div className="flex items-center gap-8">
          {/* واتساب */}
          <a 
            href="https://wa.me/201551451375" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#25D366] transition-colors group"
          >
            <FaWhatsapp size={28} className="group-hover:scale-110 transition-transform" />
            <span className="text-lg font-medium">01551451375</span>
          </a>

          {/* فيسبوك */}
          <a 
            href="https://www.facebook.com/MeTime1996?locale=ar_AR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#1877F2] transition-colors group"
          >
            <FaFacebook size={28} className="group-hover:scale-110 transition-transform" />
            <span className="text-lg font-medium">Facebook</span>
          </a>
        </div>

        {/* حقوق النشر */}
        <div className="text-gray-500 text-sm">
          © {new Date().getFullYear()}  © 2026 MeTime. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;