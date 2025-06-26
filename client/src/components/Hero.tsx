import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Utensils, Calendar, Images, ChevronDown } from "lucide-react";

const floatingElements = [
  { id: 1, delay: 0, size: "w-20 h-20", position: "top-20 left-10", color: "bg-mexican-green" },
  { id: 2, delay: 1, size: "w-16 h-16", position: "top-40 right-16", color: "bg-mexican-red" },
  { id: 3, delay: 2, size: "w-12 h-12", position: "bottom-32 left-20", color: "bg-warm-sand" },
];

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const openReservationModal = () => {
    const modal = document.getElementById("reservationModal");
    modal?.classList.remove("hidden");
    modal?.classList.add("flex");
    document.body.style.overflow = "hidden";
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 parallax-bg"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Floating Food Elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute ${element.position} ${element.size} ${element.color} rounded-full opacity-20`}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut"
          }}
        />
      ))}
      
      <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h1 className="font-playfair text-6xl md:text-8xl font-bold mb-6">
            <span className="mexican-green">Las</span>{" "}
            <span className="text-white">Tortilhas</span>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p className="text-xl md:text-2xl mb-8 font-light warm-sand">
            Autêntico Sabor Mexicano em Angola
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Descubra os sabores tradicionais do México no coração da Ilha de Luanda. 
            Uma experiência gastronómica única que combina receitas autênticas com o calor angolano.
          </p>
        </motion.div>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={() => scrollToSection("menu")}
              className="bg-mexican-red hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg h-auto"
            >
              <Utensils className="mr-2 h-5 w-5" />
              Ver Menu
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={openReservationModal}
              variant="outline"
              className="border-2 border-white hover:bg-white hover:text-rich-brown text-white px-8 py-4 rounded-full font-semibold text-lg h-auto"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Fazer Reserva
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={() => scrollToSection("galeria")}
              className="bg-mexican-green hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg h-auto"
            >
              <Images className="mr-2 h-5 w-5" />
              Galeria
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="h-8 w-8" />
      </motion.div>
    </section>
  );
}
