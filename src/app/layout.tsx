import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry"
import {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"


const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  title: "YouTube Downloader",
  authors: {name: "Troy DeSpain"},
  creator: "Troy DeSpain",
  robots: {
    index: false,
    follow: false
  }
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
    <head>
      <meta name="theme-color" content="#fff" />
    </head>

    <body className={inter.className}>
    <ThemeRegistry>
      {children}
    </ThemeRegistry>
    </body>
    </html>
  )
}
