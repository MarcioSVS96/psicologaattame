import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BannerSectionProps {
  imageUrl: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  imagePosition?: string
}

export function BannerSection({
  imageUrl,
  title,
  subtitle,
  buttonText,
  buttonLink,
  imagePosition = "center",
}: BannerSectionProps) {
  return (
    <section
      className="w-full h-[300px] md:h-[350px] max-h-[400px] bg-cover bg-no-repeat relative flex items-center justify-center text-center text-white"
      style={{ backgroundImage: `url(${imageUrl})`, backgroundPosition: imagePosition }}
    >
      {/* Overlay para melhorar a legibilidade do texto */}
      <div className="absolute inset-0 bg-navy/60" />

      <div className="relative z-10 p-4 space-y-6 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-balance">{title}</h2>
        <p className="text-lg md:text-xl text-pretty">{subtitle}</p>
        <Button asChild size="lg" className="bg-turquoise hover:bg-turquoise/90 text-white font-bold text-lg px-8 py-6">
          <Link href={buttonLink}>{buttonText}</Link>
        </Button>
      </div>
    </section>
  )
}