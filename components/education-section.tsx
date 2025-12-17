import { Card, CardContent } from "@/components/ui/card"
import { Award, Brain, Heart, Target, Users } from "lucide-react"

export function EducationSection() {
  const education = [
    {
      icon: Heart,
      title: "Acolhimento",
      description:
        "Ofereço um ambiente seguro, ético e livre de julgamentos, no qual você pode se expressar com liberdade e autenticidade.",
    },
    {
      icon: Brain,
      title: "Abordagem Científica",
      description:
        "O compromisso com a ciência é essencial para promover mudanças reais e sustentáveis.",
    },
    {
      icon: Users,
      title: "Atendimento Personalizado",
      description:
        "Adapto o processo psicoterapêutico às suas necessidades específicas, respeitando seu ritmo, suas particularidades emocionais e sua subjetividade.",
    },
    {
      icon: Target,
      title: "Foco em Resultados",
      description:
        "Trabalho com objetivos terapêuticos claros, orientados para o desenvolvimento pessoal e o bem-estar emocional.",
    },
  ]

  return (
    <section id="education" className="min-h-screen flex items-center bg-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-5 pb-20">
        {/* TÍTULO DA SEÇÃO */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-serif font-bold text-navy text-balance">
            Minha Abordagem Terapêutica
          </h2>
          <p className="text-xl text-gray-600 text-pretty max-w-3xl mx-auto">
            Conheça os pilares que orientam meu trabalho clínico e garantem um
            atendimento ético, personalizado e baseado em evidências.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {education.map((item, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full"
            >
              <CardContent className="p-8 text-center flex flex-col h-full">
                <div className="bg-turquoise/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <item.icon className="h-8 w-8 text-turquoise" />
                </div>

                <div className="space-y-2 mt-4 flex-1 flex flex-col justify-start">
                  <h3 className="font-bold text-navy text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CRP */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-navy/5 px-6 py-3 rounded-full">
            <Award className="h-5 w-5 text-navy" />
            <span className="font-semibold text-navy">
              CRP 02/28474 - Conselho Regional de Psicologia
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
