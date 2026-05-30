import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../lib/mock-api';
import type { Page, Section } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Search, BookOpen, Layers, Plus, ExternalLink, Sparkles, 
  HelpCircle, CheckCircle, Info, Compass, Sliders, ArrowUpRight, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface LibraryItem {
  id: string;
  key: string;
  name: string;
  category: 'Portada' | 'Galerías' | 'Soporte' | 'Interacción';
  description: string;
  thumbnailUrl: string;
  moduleKey: string;
}

export default function SectionLibrary() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Add to page state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<LibraryItem | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string>('');

  const installedSections: LibraryItem[] = [
    {
      id: 'lib-1',
      key: 'hero_banner',
      name: 'Banner de Portada (Hero Banner)',
      category: 'Portada',
      description: 'Título impactante, descripción profesional, llamada a la acción y un gran fondo cinemático de tu taller u obra principal.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80',
      moduleKey: 'hero'
    },
    {
      id: 'lib-2',
      key: 'video_showcase',
      name: 'Teaser de Taller (Video Showcase)',
      category: 'Portada',
      description: 'Reproductor flotante para videos explicativos sobre desbaste, canteras de mármol o exposiciones con overlays de texto minimalistas.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=400&auto=format&fit=crop&q=80',
      moduleKey: 'taller'
    },
    {
      id: 'lib-3',
      key: 'gallery_section',
      name: 'Muestrario Geométrico (Gallery Section)',
      category: 'Galerías',
      description: 'Cuadrícula de obras interactivas con filtros automáticos por materiales y pátinas. Soporta lightbox.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&auto=format&fit=crop&q=80',
      moduleKey: 'galeria_obras'
    },
    {
      id: 'lib-4',
      key: 'press_gallery',
      name: 'Galería de Prensa (Press Gallery)',
      category: 'Galerías',
      description: 'Bloque elegante que combina un carrusel de logotipos de periódicos (grayscale) y tarjetas de artículos con enlaces externos.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&auto=format&fit=crop&q=80',
      moduleKey: 'prensa'
    },
    {
      id: 'lib-5',
      key: 'before_after',
      name: 'Bloque Escultórico Deslizante (Before/After)',
      category: 'Galerías',
      description: 'Slider comparador antes/después interactivo. Arrastra para ver el bloque de piedra en bruto frente a la figura esculpida final.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&auto=format&fit=crop&q=80',
      moduleKey: 'taller'
    },
    {
      id: 'lib-6',
      key: 'faq_accordion',
      name: 'Preguntas y Logística (FAQ Accordion)',
      category: 'Soporte',
      description: 'Respuestas colapsables con efecto suave de acordeón sobre cómo realizas los envíos de gran formato y seguros de arte.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1576016770956-debb63d900ee?w=400&auto=format&fit=crop&q=80',
      moduleKey: 'faq'
    },
    {
      id: 'lib-7',
      key: 'testimonial_slider',
      name: 'Voces de Coleccionistas (Testimonial Slider)',
      category: 'Soporte',
      description: 'Carrusel de testimonios interactivo de fundaciones, galeristas o coleccionistas que han adquirido tus esculturas.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&auto=format&fit=crop&q=80',
      moduleKey: 'testimonios'
    },
    {
      id: 'lib-8',
      key: 'timeline',
      name: 'Línea de Vida (Timeline)',
      category: 'Soporte',
      description: 'Cronología profesional elegante en formato vertical con fechas marcadas y hitos de exposiciones destacadas.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?w=400&auto=format&fit=crop&q=80',
      moduleKey: 'cronologia'
    },
    {
      id: 'lib-9',
      key: 'contact_form',
      name: 'Formulario de Comisiones (Contact Form)',
      category: 'Interacción',
      description: 'Un formulario limpio y sofisticado diseñado especialmente para coleccionistas privados que desean encargar comisiones.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=80',
      moduleKey: 'contacto'
    },
    {
      id: 'lib-10',
      key: 'stats_grid',
      name: 'Muro de Cifras (Stats Grid)',
      category: 'Interacción',
      description: 'Bloque numérico asimétrico para lucir tus cifras clave (obras en colecciones, años de trayectoria, m³ tallados).',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&auto=format&fit=crop&q=80',
      moduleKey: 'hero'
    }
  ];

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      try {
        const pageList = await mockApi.pages.list();
        setPages(pageList);
        if (pageList.length > 0) {
          setSelectedPageId(pageList[0]?.id || '');
        }
      } catch {
        toast.error('Error al recuperar páginas.');
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const handleOpenAdd = (item: LibraryItem) => {
    setSelectedSection(item);
    setIsAddOpen(true);
  };

  const handleAddSectionToPage = async () => {
    if (!selectedSection || !selectedPageId) return;

    const t = toast.loading('Escribiendo estructura visual en la página...');
    try {
      const page = pages.find(p => p.id === selectedPageId);
      if (page) {
        // Create new Section entry
        const newSecId = `sec-${selectedSection.key}-${Date.now()}`;
        const newSection: Section = {
          id: newSecId,
          type: selectedSection.key,
          category: selectedSection.category,
          label: selectedSection.name,
          moduleKey: selectedSection.moduleKey,
          active: true,
          order: page.sectionIds.length + 1,
          presetId: `${selectedSection.key}-split` // default preset
        };

        // Save section
        await mockApi.sections.save(newSection);

        // Update Page sectionIds
        const updatedPage = {
          ...page,
          sectionIds: [...page.sectionIds, newSecId]
        };
        
        await mockApi.pages.save(updatedPage);
        
        toast.dismiss(t);
        toast.success(`Sección "${selectedSection.name}" añadida con éxito a la página "${page.name}".`);
        setIsAddOpen(false);
        
        // Let user navigate to pages manager to see/sort it
        if (confirm(`La sección ha sido colocada abajo del todo en la página "${page.name}". ¿Deseas ir al organizador de páginas para verla o reordenarla?`)) {
          navigate('/pages');
        }
      }
    } catch {
      toast.dismiss(t);
      toast.error('Error al insertar la sección.');
    }
  };

  // Filtering
  const filteredLibrary = installedSections.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', 'Portada', 'Galerías', 'Soporte', 'Interacción'];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Catálogo de Secciones (Ya Instaladas)</h1>
          <p className="text-sm text-muted-foreground">
            Inspecciona la biblioteca visual de layouts y secciones cargadas en tu licencia y agrégalas a tus páginas.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/pages')} className="gap-1.5 h-8">
            <Compass size={14} />
            Organizar Páginas
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/marketplace')} className="gap-1.5 h-8 text-indigo-500 hover:text-indigo-600">
            <Sparkles size={14} />
            Marketplace (Obtener más)
          </Button>
        </div>
      </div>

      {/* FILTER BUTTONS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80 text-left">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar secciones instaladas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="h-8 text-xs font-bold capitalize"
            >
              {cat === 'all' ? 'Ver todas' : cat}
            </Button>
          ))}
        </div>
      </div>

      {/* REINFORCE CONCEPT NOTICE */}
      <Card className="bg-indigo-50/50 dark:bg-indigo-950/15 border-indigo-100 dark:border-indigo-900/50 p-4">
        <div className="flex gap-3 text-left">
          <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs text-indigo-900 dark:text-indigo-300">¿Qué diferencia hay con el Marketplace?</h4>
            <p className="text-xs text-indigo-950/70 dark:text-indigo-200/70 leading-relaxed">
              En este <strong>Catálogo de Secciones</strong> encuentras las capas visuales que <strong>ya posees</strong> y que puedes clonar, editar e incrustar en cualquiera de las pestañas de tu menú. Una sección es la representación estética y visual de un módulo de datos. En el <strong>Marketplace</strong> descargas componentes nuevos o compras themes listos para instalar.
            </p>
          </div>
        </div>
      </Card>

      {/* GRID DISPLAY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {filteredLibrary.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-all border-zinc-200 dark:border-zinc-800 bg-card overflow-hidden flex flex-col justify-between">
            {/* Visual thumbnail */}
            <div className="relative aspect-[16/10] bg-muted overflow-hidden">
              <img 
                src={item.thumbnailUrl} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute top-2.5 left-2.5">
                <Badge className="bg-background/90 text-foreground border font-bold text-[9px] px-1.5 py-0.5">
                  {item.category}
                </Badge>
              </div>
            </div>

            {/* Content description */}
            <CardContent className="p-4 space-y-2 grow flex flex-col justify-between">
              <div className="space-y-1.5">
                <h3 className="font-black text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Core module connection */}
              <div className="pt-3 border-t flex items-center justify-between text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                <span>Alimentado por:</span>
                <Badge variant="outline" className="text-[10px] font-mono capitalize">
                  {item.moduleKey}
                </Badge>
              </div>
            </CardContent>

            <CardFooter className="p-3 border-t bg-muted/20 flex items-center justify-between">
              <span className="text-[9px] text-muted-foreground font-mono">Tipo: {item.key}</span>
              <Button
                size="sm"
                onClick={() => handleOpenAdd(item)}
                className="h-8 text-xs font-bold gap-1 px-4.5"
              >
                <Plus size={12} />
                Agregar a página
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md text-left">
          <DialogHeader>
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <Compass size={18} className="text-primary" />
              Incrustar Sección
            </DialogTitle>
            <DialogDescription className="text-xs">
              Elige a qué página de tu portal deseas agregar la sección &quot;{selectedSection?.name}&quot;.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="text-center py-6">
              <RefreshCw className="animate-spin mx-auto h-5 w-5 text-primary" />
            </div>
          ) : (
            <div className="space-y-4 py-3">
              <div className="space-y-1.5">
                <Label htmlFor="targetPage" className="text-xs font-bold">Seleccionar Página Destino</Label>
                <Select value={selectedPageId} onValueChange={setSelectedPageId}>
                  <SelectTrigger className="h-10 text-xs">
                    <SelectValue placeholder="Selecciona la página" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground mt-1">
                  La sección se colocará por defecto al final de la página elegida. Podrás cambiar su orden arrastrándola en la sección Páginas.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(false)}
              className="h-9 text-xs"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleAddSectionToPage}
              disabled={!selectedPageId}
              className="h-9 text-xs font-extrabold gap-1"
            >
              <CheckCircle size={14} /> Incorporar Sección
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}