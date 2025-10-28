import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Shield, Users } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white"
      style={{ background: "linear-gradient(to bottom right, #001f54, #1a3a6b)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-8">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-serif font-bold text-balance leading-tight">
                Cuidando da sua <span style={{ color: "#40e0d0" }}>saúde mental</span> com acolhimento e
                profissionalismo
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 text-pretty leading-relaxed">
                Foco em psicoterapia individual, voltada para quem busca autoconhecimento, equilíbrio emocional e estratégias práticas para lidar com os desafios do dia a dia.
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
            <div className="flex flex-col items-center lg:items-start space-y-4 lg:flex-row lg:space-y-0 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6" style={{ color: "#40e0d0" }} />
                <span className="text-sm">CRP 02/28474</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6" style={{ color: "#40e0d0" }} />
                <span className="text-sm">Psicologa Clínica</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6" style={{ color: "#40e0d0" }} />
                <span className="text-sm">Especialista em análise do comportamento</span>
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
                src="/profile.png"
                alt="Beatriz Attame - Psicóloga"
                className="rounded-2xl object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
