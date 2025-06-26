import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Heart } from "lucide-react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="sobre" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center" ref={ref}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
              alt="Interior do restaurante Las Tortilhas" 
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-rich-brown">
              Nossa História
            </h2>
            <p className="text-lg leading-relaxed mb-6 text-gray-700">
              Las Tortilhas nasceu do sonho de trazer os verdadeiros sabores do México para Angola. 
              Localizado na prestigiada Ilha de Luanda, nosso restaurante combina tradições culinárias 
              milenares com ingredientes frescos e de qualidade.
            </p>
            <p className="text-lg leading-relaxed mb-8 text-gray-700">
              Cada prato é preparado com amor e respeito pelas receitas tradicionais, 
              oferecendo uma experiência gastronómica autêntica que transporta nossos clientes 
              diretamente ao coração do México.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                className="text-center p-6 bg-white rounded-xl shadow-lg"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl text-mexican-red mb-2">
                  <Award className="mx-auto h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg">Qualidade Premium</h3>
                <p className="text-gray-600">Ingredientes selecionados</p>
              </motion.div>
              
              <motion.div 
                className="text-center p-6 bg-white rounded-xl shadow-lg"
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl text-mexican-green mb-2">
                  <Heart className="mx-auto h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg">Tradição Autêntica</h3>
                <p className="text-gray-600">Receitas originais</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
