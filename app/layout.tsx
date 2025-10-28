import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Beatriz Attame - Psicóloga | Terapia Individual e de Casal",
  description: "Psicóloga especializada em terapia individual, de casal e familiar. Atendimento humanizado e personalizado para promover seu bem-estar emocional.",
  keywords: ['psicóloga', 'terapia', 'terapia de casal', 'saúde mental', 'Beatriz Attame'],
  openGraph: {
    title: "Beatriz Attame - Psicóloga | Terapia Individual e de Casal",
    description: "Atendimento humanizado e personalizado para promover seu bem-estar emocional.",
    url: "https://www.beatrizattame.com", 
    siteName: "Beatriz Attame Psicologia",
    images: [
      {
        url: "/rs.png", 
        width: 1200,
        height: 630,
        alt: "Beatriz Attame - Psicóloga",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beatriz Attame - Psicóloga",
    description: "Atendimento humanizado e personalizado para promover seu bem-estar emocional.",
    images: ["/rs.png"], 
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${inter.variable} ${playfair.variable} antialiased`}>
        <Toaster richColors />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
