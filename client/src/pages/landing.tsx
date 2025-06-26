import { useEffect } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/ReservationModal";
import RegisterModal from "@/components/RegisterModal";
import Lightbox from "@/components/Lightbox";

export default function Landing() {
  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = "Las Tortilhas - Autêntico Sabor Mexicano em Angola | Restaurante Mexicano Luanda";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Las Tortilhas - O melhor restaurante mexicano na Ilha de Luanda. Sabores autênticos do México em Angola. Reserve sua mesa!');
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Las Tortilhas - O melhor restaurante mexicano na Ilha de Luanda. Sabores autênticos do México em Angola. Reserve sua mesa!";
      document.head.appendChild(meta);
    }
  }, []);

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
      <RegisterModal />
      <Lightbox />
    </div>
  );
}
