import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import Loading from "@/components/Loading";
import type { MenuCategory, MenuItem } from "@shared/schema";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("principais");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu/categories"],
  });

  const { data: menuItems = [], isLoading: itemsLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu/items"],
  });

  // Default menu items for demonstration
  const defaultMenuItems = [
    {
      id: 1,
      categoryId: 1,
      name: "Tacos Tradicionais",
      nameEn: "Traditional Tacos",
      description: "Tortilhas de milho com carne marinada, cebola, coentro e molho verde",
      descriptionEn: "Corn tortillas with marinated meat, onion, cilantro and green sauce",
      price: "3500",
      imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
      available: true,
      featured: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      categoryId: 1,
      name: "Enchiladas Rojas",
      nameEn: "Red Enchiladas",
      description: "Tortilhas recheadas com frango, banhadas em molho vermelho e queijo",
      descriptionEn: "Tortillas filled with chicken, bathed in red sauce and cheese",
      price: "4200",
      imageUrl: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
      available: true,
      featured: false,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      categoryId: 1,
      name: "Quesadilla Especial",
      nameEn: "Special Quesadilla",
      description: "Tortilha de farinha com queijo derretido, cogumelos e pimentos",
      descriptionEn: "Flour tortilla with melted cheese, mushrooms and peppers",
      price: "3800",
      imageUrl: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
      available: true,
      featured: false,
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      categoryId: 1,
      name: "Burrito Las Tortilhas",
      nameEn: "Las Tortilhas Burrito",
      description: "Tortilha grande com carne, feijão, arroz, alface e molho especial",
      descriptionEn: "Large tortilla with meat, beans, rice, lettuce and special sauce",
      price: "4500",
      imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
      available: true,
      featured: true,
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 5,
      categoryId: 1,
      name: "Nachos Supreme",
      nameEn: "Nachos Supreme",
      description: "Tortilhas crocantes com queijo derretido, jalapeños e guacamole",
      descriptionEn: "Crispy tortillas with melted cheese, jalapeños and guacamole",
      price: "3200",
      imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
      available: true,
      featured: false,
      order: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 6,
      categoryId: 1,
      name: "Fajitas de Frango",
      nameEn: "Chicken Fajitas",
      description: "Frango grelhado com pimentos e cebolas, servido em prato quente",
      descriptionEn: "Grilled chicken with peppers and onions, served on hot plate",
      price: "4800",
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
      available: true,
      featured: false,
      order: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Use default items if database is empty
  const displayItems = menuItems.length > 0 ? menuItems : defaultMenuItems;

  const menuCategories = [
    { slug: "principais", name: "Pratos Principais", nameEn: "Main Dishes" },
    { slug: "entradas", name: "Entradas", nameEn: "Appetizers" },
    { slug: "sobremesas", name: "Sobremesas", nameEn: "Desserts" },
    { slug: "bebidas", name: "Bebidas", nameEn: "Beverages" },
  ];

  // Remove loading screen to improve performance

  return (
    <section id="menu" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          ref={ref}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-rich-brown">
            Nosso Menu
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore nossa seleção de pratos autênticos mexicanos, preparados com ingredientes frescos e muito amor
          </p>
        </motion.div>
        
        {/* Menu Categories */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {menuCategories.map((category) => (
            <Button
              key={category.slug}
              onClick={() => setActiveCategory(category.slug)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.slug
                  ? "bg-gradient-to-r from-mexican-green to-mexican-red text-white"
                  : "border-2 border-mexican-green text-mexican-green hover:bg-mexican-green hover:text-white"
              }`}
              variant={activeCategory === category.slug ? "default" : "outline"}
            >
              {category.name}
            </Button>
          ))}
        </motion.div>
        
        {/* Menu Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {itemsLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            displayItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="relative">
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400"} 
                      alt={item.name} 
                      className="w-full h-48 object-cover"
                    />
                    {item.featured && (
                      <div className="absolute top-4 left-4 bg-mexican-red text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Destaque
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-playfair text-xl font-bold mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-mexican-red">
                        {parseFloat(item.price).toLocaleString('pt-AO')} Kz
                      </span>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button 
                          size="icon"
                          className="bg-mexican-green text-white rounded-full hover:bg-green-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
