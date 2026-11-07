import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./mobile.css";

export const metadata: Metadata = {
  title: "Muvie · Mười Năm Tựa Một Bó Hoa",
  description: "Không gian trải nghiệm dành cho DM và sáu người chơi tại Muvie.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
