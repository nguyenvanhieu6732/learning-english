import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Đăng ký – English Mastery" };

export default function RegisterPage() {
  return (
    <>
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Tạo tài khoản miễn phí</h1>
        <p className="text-sm text-muted-foreground">Chỉ mất 30 giây để bắt đầu học</p>
      </div>
      <RegisterForm />
    </>
  );
}
