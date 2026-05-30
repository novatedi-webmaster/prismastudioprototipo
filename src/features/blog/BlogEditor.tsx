import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../../lib/mock-api';
import type { BlogPost } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  ChevronLeft, Save, Trash2, FileText, Image as ImageIcon, 
  UploadCloud, RefreshCw, X, CheckCircle, Eye, EyeOff, LayoutGrid 
} from 'lucide-react';
import { toast } from 'sonner';

export default function BlogEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [activePane, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Blog Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [date, setDate] = useState('');
  const [author, setAuthor] = useState('Antonio Carballo');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        if (isNew) {
          setTitle('Nueva Bitácora del Taller');
          setSlug('nueva-bitacora-taller');
          setExcerpt('');
          setBody(`# Nueva Bitácora del Taller\n\nComienza a redactar tu artículo aquí...\n\n## Subtítulo de ejemplo\nEscribe reflexiones sobre tus esculturas.`);
          setCoverUrl('https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80');
          setStatus('draft');
          setDate(new Date().toISOString().split('T')[0] || '');
          setAuthor('Antonio Carballo');
          setLoading(false);
          return;
        }

        const post = await mockApi.blog.get(id || '');
        if (post) {
          setTitle(post.title);
          setSlug(post.slug);
          setExcerpt(post.excerpt);
          setBody(post.body);
          setCoverUrl(post.coverUrl || '');
          setStatus(post.status);
          setDate(post.date);
          setAuthor(post.author);
        } else {
          toast.error('La entrada de blog no existe.');
          navigate('/blog');
        }
      } catch {
        toast.error('Error al recuperar detalles de la entrada.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, isNew]);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew || slug === '' || slug === 'nueva-bitacora-taller') {
      const generated = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .trim()
        .replace(/\s+/g, '-'); // Replace spaces with hyphens
      setSlug(generated);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      toast.error('Por favor escribe un título y un slug válido.');
      return;
    }

    setSaving(true);
    const t = toast.loading('Guardando entrada de blog...');

    const savedPost: BlogPost = {
      id: isNew ? `post-${Date.now()}` : id!,
      title,
      slug,
      excerpt,
      body,
      coverUrl,
      status,
      date,
      author
    };

    try {
      await mockApi.blog.save(savedPost);
      toast.dismiss(t);
      toast.success('Entrada guardada con éxito.');
      setSaving(false);
      navigate('/blog');
    } catch {
      toast.dismiss(t);
      toast.error('Fallo al guardar la entrada.');
      setSaving(false);
    }
  };

  // Simple Markdown to HTML compiler for previewing
  const renderMarkdown = (md: string) => {
    if (!md) return '';
    
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings
    html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-black mt-6 mb-4 text-foreground tracking-tight">$1</h1>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-extrabold mt-5 mb-3 text-foreground tracking-tight">$1</h2>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2 text-foreground">$1</h3>');

    // Blockquotes
    html = html.replace(/^>\s*\*\*(.+)\*\*\s*$/gm, '<blockquote class="border-l-4 border-primary pl-4 py-1 my-4 italic font-bold text-foreground">$1</blockquote>');
    html = html.replace(/^>\s*(.+)$/gm, '<blockquote class="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 py-1 my-4 italic text-muted-foreground">$1</blockquote>');

    // Bold & Italics
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Lists (unordered)
    html = html.replace(/^\-\s+(.+)$/gm, '<li class="list-disc ml-5 mb-1">$1</li>');
    // Lists (ordered)
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="list-decimal ml-5 mb-1">$1</li>');

    // Paragraphs (split by double newlines)
    const paragraphs = html.split(/\n\n+/);
    const parsedParagraphs = paragraphs.map(p => {
      // If paragraph contains HTML headings or lists, don't wrap in <p>
      if (p.trim().startsWith('<h') || p.trim().startsWith('<li') || p.trim().startsWith('<blockquote')) {
        return p;
      }
      return `<p class="mb-4 text-sm leading-relaxed text-muted-foreground">${p.replace(/\n/g, '<br />')}</p>`;
    });

    return parsedParagraphs.join('\n');
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground text-xs space-y-3">
        <RefreshCw className="animate-spin mx-auto h-8 w-8 text-primary" />
        <p>Iniciando editor de bitácoras...</p>
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
            onClick={() => navigate('/blog')}
            className="h-8 w-8 rounded-lg"
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="space-y-0.5 text-left">
            <h1 className="text-2xl font-black tracking-tight">{isNew ? 'Nueva Bitácora' : title}</h1>
            <p className="text-xs text-muted-foreground">Escribe en formato Markdown y previsualiza cómo se verá en tu portal.</p>
          </div>
        </div>

        {/* View toggle for mobile / responsive layouts */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant={activePane === 'editor' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('editor')}
            className="text-xs font-bold"
          >
            Redacción
          </Button>
          <Button
            variant={activePane === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('preview')}
            className="text-xs font-bold"
          >
            Previsualizar
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* DESKTOP SPLIT SCREEN (SIDE BY SIDE) OR MOBILE SELECTED PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          
          {/* LEFT PANE: WRITING FORM & CMS EDITOR */}
          <div className={`space-y-6 ${activePane === 'editor' ? 'block' : 'hidden lg:block'}`}>
            <Card className="bg-background border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Configuración de Publicación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="postTitle" className="text-xs font-bold">Título de la Entrada</Label>
                  <Input
                    id="postTitle"
                    placeholder="Ej. El diálogo silencioso con las canteras de Carrara"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    className="h-10 text-xs font-bold"
                  />
                </div>

                {/* Grid 2 Cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Slug */}
                  <div className="space-y-1.5">
                    <Label htmlFor="postSlug" className="text-xs font-bold">Ruta Amigable (Slug URL)</Label>
                    <Input
                      id="postSlug"
                      placeholder="ej-dialogo-silencioso-carrara"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                      className="h-10 text-xs font-mono"
                    />
                  </div>

                  {/* Status selection */}
                  <div className="space-y-1.5">
                    <Label htmlFor="postStatus" className="text-xs font-bold">Estado de Publicación</Label>
                    <Select value={status} onValueChange={(val) => setStatus(val as any)}>
                      <SelectTrigger className="h-10 text-xs">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Borrador (Oculto) 📝</SelectItem>
                        <SelectItem value="published">Publicado (Visible) 🚀</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Grid 2 Cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date */}
                  <div className="space-y-1.5">
                    <Label htmlFor="postDate" className="text-xs font-bold">Fecha de Entrada</Label>
                    <Input
                      id="postDate"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="h-10 text-xs"
                    />
                  </div>

                  {/* Author */}
                  <div className="space-y-1.5">
                    <Label htmlFor="postAuthor" className="text-xs font-bold">Autor</Label>
                    <Input
                      id="postAuthor"
                      placeholder="Antonio Carballo"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      required
                      className="h-10 text-xs"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <Label htmlFor="postExcerpt" className="text-xs font-bold">Extracto Resumen (Aparecerá en el feed de blog)</Label>
                  <Textarea
                    id="postExcerpt"
                    placeholder="Escribe un resumen corto que incite a los coleccionistas a leer el post completo..."
                    rows={3}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    required
                    className="text-xs leading-relaxed"
                  />
                </div>

                {/* Cover URL */}
                <div className="space-y-1.5">
                  <Label htmlFor="postCover" className="text-xs font-bold">URL de Imagen de Portada</Label>
                  <Input
                    id="postCover"
                    placeholder="https://images.unsplash.com/..."
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="h-10 text-xs font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Markdown writing editor */}
            <Card className="bg-background border-zinc-200 dark:border-zinc-800 flex flex-col">
              <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cuerpo del artículo (Soporta Markdown)</CardTitle>
                <kbd className="text-[10px] bg-muted px-2 py-0.5 rounded border text-muted-foreground font-mono">MD</kbd>
              </CardHeader>
              <CardContent className="p-0">
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="# Título Principal&#10;&#10;Escribe tu crónica..."
                  rows={20}
                  className="w-full p-4 text-xs font-mono bg-zinc-50/50 dark:bg-zinc-950/20 text-foreground resize-y focus:outline-none min-h-[350px] leading-relaxed"
                />
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANE: LIVE MARKDOWN HTML PREVIEW */}
          <div className={`space-y-6 ${activePane === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <Card className="bg-background border-zinc-200 dark:border-zinc-800 sticky top-6">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Eye size={14} className="text-primary" />
                  Previsualización en tiempo real
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 overflow-y-auto max-h-[85vh] prose dark:prose-invert max-w-none space-y-4">
                {/* Header preview of the post */}
                {coverUrl && (
                  <div className="aspect-[21/9] rounded-lg bg-muted overflow-hidden">
                    <img src={coverUrl} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="text-left border-b pb-4 mt-2">
                  <h1 className="text-2xl font-black text-foreground tracking-tight">{title || 'Sin Título'}</h1>
                  <div className="flex items-center gap-3.5 mt-2.5 text-xs text-muted-foreground font-mono">
                    <span>{date || 'Fecha'}</span>
                    <span>•</span>
                    <span>Autor: {author}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-[9px] font-bold capitalize px-1.5 py-0">
                      {status}
                    </Badge>
                  </div>
                  {excerpt && (
                    <p className="text-xs text-muted-foreground/80 italic mt-3 leading-relaxed border-l-2 pl-3">
                      {excerpt}
                    </p>
                  )}
                </div>

                {/* Body compiled markdown */}
                <div 
                  className="text-left py-2"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }} 
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* BOTTOM GLOBAL SAVE ACTIONS */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/blog')}
            disabled={saving}
            className="h-10 text-xs font-bold w-36"
          >
            Volver a la lista
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="h-10 text-xs font-extrabold w-48 shadow-md gap-2"
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={14} />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}