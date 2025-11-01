import { Card, CardContent } from "@/components/ui/card"
import { Heart, Brain, Users, Target } from "lucide-react"

export function AboutSection() {
  const values = [
    {
      icon: Heart,
      title: "Acolhimento",
      description: "Ofereço um ambiente seguro, ético e livre de julgamentos, no qual você pode se expressar com liberdade e autenticidade.",
    },
    {
      icon: Brain,
      title: "Abordagem Científica",
      description: "O compromisso com a ciência é essencial para promover mudanças reais e sustentáveis.",
    },
    {
      icon: Users,
      title: "Atendimento Personalizado",
      description: "Adapto o processo psicoterapêutico às suas necessidades específicas, respeitando seu ritmo, suas particularidades emocionais e sua subjetividade.",

    },
    {
      icon: Target,
      title: "Foco em Resultados",
      description: "Trabalho com objetivos terapêuticos claros, orientados para o desenvolvimento pessoal e o bem-estar emocional. ",

    },
  ]

  return (
    <section id="about" className="min-h-screen flex items-center bg-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src="/about.png"
              alt="Psicóloga Beatriz Attame"
              className="rounded-2xl shadow-2xl object-cover w-full h-auto max-h-[85vh]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent rounded-2xl"></div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-serif font-bold text-navy text-balance">Sobre mim</h2>
              <p className="text-lg text-gray-700 text-pretty leading-relaxed">
                 Meu trabalho tem como base o acolhimento, oferecendo um espaço de escuta e respeito. Atuo com Terapia Cognitivo-Comportamental (TCC) baseada em evidências, promovendo intervenções eficazes voltadas ao autoconhecimento, ao fortalecimento psicológico e a mudanças positivas e duradouras.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-1">
                    <div className="flex flex-col items-center gap-2 text-center">
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
