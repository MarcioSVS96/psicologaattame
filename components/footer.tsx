import Link from "next/link"
import { Heart, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold">Beatriz Attame</h3>
            <p className="text-gray-300 text-pretty">
              Psicóloga dedicada ao cuidado da saúde mental, oferecendo atendimento humanizado e personalizado em São
              Paulo.
            </p>
            <div className="flex items-center space-x-2 text-turquoise">
              <Heart className="h-5 w-5" />
              <span className="text-sm">CRP 02/28474</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Links Rápidos</h4>
            <nav className="space-y-2">
              <Link href="#about" className="block text-gray-300 hover:text-turquoise transition-colors">
                Sobre
              </Link>
              <Link href="#education" className="block text-gray-300 hover:text-turquoise transition-colors">
                Formação
              </Link>
              <Link href="#services" className="block text-gray-300 hover:text-turquoise transition-colors">
                Serviços
              </Link>
              <Link href="#contact" className="block text-gray-300 hover:text-turquoise transition-colors">
                Contato
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-turquoise" />
                <span className="text-gray-300">(81) 98571-2073</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-turquoise" />
                <span className="text-gray-300">contato@beatrizattame.com.br</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-turquoise mt-0.5" />
                <span className="text-gray-300">
                  Rua das Flores, 123
                  <br />
                  São Paulo, SP
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Beatriz Attame. Todos os direitos reservados. | Desenvolvido com carinho para cuidar da sua saúde
            mental.
          </p>
        </div>
      </div>
    </footer>
  )
}
