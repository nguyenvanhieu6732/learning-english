import { Logo } from "@/components/common/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo className="text-xl" />
        </div>
        <div className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">{children}</div>
      </div>
    </main>
  );
}
