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
  title: "Sagar Mishra | Full-Stack Developer & Java specialist",
  description: "Portfolio of Sagar Mishra, an aspiring MERN Stack Developer, Java programmer, and DSA specialist. Explore real-time GitHub repositories, projects, and certifications.",
  keywords: "Sagar Mishra, MERN Stack Developer, Java Developer, DSA, Computer Science Portfolio, GLA University, Next.js portfolio, React Developer",
  authors: [{ name: "Sagar Mishra", url: "https://github.com/SagarXdev23" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-foreground select-none" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

