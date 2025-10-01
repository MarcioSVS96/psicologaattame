import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { EducationSection } from "@/components/education-section"
import { ServicesSection } from "@/components/services-section"
import { ContactSection } from "@/components/contact-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BannerSection } from "@/components/banner-section"
import { LatestPosts } from "@/components/latest-posts"


export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <EducationSection />
      <BannerSection
        imageUrl="/banner.png"
        title="Acompanhamentos psicoterapeuticos."
        subtitle="100% Online"
        buttonText="Saiba Mais"
        buttonLink="/services"
      />
      <LatestPosts />
      <AboutSection />
      <BannerSection
        imageUrl="/banner.png"
        title="Acompanhamentos psicoterapeuticos."
        subtitle="100% Online"
        buttonText="Saiba Mais"
        buttonLink="/services"
      />
      <ContactSection />
      <Footer />
    </main>
  )
}
