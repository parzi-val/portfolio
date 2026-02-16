import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import type { Writing } from "@/lib/types"; // Added this import as per instruction

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Balasubramanian KR",
  description: "AI, systems infrastructure, and technical writing.",
  openGraph: {
    title: "Balasubramanian KR",
    description: "AI, systems infrastructure, and technical writing.",
    url: "https://bala.is-a.dev",
    siteName: "Balasubramanian KR Portfolio",
    images: [
      {
        url: "/me.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Balasubramanian KR",
    description: "AI, systems infrastructure, and technical writing.",
    images: ["/me.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 transition-all duration-300 md:pl-[var(--sidebar-width,264px)]">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
