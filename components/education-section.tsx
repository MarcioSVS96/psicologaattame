import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Award, BookOpen, Users } from "lucide-react"

export function EducationSection() {
  const education = [
    {
      icon: GraduationCap,
      title: "Graduação em Psicologia",
      institution: "Universidade de São Paulo (USP)",
      year: "2018",
      description: "Formação sólida em fundamentos da psicologia e práticas clínicas.",
    },
    {
      icon: Award,
      title: "Especialização em TCC",
      institution: "Instituto de Terapia Cognitiva",
      year: "2019",
      description: "Especialização em Terapia Cognitivo-Comportamental para adultos.",
    },
    {
      icon: BookOpen,
      title: "Pós-graduação em Terapia de Casal",
      institution: "PUC-SP",
      year: "2020",
      description: "Formação especializada em terapia de casal e relacionamentos.",
    },
    {
      icon: Users,
      title: "Formação em Terapia Familiar",
      institution: "Instituto Familiae",
      year: "2021",
      description: "Capacitação em dinâmicas familiares e terapia sistêmica.",
    },
  ]

  return (
    <section id="education" className="min-h-screen flex items-center bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-serif font-bold text-navy text-balance">Formação e Qualificações</h2>
          <p className="text-xl text-gray-600 text-pretty max-w-3xl mx-auto">
            Minha formação acadêmica e especializações garantem um atendimento de qualidade, baseado nas melhores
            práticas da psicologia clínica.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {education.map((item, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="bg-turquoise/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <item.icon className="h-8 w-8 text-turquoise" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-navy text-lg">{item.title}</h3>
                  <p className="font-medium text-turquoise">{item.institution}</p>
                  <p className="text-sm text-gray-500">{item.year}</p>
                  <p className="text-sm text-gray-600 text-pretty">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CRP Registration */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-navy/5 px-6 py-3 rounded-full">
            <Award className="h-5 w-5 text-navy" />
            <span className="font-semibold text-navy">CRP 06/123456 - Conselho Regional de Psicologia</span>
          </div>
        </div>
      </div>
    </section>
  )
}
