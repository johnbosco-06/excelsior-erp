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
  title: "Excelsior ERP — LICET CSE",
  description: "Department Management System — Loyola-ICAM College of Engineering and Technology, Department of Computer Science and Engineering",
  icons: {
    icon: "/licet-logo.png",
    apple: "/licet-logo.png",
  },
  openGraph: {
    title: "Excelsior ERP — LICET CSE",
    description: "LICET CSE Department Management System",
    siteName: "Excelsior ERP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
