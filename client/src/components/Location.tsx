import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Calendar } from "lucide-react";

export default function Location() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const openReservationModal = () => {
    const modal = document.getElementById("reservationModal");
    modal?.classList.remove("hidden");
    modal?.classList.add("flex");
    document.body.style.overflow = "hidden";
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center" ref={ref}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-rich-brown">
              Localização
            </h2>
            <p className="text-lg leading-relaxed mb-6 text-gray-700">
              Encontre-nos na prestigiada Ilha de Luanda, um dos locais mais exclusivos da capital angolana. 
              Nossa localização privilegiada oferece não apenas excelente gastronomia, mas também vistas 
              deslumbrantes da baía de Luanda.
            </p>
            
            <div className="space-y-4 mb-8">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MapPin className="text-mexican-red h-6 w-6" />
                <span className="text-lg">Ilha de Luanda, Angola</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Clock className="text-mexican-green h-6 w-6" />
                <span className="text-lg">Terça a Domingo: 18:00 - 23:00</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Phone className="text-warm-sand h-6 w-6" />
                <span className="text-lg">+244 949 639 932</span>
              </motion.div>
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={openReservationModal}
                className="bg-mexican-red hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg h-auto"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Fazer Reserva
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
              alt="Vista da Ilha de Luanda ao pôr do sol" 
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
