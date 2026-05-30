import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../lib/mock-api';
import type { Work } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, Grid, List, Plus, Heart, SlidersHorizontal, 
  ChevronLeft, ChevronRight, Image as ImageIcon, Eye, Trash2, Edit, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export default function WorksManager() {
  const navigate = useNavigate();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedFilter] = useState<string>('all');
  const [selectedFeatured, setSelectedFeatured] = useState<string>('all'); // 'all' | 'featured' | 'standard'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Categories list derived from works or defined
  const [categories, setCategories] = useState<string[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await mockApi.works.list();
      setWorks(data);
      
      // Derive categories
      const cats = Array.from(new Set(data.map(w => w.category).filter(Boolean)));
      setCategories(cats);
    } catch {
      toast.error('Error al cargar la colección de obras.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de que deseas eliminar esta obra del catálogo de forma permanente?')) {
      const t = toast.loading('Eliminando obra de la colección...');
      try {
        await mockApi.works.delete(id);
        toast.dismiss(t);
        toast.success('La obra ha sido retirada con éxito.');
        loadData();
      } catch {
        toast.dismiss(t);
        toast.error('Fallo al eliminar la obra.');
      }
    }
  };

  const handleToggleFeatured = async (work: Work, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...work, featured: !work.featured };
    const verb = updated.featured ? 'destacada' : 'normal';
    try {
      await mockApi.works.save(updated);
      toast.success(`Obra marcada como ${verb} con éxito.`);
      loadData();
    } catch {
      toast.error('Error al actualizar el estado de la obra.');
    }
  };

  const handleCreateNew = () => {
    const newId = `work-${Date.now()}`;
    navigate(`/works/${newId}?new=true`);
  };

  // Filter & Search Logic
  const filteredWorks = works.filter(w => {
    const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase()) || 
                          w.materials.toLowerCase().includes(search.toLowerCase()) ||
                          w.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || w.category === selectedCategory;
    const matchesFeatured = selectedFeatured === 'all' ? true : 
                            selectedFeatured === 'featured' ? w.featured === true : 
                            w.featured === false;
    return matchesSearch && matchesCat && matchesFeatured;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWorks = filteredWorks.slice(startIndex, startIndex + itemsPerPage);

  const formatPrice = (cents: number) => {
    if (!cents) return 'Consultar precio';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Obras y Esculturas</h1>
          <p className="text-sm text-muted-foreground">
            Administra el catálogo de tu portfolio público, precios e imágenes de alta definición.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2 self-start md:self-auto shadow-md">
          <Plus size={16} />
          Nueva Obra
        </Button>
      </div>

      {/* FILTER BAR */}
      <Card className="bg-background/40 backdrop-blur-sm border-zinc-200/80 dark:border-zinc-800/80">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar obra, material..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Category Filter */}
            <Select 
              value={selectedCategory} 
              onValueChange={(val) => {
                setSelectedFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-44 h-9 text-xs">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Featured Filter */}
            <Select 
              value={selectedFeatured} 
              onValueChange={(val) => {
                setSelectedFeatured(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40 h-9 text-xs">
                <SelectValue placeholder="Mostrar todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Mostrar todas</SelectItem>
                <SelectItem value="featured">Destacadas ⭐</SelectItem>
                <SelectItem value="standard">Obras estándar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toggle Grid/List */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 rounded-lg"
              title="Cuadrícula"
            >
              <Grid size={15} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 rounded-lg"
              title="Lista"
            >
              <List size={15} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* WORKS DISPLAY AREA */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground text-xs space-y-3">
          <RefreshCw className="animate-spin mx-auto h-8 w-8 text-primary/75" />
          <p>Cargando catálogo artístico de Antonio Carballo...</p>
        </div>
      ) : filteredWorks.length === 0 ? (
        <Card className="border-dashed border-2 py-16 text-center">
          <CardContent className="space-y-3">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No se encontraron obras</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Prueba a cambiar los filtros de búsqueda o agrega una nueva obra a tu portfolio.
            </p>
            <Button variant="outline" size="sm" onClick={handleCreateNew} className="gap-1.5 mt-2">
              <Plus size={14} /> Crear primera obra
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedWorks.map((work) => (
            <Card 
              key={work.id} 
              onClick={() => navigate(`/works/${work.id}`)}
              className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-zinc-200 dark:border-zinc-800 bg-card hover:-translate-y-1 relative"
            >
              {/* Cover Image */}
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {work.images && work.images[0] ? (
                  <img 
                    src={work.images[0]} 
                    alt={work.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 bg-zinc-100 dark:bg-zinc-900">
                    <ImageIcon size={32} />
                  </div>
                )}
                
                {/* Floating Tags */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                  <Badge className="bg-background/90 text-foreground backdrop-blur border text-[10px] font-bold px-1.5 py-0.5">
                    {work.category}
                  </Badge>
                  {work.featured && (
                    <Badge className="bg-amber-500 text-amber-50 shadow-sm text-[9px] font-extrabold px-1.5 py-0.5 flex items-center gap-1">
                      ★ Destacada
                    </Badge>
                  )}
                </div>

                {/* Hover Quick actions overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => handleToggleFeatured(work, e)}
                    title={work.featured ? "Quitar destacada" : "Hacer destacada"}
                  >
                    <Heart size={14} className={work.featured ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/works/${work.id}`);
                    }}
                    title="Editar"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => handleDelete(work.id, e)}
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              {/* Text Body */}
              <CardContent className="p-4 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {work.title}
                  </h3>
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                    {work.year}
                  </span>
                </div>
                
                <p className="text-[11px] text-muted-foreground truncate leading-relaxed">
                  {work.materials}
                </p>
                
                <p className="text-[10px] text-muted-foreground/80 font-mono">
                  {work.dimensions}
                </p>
              </CardContent>

              <CardFooter className="px-4 py-2.5 border-t bg-muted/20 flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">
                  {formatPrice(work.priceCents)}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye size={12} />
                  Editar obra
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <Card className="border rounded-xl overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-muted/50 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4 w-16">Foto</th>
                  <th className="p-4">Título de la Obra</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Año</th>
                  <th className="p-4">Materiales / Dimensiones</th>
                  <th className="p-4 text-right">Precio</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedWorks.map((work) => (
                  <tr 
                    key={work.id} 
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/works/${work.id}`)}
                  >
                    <td className="p-4">
                      <div className="w-12 h-10 rounded-md bg-muted overflow-hidden">
                        {work.images && work.images[0] ? (
                          <img src={work.images[0]} alt={work.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/35">
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm">{work.title}</span>
                        {work.featured && (
                          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/30 text-[9px] font-bold py-0 px-1.5 h-4">
                            ★ Destacada
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-[10px] font-bold px-1.5 py-0.5">
                        {work.category}
                      </Badge>
                    </td>
                    <td className="p-4 font-semibold text-muted-foreground">
                      {work.year}
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="truncate max-w-[200px] text-muted-foreground font-medium">{work.materials}</div>
                      <div className="text-[10px] text-muted-foreground/60 font-mono">{work.dimensions}</div>
                    </td>
                    <td className="p-4 text-right font-extrabold text-foreground text-sm">
                      {formatPrice(work.priceCents)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => handleToggleFeatured(work, e)}
                        >
                          <Heart size={14} className={work.featured ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => navigate(`/works/${work.id}`)}
                        >
                          <Edit size={14} className="text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-red-500"
                          onClick={(e) => handleDelete(work.id, e)}
                        >
                          <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Mostrando <span className="font-bold text-foreground">{startIndex + 1}</span> a{' '}
            <span className="font-bold text-foreground">
              {Math.min(startIndex + itemsPerPage, filteredWorks.length)}
            </span>{' '}
            de <span className="font-bold text-foreground">{filteredWorks.length}</span> obras registradas.
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="h-8 px-2"
            >
              <ChevronLeft size={14} /> Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
                className="h-8 w-8 p-0 text-xs"
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="h-8 px-2"
            >
              Next <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}