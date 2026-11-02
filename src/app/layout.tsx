import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Mastery – Học tiếng Anh theo logic",
  description: "Học tiếng Anh kiểu IELTS cho người Việt mới bắt đầu: hiểu logic thay vì học thuộc, bài học do AI soạn theo chủ đề.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fc" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      {/* System font stack: full Vietnamese diacritics support without shipping a font. */}
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
