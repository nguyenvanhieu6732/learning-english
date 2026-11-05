import type { Metadata, Viewport } from "next";
import { Source_Serif_4 } from "next/font/google";
import "./globals.css";

// System serifs like Georgia lack many Vietnamese glyphs, which detaches the diacritics.
const serif = Source_Serif_4({ subsets: ["latin", "vietnamese"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "English Mastery – Học tiếng Anh theo logic",
  description: "Học tiếng Anh kiểu IELTS cho người Việt mới bắt đầu: hiểu logic thay vì học thuộc, bài học do AI soạn theo chủ đề.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={serif.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
