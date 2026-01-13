import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "MiniTask - Premium Task Management",
    template: "%s | MiniTask"
  },
  description: "Organize your life with MiniTask. A premium, secure, and modern task management application for professionals.",
  keywords: ["task management", "productivity", "todo list", "minitask", "nextjs", "react", "task organizer", "secure todo"],
  authors: [{ name: "Gaurav" }], // or your name/brand
  creator: "Gaurav",
  openGraph: {
    title: "MiniTask - Premium Task Management",
    description: "Organize your life with MiniTask. A premium, secure, and modern task management application for professionals.",
    url: "https://minitask.vercel.app",
    siteName: "MiniTask",
    images: [
      {
        url: "/og-image.png", // Ensure this image exists in public folder or use a hosted URL
        width: 1200,
        height: 630,
        alt: "MiniTask Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MiniTask - Premium Task Management",
    description: "Organize your life with MiniTask.",
    images: ["/og-image.png"],
    creator: "@yourhandle", // Optional
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "MiniTask",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "A premium, secure, and modern task management application for professionals."
            })
          }}
        />
      </body>
    </html>
  );
}
