import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <img 
              src="/src/assets/navig-logo.png" 
              alt="Navig Logo" 
              className="h-8 mb-6"
            />
            <p className="text-gray-400">
              Transformando a maneira como as pessoas alugam carros no Brasil.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="/plans" className="hover:text-white transition-colors">Planos</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contato</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-400">
              <li>contato@navig.com.br</li>
              <li>+55 (11) 3456-7890</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2024 Navig. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};