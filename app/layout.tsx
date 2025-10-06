import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "ArogyaMaa - Your Wellness Companion",
  description: "Multilingual voice-based maternal health assistant for pregnant women and new mothers",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${poppins.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
