"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DifficultySelector } from "@/components/common/DifficultySelector";
import type { Difficulty } from "@/lib/gemini/schemas";
import { LoadingSpark } from "@/components/common/LoadingSpark";
import { GoogleButton } from "./GoogleButton";

export function RegisterForm() {
  const router = useRouter();
  const [level, setLevel] = useState<Difficulty>("easy");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const { data, error } = await createClient().auth.signUp({
      email: String(form.get("email")),
      password: String(form.get("password")),
      options: {
        // Read by the handle_new_user trigger to create the profile row.
        data: { display_name: String(form.get("name")), current_level: level },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) return setError(error.message);
    if (!data.session) return setInfo("Đã gửi email xác thực. Hãy mở hộp thư và bấm vào liên kết để kích hoạt tài khoản.");
    router.push("/dashboard");
    router.refresh();
  }

  if (info) return <p className="rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">{info}</p>;

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên hiển thị</Label>
          <Input id="name" name="name" autoComplete="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu (tối thiểu 6 ký tự)</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={6} required />
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Cấp độ hiện tại của bạn</legend>
          <DifficultySelector value={level} onChange={setLevel} />
        </fieldset>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" className="h-11 w-full text-base" disabled={loading}>
          {loading ? <LoadingSpark label="Đang tạo tài khoản…" /> : "Đăng ký"}
        </Button>
      </form>
      <GoogleButton />
      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-medium text-primary underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
