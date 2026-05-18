import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";

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
      className="font-sans"
    >
      <body className="h-auto overflow-x-hidden flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}