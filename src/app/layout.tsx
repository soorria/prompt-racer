import { ClerkProvider } from "@clerk/nextjs"
import "~/styles/globals.css"
import type { Metadata } from "next"
import { Inter, Fugaz_One } from "next/font/google"
import ConvexClientProvider from "~/lib/convex"
import { ThemeProvider } from "~/components/theme-provider"
import { cx } from "class-variance-authority"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const Fugaz = Fugaz_One({ weight: "400", variable: "--font-fugaz", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prompt Racer",
  description: "Race Prompter",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cx(Fugaz.variable, inter.variable, "font-sans")}>
          <ConvexClientProvider>
            {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
            {children}
            {/* </ThemeProvider> */}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
