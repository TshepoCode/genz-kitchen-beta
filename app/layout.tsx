import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/icon.png",
  },
  title: "GenZ Kitchen Beta",
  description: "GenZ Kitchen ordering app, this isnt the polished product, but its a start. We are in beta, so expect some bugs and missing features. But we are working hard to make it better. Stay tuned for updates and new features!",
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
    >
      <body className="h-auto overflow-x-hidden flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}