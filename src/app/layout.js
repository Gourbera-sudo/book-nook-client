import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/footer";
import MotionProvider from "@/components/motion/motion-provider";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Runs before the page paints so the saved theme is applied without a flash.
const themeScript = `(function(){try{var stored=localStorage.getItem("booknook-theme");var isDark=stored==="dark"||(stored!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var root=document.documentElement;root.classList.toggle("dark",isDark);root.style.colorScheme=isDark?"dark":"light";}catch(error){}})();`;

export const metadata = {
  title: {
    default: "BookNook",
    template: "BookNook | %s",
  },
  description: "Discover, share, and borrow books from readers around you.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <MotionProvider>
          <Suspense
            fallback={
              <header className="sticky top-0 z-50 h-16 w-full border-b border-border bg-background/80" />
            }
          >
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </MotionProvider>
        <Toaster />
      </body>
    </html>
  );
}
