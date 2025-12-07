// "use client";

// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export function Navbar() {
//   return (
//     <nav className="w-full flex items-center justify-between px-10 py-6">
//       <div className="text-3xl font-extrabold tracking-tight">WeCall SMS</div>

//       <div className="flex gap-8 font-medium text-lg">
//         <a href="#features" className="hover:text-black transition">Features</a>
//         <a href="#pricing" className="hover:text-black transition">Pricing</a>
//         <a href="#docs" className="hover:text-black transition">Docs</a>
//       </div>

//       <div className="flex gap-4">
//         <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
//           Login
//         </Button>
//         <Link href="register">
//           <Button className="bg-black text-white hover:bg-primary-dark">
//             Get Started
//           </Button>
//         </Link>
//       </div>
//     </nav>
//   );
// }
"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Menu, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              WeCall <span style={{ color: 'var(--primary)' }}>SMS</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login">
              <button className="px-6 py-2.5 text-gray-700 dark:text-gray-300 font-semibold transition-colors" style={{ color: 'var(--text-color)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-color)'}>
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="btn-primary">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link block py-2"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              <Link href="/login" className="block">
                <button className="btn-primary-outline w-full">
                  Login
                </button>
              </Link>
              <Link href="/register" className="block">
                <button className="btn-primary w-full">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
