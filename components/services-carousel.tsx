"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, User, Users, Heart, Brain, BookOpen, Smile, ClipboardCheck, Briefcase, Lightbulb } from "lucide-react"
import Link from "next/link"

import "swiper/css"
import "swiper/css/navigation"

interface Service {
  id: string
  title: string
  description: string
  duration_minutes: number
  features: string[]
  icon: string
}

interface ServicesCarouselProps {
  services: Service[]
  isLoggedIn: boolean
}

// Mapeamento de nomes de ícones para componentes Lucide
const serviceIcons: { [key: string]: React.ElementType } = {
  User,
  Users,
  Heart,
  Brain,
  BookOpen,
  Smile,
  ClipboardCheck,
  Briefcase,
  Lightbulb,
}

export function ServicesCarousel({ services, isLoggedIn }: ServicesCarouselProps) {
  return (
    <div className="relative w-full max-w-7xl">
      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        breakpoints={{
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className="!pb-10" // Adiciona padding-bottom para a paginação/navegação não sobrepor
      >
        {services.map((service) => {
          const IconComponent = service.icon ? serviceIcons[service.icon] : User
          return (
            <SwiperSlide key={service.id} className="h-auto">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <CardHeader className="text-center pb-4">
                  <div className="bg-turquoise/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-turquoise" />
                  </div>
                  <CardTitle className="text-xl font-bold text-navy">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 flex flex-col flex-grow">
                  <p className="text-gray-600 text-pretty text-sm leading-relaxed flex-grow">{service.description}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-turquoise" />
                    <span className="text-gray-600">{service.duration_minutes} minutos</span>
                  </div>
                  <div className="space-y-2">
                    {Array.isArray(service.features) &&
                      service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-turquoise rounded-full"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                  </div>
                  <Button asChild className="w-full bg-turquoise hover:bg-turquoise/90 text-white mt-auto">
                    <Link href={isLoggedIn ? "/book-appointment" : "/auth/login"}>Agendar Consulta</Link>
                  </Button>
                </CardContent>
              </Card>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}