import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, UserPlus, Mail, Lock, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ValidationState {
  email: { valid: boolean; message: string };
  password: { valid: boolean; message: string };
}

export default function RegisterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [validation, setValidation] = useState<ValidationState>({
    email: { valid: false, message: "" },
    password: { valid: false, message: "" }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return { valid: false, message: "" };
    if (!emailRegex.test(email)) return { valid: false, message: "Email inválido" };
    return { valid: true, message: "Email válido" };
  };

  const validatePassword = (password: string) => {
    if (!password) return { valid: false, message: "" };
    if (password.length < 6) return { valid: false, message: "Mínimo 6 caracteres" };
    if (password.length >= 8) return { valid: true, message: "Senha forte" };
    return { valid: true, message: "Senha válida" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validation.email.valid || !validation.password.valid) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Login realizado com sucesso!",
        });
        
        // Invalidate auth cache to update authentication state
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        
        closeModal();
      } else {
        toast({
          title: "Erro no login",
          description: data.message || "Credenciais inválidas",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Tente novamente em alguns momentos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    if (name === 'email') {
      setValidation(prev => ({ ...prev, email: validateEmail(value) }));
    } else if (name === 'password') {
      setValidation(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
    setFormData({ email: "", password: "", confirmPassword: "" });
    setValidation({
      email: { valid: false, message: "" },
      password: { valid: false, message: "" }
    });
  };

  const openLoginModal = () => {
    window.location.href = "/api/login";
  };

  // Listen for modal open events
  React.useEffect(() => {
    const handleModalOpen = () => {
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

  const isFormValid = validation.email.valid && validation.password.valid && 
                     formData.password === formData.confirmPassword && 
                     formData.confirmPassword.length > 0;

  return (
    <div id="registerModal" className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, type: "spring", damping: 20 }}
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-mexican-red to-red-600 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Shield className="mr-3 h-7 w-7" />
                    <h2 className="font-playfair text-2xl font-bold">Criar Conta</h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={closeModal}
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <p className="text-red-100">Sistema Inteligente de Cadastro</p>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="exemplo@email.com"
                      className={`pr-10 transition-all duration-200 ${
                        validation.email.message 
                          ? validation.email.valid 
                            ? 'border-green-500 focus:ring-green-500' 
                            : 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300'
                      }`}
                      required
                    />
                    {validation.email.message && (
                      <div className="absolute right-3 top-3">
                        {validation.email.valid ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {validation.email.message && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-xs ${validation.email.valid ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {validation.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Mínimo 6 caracteres"
                      className={`pr-10 transition-all duration-200 ${
                        validation.password.message 
                          ? validation.password.valid 
                            ? 'border-green-500 focus:ring-green-500' 
                            : 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300'
                      }`}
                      required
                    />
                    {validation.password.message && (
                      <div className="absolute right-3 top-3">
                        {validation.password.valid ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {validation.password.message && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-xs ${validation.password.valid ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {validation.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Digite a senha novamente"
                      className={`pr-10 transition-all duration-200 ${
                        formData.confirmPassword
                          ? formData.password === formData.confirmPassword
                            ? 'border-green-500 focus:ring-green-500'
                            : 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300'
                      }`}
                      required
                    />
                    {formData.confirmPassword && (
                      <div className="absolute right-3 top-3">
                        {formData.password === formData.confirmPassword ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-600"
                    >
                      As senhas não coincidem
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.div 
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }} 
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  className="pt-4"
                >
                  <Button 
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className={`w-full py-4 font-semibold text-lg h-auto transition-all duration-200 ${
                      isFormValid 
                        ? 'bg-gradient-to-r from-mexican-red to-red-600 hover:from-red-700 hover:to-red-700 text-white shadow-lg' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Criando conta...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Criar Conta Agora
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Help Text */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-green-800 font-semibold text-sm mb-2 flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Como funciona:
                </h4>
                <p className="text-green-700 text-xs leading-relaxed">
                  Digite um email válido e uma senha segura. Se você ainda não tem conta, 
                  ela será criada automaticamente. Se já tem conta, você será logado diretamente.
                </p>
              </div>
              
              {/* Footer */}
              <div className="border-t pt-4 mt-6">
                <p className="text-center text-gray-600 text-sm">
                  Já tem uma conta?{" "}
                  <button 
                    onClick={openLoginModal}
                    className="text-mexican-red hover:underline font-semibold transition-all"
                  >
                    Entrar agora
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
