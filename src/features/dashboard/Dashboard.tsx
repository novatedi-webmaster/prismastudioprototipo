import { useState, useEffect } from 'react';
import { useModules } from '../../lib/contexts/ModuleContext';
import { usePublicTheme } from '../../lib/contexts/PublicThemeContext';
import { PublicWebPreview } from '../web/PublicWebPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Compass, Eye, Upload, FileText, CheckCircle2, 
  ArrowUpRight, Palette, RefreshCw, MessageSquare, 
  TrendingUp, Calendar, Image as ImageIcon, Heart
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardProps {
  onNavigate: (route: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { modules, sections } = useModules();
  const { activeTheme } = usePublicTheme();
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    const t = toast.loading('Sincronizando base de datos local y compilando estáticos...');
    setTimeout(() => {
      toast.dismiss(t);
      setIsPublishing(false);
      toast.success('Sitio web publicado con éxito en Cloudflare CDN.');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Hola, Antonio</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Sitio Online • Última publicación hace 2 días
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate('/web')} className="gap-1">
            <Eye size={16} />
            Ver Web Pública
          </Button>
          <Button size="sm" onClick={handlePublish} disabled={isPublishing} className="gap-1">
            <RefreshCw size={16} className={isPublishing ? 'animate-spin' : ''} />
            {isPublishing ? 'Publicando...' : 'Publicar cambios'}
          </Button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('/content')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Obras Registradas</CardTitle>
            <Heart size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">171</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">+3 catalogadas hoy</p>
          </CardContent>
        </Card>

        {/* Stat 2 */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('/content')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Exposiciones</CardTitle>
            <Calendar size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">1 exposición activa</p>
          </CardContent>
        </Card>

        {/* Stat 3 */}
        <Card className="hover:shadow-md transition-shadow border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Nuevos Mensajes</CardTitle>
            <MessageSquare size={16} className="text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">3</div>
            <Badge variant="destructive" className="text-[10px] py-0 px-1.5 mt-1 font-semibold">
              Por responder
            </Badge>
          </CardContent>
        </Card>

        {/* Stat 4 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Visitas en Mayo</CardTitle>
            <TrendingUp size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.420</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">+15.4% que el mes anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* CORE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PREVIEW CONTAINER - 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-lg font-bold">Vista previa en vivo</h3>
              <p className="text-xs text-muted-foreground">Tu dominio público: <code className="font-semibold text-primary">escultorcarballo.com</code></p>
            </div>
            <div className="flex gap-1 border p-1 bg-muted rounded-md text-xs">
              <button 
                onClick={() => setPreviewDevice('desktop')}
                className={`px-2.5 py-1 rounded-sm font-semibold transition-all ${previewDevice === 'desktop' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
              >
                Escritorio
              </button>
              <button 
                onClick={() => setPreviewDevice('mobile')}
                className={`px-2.5 py-1 rounded-sm font-semibold transition-all ${previewDevice === 'mobile' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
              >
                Móvil
              </button>
            </div>
          </div>

          <Card className="overflow-hidden border shadow-sm">
            <CardContent className="p-0 bg-zinc-100 dark:bg-zinc-900 flex justify-center">
              <div 
                className={`transition-all duration-300 overflow-y-auto ${
                  previewDevice === 'desktop' 
                    ? 'w-full h-[500px]' 
                    : 'w-[375px] h-[500px] border-x shadow-2xl my-4 rounded-xl'
                }`}
              >
                <PublicWebPreview 
                  theme={activeTheme} 
                  modules={modules} 
                  sections={sections} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SIDE ACTIONS AND ACTIVITY - 1/3 */}
        <div className="space-y-6">
          {/* ACCIONES RÁPIDAS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Acciones rápidas</CardTitle>
              <CardDescription>Acceso directo a las tareas frecuentes</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-left gap-2"
                onClick={() => onNavigate('/content')}
              >
                <FileText size={16} className="text-muted-foreground" />
                Editar contenido de la web
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left gap-2"
                onClick={() => onNavigate('/themes')}
              >
                <Palette size={16} className="text-muted-foreground" />
                Cambiar diseño estético
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left gap-2"
                onClick={() => onNavigate('/assets')}
              >
                <Upload size={16} className="text-muted-foreground" />
                Subir foto a la biblioteca
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left gap-2"
                onClick={() => onNavigate('/pages')}
              >
                <Compass size={16} className="text-muted-foreground" />
                Organizar páginas y secciones
              </Button>
            </CardContent>
          </Card>

          {/* ACTIVIDAD RECIENTE */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Actividad reciente</CardTitle>
              <CardDescription>Últimos cambios en el panel soberano</CardDescription>
            </CardHeader>
            <CardContent className="p-0 px-6 pb-6">
              <div className="relative border-l pl-4 space-y-4 text-xs">
                {/* Timeline Item 1 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-background">
                    <CheckCircle2 size={10} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold">Sincronización completada</p>
                    <p className="text-muted-foreground">Compilado el tema <span className="font-semibold">{activeTheme?.name}</span></p>
                    <p className="text-[10px] text-muted-foreground">Hace 2 horas</p>
                  </div>
                </div>

                {/* Timeline Item 2 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-background">
                    <CheckCircle2 size={10} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold">Modificación de biografía</p>
                    <p className="text-muted-foreground">Editado el campo "Segundo Párrafo"</p>
                    <p className="text-[10px] text-muted-foreground">Hace 1 día</p>
                  </div>
                </div>

                {/* Timeline Item 3 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 bg-purple-500 text-white rounded-full p-0.5 border-2 border-background">
                    <CheckCircle2 size={10} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold">Nueva obra catalogada</p>
                    <p className="text-muted-foreground">Subido "Torso de Carrara" en mármol</p>
                    <p className="text-[10px] text-muted-foreground">Hace 2 días</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
