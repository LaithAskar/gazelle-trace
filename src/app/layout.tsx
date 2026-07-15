import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gazelle Trace — Adaptive tutoring you can audit",
  description:
    "A teacher-bounded GPT-5.6 tutor that diagnoses handwritten math mistakes and proves every adaptive move stayed in bounds.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

