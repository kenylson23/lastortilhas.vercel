import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function Lightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  // Set up global lightbox opener
  useEffect(() => {
    (window as any).openLightbox = (imageUrl: string) => {
      setImageSrc(imageUrl);
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    };

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeLightbox();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      (window as any).openLightbox = undefined;
    };
  }, [isOpen]);

  return (
    <div id="lightbox" className={`fixed inset-0 bg-black bg-opacity-90 z-[9999] ${isOpen ? "flex" : "hidden"} items-center justify-center p-4`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/20 hover:bg-black/40"
            >
              <X className="h-6 w-6" />
            </Button>
            
            <motion.img
              id="lightboxImage"
              src={imageSrc}
              alt=""
              className="max-w-full max-h-full object-contain rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="absolute inset-0 cursor-pointer"
          onClick={closeLightbox}
        />
      )}
    </div>
  );
}
