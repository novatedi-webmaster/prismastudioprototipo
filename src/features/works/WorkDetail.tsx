import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { mockApi } from '../../lib/mock-api';
import type { Work, Asset } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, Save, Trash2, Image as ImageIcon, Heart, 
  UploadCloud, Play, CheckCircle, RefreshCw, X, Sparkles, HelpCircle 
} from 'lucide-react';
import { toast } from 'sonner';

export default function WorkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('new') === 'true';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Bronce', 'Mármol', 'Madera', 'Esculturas de Piedra', 'Modelados', 'Metales']);

  // Work Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Bronce');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [materials, setMaterials] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [description, setDescription] = useState('');
  const [priceInput, setPriceInput] = useState('0.00'); // For display
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [mainImageIdx, setMainImageIdx] = useState(0);

  // Drag and drop mock state
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchWork = async () => {
      setLoading(true);
      try {
        // Load categories from categories endpoint if possible
        try {
          const cats = await mockApi.categories.list();
          if (cats.length > 0) {
            setCategories(cats.map(c => c.name));
          }
        } catch {
          // Fallback to static
        }

        if (isNew) {
          setTitle('Nueva Escultura');
          setCategory(categories[0] || 'Bronce');
          setYear(new Date().getFullYear());
          setMaterials('');
          setDimensions('');
          setDescription('');
          setPriceInput('0.00');
          setFeatured(false);
          setImages([]);
          setLoading(false);
          return;
        }

        const work = await mockApi.works.get(id || '');
        if (work) {
          setTitle(work.title);
          setCategory(work.category);
          setYear(work.year);
          setMaterials(work.materials);
          setDimensions(work.dimensions);
          setDescription(work.description || '');
          setPriceInput((work.priceCents / 100).toFixed(2));
          setFeatured(work.featured);
          setImages(work.images || []);
        } else {
          toast.error('La obra especificada no existe.');
          navigate('/works');
        }
      } catch {
        toast.error('Error al recuperar detalles de la obra.');
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [id, isNew]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const t = toast.loading('Guardando los datos de la escultura...');

    const priceCents = Math.round(parseFloat(priceInput || '0') * 100);

    // Reorganize images array so the selected main image is first
    let finalImages = [...images];
    if (finalImages.length > 0 && mainImageIdx !== 0 && mainImageIdx < finalImages.length) {
      const selected = finalImages[mainImageIdx]!;
      finalImages.splice(mainImageIdx, 1);
      finalImages = [selected, ...finalImages];
    }

    const savedWork: Work = {
      id: id || `work-${Date.now()}`,
      title,
      category,
      year: Number(year),
      materials,
      dimensions,
      priceCents,
      images: finalImages,
      featured,
      description
    };

    try {
      await mockApi.works.save(savedWork);
      toast.dismiss(t);
      toast.success('Escultura guardada en el catálogo con éxito.');
      setSaving(false);
      navigate('/works');
    } catch {
      toast.dismiss(t);
      toast.error('Fallo al guardar la obra.');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Deseas eliminar esta obra por completo del catálogo público de Antonio Carballo?')) {
      const t = toast.loading('Eliminando obra de la base de datos...');
      try {
        await mockApi.works.delete(id || '');
        toast.dismiss(t);
        toast.success('La obra ha sido retirada con éxito.');
        navigate('/works');
      } catch {
        toast.dismiss(t);
        toast.error('Fallo al eliminar la obra.');
      }
    }
  };

  // Mock Upload Handler (Adds high-quality unsplash art images as mock files)
  const simulateUpload = () => {
    const mockArtUrls = [
      'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&auto=format&fit=crop&q=80',
    ];
    
    // Pick an image that is not currently in the images list
    const available = mockArtUrls.filter(u => !images.includes(url => url === u));
    const randomUrl = available.length > 0 
      ? available[Math.floor(Math.random() * available.length)]! 
      : mockArtUrls[Math.floor(Math.random() * mockArtUrls.length)]!;
    
    const t = toast.loading('Cargando imagen a la biblioteca multimedia...');
    setTimeout(() => {
      setImages(prev => [...prev, randomUrl]);
      toast.dismiss(t);
      toast.success('Imagen agregada con éxito al catálogo de la obra.');
    }, 1200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
    if (mainImageIdx === index) {
      setMainImageIdx(0);
    } else if (mainImageIdx > index) {
      setMainImageIdx(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground text-xs space-y-3">
        <RefreshCw className="animate-spin mx-auto h-8 w-8 text-primary" />
        <p>Cargando detalles de la obra...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/works')}
            className="h-8 w-8 rounded-lg"
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="space-y-0.5 text-left">
            <h1 className="text-2xl font-black tracking-tight">{isNew ? 'Nueva Obra' : title}</h1>
            <p className="text-xs text-muted-foreground">Ficha técnica detallada, precios e imágenes en alta resolución.</p>
          </div>
        </div>

        {!isNew && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/25 h-8 gap-1"
          >
            <Trash2 size={14} />
            Eliminar Obra
          </Button>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-5 gap-6 text-left">
        {/* TECHNICAL DETAILS FORM (3 COLS) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-background border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                Ficha Técnica de la Escultura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-bold">Título de la Obra</Label>
                <Input
                  id="title"
                  placeholder="Ej. Maternidad Cósmica III"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-10 text-xs"
                />
              </div>

              {/* Grid 2 Cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Selection */}
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-xs font-bold">Categoría / Familia</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-10 text-xs">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year */}
                <div className="space-y-1.5">
                  <Label htmlFor="year" className="text-xs font-bold">Año de Creación</Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    required
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              {/* Materials */}
              <div className="space-y-1.5">
                <Label htmlFor="materials" className="text-xs font-bold">Materiales / Pátinas / Acabados</Label>
                <Input
                  id="materials"
                  placeholder="Ej. Mármol de Carrara tallado a mano y pulido fino con base de granito."
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  required
                  className="h-10 text-xs"
                />
              </div>

              {/* Dimensions */}
              <div className="space-y-1.5">
                <Label htmlFor="dimensions" className="text-xs font-bold">Dimensiones (Alto x Ancho x Fondo)</Label>
                <Input
                  id="dimensions"
                  placeholder="Ej. 120 x 55 x 40 cm"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  required
                  className="h-10 text-xs font-mono"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-bold">Reseña Poética o Contexto Artístico</Label>
                <Textarea
                  id="description"
                  placeholder="Describe la poética, el proceso de fundición, su peso o el diálogo con el espacio..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-xs leading-relaxed"
                />
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs font-bold">Precio de Venta al Coleccionista (€)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-extrabold">€</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="pl-7 h-10 text-xs font-extrabold"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <HelpCircle size={11} />
                  Fija en 0 para mostrar como &quot;Consultar disponibilidad&quot;. El precio no se publicará si la opción de mostrar precios en el catálogo está desactivada.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GALLERY & SETTINGS (2 COLS) */}
        <div className="lg:col-span-2 space-y-6">
          {/* DESTACADA TOGGLE */}
          <Card className="bg-background border-zinc-200 dark:border-zinc-800">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-bold">Obra Destacada ⭐</Label>
                <p className="text-[10px] text-muted-foreground">Destacar en la portada principal del sitio web.</p>
              </div>
              <Switch
                checked={featured}
                onCheckedChange={setFeatured}
              />
            </CardContent>
          </Card>

          {/* GALERÍA DE IMÁGENES */}
          <Card className="bg-background border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold">Galería de Imágenes</CardTitle>
              <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px] py-0 px-2 font-bold h-5">
                {images.length} fotos
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Preview Box */}
              {images.length > 0 ? (
                <div className="aspect-[4/3] rounded-lg bg-zinc-100 dark:bg-zinc-900 border overflow-hidden relative">
                  <img
                    src={images[mainImageIdx] || images[0]}
                    alt="Main visual"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-background/90 text-foreground backdrop-blur font-bold text-[9px] px-1.5 py-0.5">
                      Foto de Portada de la Obra
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-lg bg-zinc-100 dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center p-6 text-center text-muted-foreground/60">
                  <ImageIcon size={32} className="mb-2 text-muted-foreground/45" />
                  <p className="text-xs font-bold text-foreground">Sin imágenes</p>
                  <p className="text-[10px] mt-1 max-w-[180px] leading-relaxed">
                    Sube al menos una imagen de gran resolución para mostrar la escultura.
                  </p>
                </div>
              )}

              {/* Thumbnails grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2.5">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setMainImageIdx(idx)}
                      className={`relative aspect-square rounded-md bg-muted border overflow-hidden cursor-pointer transition-all ${
                        mainImageIdx === idx 
                          ? 'ring-2 ring-primary ring-offset-2 scale-95 border-transparent' 
                          : 'hover:scale-95 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      
                      {/* Delete thumb action */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(idx);
                        }}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-0.5 rounded-full shadow-sm z-10 transition-colors"
                        title="Eliminar foto"
                      >
                        <X size={10} />
                      </button>

                      {idx === 0 && (
                        <div className="absolute bottom-0 inset-x-0 bg-primary/85 text-white text-[8px] py-0.5 font-bold text-center">
                          Portada
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Drag and drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={simulateUpload}
                className={`border-2 border-dashed rounded-lg p-5 text-center transition-all cursor-pointer ${
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-muted/40 hover:bg-muted/70'
                }`}
              >
                <div className="space-y-1">
                  <UploadCloud size={24} className="mx-auto text-muted-foreground/80 mb-1" />
                  <p className="text-[11px] font-bold text-foreground">Arrastra tus fotos aquí o haz clic</p>
                  <p className="text-[9px] text-muted-foreground">Soporta PNG, JPG y WEBP hasta 10MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SAVE / ACTIONS */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/works')}
              disabled={saving}
              className="h-10 text-xs font-bold w-1/3"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="h-10 text-xs font-extrabold w-2/3 shadow-md gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Guardar Ficha
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}