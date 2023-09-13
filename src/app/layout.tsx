import "@total-typescript/ts-reset"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

import "~/styles/globals.css"
import type { Metadata } from "next"
import { Inter, Fugaz_One } from "next/font/google"
import ConvexClientProvider from "~/lib/convex"
import { cx } from "class-variance-authority"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const Fugaz = Fugaz_One({ weight: "400", variable: "--font-fugaz", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prompt Racer",
  description: "Race against your friends using only the power of LLMs!",
}

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
        <body className={cx(Fugaz.variable, inter.variable, "font-sans", "p-4 flex flex-col")}>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
