import { useState } from 'react';
import { 
  Globe, Search, Share2, FileText, CheckCircle, RefreshCw, 
  Settings, Save, Eye, AlertCircle, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface PageSeo {
  pageName: string;
  url: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

const initialPagesSeo: Record<string, PageSeo> = {
  inicio: {
    pageName: 'Inicio / Home',
    url: '',
    title: 'Antonio Carballo | Escultor Contemporáneo',
    description: 'Portal oficial de Antonio Carballo, escultor especializado en talla directa en mármol de Carrara, bronce a la cera perdida y maderas nobles centenarias. Obra original, exposiciones y encargos privados.',
    keywords: 'escultor, mármol de carrara, bronce, antonio carballo, escultura contemporanea, bellas artes',
    ogImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&h=630&fit=crop'
  },
  obras: {
    pageName: 'Catálogo de Obras',
    url: 'obras',
    title: 'Catálogo de Esculturas Originales | Antonio Carballo',
    description: 'Explora la colección de esculturas en bronce, mármol y madera creadas por Antonio Carballo. Obras figurativas y conceptuales disponibles para coleccionistas privados y galerías de arte.',
    keywords: 'comprar escultura, catalogo de arte, esculturas en bronce, marmol tallado, arte español',
    ogImage: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=1200&h=630&fit=crop'
  },
  biografia: {
    pageName: 'Sobre Mí / Biografía',
    url: 'biografia',
    title: 'Biografía del Escultor Antonio Carballo | Trayectoria',
    description: 'Conoce la trayectoria artística de Antonio Carballo. Formación en Bellas Artes, premios, simposios de escultura y filosofía detrás del modelado y la talla directa.',
    keywords: 'biografia artista, trayectoria antonio carballo, premios de escultura, simposio de arte',
    ogImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=630&fit=crop'
  },
  contacto: {
    pageName: 'Contacto y Cita Previa',
    url: 'contacto',
    title: 'Contacto con el Taller de Antonio Carballo | Reservas',
    description: 'Solicita un presupuesto para obras de encargo o reserva una cita previa para visitar el taller y estudio de escultura de Antonio Carballo en Madrid.',
    keywords: 'contacto escultor, encargar estatua, visitar taller escultura, presupuesto arte',
    ogImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=630&fit=crop'
  }
};

export default function SeoManager() {
  const [pagesSeo, setPagesSeo] = useState<Record<string, PageSeo>>(initialPagesSeo);
  const [selectedPageKey, setSelectedPageKey] = useState<string>('inicio');
  const [regeneratingSitemap, setRegeneratingSitemap] = useState(false);

  // Global SEO options
  const [isIndex, setIsIndex] = useState(true);
  const [isFollow, setIsFollow] = useState(true);

  const currentPage = pagesSeo[selectedPageKey]!;

  const handleChange = (field: keyof PageSeo, val: string) => {
    setPagesSeo(prev => ({
      ...prev,
      [selectedPageKey]: {
        ...prev[selectedPageKey]!,
        [field]: val
      }
    }));
  };

  const handleSave = () => {
    toast.success('Metatags de SEO actualizados de forma segura.');
  };

  const handleRegenerateSitemap = () => {
    setRegeneratingSitemap(true);
    setTimeout(() => {
      setRegeneratingSitemap(false);
      toast.success('Sitemap.xml regenerado automáticamente con todas las páginas y obras publicadas.');
    }, 1500);
  };

  // AI Suggest Meta titles/descriptions
  const handleAiSuggest = () => {
    const toastId = toast.loading('Prisma IA analizando contenido para sugerir metadatos...');
    setTimeout(() => {
      toast.dismiss(toastId);
      handleChange('title', `${currentPage.title.split('|')[0]} | Escultura Singular`);
      handleChange('description', `Descubre la maestría escultórica de Antonio Carballo. Obras icónicas, exposiciones exclusivas y la profunda textura de materiales nobles esculpidos directamente con pasión.`);
      toast.success('Prisma IA ha optimizado los metadatos de esta página.');
    }, 1200);
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Posicionamiento SEO</h1>
        <p className="text-xs text-muted-foreground">Optimiza la visibilidad de tu portal en buscadores como Google para atraer coleccionistas orgánicos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* EDIT METADATA (Col-span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Globe size={16} className="text-violet-500" />
                    Editar Metadatos por Página
                  </CardTitle>
                </div>
                {/* SELECT PAGE DROPDOWN */}
                <select 
                  value={selectedPageKey} 
                  onChange={(e) => setSelectedPageKey(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 h-8 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                >
                  {Object.entries(pagesSeo).map(([key, page]) => (
                    <option key={key} value={key}>{page.pageName}</option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
              {/* PAGE TITLE */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Meta Title</label>
                  <span className={`text-[10px] font-semibold ${currentPage.title.length > 60 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                    {currentPage.title.length} / 60 caracteres
                  </span>
                </div>
                <Input 
                  value={currentPage.title} 
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="h-9 text-xs font-semibold"
                />
              </div>

              {/* PAGE DESCRIPTION */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Meta Description</label>
                  <span className={`text-[10px] font-semibold ${currentPage.description.length > 160 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                    {currentPage.description.length} / 160 caracteres
                  </span>
                </div>
                <Textarea 
                  value={currentPage.description} 
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="text-xs min-h-[80px]"
                />
              </div>

              {/* KEYWORDS */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Keywords (separadas por comas)</label>
                <Input 
                  value={currentPage.keywords} 
                  onChange={(e) => handleChange('keywords', e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              {/* OPEN GRAPH IMAGE */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">URL Imagen Compartida (Open Graph Image)</label>
                <Input 
                  value={currentPage.ogImage} 
                  onChange={(e) => handleChange('ogImage', e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              {/* GOOGLE INDEX/FOLLOW CONFIG */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dashed">
                <div className="flex items-center justify-between p-3 border rounded-xl bg-background">
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold">Indexar Página</p>
                    <p className="text-[10px] text-muted-foreground">Permitir a Google mostrarla</p>
                  </div>
                  <Switch checked={isIndex} onCheckedChange={setIsIndex} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-xl bg-background">
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold">Seguir Enlaces</p>
                    <p className="text-[10px] text-muted-foreground">Traspasar autoridad de links</p>
                  </div>
                  <Switch checked={isFollow} onCheckedChange={setIsFollow} />
                </div>
              </div>

              {/* SAVE & AI BUTTONS */}
              <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" size="sm" onClick={handleAiSuggest} className="text-violet-600 border-violet-200 hover:bg-violet-50 text-xs font-bold h-9">
                  <Sparkles size={14} className="mr-1.5 text-violet-500" />
                  Optimizar con IA
                </Button>
                <Button onClick={handleSave} className="text-xs font-bold h-9">
                  <Save size={14} className="mr-1.5" />
                  Guardar Cambios
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* GOOGLE PREVIEW & INFRASTRUCTURE STATUS (Col-span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* GOOGLE SNIPPET PREVIEW */}
          <Card>
            <CardHeader className="pb-3 bg-muted/20 border-b">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Eye size={13} />
                Vista Previa en Buscador (Google)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-left font-sans">
              <div className="space-y-1">
                {/* Site badge */}
                <div className="flex items-center gap-2 text-xs text-[#202124] dark:text-[#bdc1c6] leading-none mb-1">
                  <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border flex items-center justify-center text-[10px] font-bold">
                    ▲
                  </div>
                  <div>
                    <p className="font-semibold text-xs leading-none">Antonio Carballo</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-none">
                      https://antoniocarballo.art.es{currentPage.url ? '/' + currentPage.url : ''}
                    </p>
                  </div>
                </div>
                {/* Title */}
                <h3 className="text-lg text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-tight font-medium">
                  {currentPage.title || 'Introduce un título...'}
                </h3>
                {/* Description */}
                <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed pt-0.5 font-normal">
                  {currentPage.description || 'Introduce una metadescripción para ver cómo se estructurará tu snippet en los resultados de búsqueda orgánica de Google.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SOCIAL MEDIA PREVIEW */}
          <Card>
            <CardHeader className="pb-3 bg-muted/20 border-b">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Share2 size={13} />
                Vista Previa Redes (Open Graph / WhatsApp)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="border rounded-xl overflow-hidden bg-background">
                {currentPage.ogImage && (
                  <div className="aspect-[1.91/1] bg-zinc-100 dark:bg-zinc-900 border-b overflow-hidden relative">
                    <img 
                      src={currentPage.ogImage} 
                      alt="OG preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-3 text-xs text-left">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">antoniocarballo.art.es</p>
                  <p className="font-bold text-foreground truncate mt-1">{currentPage.title}</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{currentPage.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO INFRASTRUCTURE (SITEMAP & ROBOTS) */}
          <Card>
            <CardHeader className="pb-3 bg-muted/20 border-b">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Infraestructura de Indexación
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              
              {/* Sitemap.xml */}
              <div className="flex items-start justify-between gap-3 p-3 border rounded-xl bg-background/50">
                <div className="overflow-hidden">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-emerald-500" />
                    Sitemap XML
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">/sitemap.xml</p>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Actualizado: Hace 2 días (contiene 4 páginas base y 12 obras activas).
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="xs" 
                  onClick={handleRegenerateSitemap} 
                  disabled={regeneratingSitemap}
                  className="text-[10px] font-bold h-7 shrink-0"
                >
                  <RefreshCw size={10} className={`mr-1 ${regeneratingSitemap ? 'animate-spin' : ''}`} />
                  Regenerar
                </Button>
              </div>

              {/* Robots.txt */}
              <div className="flex items-start gap-3 p-3 border rounded-xl bg-background/50">
                <div className="overflow-hidden">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-emerald-500" />
                    Robots.txt
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">/robots.txt</p>
                  <pre className="text-[9px] bg-muted p-2 rounded mt-2 font-mono text-zinc-500 leading-snug">
User-agent: *{"\n"}
Allow: /{"\n"}
Sitemap: https://antoniocarballo.art.es/sitemap.xml
                  </pre>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
