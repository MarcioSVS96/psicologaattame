import { TeaHeader } from "@/components/tea/tea-header"
import { TeaHeroSection } from "@/components/tea/tea-hero-section"
import { TeaBannerSection } from "@/components/tea/tea-banner-section"
import { TeaServicesSection } from "@/components/tea/tea-services-section"
import { TeaSubjectsSection } from "@/components/tea/tea-subjects-section"
import { TeaFaqSection } from "@/components/tea/tea-faq-section"
import { TeaCtaSection } from "@/components/tea/tea-cta-section"
import { TeaFooter } from "@/components/tea/tea-footer"

export default function TeaPage() {
  return (
    <main className="min-h-screen bg-[color:var(--tea-bg)] text-[color:var(--tea-text)]">
      <TeaHeader />

      <TeaHeroSection />

      <TeaBannerSection
        title="TEA (Transtorno do Espectro Autista)"
        subtitle="Uma página dedicada a orientação inicial, temas importantes e próximos passos."
        buttonText="Falar no WhatsApp"
        buttonLink="https://wa.me/5581985712073"
      />

      <TeaServicesSection />

      <TeaSubjectsSection />

      <TeaFaqSection />

      <TeaBannerSection
        title="Você não precisa entender tudo sozinho(a)."
        subtitle="Vamos organizar as informações e transformar em um caminho prático e acolhedor."
        buttonText="Falar no WhatsApp"
        buttonLink="https://wa.me/5581985712073"
        variant="soft"
        />

      <TeaCtaSection />

      <TeaFooter />
    </main>
  )
}
