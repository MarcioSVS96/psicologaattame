import type React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Beatriz Attame - Psicóloga | Psicoterapia Individual e de Casal",
  description:
    "Psicóloga especializada em psicoterapia individual, de casal e familiar. Atendimento humanizado e personalizado para promover seu bem-estar emocional.",
  openGraph: {
    title: "Beatriz Attame - Psicóloga | Psicoterapia Individual e de Casal",
    description:
      "Atendimento humanizado e personalizado para promover seu bem-estar emocional.",
    url: "https://www.psicologabrasil.com",
    siteName: "Beatriz Attame Psicologia",
    images: [
      {
        url: "https://www.psicologabrasil.com/rs.png", // URL absoluta atualizada
        width: 1200,
        height: 630,
        alt: "Beatriz Attame - Psicóloga",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* JSON-LD Schema.org para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Beatriz Attame Psicologia",
              "url": "https://www.psicologabrasil.com",
              "logo": "https://www.psicologabrasil.com/rs.png",
              "sameAs": [
                "https://www.linkedin.com/in/beatrizattame",
                "https://www.instagram.com/beatrizattame",
              ],
              "description":
                "Psicóloga especializada em terapia individual, de casal e familiar. Atendimento humanizado e personalizado para promover seu bem-estar emocional.",
              "areaServed": "Brasil",
              "priceRange": "R$",
            }),
          }}
        />
      </head>
      <body className={`font-sans ${inter.variable} ${playfair.variable} antialiased`}>
        <Toaster richColors />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtag/js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','G-GTHZ9BL3PR');

            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GTHZ9BL3PR');
          `}
        </Script>
      </body>
    </html>
  );
}
