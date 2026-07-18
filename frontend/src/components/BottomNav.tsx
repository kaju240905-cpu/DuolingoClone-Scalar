"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield, Award, Store, UserCircle, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav() {
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar-bg border-t-2 border-sidebar-border px-2 py-3 z-50 flex items-center justify-around h-[80px]">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link key={link.name} href={link.href} className="flex flex-col items-center gap-1 w-12 cursor-pointer">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-xl transition-all ${
                isActive ? "bg-card-bg shadow-sm" : ""
              }`}
            >
              <Icon 
                strokeWidth={isActive ? 2.5 : 2}
                className={`w-7 h-7 ${isActive ? link.color : "text-text-secondary"} transition-colors`} 
              />
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
