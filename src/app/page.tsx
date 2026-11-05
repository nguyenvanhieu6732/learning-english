import Link from "next/link";
import { BookOpenCheck, Brain, CheckCircle2, Map, PenLine, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/Logo";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI soạn bài theo chủ đề",
    text: "Gõ bất kỳ chủ đề nào, ví dụ “mạo từ a/an/the”. Khoảng 30 giây sau bạn có lý thuyết, ví dụ và 10 bài tập.",
  },
  {
    icon: Brain,
    title: "Hiểu logic, không học thuộc",
    text: "Mỗi điểm ngữ pháp được giải thích bằng cách so sánh tư duy tiếng Việt và tiếng Anh.",
  },
  {
    icon: Map,
    title: "Lộ trình 5 Đầu Mục Cốt Lõi",
    text: "4 giai đoạn, 17 chủ điểm: từ trật tự câu, các thì đến mạo từ. Theo dõi tiến độ từng bước.",
  },
];

const STEPS = [
  { icon: Brain, label: "Hiểu logic" },
  { icon: BookOpenCheck, label: "Xem ví dụ" },
  { icon: CheckCircle2, label: "Làm bài tập" },
  { icon: PenLine, label: "Tự viết" },
  { icon: Wand2, label: "Sửa lỗi" },
];

/** Static preview of the exercise screen (spec §8.2). */
function ExercisePreview() {
  return (
    <div className="relative">
      <div className="rounded-2xl border bg-card p-5 shadow-sm" aria-label="Ví dụ màn hình bài tập">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Câu 3/10</span>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Dễ</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-muted">
          <div className="h-full w-[30%] rounded-full bg-primary" />
        </div>
        <p className="mt-5 text-sm text-muted-foreground">Chọn mạo từ đúng:</p>
        <p className="mt-1 text-lg font-medium">“I want to buy ___ new phone.”</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <span className="rounded-lg border-2 border-green-500 bg-green-50 py-2 font-medium text-green-800">a</span>
          <span className="rounded-lg border py-2 text-muted-foreground">an</span>
          <span className="rounded-lg border py-2 text-muted-foreground">the</span>
        </div>
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-900">
          <p className="flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="size-4" aria-hidden="true" /> Chính xác!
          </p>
          <p className="mt-1">“new” bắt đầu bằng phụ âm → dùng “a”. Người nghe chưa biết điện thoại nào → chưa xác định.</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Logo />
        <Button asChild variant="ghost">
          <Link href="/login">Đăng nhập</Link>
        </Button>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 md:grid-cols-2 md:py-20">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-sm font-medium text-muted-foreground">
              <Sparkles className="size-4" aria-hidden="true" /> Dành cho người Việt mới bắt đầu
            </span>
            <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
              Học tiếng Anh bằng cách <span className="text-primary">hiểu logic</span>, không phải học thuộc
            </h1>
            <p className="max-w-prose text-lg text-muted-foreground">
              Nhập chủ đề bạn muốn học, AI soạn ngay bài học với giải thích so sánh Việt–Anh, ví dụ có phân tích và bài
              tập có chấm điểm.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6 text-base">
                <Link href="/register">Bắt đầu miễn phí</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 bg-card px-6 text-base">
                <Link href="/login">Tôi đã có tài khoản</Link>
              </Button>
            </div>
          </div>
          <ExercisePreview />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border bg-card p-6 shadow-sm">
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-center text-2xl font-medium sm:text-3xl">Mỗi chủ điểm, 5 bước</h2>
          <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {STEPS.map(({ icon: Icon, label }, i) => (
              <li key={label} className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 text-center shadow-sm">
                <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">Bước {i + 1}</span>
                <span className="font-semibold">{label}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 pt-8">
          <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground">
            <h2 className="text-2xl font-medium sm:text-3xl">Sẵn sàng học tiếng Anh theo cách dễ hiểu?</h2>
            <p className="mt-2 text-primary-foreground/90">Miễn phí. Chỉ cần email hoặc tài khoản Google.</p>
            <Button asChild size="lg" variant="secondary" className="mt-6 h-12 bg-card px-6 text-base text-foreground hover:bg-card/90">
              <Link href="/register">Tạo tài khoản</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
