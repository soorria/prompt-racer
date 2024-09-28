import "@total-typescript/ts-reset"
import "@total-typescript/ts-reset/dom"
import "~/styles/globals.css"

import type { Metadata, Viewport } from "next"
import { Fugaz_One, Inter } from "next/font/google"
import { headers } from "next/headers"
import Script from "next/script"

import { Toaster } from "~/components/ui/sonner"
import { TooltipProvider } from "~/components/ui/tooltip"
import { PosthogClientProvider } from "~/lib/posthog/provider"
import { TRPCReactProvider } from "~/lib/trpc/react"
import { cn } from "~/lib/utils"

// See: https://stackoverflow.com/a/78556677/7289958
export async function generateViewport(): Promise<Viewport> {
  const userAgent = headers().get("user-agent")
  const isiPhone = /iphone/i.test(userAgent ?? "")
  return isiPhone
    ? {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1, // disables auto-zoom on ios safari
      }
    : {}
}

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" })
const Fugaz = Fugaz_One({ weight: "400", variable: "--font-fugaz", subsets: ["latin"] })

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

  // TODO: Set up manifest
  // manifest: "/site.webmanifest",

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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const rootclass = cn(Fugaz.variable, fontSans.variable, "h-[100svh]")

  return (
    <html lang="en" className={rootclass}>
      <head>
        <Script
          id="plausible"
          async
          defer
          data-domain="promptracer.dev"
          data-api="https://soorria.com/proxy/api/event"
          src="https://soorria.com/js/potato.js"
        />
      </head>
      <body>
        <TRPCReactProvider>
          <PosthogClientProvider>
            <TooltipProvider>
              <main className="mx-auto flex h-full w-full flex-col p-4 pt-0">
                <div className="flex-1">{children}</div>
                <Toaster />
              </main>
            </TooltipProvider>
          </PosthogClientProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
