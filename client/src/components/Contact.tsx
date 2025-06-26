import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo seu contacto. Responderemos em breve.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contacto" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          ref={ref}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
            Entre em Contacto
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Tem alguma dúvida ou sugestão? Adoraríamos ouvir de você!
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-white mb-2 block">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-600 text-white focus:border-mexican-red"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-600 text-white focus:border-mexican-red"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-white mb-2 block">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-600 text-white focus:border-mexican-red"
                />
              </div>
              
              <div>
                <Label htmlFor="message" className="text-white mb-2 block">Mensagem</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-600 text-white focus:border-mexican-red"
                />
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  type="submit" 
                  disabled={contactMutation.isPending}
                  className="w-full bg-mexican-red hover:bg-red-700 text-white py-4 font-semibold text-lg h-auto"
                >
                  <Send className="mr-2 h-5 w-5" />
                  {contactMutation.isPending ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </motion.div>
            </form>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8">
                <h3 className="font-playfair text-2xl font-bold mb-6 text-white">
                  Informações de Contacto
                </h3>
                
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-start space-x-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <MapPin className="text-mexican-red h-6 w-6 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1 text-white">Endereço</h4>
                      <p className="text-gray-300">Ilha de Luanda, Angola</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Phone className="text-mexican-green h-6 w-6 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1 text-white">Telefone</h4>
                      <p className="text-gray-300">+244 949 639 932</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Clock className="text-warm-sand h-6 w-6 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1 text-white">Horário de Funcionamento</h4>
                      <p className="text-gray-300">Terça a Domingo: 18:00 - 23:00</p>
                      <p className="text-gray-300">Segunda: Fechado</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Mail className="text-mexican-red h-6 w-6 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1 text-white">Email</h4>
                      <p className="text-gray-300">info@lastortilhas.ao</p>
                    </div>
                  </motion.div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-semibold mb-4 text-white">Siga-nos</h4>
                  <div className="flex space-x-4">
                    <motion.a 
                      href="#" 
                      className="bg-mexican-red hover:bg-red-700 p-3 rounded-full transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaFacebook className="h-5 w-5" />
                    </motion.a>
                    <motion.a 
                      href="#" 
                      className="bg-mexican-green hover:bg-green-700 p-3 rounded-full transition-colors"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaInstagram className="h-5 w-5" />
                    </motion.a>
                    <motion.a 
                      href="https://wa.me/244949639932" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-warm-sand hover:bg-yellow-600 p-3 rounded-full transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaWhatsapp className="h-5 w-5" />
                    </motion.a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
