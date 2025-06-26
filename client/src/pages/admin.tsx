import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  ChefHat, 
  Image, 
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Eye,
  ArrowLeft,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";

interface DashboardStats {
  totalReservations: number;
  pendingReservations: number;
  newContacts: number;
  totalMenuItems: number;
  galleryImages: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentReservations: any[];
  recentContacts: any[];
}

function StatsCard({ title, value, icon: Icon, color }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ReservationManager() {
  const { data: reservations, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/reservations"],
  });

  const queryClient = useQueryClient();
  const updateReservation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PUT", `/api/admin/reservations/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reservations"] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) return <div>Carregando reservas...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gerenciar Reservas</h3>
      </div>
      
      <div className="space-y-3">
        {reservations && reservations.map((reservation: any) => (
          <Card key={reservation.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{reservation.name}</h4>
                    <Badge className={getStatusColor(reservation.status)}>
                      {reservation.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📧 {reservation.email || "Não informado"}</p>
                    <p>📞 {reservation.phone}</p>
                    <p>📅 {new Date(reservation.date).toLocaleDateString()} às {reservation.time}</p>
                    <p>👥 {reservation.guests} pessoas</p>
                    {reservation.message && <p>💬 {reservation.message}</p>}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Select
                    value={reservation.status}
                    onValueChange={(status) => 
                      updateReservation.mutate({ id: reservation.id, status })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="confirmed">Confirmada</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MenuManager() {
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: "",
    spicyLevel: 0,
    vegetarian: false,
    featured: false
  });

  const { data: categories } = useQuery<any[]>({
    queryKey: ["/api/menu/categories"],
  });

  const { data: items } = useQuery<any[]>({
    queryKey: ["/api/menu/items"],
  });

  const queryClient = useQueryClient();
  const createItem = useMutation({
    mutationFn: async (item: any) => {
      await apiRequest("POST", "/api/admin/menu/items", {
        ...item,
        price: parseFloat(item.price),
        categoryId: parseInt(item.categoryId),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
      setNewItem({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        image: "",
        spicyLevel: 0,
        vegetarian: false,
        featured: false
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gerenciar Menu</h3>
      </div>

      {/* Add New Item Form */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Prato</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Ex: Taco al Pastor"
              />
            </div>
            <div>
              <Label htmlFor="price">Preço (AOA)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Descrição detalhada do prato..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={newItem.categoryId}
                onValueChange={(value) => setNewItem({ ...newItem, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories && categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                value={newItem.image}
                onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>

          <Button 
            onClick={() => createItem.mutate(newItem)}
            disabled={!newItem.name || !newItem.price || !newItem.categoryId}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Item
          </Button>
        </CardContent>
      </Card>

      {/* Menu Items List */}
      <div className="grid gap-4">
        {items && items.map((item: any) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex space-x-4">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{item.price} AOA</Badge>
                      {item.vegetarian && <Badge className="bg-green-100 text-green-800">Vegetariano</Badge>}
                      {item.featured && <Badge className="bg-yellow-100 text-yellow-800">Destaque</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GalleryManager() {
  const [newImage, setNewImage] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "food",
    featured: false
  });

  const { data: images, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/gallery"],
  });

  const queryClient = useQueryClient();
  const createImage = useMutation({
    mutationFn: async (image: any) => {
      await apiRequest("POST", "/api/admin/gallery", image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
      setNewImage({
        title: "",
        description: "",
        imageUrl: "",
        category: "food",
        featured: false
      });
    },
  });

  const deleteImage = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gerenciar Galeria</h3>
      </div>

      {/* Add New Image Form */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Imagem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newImage.title}
                onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                placeholder="Título da imagem"
              />
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={newImage.category}
                onValueChange={(value) => setNewImage({ ...newImage, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Comida</SelectItem>
                  <SelectItem value="restaurant">Restaurante</SelectItem>
                  <SelectItem value="events">Eventos</SelectItem>
                  <SelectItem value="team">Equipe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              id="imageUrl"
              value={newImage.imageUrl}
              onChange={(e) => setNewImage({ ...newImage, imageUrl: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={newImage.description}
              onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
              placeholder="Descrição da imagem..."
            />
          </div>

          <Button 
            onClick={() => createImage.mutate(newImage)}
            disabled={!newImage.title || !newImage.imageUrl}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Imagem
          </Button>
        </CardContent>
      </Card>

      {/* Gallery Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images && images.map((image: any) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <img 
                src={image.imageUrl} 
                alt={image.title}
                className="w-full h-48 rounded-lg object-cover mb-3"
              />
              <div className="space-y-2">
                <h4 className="font-semibold">{image.title}</h4>
                {image.description && (
                  <p className="text-sm text-gray-600">{image.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{image.category}</Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => deleteImage.mutate(image.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ContactManager() {
  const { data: contacts, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/contacts"],
  });

  const queryClient = useQueryClient();
  const updateContact = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PUT", `/api/admin/contacts/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "read": return "bg-blue-100 text-blue-800";
      case "replied": return "bg-green-100 text-green-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) return <div>Carregando contatos...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gerenciar Contatos</h3>
      </div>
      
      <div className="space-y-3">
        {contacts && contacts.map((contact: any) => (
          <Card key={contact.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{contact.name}</h4>
                    <Badge className={getStatusColor(contact.status)}>
                      {contact.status === "new" ? "Nova" : 
                       contact.status === "read" ? "Lida" : "Respondida"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📧 {contact.email}</p>
                    {contact.phone && <p>📞 {contact.phone}</p>}
                    <p>📅 {new Date(contact.createdAt).toLocaleDateString()}</p>
                    <p className="mt-2 p-2 bg-gray-50 rounded">{contact.message}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Select
                    value={contact.status}
                    onValueChange={(status) => 
                      updateContact.mutate({ id: contact.id, status })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Nova</SelectItem>
                      <SelectItem value="read">Lida</SelectItem>
                      <SelectItem value="replied">Respondida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/admin/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-mexican-red border-t-transparent mx-auto mb-4"></div>
          <p>Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Painel Administrativo - Las Tortilhas
              </h1>
              <p className="text-gray-600">
                Gerencie menu, reservas, galeria e contatos do restaurante
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300"
            >
              <Home className="h-4 w-4" />
              Voltar ao Site
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Total de Reservas"
            value={dashboardData?.stats.totalReservations || 0}
            icon={Calendar}
            color="text-blue-600"
          />
          <StatsCard
            title="Reservas Pendentes"
            value={dashboardData?.stats.pendingReservations || 0}
            icon={Clock}
            color="text-yellow-600"
          />
          <StatsCard
            title="Novos Contatos"
            value={dashboardData?.stats.newContacts || 0}
            icon={MessageSquare}
            color="text-green-600"
          />
          <StatsCard
            title="Itens do Menu"
            value={dashboardData?.stats.totalMenuItems || 0}
            icon={ChefHat}
            color="text-purple-600"
          />
          <StatsCard
            title="Imagens da Galeria"
            value={dashboardData?.stats.galleryImages || 0}
            icon={Image}
            color="text-pink-600"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="reservations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reservations">Reservas</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations">
            <Card>
              <CardContent className="p-6">
                <ReservationManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <Card>
              <CardContent className="p-6">
                <MenuManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardContent className="p-6">
                <GalleryManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardContent className="p-6">
                <ContactManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}