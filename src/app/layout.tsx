import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { type Metadata } from "next";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const rootclass = cn(fontSans.variable, "mb-1 hi");
  return (
    <html lang="en" className={rootclass}>
      <body>
        {/* <TRPCReactProvider> */}
        {children}
        {/* </TRPCReactProvider> */}
      </body>
    </html>
  );
}
