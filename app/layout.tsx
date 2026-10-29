import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  metadataBase: new URL("https://notehub.com/"),
  title: {
    default: "NoteHub — Your Notes, Organized",
    template: "%s | NoteHub",
  },
  description:
    "NoteHub helps you create, organize, and manage your notes in one convenient place.",
  openGraph: {
    title: "NoteHub — Your Notes, Organized",
    description: "Create, organize, and manage your notes with NoteHub.",
    url: "https://notehub.com/",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub — notes management application",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <TanstackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <Footer />
          </AuthProvider>
        </TanstackProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
