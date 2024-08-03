import "~/styles/globals.css"

import { type Metadata } from "next"
import { Fugaz_One, Inter } from "next/font/google"
import Link from "next/link"

import Logo from "~/components/nav-bar/Logo"
import ProfileCard from "~/components/nav-bar/ProfileCard"
import { getAuthUser } from "~/lib/auth/user"
import Navbar from "~/lib/surfaces/navbar/Navbar"
import { cn } from "~/lib/utils"

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
  const user = await getAuthUser()
  return (
    <html lang="en" className={rootclass}>
      <body className="flex flex-col p-4">
        <Navbar
          leftContent={<Logo />}
          rightContent={
            <>
              {/* TODO: make this UI better */}
              {user ? (
                /**
                 * Note: intentionally not using Link here because the full reload reset's next's
                 * cache in the browser
                 */
                <a href="/auth/logout">Logout</a>
              ) : (
                <Link href="/auth/login">Login</Link>
              )}
              <ProfileCard />
            </>
          }
        />
        {/* <TRPCReactProvider> */}
        <div className="flex-1 overflow-hidden pt-4">{children}</div>
        {/* </TRPCReactProvider> */}
      </body>
    </html>
  )
}
