// "use client"
import "@total-typescript/ts-reset"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

import "~/styles/globals.css"
// import "dracula-prism/dist/css/dracula-prism.css"
import type { Metadata } from "next"
import { Inter, Fugaz_One } from "next/font/google"
import ConvexClientProvider from "~/lib/convex"
import { cx } from "class-variance-authority"
import NavBar from "~/components/NavBar"
import Footer from "~/components/Footer"
import { TooltipProvider } from "~/components/ui/tooltip"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const Fugaz = Fugaz_One({ weight: "400", variable: "--font-fugaz", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prompt Racer",
  description: "Race against your friends using only the power of LLMs!",
}

export const revalidate = 10

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      afterSignInUrl="/g"
      afterSignUpUrl="/g"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#22c55e",
          colorTextOnPrimaryBackground: "#054016",
        },
      }}
    >
      <html lang="en">
        <head>
          <script
            async
            defer
            data-domain="prompt-racer.soorria.com"
            data-api="https://soorria.com/proxy/api/event"
            src="https://soorria.com/js/potato.js"
          />
        </head>
        <body
          className={cx(Fugaz.variable, inter.variable, "font-sans", "px-4 pt-4 flex flex-col")}
        >
          <ConvexClientProvider>
            <TooltipProvider>
              <NavBar />
              <main className="flex-1">{children}</main>
              <Footer />
            </TooltipProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
