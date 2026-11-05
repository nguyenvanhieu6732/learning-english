import { Target } from "lucide-react";
import { getUser } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopicInput } from "@/components/dashboard/TopicInput";

export const metadata = { title: "Tạo bài học – English Mastery" };

const IDEAS = [
  "Cách xác định mạo từ a/an/the",
  "Present Perfect vs Past Simple",
  "Phân biệt will và be going to",
  "Thứ tự tính từ trong tiếng Anh",
  "Lỗi phổ biến do tư duy tiếng Việt",
];

export default async function CustomLessonPage() {
  const { supabase, user } = await getUser();
  const { data: profile } = await supabase.from("users").select("current_level").eq("id", user!.id).single();

  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Target className="size-6 shrink-0 text-primary" aria-hidden="true" /> Sinh bài học theo chủ đề
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>AI sẽ soạn lý thuyết, 8–12 ví dụ, 10 bài tập và 1 thử thách</CardTitle>
        </CardHeader>
        <CardContent>
          <TopicInput defaultLevel={profile?.current_level ?? "easy"} />
        </CardContent>
      </Card>
      <div className="text-sm text-muted-foreground">
        <p className="font-medium">Gợi ý chủ đề:</p>
        <ul className="mt-1 list-inside list-disc">
          {IDEAS.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
