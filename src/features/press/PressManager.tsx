import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../lib/mock-api';
import type { PressLogo, PressArticle } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Plus, Calendar, ExternalLink, Trash2, Edit, Save, 
  RefreshCw, CheckCircle, Newspaper, Image as ImageIcon, Link as LinkIcon 
} from 'lucide-react';
import { toast } from 'sonner';

export default function PressManager() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'articles' | 'logos'>('articles');
  
  const [articles, setArticles] = useState<PressArticle[]>([]);
  const [logos, setLogos] = useState<PressLogo[]>([]);
  const [loading, setLoading] = useState(true);

  // Logo creation state
  const [isLogoOpen, setIsLogoOpen] = useState(false);
  const [logoName, setLogoName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [savingLogo, setSavingLogo] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const artList = await mockApi.press.listArticles();
      setArticles(artList);

      const logList = await mockApi.press.listLogos();
      setLogos(logList);
    } catch {
      toast.error('Error al cargar la prensa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteArticle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de que deseas eliminar este artículo de prensa?')) {
      try {
        await mockApi.press.deleteArticle(id);
        toast.success('Artículo eliminado.');
        loadData();
      } catch {
        toast.error('Fallo al eliminar artículo.');
      }
    }
  };

  const handleOpenCreateLogo = () => {
    setLogoName('');
    setLogoUrl('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&fit=crop');
    setIsLogoOpen(true);
  };

  const handleSaveLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoName.trim() || !logoUrl.trim()) return;

    setSavingLogo(true);
    const newLogo: PressLogo = {
      id: `pl-${Date.now()}`,
      name: logoName.trim(),
      imageUrl: logoUrl.trim()
    };

    try {
      await mockApi.press.saveLogo(newLogo);
      toast.success('Logotipo de medio agregado con éxito.');
      setIsLogoOpen(false);
      loadData();
    } catch {
      toast.error('Error al guardar logotipo.');
    } finally {
      setSavingLogo(false);
    }
  };

  const handleDeleteLogo = async (id: string, name: string) => {
    if (confirm(`¿Deseas eliminar el logotipo de "${name}"?`)) {
      try {
        await mockApi.press.deleteLogo(id);
        toast.success(`Logotipo de "${name}" eliminado.`);
        loadData();
      } catch {
        toast.error('Error al eliminar logotipo.');
      }
    }
  };

  const handleCreateArticle = () => {
    const newId = `pa-${Date.now()}`;
    navigate(`/press/${newId}?new=true`);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Prensa y Publicaciones</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los artículos, entrevistas y logotipos de medios de comunicación que avalan tu carrera.
          </p>
        </div>
        
        {activeTab === 'articles' ? (
          <Button onClick={handleCreateArticle} className="gap-2 self-start md:self-auto shadow-md">
            <Plus size={16} />
            Nuevo Artículo
          </Button>
        ) : (
          <Button onClick={handleOpenCreateLogo} className="gap-2 self-start md:self-auto shadow-md">
            <Plus size={16} />
            Agregar Logotipo
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <div className="flex justify-start border-b pb-2">
          <TabsList className="bg-muted/60 p-1 rounded-lg">
            <TabsTrigger value="articles" className="text-xs font-bold px-4 py-1.5 rounded-md">
              Artículos de Prensa
            </TabsTrigger>
            <TabsTrigger value="logos" className="text-xs font-bold px-4 py-1.5 rounded-md">
              Logotipos de Medios
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ARTICLES CONTENT */}
        <TabsContent value="articles" className="pt-4 text-left">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground text-xs space-y-2">
              <RefreshCw className="animate-spin mx-auto h-7 w-7 text-primary" />
              <p>Sincronizando hemeroteca...</p>
            </div>
          ) : articles.length === 0 ? (
            <Card className="border-dashed border-2 py-16 text-center">
              <CardContent className="space-y-3">
                <Newspaper className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No hay artículos cargados</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Registra críticas de arte, reportajes dominicales o entrevistas en formato de fichas estéticas.
                </p>
                <Button variant="outline" size="sm" onClick={handleCreateArticle} className="gap-1.5 mt-2">
                  <Plus size={14} /> Registrar primer artículo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((art) => (
                <Card 
                  key={art.id} 
                  onClick={() => navigate(`/press/${art.id}`)}
                  className="group overflow-hidden cursor-pointer border-zinc-200 dark:border-zinc-800 bg-card hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Cover image */}
                    {art.imageUrl && (
                      <div className="sm:w-1/3 aspect-[4/3] sm:aspect-auto bg-muted overflow-hidden shrink-0 relative">
                        <img 
                          src={art.imageUrl} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-background/90 text-foreground text-[9px] font-bold border px-1.5 py-0">
                            {art.mediaName}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Body contents */}
                    <div className="p-4 flex flex-col justify-between grow min-w-0">
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                          <Calendar size={12} />
                          <span>{art.date}</span>
                        </div>
                        <h3 className="font-extrabold text-sm text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {art.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>

                      {/* Footer URL link */}
                      {art.externalUrl && (
                        <div className="text-[10px] text-primary font-bold flex items-center gap-1.5 mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-900 leading-none">
                          <LinkIcon size={11} />
                          <span className="truncate max-w-[150px]">{art.externalUrl}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions overlay */}
                  <div className="px-4 py-2 border-t bg-muted/10 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-muted-foreground">ID: {art.id}</span>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded"
                        onClick={() => navigate(`/press/${art.id}`)}
                      >
                        <Edit size={12} className="text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded text-red-500 hover:text-red-600"
                        onClick={(e) => handleDeleteArticle(art.id, e)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* LOGOS CONTENT */}
        <TabsContent value="logos" className="pt-4 text-left">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground text-xs space-y-2">
              <RefreshCw className="animate-spin mx-auto h-7 w-7 text-primary" />
              <p>Cargando logotipos de prensa...</p>
            </div>
          ) : logos.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-xs italic">
              No hay logotipos registrados. Haz clic en Agregar Logotipo arriba.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {logos.map((logo) => (
                <Card key={logo.id} className="group relative border-zinc-200 dark:border-zinc-800 bg-card p-4 hover:shadow-md transition-shadow flex flex-col items-center justify-center">
                  <div className="w-24 h-16 flex items-center justify-center overflow-hidden">
                    <img 
                      src={logo.imageUrl} 
                      alt={logo.name} 
                      className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-xs font-bold text-foreground leading-none truncate max-w-[120px]">{logo.name}</p>
                  </div>

                  {/* Floating Delete action */}
                  <button
                    onClick={() => handleDeleteLogo(logo.id, logo.name)}
                    className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    title="Eliminar logo"
                  >
                    <Trash2 size={10} />
                  </button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* CREATE LOGO DIALOG */}
      <Dialog open={isLogoOpen} onOpenChange={setIsLogoOpen}>
        <DialogContent className="max-w-md text-left">
          <DialogHeader>
            <DialogTitle className="text-base font-black flex items-center gap-2">
              <ImageIcon size={18} className="text-primary" />
              Agregar Logotipo de Medio
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sube el logo corporativo del medio que publicó tu entrevista. Se mostrará en escala de grises en la portada.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveLogo}>
            <div className="space-y-4 py-3">
              <div className="space-y-1.5">
                <Label htmlFor="logoName" className="text-xs font-bold">Nombre del Medio</Label>
                <Input
                  id="logoName"
                  placeholder="Ej. El Mundo, ABC, Architectural Digest..."
                  value={logoName}
                  onChange={(e) => setLogoName(e.target.value)}
                  required
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="logoUrl" className="text-xs font-bold">URL de la Imagen / Logotipo</Label>
                <Input
                  id="logoUrl"
                  placeholder="Ej. https://images.unsplash.com/..."
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  required
                  className="h-10 text-xs font-mono"
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLogoOpen(false)}
                disabled={savingLogo}
                className="h-9 text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={savingLogo}
                className="h-9 text-xs font-extrabold gap-1"
              >
                <CheckCircle size={14} /> Registrar Medio
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}