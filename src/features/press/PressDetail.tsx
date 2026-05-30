import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { mockApi } from '../../lib/mock-api';
import type { PressArticle } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, Save, Trash2, Newspaper, Image as ImageIcon, 
  UploadCloud, RefreshCw, X, CheckCircle 
} from 'lucide-react';
import { toast } from 'sonner';

export default function PressDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('new') === 'true';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Press Form State
  const [mediaName, setMediaName] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        if (isNew) {
          setMediaName('');
          setTitle('Nueva Reseña de Prensa');
          setDate(new Date().toISOString().split('T')[0] || '');
          setExternalUrl('');
          setExcerpt('');
          setImageUrl('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80');
          setLoading(false);
          return;
        }

        const article = await mockApi.press.getArticle(id || '');
        if (article) {
          setMediaName(article.mediaName);
          setTitle(article.title);
          setDate(article.date);
          setExternalUrl(article.externalUrl);
          setExcerpt(article.excerpt);
          setImageUrl(article.imageUrl || '');
        } else {
          toast.error('El artículo de prensa especificado no existe.');
          navigate('/press');
        }
      } catch {
        toast.error('Error al recuperar detalles de la reseña.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, isNew]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaName.trim() || !title.trim()) {
      toast.error('Por favor rellena el nombre del medio y el título de la reseña.');
      return;
    }

    setSaving(true);
    const t = toast.loading('Guardando artículo de prensa...');

    const savedArticle: PressArticle = {
      id: id || `pa-${Date.now()}`,
      mediaName,
      title,
      date,
      externalUrl,
      excerpt,
      imageUrl
    };

    try {
      await mockApi.press.saveArticle(savedArticle);
      toast.dismiss(t);
      toast.success('Reseña guardada con éxito en tu hemeroteca.');
      setSaving(false);
      navigate('/press');
    } catch {
      toast.dismiss(t);
      toast.error('Error al guardar artículo.');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar este artículo de prensa?')) {
      const t = toast.loading('Borrando registro de prensa...');
      try {
        await mockApi.press.deleteArticle(id || '');
        toast.dismiss(t);
        toast.success('El artículo de prensa ha sido retirado con éxito.');
        navigate('/press');
      } catch {
        toast.dismiss(t);
        toast.error('Fallo al eliminar artículo.');
      }
    }
  };

  // Mock upload selector
  const selectMockCover = () => {
    const urls = [
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80',
    ];
    const randomUrl = urls[Math.floor(Math.random() * urls.length)]!;
    setImageUrl(randomUrl);
    toast.success('Imagen de cabecera seleccionada.');
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground text-xs space-y-3">
        <RefreshCw className="animate-spin mx-auto h-8 w-8 text-primary" />
        <p>Cargando hemeroteca de prensa...</p>
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
            onClick={() => navigate('/press')}
            className="h-8 w-8 rounded-lg"
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="space-y-0.5 text-left">
            <h1 className="text-2xl font-black tracking-tight">{isNew ? 'Nueva Reseña' : mediaName}</h1>
            <p className="text-xs text-muted-foreground">Configura los metadatos, fecha de publicación, URL externa e imágenes.</p>
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
            Eliminar Artículo
          </Button>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-5 gap-6 text-left">
        {/* DETAILS FORM (3 COLS) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-background border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Newspaper size={16} className="text-primary" />
                Detalles del Artículo de Prensa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Media Name */}
              <div className="space-y-1.5">
                <Label htmlFor="media" className="text-xs font-bold">Nombre del Medio de Comunicación</Label>
                <Input
                  id="media"
                  placeholder="Ej. El País, Descubrir el Arte, Jot Down..."
                  value={mediaName}
                  onChange={(e) => setMediaName(e.target.value)}
                  required
                  className="h-10 text-xs"
                />
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-bold">Titular / Cabecera de la noticia</Label>
                <Input
                  id="title"
                  placeholder="Ej. Antonio Carballo esculpe el misticismo del vacío en Cercedilla"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-10 text-xs"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs font-bold">Fecha de Publicación</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="h-10 text-xs"
                />
              </div>

              {/* External URL */}
              <div className="space-y-1.5">
                <Label htmlFor="url" className="text-xs font-bold">Enlace Externo al Artículo (URL)</Label>
                <Input
                  id="url"
                  placeholder="Ej. https://elpais.com/cultura/..."
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="h-10 text-xs font-mono"
                />
                <p className="text-[9px] text-muted-foreground">Opcional. Permite a tus visitantes hacer clic para leer la noticia original en la web del medio.</p>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <Label htmlFor="excerpt" className="text-xs font-bold">Extracto / Resumen / Crítica destacada</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Escribe un párrafo sugerente de la reseña o una cita textual del crítico de arte..."
                  rows={5}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="text-xs leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* IMAGE PREVIEW (2 COLS) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-background border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Imagen de Cabecera</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview Box */}
              {imageUrl ? (
                <div className="aspect-[4/3] rounded-lg bg-zinc-100 dark:bg-zinc-900 border overflow-hidden relative">
                  <img
                    src={imageUrl}
                    alt="Article cover"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 bg-black/75 hover:bg-black text-white p-1 rounded-full shadow-sm z-10"
                    title="Quitar foto"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-lg bg-zinc-100 dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center p-6 text-center text-muted-foreground/60">
                  <ImageIcon size={32} className="mb-2 text-muted-foreground/45" />
                  <p className="text-xs font-bold text-foreground">Sin portada</p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">URL de la foto de cabecera</Label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Pegar URL de la imagen..."
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div
                onClick={selectMockCover}
                className="border border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/40 transition-colors"
              >
                <UploadCloud size={20} className="mx-auto text-muted-foreground/80 mb-1" />
                <p className="text-[10px] font-bold text-foreground">Seleccionar imagen de hemeroteca</p>
              </div>
            </CardContent>
          </Card>

          {/* ACTIONS */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/press')}
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
                  Guardar Artículo
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}