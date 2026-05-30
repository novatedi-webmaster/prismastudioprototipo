import { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Eye, Image as ImageIcon, 
  MessageSquare, Calendar, ChevronDown, ArrowUpRight, ArrowDownRight, Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock Data for different ranges
const dataRangeStats: Record<string, {
  visitas: number;
  visitasTrend: string;
  visitasTrendUp: boolean;
  paginasVistas: number;
  paginasVistasTrend: string;
  paginasVistasTrendUp: boolean;
  topObrasVistas: number;
  mensajes: number;
  mensajesTrend: string;
  mensajesTrendUp: boolean;
  trafficData: { name: string; visitas: number; paginas: number }[];
  sculptureData: { name: string; vistas: number }[];
  pagesTable: { url: string; name: string; views: number; time: string }[];
  sourcesTable: { source: string; views: number; pct: number }[];
}> = {
  '7': {
    visitas: 1240,
    visitasTrend: '+12.4%',
    visitasTrendUp: true,
    paginasVistas: 4890,
    paginasVistasTrend: '+8.1%',
    paginasVistasTrendUp: true,
    topObrasVistas: 582,
    mensajes: 14,
    mensajesTrend: '+27%',
    mensajesTrendUp: true,
    trafficData: [
      { name: 'Lun', visitas: 150, paginas: 410 },
      { name: 'Mar', visitas: 180, paginas: 490 },
      { name: 'Mié', visitas: 140, paginas: 380 },
      { name: 'Jue', visitas: 210, paginas: 560 },
      { name: 'Vie', visitas: 195, paginas: 520 },
      { name: 'Sáb', visitas: 230, paginas: 650 },
      { name: 'Dom', visitas: 135, paginas: 380 }
    ],
    sculptureData: [
      { name: 'Maternidad II', vistas: 245 },
      { name: 'Torso de Carrara', vistas: 198 },
      { name: 'Silueta Viento', vistas: 142 },
      { name: 'Busto Mármol', vistas: 98 },
      { name: 'Relieve Olivo', vistas: 75 }
    ],
    pagesTable: [
      { url: '/', name: 'Inicio', views: 2450, time: '2:14' },
      { url: '/obras', name: 'Catálogo de Obras', views: 1680, time: '3:45' },
      { url: '/obras/work-1', name: 'Maternidad II (Detalle)', views: 840, time: '1:50' },
      { url: '/biografia', name: 'Sobre Mí / Biografía', views: 420, time: '2:30' },
      { url: '/contacto', name: 'Contacto', views: 310, time: '1:10' }
    ],
    sourcesTable: [
      { source: 'Buscadores (Google/Bing)', views: 1840, pct: 45 },
      { source: 'Tráfico Directo', views: 1220, pct: 30 },
      { source: 'Instagram / Redes', views: 610, pct: 15 },
      { source: 'Prensa (El Cultural)', views: 410, pct: 10 }
    ]
  },
  '30': {
    visitas: 5120,
    visitasTrend: '+18.7%',
    visitasTrendUp: true,
    paginasVistas: 19450,
    paginasVistasTrend: '+15.2%',
    paginasVistasTrendUp: true,
    topObrasVistas: 2410,
    mensajes: 48,
    mensajesTrend: '-4.2%',
    mensajesTrendUp: false,
    trafficData: [
      { name: 'Semana 1', visitas: 1100, paginas: 4100 },
      { name: 'Semana 2', visitas: 1240, paginas: 4890 },
      { name: 'Semana 3', visitas: 1450, paginas: 5300 },
      { name: 'Semana 4', visitas: 1330, paginas: 5160 }
    ],
    sculptureData: [
      { name: 'Maternidad II', vistas: 980 },
      { name: 'Torso de Carrara', vistas: 740 },
      { name: 'Silueta Viento', vistas: 510 },
      { name: 'Busto Mármol', vistas: 380 },
      { name: 'Relieve Olivo', vistas: 290 }
    ],
    pagesTable: [
      { url: '/', name: 'Inicio', views: 9840, time: '2:08' },
      { url: '/obras', name: 'Catálogo de Obras', views: 6710, time: '3:32' },
      { url: '/obras/work-1', name: 'Maternidad II (Detalle)', views: 3250, time: '1:44' },
      { url: '/biografia', name: 'Sobre Mí / Biografía', views: 1820, time: '2:25' },
      { url: '/contacto', name: 'Contacto', views: 1140, time: '1:12' }
    ],
    sourcesTable: [
      { source: 'Buscadores (Google/Bing)', views: 7890, pct: 41 },
      { source: 'Tráfico Directo', views: 5770, pct: 30 },
      { source: 'Instagram / Redes', views: 3460, pct: 18 },
      { source: 'Prensa (El Cultural)', views: 2110, pct: 11 }
    ]
  }
};

export default function AnalyticsManager() {
  const [range, setRange] = useState<'7' | '30'>('7');
  const stats = dataRangeStats[range]!;

  const handleRefresh = () => {
    toast.success('Métricas actualizadas en tiempo real desde Cloudflare.');
  };

  return (
    <div className="space-y-6 text-left">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Analíticas de Tráfico</h1>
          <p className="text-xs text-muted-foreground">Monitorea el interés de tus coleccionistas y las visitas que recibe tu catálogo de arte.</p>
        </div>

        {/* DATE RANGE SELECTOR */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-semibold">Rango:</span>
          <select 
            value={range} 
            onChange={(e) => {
              setRange(e.target.value as '7' | '30');
              toast.info(`Cargando datos de los últimos ${e.target.value} días...`);
            }}
            className="rounded-md border border-input bg-background px-3 h-9 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
          </select>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="h-9 text-xs">
            Refrescar
          </Button>
        </div>
      </div>

      {/* METRICS CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* VISITAS */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Visitas Únicas</span>
              <p className="text-2xl font-black tracking-tight leading-none">
                {stats.visitas.toLocaleString('es-ES')}
              </p>
              <div className="flex items-center gap-1">
                {stats.visitasTrendUp ? (
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <ArrowUpRight size={10} />
                    {stats.visitasTrend}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <ArrowDownRight size={10} />
                    {stats.visitasTrend}
                  </span>
                )}
                <span className="text-[9px] text-muted-foreground">vs anterior</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500 border border-indigo-500/10 shrink-0">
              <Users size={20} />
            </div>
          </CardContent>
        </Card>

        {/* PAGINAS VISTAS */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Páginas Vistas</span>
              <p className="text-2xl font-black tracking-tight leading-none">
                {stats.paginasVistas.toLocaleString('es-ES')}
              </p>
              <div className="flex items-center gap-1">
                {stats.paginasVistasTrendUp ? (
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <ArrowUpRight size={10} />
                    {stats.paginasVistasTrend}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <ArrowDownRight size={10} />
                    {stats.paginasVistasTrend}
                  </span>
                )}
                <span className="text-[9px] text-muted-foreground">vs anterior</span>
              </div>
            </div>
            <div className="p-3 bg-violet-500/10 rounded-xl text-violet-500 border border-violet-500/10 shrink-0">
              <Eye size={20} />
            </div>
          </CardContent>
        </Card>

        {/* TOP OBRAS VISTAS */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Vistas a Esculturas</span>
              <p className="text-2xl font-black tracking-tight leading-none">
                {stats.topObrasVistas.toLocaleString('es-ES')}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="font-bold text-indigo-500">Maternidad II</span>
                <span>es la más vista</span>
              </div>
            </div>
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500 border border-cyan-500/10 shrink-0">
              <ImageIcon size={20} />
            </div>
          </CardContent>
        </Card>

        {/* MENSAJES RECIBIDOS */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Mensajes Recibidos</span>
              <p className="text-2xl font-black tracking-tight leading-none">
                {stats.mensajes}
              </p>
              <div className="flex items-center gap-1">
                {stats.mensajesTrendUp ? (
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <ArrowUpRight size={10} />
                    {stats.mensajesTrend}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <ArrowDownRight size={10} />
                    {stats.mensajesTrend}
                  </span>
                )}
                <span className="text-[9px] text-muted-foreground">vs anterior</span>
              </div>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10 shrink-0">
              <MessageSquare size={20} />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* CHARTS CONTAINER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TRAFFIC LINE CHART (Col-span 7) */}
        <Card className="lg:col-span-7">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-sm font-bold">Flujo de Tráfico Diario</CardTitle>
            <CardDescription className="text-xs">Tráfico comparado entre visitas únicas y páginas vistas durante el rango seleccionado.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[280px] w-full text-xs font-semibold">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.trafficData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend iconType="circle" />
                  <Line type="monotone" name="Visitas Únicas" dataKey="visitas" stroke="hsl(var(--primary))" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  <Line type="monotone" name="Páginas Vistas" dataKey="paginas" stroke="hsl(var(--secondary))" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* TOP SCULPTURES BAR CHART (Col-span 5) */}
        <Card className="lg:col-span-5">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-sm font-bold">Obras Más Populares</CardTitle>
            <CardDescription className="text-xs">Visitas únicas acumuladas por cada escultura en las últimas semanas.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[280px] w-full text-xs font-semibold">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.sculptureData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis type="number" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} width={110} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar name="Visitas Únicas" dataKey="vistas" radius={[0, 4, 4, 0]}>
                    {stats.sculptureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : index === 1 ? 'hsl(var(--secondary))' : 'hsl(var(--primary)/0.6)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* PAGES & CHANNELS TABLES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PAGES TABLE */}
        <Card>
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Globe size={15} className="text-zinc-500" />
              Páginas Más Visitadas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-muted/30 border-b text-muted-foreground font-bold">
                  <th className="p-3">Ruta de Página</th>
                  <th className="p-3 text-right">Visitas</th>
                  <th className="p-3 text-right">Tiempo Promedio</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.pagesTable.map((p, idx) => (
                  <tr key={idx} className="hover:bg-muted/15">
                    <td className="p-3">
                      <p className="font-extrabold text-foreground">{p.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{p.url}</p>
                    </td>
                    <td className="p-3 text-right font-black">{p.views.toLocaleString('es-ES')}</td>
                    <td className="p-3 text-right text-muted-foreground font-semibold">{p.time} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* SOURCES TABLE */}
        <Card>
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <TrendingUp size={15} className="text-zinc-500" />
              Canales / Orígenes de Tráfico
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-muted/30 border-b text-muted-foreground font-bold">
                  <th className="p-3">Canal</th>
                  <th className="p-3 text-right">Visitas</th>
                  <th className="p-3 text-right">Porcentaje</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.sourcesTable.map((s, idx) => (
                  <tr key={idx} className="hover:bg-muted/15">
                    <td className="p-3 font-extrabold">{s.source}</td>
                    <td className="p-3 text-right font-black">{s.views.toLocaleString('es-ES')}</td>
                    <td className="p-3 text-right font-semibold">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden shrink-0">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ width: `${s.pct}%` }}
                          />
                        </div>
                        <span className="w-7 text-right">{s.pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
