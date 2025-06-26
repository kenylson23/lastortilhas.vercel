import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-mexican-red rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🌶️</span>
              </div>
              <span className="font-playfair font-bold text-xl">Las Tortilhas</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Autêntico sabor mexicano no coração da Ilha de Luanda. 
              Uma experiência gastronómica única que combina tradição e qualidade.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection("inicio")}
                  className="hover:text-mexican-red transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("sobre")}
                  className="hover:text-mexican-red transition-colors"
                >
                  Sobre
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("menu")}
                  className="hover:text-mexican-red transition-colors"
                >
                  Menu
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("galeria")}
                  className="hover:text-mexican-red transition-colors"
                >
                  Galeria
                </button>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <span className="mr-2">📍</span>
                Ilha de Luanda, Angola
              </li>
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                +244 949 639 932
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                info@lastortilhas.ao
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-4">Siga-nos</h4>
              <div className="flex space-x-4">
                <motion.a 
                  href="#" 
                  className="bg-mexican-red hover:bg-red-700 p-2 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaFacebook className="h-4 w-4" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="bg-mexican-green hover:bg-green-700 p-2 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaInstagram className="h-4 w-4" />
                </motion.a>
                <motion.a 
                  href="https://wa.me/244949639932" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-warm-sand hover:bg-yellow-600 p-2 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaWhatsapp className="h-4 w-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">Horário</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Terça a Domingo</li>
              <li>18:00 - 23:00</li>
              <li className="text-mexican-red">Segunda: Fechado</li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>&copy; {new Date().getFullYear()} Las Tortilhas. Todos os direitos reservados.</p>
        </motion.div>
      </div>
    </footer>
  );
}
