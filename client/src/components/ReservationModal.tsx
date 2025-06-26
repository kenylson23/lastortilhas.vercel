import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X, Calendar, MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function ReservationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    notes: ""
  });

  const reservationMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/reservations", {
        ...data,
        guests: parseInt(data.guests),
        date: new Date(data.date + "T" + data.time + ":00")
      });
    },
    onSuccess: () => {
      // Create WhatsApp message
      const dateObj = new Date(formData.date);
      const formattedDate = dateObj.toLocaleDateString('pt-PT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      let message = `Olá! Gostaria de fazer uma reserva no Las Tortilhas:\n\n`;
      message += `👤 Nome: ${formData.name}\n`;
      message += `📞 Telefone: ${formData.phone}\n`;
      message += `📅 Data: ${formattedDate}\n`;
      message += `🕐 Horário: ${formData.time}\n`;
      message += `👥 Pessoas: ${formData.guests}\n`;
      if (formData.notes) {
        message += `📝 Observações: ${formData.notes}\n`;
      }
      message += `\nObrigado!`;
      
      // WhatsApp URL
      const whatsappNumber = '244949639932';
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp
      window.open(whatsappURL, '_blank');
      
      toast({
        title: "Reserva criada!",
        description: "Redirecionando para WhatsApp para confirmação...",
      });
      
      closeModal();
      setFormData({ name: "", phone: "", date: "", time: "", guests: "", notes: "" });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar reserva",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reservationMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  // Listen for modal open events
  React.useEffect(() => {
    const handleModalOpen = () => {
      console.log("Opening reservation modal");
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    };

    // Set up global modal opener
    (window as any).openReservationModal = handleModalOpen;

    // Set up click listener for modal backdrop
    const modal = document.getElementById("reservationModal");
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });
    }

    return () => {
      (window as any).openReservationModal = undefined;
    };
  }, []);

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <div id="reservationModal" className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
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
                  <Calendar className="mr-2 h-6 w-6" />
                  Fazer Reserva
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
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="res-name">Nome</Label>
                  <Input
                    id="res-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="focus:border-mexican-red focus:ring-mexican-red"
                  />
                </div>
                
                <div>
                  <Label htmlFor="res-phone">Telefone</Label>
                  <Input
                    id="res-phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="focus:border-mexican-red focus:ring-mexican-red"
                  />
                </div>
                
                <div>
                  <Label htmlFor="res-date">Data</Label>
                  <Input
                    id="res-date"
                    name="date"
                    type="date"
                    required
                    min={today}
                    value={formData.date}
                    onChange={handleInputChange}
                    className="focus:border-mexican-red focus:ring-mexican-red"
                  />
                </div>
                
                <div>
                  <Label htmlFor="res-time">Horário</Label>
                  <Select onValueChange={(value) => handleSelectChange(value, "time")} required>
                    <SelectTrigger className="focus:border-mexican-red focus:ring-mexican-red">
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18:00">18:00</SelectItem>
                      <SelectItem value="18:30">18:30</SelectItem>
                      <SelectItem value="19:00">19:00</SelectItem>
                      <SelectItem value="19:30">19:30</SelectItem>
                      <SelectItem value="20:00">20:00</SelectItem>
                      <SelectItem value="20:30">20:30</SelectItem>
                      <SelectItem value="21:00">21:00</SelectItem>
                      <SelectItem value="21:30">21:30</SelectItem>
                      <SelectItem value="22:00">22:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="res-guests">Número de Pessoas</Label>
                  <Select onValueChange={(value) => handleSelectChange(value, "guests")} required>
                    <SelectTrigger className="focus:border-mexican-red focus:ring-mexican-red">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 pessoa</SelectItem>
                      <SelectItem value="2">2 pessoas</SelectItem>
                      <SelectItem value="3">3 pessoas</SelectItem>
                      <SelectItem value="4">4 pessoas</SelectItem>
                      <SelectItem value="5">5 pessoas</SelectItem>
                      <SelectItem value="6">6 pessoas</SelectItem>
                      <SelectItem value="7">7 pessoas</SelectItem>
                      <SelectItem value="8">8 pessoas</SelectItem>
                      <SelectItem value="9">9+ pessoas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="res-notes">Observações (opcional)</Label>
                  <Textarea
                    id="res-notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Alergias alimentares, ocasião especial, etc."
                    className="focus:border-mexican-red focus:ring-mexican-red"
                  />
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    disabled={reservationMutation.isPending}
                    className="w-full bg-mexican-green hover:bg-green-700 text-white py-4 font-semibold text-lg h-auto"
                  >
                    <FaWhatsapp className="mr-2 h-5 w-5" />
                    {reservationMutation.isPending ? "Processando..." : "Confirmar via WhatsApp"}
                  </Button>
                </motion.div>
              </form>
              
              <p className="text-center mt-4 text-sm text-gray-600 flex items-center justify-center">
                <MessageCircle className="mr-1 h-4 w-4" />
                Sua reserva será confirmada via WhatsApp
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
