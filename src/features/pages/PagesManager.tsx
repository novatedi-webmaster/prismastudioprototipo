import { useState, useEffect } from 'react';
import { useModules } from '../../lib/contexts/ModuleContext';
import type { Page, Section } from '../../lib/types';
import { mockApi } from '../../lib/mock-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { 
  FolderTree, Plus, ArrowUp, ArrowDown, Trash2, Edit2, 
  ArrowLeft, Search, Eye, EyeOff, LayoutGrid, CheckCircle 
} from 'lucide-react';
import { toast } from 'sonner';

export default function PagesManager() {
  const { pages, sections, reorderPages, reorderSections, savePage, saveSection, deleteSection } = useModules();
  
  // States
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [sectionSearch, setSectionSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('Todos');

  // Catálogo completo de secciones disponibles en PrismaEditor para añadir
  const sectionCatalog = [
    { type: 'hero', category: 'Portada', label: 'Portada de Inicio (Hero)', moduleKey: 'hero', desc: 'Banner de portada grande con CTA y foto de fondo' },
    { type: 'about', category: 'Biografía', label: 'Sobre Mí / Biografía', moduleKey: 'biografia', desc: 'Resumen de trayectoria y foto retrato' },
    { type: 'gallery', category: 'Obras', label: 'Catálogo de Esculturas', moduleKey: 'galeria_obras', desc: 'Grilla interactiva para el portfolio' },
    { type: 'exhibitions', category: 'Eventos', label: 'Exposiciones y Eventos', moduleKey: 'exposiciones', desc: 'Fechas y ubicaciones de galerías' },
    { type: 'timeline', category: 'Biografía', label: 'Cronología Profesional', moduleKey: 'cronologia', desc: 'Línea de tiempo vertical de hitos' },
    { type: 'studio', category: 'Proceso', label: 'Taller / Proceso Creativo', moduleKey: 'taller', desc: 'Descripción del estudio y herramientas' },
    { type: 'contact', category: 'Contacto', label: 'Formulario de Contacto', moduleKey: 'contacto', desc: 'Formulario seguro para coleccionistas' },
    { type: 'press', category: 'Prensa', label: 'Prensa y Publicaciones', moduleKey: 'prensa', desc: 'Menciones críticas en medios de comunicación' },
    { type: 'testimonials', category: 'Prensa', label: 'Testimonios de Compradores', moduleKey: 'testimonios', desc: 'Citas de coleccionistas privados' },
    { type: 'hours', category: 'Contacto', label: 'Horarios de Visitas', moduleKey: 'horarios', desc: 'Detalle de apertura y citas previas' },
    { type: 'faq', category: 'Soporte', label: 'Preguntas Frecuentes', moduleKey: 'faq', desc: 'Preguntas habituales sobre transporte y compras' },
    { type: 'comissions', category: 'Servicios', label: 'Comisiones de Arte', moduleKey: 'comisiones', desc: 'Apartado informativo sobre encargos' }
  ];

  // ========================================================
  // CORE FUNCTIONS - PAGES
  // ========================================================
  const handleMovePage = async (index: number, direction: 'up' | 'down') => {
    const updated = [...pages];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < updated.length) {
      const temp = updated[index]!;
      updated[index] = updated[targetIdx]!;
      updated[targetIdx] = temp;
      // Re-map orders
      const reordered = updated.map((p, i) => ({ ...p, order: i + 1 }));
      await reorderPages(reordered);
      toast.success('Páginas reordenadas correctamente.');
    }
  };

  const handleTogglePageVisibility = async (page: Page) => {
    const updated = { ...page, visible: !page.visible };
    await savePage(updated);
    toast.success(`Página "${page.name}" ahora es ${updated.visible ? 'visible' : 'oculta'}.`);
  };

  // ========================================================
  // CORE FUNCTIONS - SECTIONS
  // ========================================================
  const getPageSections = () => {
    if (!selectedPage) return [];
    // Filter out sections belonging to this page
    return sections
      .filter(s => selectedPage.sectionIds.includes(s.id))
      .sort((a, b) => {
        const idxA = selectedPage.sectionIds.indexOf(a.id);
        const idxB = selectedPage.sectionIds.indexOf(b.id);
        return idxA - idxB;
      });
  };

  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    if (!selectedPage) return;
    const pageSecIds = [...selectedPage.sectionIds];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < pageSecIds.length) {
      const temp = pageSecIds[index]!;
      pageSecIds[index] = pageSecIds[targetIdx]!;
      pageSecIds[targetIdx] = temp;

      const updatedPage = { ...selectedPage, sectionIds: pageSecIds };
      setSelectedPage(updatedPage);
      await savePage(updatedPage);
      toast.success('Orden de sección modificado.');
    }
  };

  const handleToggleSectionActive = async (sec: Section) => {
    const updated = { ...sec, active: !sec.active };
    await saveSection(updated);
    toast.success(`Sección "${sec.label}" ${updated.active ? 'activada' : 'desactivada'}.`);
  };

  const handleDeleteSectionFromPage = async (secId: string) => {
    if (!selectedPage) return;
    const updatedPage = {
      ...selectedPage,
      sectionIds: selectedPage.sectionIds.filter(id => id !== secId)
    };
    setSelectedPage(updatedPage);
    await savePage(updatedPage);
    await deleteSection(secId);
    toast.error('Sección desvinculada y eliminada de la página.');
  };

  const handleAddSectionToPage = async (catalogItem: typeof sectionCatalog[number]) => {
    if (!selectedPage) return;

    const newSecId = `sec-gen-${Date.now()}`;
    const newSection: Section = {
      id: newSecId,
      type: catalogItem.type,
      category: catalogItem.category,
      label: catalogItem.label,
      moduleKey: catalogItem.moduleKey,
      active: true,
      order: selectedPage.sectionIds.length + 1,
      presetId: `${catalogItem.type}-default`
    };

    const updatedPage = {
      ...selectedPage,
      sectionIds: [...selectedPage.sectionIds, newSecId]
    };

    await saveSection(newSection);
    await savePage(updatedPage);
    setSelectedPage(updatedPage);
    setIsAddSectionOpen(false);
    toast.success(`Sección "${catalogItem.label}" añadida a la página.`);
  };

  // Filter catalog
  const filteredCatalog = sectionCatalog.filter(item => {
    const matchesSearch = item.label.toLowerCase().includes(sectionSearch.toLowerCase()) || 
                          item.desc.toLowerCase().includes(sectionSearch.toLowerCase());
    const matchesCategory = sectionFilter === 'Todos' || item.category === sectionFilter;
    
    // HIDE already added sections
    const alreadyAdded = selectedPage ? pageSectionsExist(item.type) : false;

    return matchesSearch && matchesCategory && !alreadyAdded;
  });

  function pageSectionsExist(type: string): boolean {
    if (!selectedPage) return false;
    const currentSecs = getPageSections();
    return currentSecs.some(s => s.type === type);
  }

  const catalogCategories = ['Todos', 'Portada', 'Biografía', 'Obras', 'Eventos', 'Proceso', 'Contacto', 'Prensa', 'Servicios', 'Soporte'];

  return (
    <div className="space-y-6">
      {!selectedPage ? (
        // ========================================================
        // 1. INDEX OF PAGES VIEW
        // ========================================================
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight">Estructura de páginas</h1>
              <p className="text-sm text-muted-foreground">Define las pestañas de navegación y organiza las secciones de tu sitio web.</p>
            </div>
          </div>

          <div className="space-y-4">
            {pages.map((page, index) => (
              <Card key={page.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* MOVE ARROWS */}
                    <div className="flex flex-col gap-1">
                      <button 
                        disabled={index === 0}
                        onClick={() => handleMovePage(index, 'up')}
                        className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-30"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button 
                        disabled={index === pages.length - 1}
                        onClick={() => handleMovePage(index, 'down')}
                        className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-30"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <div className="text-left space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm tracking-tight">{page.name}</span>
                        <Badge variant="outline" className="text-[10px] font-medium font-mono">/{page.type}</Badge>
                        {!page.visible && (
                          <Badge variant="secondary" className="text-[10px] text-muted-foreground gap-1">
                            <EyeOff size={10} /> Oculta
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Contiene <span className="font-semibold text-foreground">{page.sectionIds.length} secciones</span> de contenido activo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 mr-4">
                      <Label htmlFor={`visible-${page.id}`} className="text-xs font-semibold cursor-pointer">
                        {page.visible ? 'Visible en menú' : 'Oculta'}
                      </Label>
                      <Switch 
                        id={`visible-${page.id}`}
                        checked={page.visible}
                        onCheckedChange={() => handleTogglePageVisibility(page)}
                      />
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setSelectedPage(page)}
                      className="gap-1.5"
                    >
                      <Edit2 size={14} />
                      Editar secciones
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        // ========================================================
        // 2. DETAILED PAGE SECTIONS EDITOR
        // ========================================================
        <>
          <div className="flex items-center gap-3 border-b pb-5">
            <Button variant="ghost" size="icon" onClick={() => setSelectedPage(null)}>
              <ArrowLeft size={18} />
            </Button>
            <div className="text-left space-y-0.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Editar Composición</span>
              <h1 className="text-2xl font-black flex items-center gap-2">
                Página: {selectedPage.name}
                <Badge variant="outline" className="font-mono text-xs">/{selectedPage.type}</Badge>
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SECTIONS LIST - 2/3 */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5 text-left">
                  <h3 className="text-lg font-bold">Orden de las secciones</h3>
                  <p className="text-xs text-muted-foreground">Las secciones se pintan de arriba a abajo en la pantalla.</p>
                </div>
                <Button size="sm" onClick={() => setIsAddSectionOpen(true)} className="gap-1.5 font-semibold">
                  <Plus size={16} />
                  Añadir Sección
                </Button>
              </div>

              <div className="space-y-3">
                {getPageSections().map((sec, index) => (
                  <Card key={sec.id} className={`border ${!sec.active ? 'opacity-55 bg-zinc-50/50' : ''}`}>
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* MOVE ACTIONS */}
                        <div className="flex flex-col gap-1">
                          <button 
                            disabled={index === 0}
                            onClick={() => handleMoveSection(index, 'up')}
                            className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-30"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button 
                            disabled={index === selectedPage.sectionIds.length - 1}
                            onClick={() => handleMoveSection(index, 'down')}
                            className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-30"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>

                        <div className="text-left space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm tracking-tight">{sec.label}</span>
                            <Badge variant="secondary" className="text-[10px] text-muted-foreground">{sec.category}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Vinculada al módulo de contenido: <code className="font-mono font-bold text-primary">{sec.moduleKey}</code>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`sec-active-${sec.id}`} className="text-xs">
                            {sec.active ? 'Activa' : 'Desactivada'}
                          </Label>
                          <Switch 
                            id={`sec-active-${sec.id}`}
                            checked={sec.active}
                            onCheckedChange={() => handleToggleSectionActive(sec)}
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          onClick={() => handleDeleteSectionFromPage(sec.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* SIDE INFO BOX - 1/3 */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-1.5">
                    <FolderTree size={16} /> Módulos asociados
                  </CardTitle>
                  <CardDescription>Cada sección lee los datos desde un contrato de slots (módulo)</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-left space-y-3 leading-relaxed">
                  <p>Al reordenar las secciones aquí, estás cambiando cómo se distribuye la información visualmente.</p>
                  <p className="text-muted-foreground">Si deseas cambiar los textos o fotos que aparecen dentro de estas secciones, debes dirigirte al menú de <span className="font-semibold text-primary">Contenido web</span> y editar el módulo asociado.</p>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full text-xs font-semibold" onClick={() => setSelectedPage(null)}>
                    Volver a la vista general
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* DIALOG: ADD SECTION TO PAGE */}
      <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Catálogo de Secciones de PrismaEditor</DialogTitle>
            <DialogDescription>
              Selecciona una forma de pintar tus datos en la página de {selectedPage?.name}. Las que ya tienes añadidas están ocultas.
            </DialogDescription>
          </DialogHeader>

          {/* FILTERS & SEARCH */}
          <div className="space-y-3 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar sección por nombre o descripción..." 
                className="pl-10"
                value={sectionSearch}
                onChange={(e) => setSectionSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {catalogCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSectionFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    sectionFilter === cat 
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* LIST */}
          <div className="space-y-3 pt-2">
            {filteredCatalog.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-xs">
                No hay secciones disponibles que coincidan con la búsqueda o que no estén ya en la página.
              </div>
            ) : (
              filteredCatalog.map(item => (
                <div 
                  key={item.type}
                  onClick={() => handleAddSectionToPage(item)}
                  className="p-4 border rounded-xl hover:border-primary bg-zinc-50/50 dark:bg-zinc-900/10 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between gap-4"
                >
                  <div className="text-left space-y-1 shrink grow">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{item.label}</span>
                      <Badge variant="secondary" className="text-[9px]">{item.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">slots vinculados: <span className="font-bold text-primary">{item.moduleKey}</span></p>
                  </div>
                  <Button size="sm" variant="secondary" className="shrink-0 gap-1 font-semibold text-xs">
                    <Plus size={12} /> Añadir
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
