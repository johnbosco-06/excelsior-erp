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
  openGraph: {
    title: "Excelsior ERP — LICET CSE",
    description: "LICET CSE Department Management System",
    siteName: "Excelsior ERP",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    colorScheme: "dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/licet-logo.png" />
        <link rel="apple-touch-icon" href="/licet-logo.png" />
        <link rel="shortcut icon" href="/licet-logo.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}>
        {children}
      </body>
    </html>
  );
}
