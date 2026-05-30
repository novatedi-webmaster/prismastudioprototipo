import { useState, useEffect } from 'react';
import { mockApi } from '../../lib/mock-api';
import type { Album, Work } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter, DialogTrigger 
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Plus, FolderHeart, Trash2, Edit, ChevronRight, 
  Folder, Image as ImageIcon, Save, RefreshCw, X 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AlbumsManager() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [albumName, setAlbumName] = useState('');
  const [albumCover, setAlbumCover] = useState('');
  const [selectedWorkIds, setSelectedWorkIds] = useState<string[]>([]);
  
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const albumList = await mockApi.albums.list();
      setAlbums(albumList);
      
      const workList = await mockApi.works.list();
      setWorks(workList);
    } catch {
      toast.error('Error al cargar la lista de álbumes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setAlbumName('');
    // Default cover to the first work image if available
    setAlbumCover(works[0]?.images[0] || 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&auto=format&fit=crop&q=80');
    setSelectedWorkIds([]);
    setIsOpen(true);
  };

  const handleOpenEdit = (album: Album) => {
    setEditingId(album.id);
    setAlbumName(album.name);
    setAlbumCover(album.coverUrl);
    setSelectedWorkIds(album.workIds || []);
    setIsOpen(true);
  };

  const handleToggleWorkSelection = (workId: string) => {
    setSelectedWorkIds(prev => 
      prev.includes(workId) 
        ? prev.filter(id => id !== workId) 
        : [...prev, workId]
    );
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumName.trim()) {
      toast.error('Por favor escribe un nombre para el álbum.');
      return;
    }

    setSaving(true);
    const id = editingId || `alb-${Date.now()}`;
    const newAlbum: Album = {
      id,
      name: albumName,
      coverUrl: albumCover,
      workIds: selectedWorkIds
    };

    try {
      await mockApi.albums.save(newAlbum);
      toast.success(editingId ? 'Colección actualizada con éxito.' : 'Nueva colección creada.');
      setIsOpen(false);
      loadData();
    } catch {
      toast.error('Error al guardar el álbum.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAlbum = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar la colección "${name}"? Las obras no serán eliminadas.`)) {
      try {
        await mockApi.albums.delete(id);
        toast.success(`Colección "${name}" eliminada.`);
        loadData();
      } catch {
        toast.error('Fallo al eliminar el álbum.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Álbumes y Colecciones</h1>
          <p className="text-sm text-muted-foreground">
            Agrupa tus esculturas en colecciones conceptuales independientes (ej. Retratos, Series en Bronce, Bocetos).
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 self-start md:self-auto shadow-md">
          <Plus size={16} />
          Crear Álbum
        </Button>
      </div>

      {/* BODY GRID */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground text-xs space-y-3">
          <RefreshCw className="animate-spin mx-auto h-8 w-8 text-primary" />
          <p>Cargando álbumes artísticos...</p>
        </div>
      ) : albums.length === 0 ? (
        <Card className="border-dashed border-2 py-16 text-center">
          <CardContent className="space-y-3">
            <Folder className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Sin colecciones todavía</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Organiza tus obras en catálogos específicos para que los compradores naveguen de forma estructurada.
            </p>
            <Button variant="outline" size="sm" onClick={handleOpenCreate} className="gap-1.5 mt-2">
              <Plus size={14} /> Crear primer álbum
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
          {albums.map((album) => (
            <Card key={album.id} className="group overflow-hidden border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all duration-300 relative flex flex-col justify-between">
              {/* Cover visual */}
              <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                <img 
                  src={album.coverUrl} 
                  alt={album.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors" />
                
                {/* Info badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-background/90 text-foreground border font-bold text-[10px] px-2 py-0.5 shadow-sm">
                    {album.workIds?.length || 0} esculturas
                  </Badge>
                </div>

                {/* Floating actions */}
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 rounded-md"
                    onClick={() => handleOpenEdit(album)}
                    title="Editar álbum"
                  >
                    <Edit size={12} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7 rounded-md"
                    onClick={() => handleDeleteAlbum(album.id, album.name)}
                    title="Eliminar álbum"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>

                {/* Album Name inside card cover */}
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <h3 className="font-extrabold text-base text-white tracking-tight drop-shadow-sm leading-snug">
                    {album.name}
                  </h3>
                </div>
              </div>

              {/* Works overview list inside card content */}
              <CardContent className="p-4 bg-background">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 leading-none">
                  Obras en este álbum:
                </p>
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {album.workIds && album.workIds.length > 0 ? (
                    works
                      .filter(w => album.workIds.includes(w.id))
                      .map(w => (
                        <div key={w.id} className="text-xs flex items-center justify-between text-muted-foreground border-b border-zinc-100 dark:border-zinc-900 pb-1 last:border-none">
                          <span className="truncate font-semibold text-foreground pr-2">{w.title}</span>
                          <span className="text-[9px] font-mono shrink-0 bg-muted px-1.5 rounded leading-normal">{w.category}</span>
                        </div>
                      ))
                  ) : (
                    <div className="text-[10px] text-muted-foreground/60 py-2 italic">
                      Ninguna obra asignada. Edita el álbum para incluir piezas.
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-3 border-t bg-muted/15 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">ID: {album.id}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleOpenEdit(album)} 
                  className="h-7 text-[10px] font-bold gap-1 text-primary"
                >
                  Configurar colección <ChevronRight size={10} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* EDIT/CREATE DIALOG */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl text-left max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-5 border-b bg-muted/30">
            <DialogTitle className="text-lg font-black flex items-center gap-2">
              <FolderHeart className="text-primary h-5 w-5" />
              {editingId ? 'Editar Álbum' : 'Crear Nuevo Álbum'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configura el título de la colección, foto de portada y las esculturas que lo integrarán.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAlbum} className="flex flex-col grow overflow-hidden">
            <div className="p-5 overflow-y-auto space-y-5 grow">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="albumName" className="text-xs font-bold">Nombre del Álbum / Colección</Label>
                <Input
                  id="albumName"
                  placeholder="Ej. Obras Monumentales de la Sierra"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  required
                  className="h-10 text-xs"
                />
              </div>

              {/* Cover Image Selector (Simple Selection from Works Images or prompt) */}
              <div className="space-y-2">
                <Label className="text-xs font-bold">Seleccionar Portada del Álbum</Label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Selected cover preview */}
                  <div className="border rounded-lg aspect-[16/10] bg-muted overflow-hidden relative">
                    <img src={albumCover} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-black/85 text-white border-none font-bold text-[9px]">Portada Activa</Badge>
                    </div>
                  </div>
                  {/* Info helper */}
                  <div className="space-y-2 text-xs text-muted-foreground flex flex-col justify-center">
                    <p className="leading-relaxed">
                      Elige una foto estética que represente la colección. Puedes pegar cualquier URL pública o seleccionar una de las imágenes disponibles de tus obras.
                    </p>
                    <Input
                      placeholder="Pegar URL de portada..."
                      value={albumCover}
                      onChange={(e) => setAlbumCover(e.target.value)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Cover quick-pick from works images */}
                {works.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Imágenes recomendadas del portfolio:</span>
                    <div className="flex gap-2 overflow-x-auto py-1.5 max-w-full">
                      {works.flatMap(w => w.images).slice(0, 10).map((imgUrl, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setAlbumCover(imgUrl)}
                          className={`w-14 h-10 rounded border bg-muted overflow-hidden shrink-0 cursor-pointer transition-all ${
                            albumCover === imgUrl ? 'ring-2 ring-primary ring-offset-1 border-transparent' : 'hover:scale-95'
                          }`}
                        >
                          <img src={imgUrl} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Checklist selector of Works */}
              <div className="space-y-2.5">
                <Label className="text-xs font-bold">Asignar Obras a esta Colección</Label>
                <div className="border rounded-lg bg-muted/15 p-3.5 max-h-48 overflow-y-auto space-y-2 border-zinc-200 dark:border-zinc-800">
                  {works.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-4">No hay esculturas creadas aún para asignar.</p>
                  ) : (
                    works.map((work) => {
                      const isChecked = selectedWorkIds.includes(work.id);
                      return (
                        <div 
                          key={work.id} 
                          onClick={() => handleToggleWorkSelection(work.id)}
                          className={`p-2 hover:bg-muted/70 rounded-lg flex items-center justify-between cursor-pointer transition-colors border ${
                            isChecked ? 'border-primary/20 bg-primary/5' : 'border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox 
                              checked={isChecked}
                              onCheckedChange={() => handleToggleWorkSelection(work.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="w-8 h-7 rounded bg-muted overflow-hidden">
                              {work.images && work.images[0] && (
                                <img src={work.images[0]} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold leading-tight">{work.title}</p>
                              <p className="text-[9px] text-muted-foreground leading-none mt-0.5">{work.materials}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[9px] font-bold">
                            {work.category}
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="p-4 border-t bg-muted/30 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={saving}
                className="h-9 text-xs"
              >
                Cerrar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="h-9 text-xs font-extrabold gap-1.5 shadow-sm px-5"
              >
                {saving ? (
                  <>
                    <RefreshCw className="animate-spin h-3.5 w-3.5" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Guardar Colección
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}