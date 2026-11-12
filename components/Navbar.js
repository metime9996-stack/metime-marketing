"use client";
import Link from 'next/link';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';

const Navbar = () => {
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-black border-b border-[#D4AF37] py-4 px-10 flex justify-between items-center sticky top-0 z-50">
      
      <Link href="/" className="text-[#D4AF37] font-bold text-2xl">
        MeTime (Get It Now)
      </Link>

      <div className="flex items-center gap-6 text-white font-medium">
        <Link href="/" className="hover:text-[#D4AF37] transition">Home</Link>
        
        {!isSignedIn ? (
          <div className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#b8962d] transition cursor-pointer">
            <SignInButton mode="modal">Login</SignInButton>
          </div>
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
      </div>
    </nav>
  );
};

export default Navbar;