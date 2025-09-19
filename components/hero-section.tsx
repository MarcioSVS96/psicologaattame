import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Shield, Users } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section
      id="hero"
      className="pt-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white"
      style={{ background: "linear-gradient(to bottom right, #001f54, #1a3a6b)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-serif font-bold text-balance leading-tight">
                Cuidando da sua <span style={{ color: "#40e0d0" }}>saúde mental</span> com acolhimento e
                profissionalismo
              </h1>
              <p className="text-xl text-gray-200 text-pretty leading-relaxed">
                Sou Beatriz Attame, psicóloga especializada em terapia individual, de casal e familiar. Ofereço um
                espaço seguro e acolhedor para você encontrar o equilíbrio emocional.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-white hover:opacity-90" style={{ backgroundColor: "#40e0d0" }}>
                <Link href="/book-appointment">
                  Agendar Primeira Consulta
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
              >
                <Link href="#about">Saiba Mais</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6" style={{ color: "#40e0d0" }} />
                <span className="text-sm">CRP 06/123456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6" style={{ color: "#40e0d0" }} />
                <span className="text-sm">+5 anos de experiência</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6" style={{ color: "#40e0d0" }} />
                <span className="text-sm">+200 pacientes atendidos</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div
              className="aspect-square rounded-2xl backdrop-blur-sm border flex items-center justify-center"
              style={{ backgroundColor: "rgba(64, 224, 208, 0.2)", borderColor: "rgba(64, 224, 208, 0.3)" }}
            >
              <img
                src="/professional-psychologist-woman-in-office-setting.jpg"
                alt="Beatriz Attame - Psicóloga"
                className="rounded-2xl object-cover w-full h-full"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 rounded-full p-4" style={{ backgroundColor: "#40e0d0" }}>
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
