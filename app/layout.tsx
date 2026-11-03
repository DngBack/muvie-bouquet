import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muvie · Mười Năm Tựa Một Bó Hoa",
  description: "Không gian trải nghiệm dành cho DM và sáu người chơi tại Muvie.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
