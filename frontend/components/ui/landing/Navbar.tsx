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

import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-10 py-6">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="WeCall Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="text-black text-2xl font-extrabold tracking-tight">
          WeCall SMS
        </span>
      </Link>

      {/* Menu */}
      <div className="flex gap-8 font-medium text-lg">
        <Link href="#features" className="nav-link">Features</Link>
        <Link href="#pricing" className="nav-link">Pricing</Link>
        <Link href="#docs" className="nav-link">Docs</Link>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link href="/login">
          <button className="btn-primary cursor-pointer">
            Login
          </button>
        </Link>

        <Link href="/register">
          <button className="btn-primary cursor-pointer">
            Get Started
          </button>
        </Link>
      </div>

    </nav>
  );
}
