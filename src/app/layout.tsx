import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RightUp | Find the Right People, Unlock Real Opportunities",
  description: "We connect professionals and business with the right network, opportunities and markets to grow with confidence.",
  keywords: ["RightUp", "Business Network", "Partnerships", "Memberships", "Australia Business Growth"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="font-sans antialiased bg-[#070B12] text-gray-100 min-h-screen selection:bg-brand-green selection:text-white">
        {children}
      </body>
    </html>
  );
}
