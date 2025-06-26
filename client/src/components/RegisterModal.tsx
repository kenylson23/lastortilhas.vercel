import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, UserPlus } from "lucide-react";

export default function RegisterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    terms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to Replit Auth login
    window.location.href = "/api/login";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const openLoginModal = () => {
    window.location.href = "/api/login";
  };

  // Listen for modal open events
  React.useEffect(() => {
    const handleModalOpen = () => {
      console.log("Opening register modal");
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    };

    // Set up global modal opener
    (window as any).openRegisterModal = handleModalOpen;

    // Set up click listener for modal backdrop
    const modal = document.getElementById("registerModal");
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });
    }

    return () => {
      (window as any).openRegisterModal = undefined;
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div id="registerModal" className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl max-w-md w-full max-h-screen overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-playfair text-2xl font-bold text-rich-brown flex items-center">
                  <UserPlus className="mr-2 h-6 w-6" />
                  Criar Conta
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  Crie sua conta para fazer reservas e acompanhar seu histórico
                </p>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={openLoginModal}
                    className="w-full bg-mexican-red hover:bg-red-700 text-white py-4 font-semibold text-lg h-auto"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Criar Conta com Replit
                  </Button>
                </motion.div>
                
                <p className="text-sm text-gray-500 mt-4">
                  Registro rápido e seguro através do Replit
                </p>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-center text-gray-600">
                  Já tem uma conta?{" "}
                  <button 
                    onClick={openLoginModal}
                    className="text-mexican-red hover:underline font-semibold"
                  >
                    Entrar
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
