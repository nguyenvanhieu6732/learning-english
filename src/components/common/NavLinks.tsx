"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Trang chủ", icon: Home },
  { href: "/progress", label: "Lộ trình", icon: Map },
  { href: "/learn/custom", label: "Tạo bài", icon: Sparkles },
];

export function NavLinks() {
  const path = usePathname();
  return (
    <nav className="flex flex-1 justify-center gap-1 text-sm sm:justify-start">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = path === href || (href === "/progress" && path.startsWith("/learn/") && path !== "/learn/custom");
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium transition-colors",
              active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sr-only sm:hidden">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
