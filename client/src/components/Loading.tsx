import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-rich-brown flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img 
            src="/logo.jpg" 
            alt="Las Tortilhas Logo" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <motion.div
          className="flex items-center justify-center space-x-2"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-2 h-2 bg-mexican-green rounded-full"></div>
          <div className="w-2 h-2 bg-mexican-red rounded-full"></div>
          <div className="w-2 h-2 bg-warm-sand rounded-full"></div>
        </motion.div>
        
        <motion.p
          className="text-white text-lg font-playfair mt-4"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Carregando Las Tortilhas...
        </motion.p>
      </div>
    </div>
  );
}