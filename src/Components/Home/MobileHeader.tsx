"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
export default function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center relative justify-between bg-[#0A84FF] px-4 py-4 md:hidden mobileHeader">
      <div>
        <Image
          src="/mobileLogo.png" // Update with your logo path
          alt="Logo"
          width={169}
          height={40}
          className="object-contain "
        />
      </div>
      {/* Mobile menu toggle button */}
      <button onClick={() => setMenuOpen(true)} className="text-white text-3xl">
        Menu
      </button>

      {/* Off-canvas mobile menu */}
      <div
        className={`fixed top-0 right-0 w-3/4 h-full bg-[#3878FF] transform transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <button onClick={() => setMenuOpen(false)} className="p-4 text-white">
          Close
        </button>
        {/* Navigation list */}
        <nav className="flex flex-col items-center justify-around px-10 py-4 gap-4">
          <Link href="#" className="text-white text-xl font-text">
            Features
          </Link>
          <Link href="#" className="text-white text-xl font-text">
            How it works
          </Link>
          <Link href="#planning" className="text-white text-xl font-text">
            Start now
          </Link>
        </nav>
      </div>
    </header>
  );
}
