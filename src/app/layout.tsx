import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Воркута Уголь — Цифровое приложение",
  description: "Корпоративное приложение охраны труда",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
