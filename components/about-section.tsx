import { Card, CardContent } from "@/components/ui/card"
import { Heart, Brain, Users, Target } from "lucide-react"

export function AboutSection() {
  const values = [
    {
      icon: Heart,
      title: "Acolhimento",
      description: "Ofereço um ambiente seguro e livre de julgamentos para você se expressar.",
    },
    {
      icon: Brain,
      title: "Abordagem Científica",
      description: "Utilizo técnicas baseadas em evidências científicas para resultados efetivos.",
    },
    {
      icon: Users,
      title: "Atendimento Personalizado",
      description: "Cada pessoa é única, por isso adapto o tratamento às suas necessidades específicas.",
    },
    {
      icon: Target,
      title: "Foco em Resultados",
      description: "Trabalho com objetivos claros para promover mudanças positivas em sua vida.",
    },
  ]

  return (
    <section id="about" className="py-20 bg-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src="/psychology-office-interior--cozy-therapy-room-with.jpg"
              alt="Consultório de Psicologia"
              className="rounded-2xl shadow-2xl object-cover w-full h-[600px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent rounded-2xl"></div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-serif font-bold text-navy text-balance">Sobre mim</h2>
              <p className="text-lg text-gray-700 text-pretty leading-relaxed">
                Sou psicóloga formada pela Universidade de São Paulo (USP) com especialização em Terapia
                Cognitivo-Comportamental. Há mais de 5 anos dedico-me ao cuidado da saúde mental, ajudando pessoas a
                superarem desafios emocionais e desenvolverem uma vida mais plena e equilibrada.
              </p>
              <p className="text-lg text-gray-700 text-pretty leading-relaxed">
                Acredito que cada pessoa possui recursos internos para promover mudanças positivas em sua vida. Meu
                papel é facilitar esse processo, oferecendo ferramentas e estratégias personalizadas para cada situação.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-turquoise/10 p-3 rounded-lg">
                        <value.icon className="h-6 w-6 text-turquoise" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-navy">{value.title}</h3>
                        <p className="text-sm text-gray-600 text-pretty">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
