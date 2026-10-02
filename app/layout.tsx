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
  metadataBase: new URL("https://copperline.example.com"),
  title: "Copperline Plumbing | Repairs, Drains, Heaters and Repipes",
  description:
    "Licensed plumbing contractor for emergency repair, drain cleaning, water heaters and full repipes. Upfront pricing, 5-year labor warranty.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23acff46'/%3E%3Ctext x='32' y='43' font-family='Arial,sans-serif' font-size='28' font-weight='800' text-anchor='middle' fill='%2309090b'%3ECL%3C/text%3E%3C/svg%3E",
  },
  openGraph: {
    type: "website",
    siteName: "Copperline Plumbing",
    title: "Copperline Plumbing | Repairs, Drains, Heaters and Repipes",
    description:
      "Emergency repair, drains, water heaters and repipes with upfront pricing and a 5-year labor warranty.",
    url: "https://copperline.example.com/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Copperline Plumbing | Repairs, Drains, Heaters and Repipes",
    description:
      "Emergency repair, drains, water heaters and repipes with upfront pricing and a 5-year labor warranty.",
  },
};

export const viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:bg-[#acff46] focus:text-zinc-950 focus:font-bold focus:text-sm focus:px-5 focus:py-3 focus:rounded-xl"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
