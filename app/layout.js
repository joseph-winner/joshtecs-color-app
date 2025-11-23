import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FaArrowLeft } from "react-icons/fa";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // Titles
  title: {
    default: "Smart Image Color Picker | Joshtecs",
    template: "%s | Smart Image Color Picker",
  },

  // Basic SEO
  description:
    "Pick beautiful color palettes directly from your images with this modern, browser-based color picker built with Next.js and Tailwind CSS.",
  keywords: [
    "color picker",
    "image color picker",
    "palette generator",
    "Next.js",
    "Tailwind CSS",
    "Joshtecs",
  ],
  authors: [{ name: "Joshtecs Solutions" }],
  creator: "Joshtecs Solutions",

  // Your real domain
  metadataBase: new URL("https://picker.joshtecs.com"),

  // Open Graph (for rich link previews)
  openGraph: {
    title: "Smart Image Color Picker | Joshtecs",
    description:
      "Upload an image, tap anywhere, and instantly get HEX & RGB values plus ready-to-use palettes.",
    url: "https://picker.joshtecs.com",
    siteName: "Smart Image Color Picker",
    images: [
      {
        url: "/og-image.png", // put this in /public
        width: 1200,
        height: 630,
        alt: "Screenshot of the Smart Image Color Picker interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter cards
  twitter: {
    card: "summary_large_image",
    title: "Smart Image Color Picker | Joshtecs",
    description: "Generate modern color palettes from your images in seconds.",
    creator: "@joshtecs_",
    site: "@joshtecs_",
    images: ["/og-image.png"],
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="py-4 px-6">
          <div className="max-w-7xl mx-auto">
            <a
              href="https://joshtecs.com"
              className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Back to Joshtecs.com"
            >
              <FaArrowLeft className="text-lg" />
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
