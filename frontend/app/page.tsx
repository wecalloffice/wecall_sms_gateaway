"use client";

import Link from "next/link";
import { MessageSquare, Users, TrendingUp, Lock, Zap, Shield, LogIn } from "lucide-react";

export default function Home() {
  const roleFeatures = [
    {
      role: "Platform Admin",
      href: "/login?demo=admin",
      icon: <Shield size={32} />,
      color: "from-red-600 to-red-700",
      description: "Full system control and management",
      features: [
        "Manage Resellers",
        "Monitor All Clients",
        "Global Reports",
        "System Settings",
      ],
    },
    {
      role: "Reseller",
      href: "/login?demo=kcb",
      icon: <TrendingUp size={32} />,
      color: "from-blue-600 to-blue-700",
      description: "Build your SMS business",
      features: [
        "Manage Clients",
        "Billing & Invoicing",
        "SMS Analytics",
        "Team Management",
      ],
    },
    {
      role: "Client",
      href: "/login?demo=rdb",
      icon: <MessageSquare size={32} />,
      color: "from-green-600 to-green-700",
      description: "Send SMS messages easily",
      features: [
        "Send SMS",
        "View History",
        "Account Balance",
        "Staff Management",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200">
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white" style={{backgroundColor: 'var(--primary)'}}>
              W
            </div>
            <h1 className="text-2xl font-bold text-gray-900">WeCall SMS</h1>
          </div>
          <Link 
            href="/login"
            className="flex items-center gap-2 px-4 py-2 btn-primary"
          >
            <LogIn size={18} />
            Login
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
          Professional SMS Gateway
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Send SMS globally with reliable delivery, powerful APIs, and competitive pricing. Manage your business with ease.
        </p>
        <Link href="/login" className="inline-flex gap-2 px-8 py-3 btn-primary">
          Get Started
        </Link>
      </section>

      {/* ROLE CARDS */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-4xl font-bold text-center mb-16 text-gray-900">Choose Your Dashboard</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roleFeatures.map((role) => (
            <div
              key={role.role}
              className="group hover:shadow-lg transition-shadow duration-300"
            >
              <Link href={role.href}>
                <div className="bg-white rounded-xl p-8 border border-gray-200 h-full flex flex-col hover:border-primary transition-colors">
                  {/* Icon */}
                  <div className="mb-6 flex items-center justify-center w-12 h-12 rounded-lg" style={{backgroundColor: 'var(--primary-accent)'}}>
                    <div style={{color: 'var(--primary)'}}>
                      {role.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-2xl font-bold mb-2 text-gray-900">{role.role}</h4>
                  <p className="text-gray-600 mb-6">{role.description}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {role.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-gray-700">
                        <Zap size={16} style={{color: 'var(--primary)'}} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <button className="btn-primary w-full font-semibold group-hover:shadow-lg transition">
                    Access Dashboard →
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-16 text-white">Why Choose WeCall?</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Lock size={32} />,
                title: "Secure",
                desc: "Enterprise-grade security",
              },
              {
                icon: <Zap size={32} />,
                title: "Fast",
                desc: "Instant SMS delivery",
              },
              {
                icon: <TrendingUp size={32} />,
                title: "Scalable",
                desc: "Grow without limits",
              },
              {
                icon: <Users size={32} />,
                title: "Support",
                desc: "24/7 customer support",
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mb-4 flex justify-center text-blue-400">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold mb-2 text-white">{feature.title}</h4>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-8 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 WeCall SMS Gateway. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
