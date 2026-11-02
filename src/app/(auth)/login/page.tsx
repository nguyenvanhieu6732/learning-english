import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Đăng nhập – English Mastery" };

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <>
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Chào mừng trở lại</h1>
        <p className="text-sm text-muted-foreground">Đăng nhập để tiếp tục lộ trình của bạn</p>
      </div>
      <LoginForm initialError={searchParams.error ? "Xác thực thất bại. Hãy thử đăng nhập lại." : undefined} />
    </>
  );
}
