import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { getUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/Logo";
import { NavLinks } from "@/components/common/NavLinks";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2.5">
          <Logo href="/dashboard" className="[&>span:last-child]:hidden md:[&>span:last-child]:inline" />
          <NavLinks />
          <form action="/auth/signout" method="post">
            <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground">
              <LogOut aria-hidden="true" />
              <span className="hidden sm:inline">Đăng xuất</span>
              <span className="sr-only sm:hidden">Đăng xuất</span>
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
