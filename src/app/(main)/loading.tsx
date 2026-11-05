import { LoadingSpark } from "@/components/common/LoadingSpark";

export default function Loading() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <LoadingSpark label="Đang tải…" className="font-serif text-lg text-primary [&_svg]:size-6" />
    </div>
  );
}
