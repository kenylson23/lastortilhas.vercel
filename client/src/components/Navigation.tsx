import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const openRegisterModal = () => {
    const modal = document.getElementById("registerModal");
    modal?.classList.remove("hidden");
    modal?.classList.add("flex");
    document.body.style.overflow = "hidden";
  };

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-md" : "bg-transparent"
      }`}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src="/logo.jpg" 
                alt="Las Tortilhas Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-playfair font-bold text-xl text-white">Las Tortilhas</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection("inicio")}
              className="text-white hover:text-warm-sand transition-colors"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection("sobre")}
              className="text-white hover:text-warm-sand transition-colors"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection("menu")}
              className="text-white hover:text-warm-sand transition-colors"
            >
              Menu
            </button>
            <button 
              onClick={() => scrollToSection("galeria")}
              className="text-white hover:text-warm-sand transition-colors"
            >
              Galeria
            </button>
            <button 
              onClick={() => scrollToSection("contacto")}
              className="text-white hover:text-warm-sand transition-colors"
            >
              Contacto
            </button>
            
            {!isAuthenticated ? (
              <Button 
                onClick={openRegisterModal}
                className="bg-mexican-red hover:bg-red-700 text-white"
              >
                Registar
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-white">Olá, {user?.firstName || 'Utilizador'}</span>
                <Button 
                  onClick={() => window.location.href = '/api/logout'}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-rich-brown"
                >
                  Sair
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-rich-brown text-white">
              <div className="flex flex-col space-y-6 mt-8">
                <button 
                  onClick={() => scrollToSection("inicio")}
                  className="text-left hover:text-warm-sand transition-colors"
                >
                  Início
                </button>
                <button 
                  onClick={() => scrollToSection("sobre")}
                  className="text-left hover:text-warm-sand transition-colors"
                >
                  Sobre
                </button>
                <button 
                  onClick={() => scrollToSection("menu")}
                  className="text-left hover:text-warm-sand transition-colors"
                >
                  Menu
                </button>
                <button 
                  onClick={() => scrollToSection("galeria")}
                  className="text-left hover:text-warm-sand transition-colors"
                >
                  Galeria
                </button>
                <button 
                  onClick={() => scrollToSection("contacto")}
                  className="text-left hover:text-warm-sand transition-colors"
                >
                  Contacto
                </button>
                
                {!isAuthenticated ? (
                  <Button 
                    onClick={openRegisterModal}
                    className="bg-mexican-red hover:bg-red-700 text-white w-full"
                  >
                    Registar
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-warm-sand">Olá, {user?.firstName || 'Utilizador'}</p>
                    <Button 
                      onClick={() => window.location.href = '/api/logout'}
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-rich-brown w-full"
                    >
                      Sair
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
