import { useState } from 'react';
import { 
  Search, HelpCircle, BookOpen, Globe, Sparkles, Award, 
  ChevronRight, ArrowLeft, Heart, MessageSquare, ShieldCheck, Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category: 'primeros' | 'obras' | 'seo' | 'suscripcion';
  readTime: string;
}

const articles: Article[] = [
  {
    id: 'art-1',
    title: '¿Cómo añado mi propio dominio personalizado (.es o .art)?',
    excerpt: 'Aprende a configurar tu propio dominio web para que tu catálogo responda directamente bajo tu marca.',
    body: 'Para enlazar tu propio dominio (ej. www.antoniocarballo.art) con tu portal de Prisma Studio, sigue estos sencillos pasos:\n\n1. Ve a Configuración de Marca o comunícanos el dominio que deseas registrar/vincular.\n2. Accede al panel de control del registrador de tu dominio (ej. GoDaddy, Piensaenred, etc.).\n3. Añade un registro CNAME que apunte tu subdominio www a "domains.prismaeditor.com".\n4. Añade una redirección de puerto o un registro A que apunte tu IP base si deseas soporte para dominio desnudo.\n5. Una vez configurados los DNS (que pueden demorar entre 2 y 24 horas en propagarse), emitiremos automáticamente un certificado de seguridad SSL Let\'s Encrypt gratuito de forma automática para asegurar tus transacciones.',
    category: 'seo',
    readTime: '4 min de lectura'
  },
  {
    id: 'art-2',
    title: '¿Cómo optimizo las fotos de mis esculturas para que carguen rápido?',
    excerpt: 'Tus fotos de alta resolución en mármol o bronce pueden optimizarse automáticamente en la biblioteca de medios.',
    body: 'Las fotos de escultura requieren capturar cada textura de cincelado o pátina de metal, lo que genera archivos masivos de hasta 10MB. En Prisma Studio incorporamos compresión inteligente:\n\n1. Cuando subes una foto a la Biblioteca de Medios, el sistema convierte la imagen internamente al formato WebP de última generación.\n2. Redimensionamos la foto automáticamente para dispositivos móviles, tablets y ordenadores.\n3. Te recomendamos subir archivos en formato JPEG o PNG con un tamaño máximo recomendado de 4000px en su eje mayor.\n4. Si deseas conservar el archivo original intacto para descargas en alta calidad, marca la casilla "Preservar original" en los ajustes multimedia del asset.',
    category: 'obras',
    readTime: '3 min de lectura'
  },
  {
    id: 'art-3',
    title: '¿Qué es el modo mantenimiento y cómo afecta a Google?',
    excerpt: 'Utiliza el modo mantenimiento de forma segura sin perder tu posicionamiento de Google.',
    body: 'El modo mantenimiento bloquea las páginas públicas mostrando una pantalla de cortesía 503.\n\n- ¿Cómo afecta al SEO?: Cuando activas este modo, el servidor responde con un código de estado HTTP 503 (Servicio no disponible). Esto le indica a los robots de Google que la caída es temporal y planificada, por lo que NO desindexará tus páginas de sus resultados ni penalizará tu autoridad de dominio.\n- ¿Cuánto tiempo puedo tenerlo activo?: Se recomienda no exceder de 7-14 días continuos en modo mantenimiento, ya que Google podría comenzar a considerar el sitio obsoleto si los reintentos persisten indefinidamente.\n- ¿Puedo yo ver mi web?: Sí, las vistas previas dentro de Prisma Studio y las rutas de previsualización privada siguen estando 100% funcionales para ti y tu equipo.',
    category: 'seo',
    readTime: '5 min de lectura'
  },
  {
    id: 'art-4',
    title: '¿Cómo invitar a mi fotógrafo o asistente a Prisma Studio?',
    excerpt: 'Añade colaboradores para que te ayuden a redactar el blog o a subir fotos de tu taller.',
    body: 'No tienes por qué hacerlo todo solo. Puedes invitar a colaboradores con diferentes roles de forma segura:\n\n1. Ve a Configuración > Equipo.\n2. Haz clic en "Invitar Miembro" e introduce su nombre, email y rol.\n3. El sistema le enviará una invitación inmediata por correo electrónico para que genere su propia clave de acceso.\n4. El rol "Manager" puede editar textos, subir imágenes y gestionar citas. El rol "Staff" se limita a ver analíticas e interactuar con el catálogo de obras sin modificar la identidad corporativa ni la suscripción.',
    category: 'primeros',
    readTime: '2 min de lectura'
  },
  {
    id: 'art-5',
    title: '¿Cómo funciona la pasarela de pagos para vender esculturas online?',
    excerpt: 'Habilita botones de cobro seguro con tarjeta de crédito o transferencia bancaria en tus fichas de obra.',
    body: 'Prisma Studio permite integrar botones de pago directo de Stripe de forma segura client-side:\n\n1. Ve a Mi Perfil > Configuración de cobros.\n2. Vincula tu cuenta de Stripe o introduce tus datos de transferencia bancaria preferida.\n3. En las fichas de Obras, si marcas el campo "Disponible para adquisición", se mostrará un botón de compra segura.\n4. Cuando un coleccionista pulse sobre adquirir, se generará una pasarela de pago cifrada. Una vez completado el pago, recibirás una alerta en tu Bandeja de Entrada para coordinar el envío de la escultura, embalaje en caja de madera de exportación y seguro de transporte.',
    category: 'suscripcion',
    readTime: '4 min de lectura'
  }
];

export default function HelpCenter() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'primeros' | 'obras' | 'seo' | 'suscripcion'>('all');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(search.toLowerCase()) || 
      art.excerpt.toLowerCase().includes(search.toLowerCase()) || 
      art.body.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === 'all' ? true : art.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const selectedArticle = articles.find(art => art.id === selectedArticleId);

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'primeros': return <BookOpen size={16} className="text-blue-500" />;
      case 'obras': return <Sparkles size={16} className="text-violet-500" />;
      case 'seo': return <Globe size={16} className="text-cyan-500" />;
      default: return <Award size={16} className="text-emerald-500" />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch(cat) {
      case 'primeros': return 'Primeros Pasos';
      case 'obras': return 'Gestión de Obras';
      case 'seo': return 'Dominios y SEO';
      default: return 'Suscripción';
    }
  };

  const handleSupportTicket = () => {
    toast.success('Petición de ticket de soporte técnico registrada. Te responderemos en menos de 2 horas.');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* HEADER HELP JUMBOTRON */}
      {!selectedArticle && (
        <Card className="border border-zinc-200 shadow-lg bg-gradient-to-tr from-violet-600/[0.03] via-indigo-600/[0.01] to-cyan-500/[0.02] relative overflow-hidden">
          {/* Decorative mesh */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          <CardContent className="p-8 md:p-12 relative flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
              <Badge variant="outline" className="font-extrabold text-[10px] uppercase tracking-wider text-violet-600 border-violet-200/50 bg-violet-100/10 px-2.5 py-1">
                Soporte Prisma Soberano
              </Badge>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                ¿Cómo te podemos ayudar hoy?
              </h1>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Busca artículos en nuestra base de conocimientos o filtra por temas para resolver tus dudas de inmediato.
              </p>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative w-full max-w-md">
              <Search size={16} className="absolute left-3.5 top-3 text-muted-foreground" />
              <Input 
                placeholder="Busca por palabras clave (ej. dominio, fotos, SEO)..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 text-xs border-zinc-200 shadow-md focus-visible:ring-violet-500 rounded-xl"
              />
            </div>

            {/* QUICK CATEGORY FILTER BADGES */}
            <div className="flex flex-wrap justify-center gap-1.5 pt-2">
              <Button 
                variant={categoryFilter === 'all' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setCategoryFilter('all')}
                className="text-[11px] font-bold h-8 px-3 rounded-full"
              >
                Todos los temas
              </Button>
              <Button 
                variant={categoryFilter === 'primeros' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setCategoryFilter('primeros')}
                className="text-[11px] font-bold h-8 px-3 rounded-full flex items-center gap-1.5"
              >
                <BookOpen size={12} />
                Primeros Pasos
              </Button>
              <Button 
                variant={categoryFilter === 'obras' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setCategoryFilter('obras')}
                className="text-[11px] font-bold h-8 px-3 rounded-full flex items-center gap-1.5"
              >
                <Sparkles size={12} />
                Obras
              </Button>
              <Button 
                variant={categoryFilter === 'seo' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setCategoryFilter('seo')}
                className="text-[11px] font-bold h-8 px-3 rounded-full flex items-center gap-1.5"
              >
                <Globe size={12} />
                SEO y Dominios
              </Button>
              <Button 
                variant={categoryFilter === 'suscripcion' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setCategoryFilter('suscripcion')}
                className="text-[11px] font-bold h-8 px-3 rounded-full flex items-center gap-1.5"
              >
                <Award size={12} />
                Suscripción
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ARTICLE GRID OR INDIVIDUAL VIEW */}
      {selectedArticle ? (
        // DETAIL VIEW
        <div className="space-y-6">
          <Button variant="ghost" size="sm" onClick={() => setSelectedArticleId(null)} className="text-xs font-bold gap-1.5 px-0 hover:bg-transparent">
            <ArrowLeft size={14} />
            Volver a la base de conocimientos
          </Button>

          <Card>
            <CardHeader className="pb-4 border-b bg-muted/10">
              <div className="flex items-center gap-2">
                {getCategoryIcon(selectedArticle.category)}
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">
                  {getCategoryLabel(selectedArticle.category)}
                </span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-[10px] text-muted-foreground font-bold">{selectedArticle.readTime}</span>
              </div>
              <CardTitle className="text-lg md:text-xl font-black tracking-tight text-foreground mt-2">
                {selectedArticle.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line text-left">
                {selectedArticle.body}
              </div>
            </CardContent>
          </Card>

          {/* Was this helpful bottom feedback */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-muted/20 p-4 border rounded-xl text-xs gap-3">
            <span className="font-semibold text-muted-foreground">¿Te ha resultado útil este artículo?</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.success('¡Gracias por tu valoración!')} className="text-xs h-8">
                Sí, gracias
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.success('Gracias por tu feedback, lo revisaremos para mejorarlo.')} className="text-xs h-8">
                No del todo
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // LIST VIEW (GRID)
        <div className="space-y-6">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Artículos Encontrados ({filteredArticles.length})</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground space-y-2">
                <HelpCircle className="mx-auto h-8 w-8 stroke-[1.5]" />
                <p className="text-xs font-semibold">No se encontraron artículos</p>
                <p className="text-[10px] text-muted-foreground/70">Prueba con otra palabra clave o selecciona otra categoría.</p>
              </div>
            ) : (
              filteredArticles.map((art) => (
                <Card 
                  key={art.id} 
                  onClick={() => setSelectedArticleId(art.id)}
                  className="hover:border-violet-300 dark:hover:border-violet-950 hover:shadow-md cursor-pointer transition-all flex flex-col text-left group"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(art.category)}
                        <span className="text-[9px] uppercase font-bold text-muted-foreground">
                          {getCategoryLabel(art.category)}
                        </span>
                      </div>
                      <span className="text-[9px] text-muted-foreground font-semibold">{art.readTime}</span>
                    </div>
                    <CardTitle className="text-xs font-black tracking-tight text-foreground group-hover:text-violet-500 mt-2 line-clamp-1 leading-snug">
                      {art.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4 flex-grow">
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-violet-500 mt-3.5 group-hover:underline">
                      Leer artículo completo
                      <ChevronRight size={10} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* STILL NEED HELP CONTACT SUPPORT ZONE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-dashed">
            <Card className="md:col-span-3 bg-muted/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <p className="font-extrabold text-xs">¿Sigues teniendo dudas o necesitas un desarrollo personalizado?</p>
                <p className="text-[10px] text-muted-foreground max-w-xl leading-relaxed">
                  Nuestro equipo de ingenieros de soporte técnico y diseñadores de portafolios de arte está disponible 24/7 para ayudarte con integraciones o soporte técnico especializado.
                </p>
              </div>
              <Button size="sm" onClick={handleSupportTicket} className="text-xs font-bold h-9 shrink-0">
                <Mail size={14} className="mr-1.5" />
                Contactar con Soporte
              </Button>
            </Card>
          </div>
        </div>
      )}

    </div>
  );
}
