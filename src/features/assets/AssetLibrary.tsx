import { useState, useEffect } from 'react';
import { mockApi } from '../../lib/mock-api';
import type { Asset } from '../../lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { 
  Image as ImageIcon, Upload, Search, Link as LinkIcon, 
  Trash2, Edit2, Check, Filter, CheckCircle 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AssetLibrary() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isUploadOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null);

  // Form states for upload
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Esculturas');

  // Form states for edit
  const [editName, setEditName] = useState('');
  const [editCat, setEditCat] = useState('');

  // Loaded assets
  const loadAssets = async () => {
    const list = await mockApi.assets.list();
    setAssets(list);
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newName) {
      toast.error('Por favor, rellena la URL y el nombre de archivo.');
      return;
    }
    const t = toast.loading('Procesando archivo estático y optimizando peso...');
    try {
      await mockApi.assets.upload({
        url: newUrl,
        name: newName,
        category: newCat,
        sizeBytes: Math.floor(1000000 + Math.random() * 2000000)
      });
      toast.dismiss(t);
      toast.success('Archivo subido e indexado en la biblioteca soberana.');
      setIsAddOpen(false);
      setNewUrl('');
      setNewName('');
      loadAssets();
    } catch {
      toast.dismiss(t);
      toast.error('Fallo al indexar el archivo.');
    }
  };

  const handleOpenEdit = (asset: Asset) => {
    setActiveAsset(asset);
    setEditName(asset.name);
    setEditCat(asset.category);
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAsset || !editName) return;
    const t = toast.loading('Actualizando metadatos estáticos...');
    try {
      await mockApi.assets.update(activeAsset.id, editName, editCat);
      toast.dismiss(t);
      toast.success('Metadatos del archivo estático actualizados.');
      setIsEditOpen(false);
      loadAssets();
    } catch {
      toast.dismiss(t);
      toast.error('Fallo al actualizar.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar de forma permanente este recurso? Se desvinculará de donde esté en uso.')) {
      await mockApi.assets.delete(id);
      toast.error('Archivo eliminado de la biblioteca soberana.');
      loadAssets();
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('¡Enlace copiado al portapapeles!');
  };

  // Get distinct categories
  const categories = ['Todos', ...Array.from(new Set(assets.map(a => a.category)))];

  // Filter list
  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Biblioteca de medios</h1>
          <p className="text-sm text-muted-foreground">Sube y gestiona las fotografías, bocetos y documentos para tus módulos de contenido.</p>
        </div>
        <Button size="sm" onClick={() => setIsAddOpen(true)} className="gap-1.5 font-semibold shrink-0">
          <Upload size={16} />
          Subir Recurso
        </Button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre..." 
            className="pl-10 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === cat 
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                  : 'hover:bg-muted text-muted-foreground bg-background'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-xl bg-zinc-50/50 dark:bg-zinc-900/10">
          <ImageIcon size={48} className="mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">No se encontraron archivos</p>
          <p className="text-xs text-muted-foreground/80 mt-1">Prueba a buscar otro término o sube un recurso nuevo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map(asset => (
            <Card key={asset.id} className="group overflow-hidden border hover:shadow-md transition-all flex flex-col justify-between">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img 
                  src={asset.url} 
                  alt={asset.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                
                {/* FLOATING ACTION OVERLAY */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    onClick={() => handleCopyLink(asset.url)}
                    className="w-8 h-8 rounded-full"
                    title="Copiar URL directa"
                  >
                    <LinkIcon size={12} />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    onClick={() => handleOpenEdit(asset)}
                    className="w-8 h-8 rounded-full"
                    title="Editar metadatos"
                  >
                    <Edit2 size={12} />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    onClick={() => handleDelete(asset.id)}
                    className="w-8 h-8 rounded-full"
                    title="Eliminar recurso"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3 text-left space-y-0.5 border-t">
                <p className="text-xs font-bold truncate" title={asset.name}>{asset.name}</p>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                  <span>{asset.category}</span>
                  <span>{(asset.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* DIALOG: UPLOAD RESOURCE */}
      <Dialog open={isUploadOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Indexar Recurso en la Biblioteca</DialogTitle>
            <DialogDescription>Indexa imágenes de Unsplash o cualquier enlace CDN estático de forma segura.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpload} className="space-y-4 pt-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="url">Enlace / URL de la imagen</Label>
              <Input 
                id="url"
                placeholder="https://images.unsplash.com/photo-..." 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre de archivo</Label>
              <Input 
                id="name"
                placeholder="Maternidad_marmol_angulo.jpg" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Categoría</Label>
              <Input 
                id="category"
                placeholder="Esculturas" 
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                required
                className="text-xs"
                list="cats-list"
              />
              <datalist id="cats-list">
                <option value="Esculturas" />
                <option value="Materiales" />
                <option value="Taller" />
                <option value="Bocetos" />
              </datalist>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
              <Button type="submit">Indexar Recurso</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: EDIT METADATA */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Metadatos de Medio</DialogTitle>
            <DialogDescription>Edita la categorización y el nombre amigable de archivo.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4 pt-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Nombre de archivo</Label>
              <Input 
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-category">Categoría</Label>
              <Input 
                id="edit-category"
                value={editCat}
                onChange={(e) => setEditCat(e.target.value)}
                required
                className="text-xs"
                list="cats-list"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
              <Button type="submit">Actualizar Metadatos</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
