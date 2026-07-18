"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield, Award, Store, UserCircle, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { name: "LEARN", href: "/", icon: Home, color: "text-[#58cc02]" },
    { name: "LEADERBOARDS", href: "/leaderboard", icon: Shield, color: "text-[#ffc800]" },
    { name: "QUESTS", href: "/achievements", icon: Award, color: "text-[#ff9600]" },
    { name: "SHOP", href: "/shop", icon: Store, color: "text-[#ff4b4b]" },
    { name: "PROFILE", href: "/profile", icon: UserCircle, color: "text-[#1cb0f6]" },
    { name: "MORE", href: "/settings", icon: MoreHorizontal, color: "text-[#afbbbf]" },
  ];

  return (
    <aside className={`w-[256px] border-r border-sidebar-border px-4 py-6 flex flex-col justify-between h-screen sticky top-0 bg-sidebar-bg ${className}`}>
      <div className="flex flex-col gap-8">
        <Link href="/" className="flex items-center gap-2 px-4 py-2">
          <span className="text-3xl font-black tracking-wide text-[#58cc02] font-sans lowercase">
            duolingo
          </span>
        </Link>

        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link key={link.name} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wide transition-all cursor-pointer border-2 uppercase ${
                    isActive
                      ? "bg-card-bg text-[#1cb0f6] border-[#1cb0f6]"
                      : "text-text-secondary hover:bg-sidebar-border/40 border-transparent"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? "text-[#1cb0f6]" : link.color} fill-current`} />
                  {link.name}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <div className="px-4 py-3 rounded-2xl bg-card-bg border border-sidebar-border flex items-center gap-3">
          <span className="text-xl">🦉</span>
          <div className="text-xs">
            <p className="font-extrabold text-[#58cc02] uppercase tracking-wider">Super Duolingo</p>
            <p className="text-text-secondary font-bold">Practice & Learn</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
