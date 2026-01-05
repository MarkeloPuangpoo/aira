import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aira.pondetpuangpoo.online"),
  title: {
    default: "AIRA Monitor - ระบบติดตามสถานการณ์ฝุ่นและน้ำเพื่อประชาชน",
    template: "%s | AIRA Monitor",
  },
  description: "ติดตามสถานการณ์ฝุ่น PM2.5 และระดับน้ำได้แบบเรียลไทม์ พร้อมแจ้งเตือนพื้นที่เสี่ยง และคาดการณ์ล่วงหน้าเพื่อสุขภาพและความปลอดภัยของคุณ",
  keywords: ["PM2.5", "Water Level", "AIRA", "Monitor", "Thailand", "Dust", "Flooding", "ฝุ่น", "น้ำท่วม", "สุขภาพ", "เชียงราย"],
  authors: [{ name: "AIRA Team" }],
  creator: "AIRA Team",
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://aira.pondetpuangpoo.online",
    title: "AIRA Monitor - ระบบติดตามสถานการณ์ฝุ่นและน้ำเพื่อประชาชน",
    description: "ติดตามสถานการณ์ฝุ่น PM2.5 และระดับน้ำได้แบบเรียลไทม์ พร้อมแจ้งเตือนพื้นที่เสี่ยง และคาดการณ์ล่วงหน้า",
    siteName: "AIRA Monitor",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AIRA Monitor Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIRA Monitor - ระบบติดตามสถานการณ์ฝุ่นและน้ำเพื่อประชาชน",
    description: "ติดตามสถานการณ์ฝุ่น PM2.5 และระดับน้ำได้แบบเรียลไทม์",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
