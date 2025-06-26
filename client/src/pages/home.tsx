import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/ReservationModal";
import Lightbox from "@/components/Lightbox";

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    // Set page title with user's name for personalized experience
    document.title = user?.firstName 
      ? `Bem-vindo ${user.firstName} - Las Tortilhas | Restaurante Mexicano Luanda`
      : "Las Tortilhas - Autêntico Sabor Mexicano em Angola | Restaurante Mexicano Luanda";
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <About />
      <Menu />
      <Gallery />
      <Location />
      <Contact />
      <Footer />
      <ReservationModal />
      <Lightbox />
    </div>
  );
}
