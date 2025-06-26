import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
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
    console.log("Button clicked - opening register modal");
    if ((window as any).openRegisterModal) {
      (window as any).openRegisterModal();
    } else {
      console.log("Global openRegisterModal function not found");
    }
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
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">
                  Olá, {user?.firstName || user?.email || 'Utilizador'}
                </span>
                {user?.role === 'admin' && (
                  <Button 
                    onClick={() => window.location.href = '/admin'}
                    variant="outline"
                    className="border-mexican-red text-mexican-red hover:bg-mexican-red hover:text-white"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Admin
                  </Button>
                )}
                <Button 
                  onClick={() => window.location.href = '/api/logout'}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </Button>
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-mexican-red hover:bg-red-700 text-white"
                >
                  <User className="mr-2 h-4 w-4" />
                  Registar
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
                
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <p className="text-warm-sand text-sm">
                      Olá, {user?.firstName || user?.email || 'Utilizador'}
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/api/logout'}
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-black"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      onClick={() => window.location.href = '/api/login'}
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-black"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Entrar
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/api/login'}
                      className="bg-mexican-red hover:bg-red-700 text-white w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Registar
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