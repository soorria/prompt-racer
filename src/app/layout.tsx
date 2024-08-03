import "~/styles/globals.css"

import { Inter } from "next/font/google"
import { type Metadata } from "next"
import { cn } from "~/lib/utils"

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" })

const title = "Prompt Racer"
const description = "Race against your friends using only the power of LLMs!"

export const metadata: Metadata = {
  metadataBase: new URL("https://promptracer.dev"),
  title: {
    default: title,
    template: "%s | Prompt Racer",
  },
  description,

  alternates: {
    canonical: "https://promptracer.dev",
  },

  manifest: "/site.webmanifest",

  icons: {
    icon: [
      { type: "image/png", url: "/favicon-32x32.png", sizes: "32x32" },
      { type: "image/png", url: "/favicon-16x16.png", sizes: "16x16" },
    ],

    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "en_AU",
    title,
    description,
    url: "https://promptracer.dev",
    images: [
      {
        url: "https://promptracer.dev/ogimage.png",
        width: 1200,
        height: 630,
        alt: `${title} - ${description}`,
      },
    ],
  },

  twitter: {
    title,
    card: "summary_large_image",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const rootclass = cn(fontSans.variable, "hi mb-1")
  return (
    <html lang="en" className={rootclass}>
      <body>
        {/* <TRPCReactProvider> */}
        {children}
        {/* </TRPCReactProvider> */}
      </body>
    </html>
  )
}
