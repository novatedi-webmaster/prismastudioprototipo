import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/contexts/AuthContext';
import { ThemeProvider, useTheme } from './lib/contexts/ThemeContext';
import { PublicThemeProvider } from './lib/contexts/PublicThemeContext';
import { ModuleProvider } from './lib/contexts/ModuleContext';

import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import ContentEditor from './features/content/ContentEditor';
import PagesManager from './features/pages/PagesManager';
import ThemesGallery from './features/themes/ThemesGallery';
import AssetLibrary from './features/assets/AssetLibrary';
import FullPreview from './features/web/FullPreview';
import ProfileSettings from './features/account/ProfileSettings';
import Marketplace from './features/marketplace/Marketplace';

import WorksManager from './features/works/WorksManager';
import WorkDetail from './features/works/WorkDetail';
import AlbumsManager from './features/albums/AlbumsManager';
import CategoriesManager from './features/categories/CategoriesManager';
import SectionLibrary from './features/sections/SectionLibrary';
import PressManager from './features/press/PressManager';
import PressDetail from './features/press/PressDetail';
import BlogManager from './features/blog/BlogManager';
import BlogEditor from './features/blog/BlogEditor';
import BrandingManager from './features/branding/BrandingManager';

import InboxManager from './features/inbox/InboxManager';
import AppointmentsManager from './features/appointments/AppointmentsManager';
import SeoManager from './features/seo/SeoManager';
import AnalyticsManager from './features/analytics/AnalyticsManager';
import TeamManager from './features/team/TeamManager';
import MaintenanceManager from './features/maintenance/MaintenanceManager';
import { SecuritySettings, BackupSettings, LicenseSettings, LegalSettings } from './features/config/ConfigScreens';
import HelpCenter from './features/help/HelpCenter';

import { Toaster } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Compass, LayoutGrid, FileText, ImageIcon, Palette, 
  ShoppingBag, Eye, User as UserIcon, LogOut, ChevronLeft, 
  ChevronRight, Search, ShieldCheck, HelpCircle, Command,
  Sparkles, FolderHeart, Layers, Newspaper, BookOpen,
  Inbox, Calendar, Globe, TrendingUp, Users, Settings,
  Lock, Database, Award, Scale, Hammer, MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

// ========================================================
// COMMAND MENU (⌘K)
// ========================================================
interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

function CommandMenu({ isOpen, onClose, onNavigate }: CommandMenuProps) {
  const [query, setQuery] = useState('');

  const commands = [
    { label: 'Ir al Dashboard', route: '/dashboard', icon: <LayoutGrid size={14} />, desc: 'Estadísticas, vista previa y actividad' },
    { label: 'Editar Contenido Web', route: '/content', icon: <FileText size={14} />, desc: 'Textos, fotos de portada, biografía, contacto...' },
    { label: 'Organizar Páginas y Secciones', route: '/pages', icon: <Compass size={14} />, desc: 'Visibilidad de enlaces y orden visual' },
    { label: 'Biblioteca de Medios', route: '/assets', icon: <ImageIcon size={14} />, desc: 'Subir imágenes de esculturas y taller' },
    { label: 'Diseños y Themes', route: '/themes', icon: <Palette size={14} />, desc: 'Elegir temas estéticos e interactivos' },
    { label: 'Marketplace de Prisma', route: '/marketplace', icon: <ShoppingBag size={14} />, desc: 'Instalar complementos y componentes' },
    { label: 'Vista Previa Completa', route: '/web', icon: <Eye size={14} />, desc: 'Inspeccionar portal público en múltiples dispositivos' },
    { label: 'Mi Perfil y Look del Panel', route: '/account', icon: <UserIcon size={14} />, desc: 'Configurar email, contraseña y colores del panel' }
  ];

  const filtered = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase()) || 
    c.desc.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleRunCommand = (route: string) => {
    onNavigate(route);
    onClose();
    setQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-muted/40 flex flex-row items-center gap-2">
          <Command size={16} className="text-muted-foreground shrink-0" />
          <Input 
            placeholder="Escribe un comando o navega..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-none bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto shrink text-xs"
            autoFocus
          />
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-xs">
              No se encontraron comandos coincidentes.
            </div>
          ) : (
            filtered.map(c => (
              <div
                key={c.route}
                onClick={() => handleRunCommand(c.route)}
                className="p-3 hover:bg-muted rounded-lg flex items-center justify-between cursor-pointer text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-background border rounded text-muted-foreground">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold">{c.label}</p>
                    <p className="text-[10px] text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
                <kbd className="text-[9px] bg-muted px-1.5 py-0.5 rounded border text-muted-foreground font-mono">
                  Enter
                </kbd>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ========================================================
// CORE MASTER LAYOUT WITH SIDEBAR AND MAIN WRAPPER
// ========================================================
function MasterLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  // Unread Inbox count and Maintenance state managers
  const [unreadInboxCount, setUnreadInboxCount] = useState(0);
  const [isMaintenanceOn, setIsMaintenanceOn] = useState(false);

  const updateUnreadCount = () => {
    try {
      const saved = sessionStorage.getItem('prisma_inbox_messages');
      if (saved) {
        const msgs = JSON.parse(saved);
        const count = msgs.filter((m: any) => m.unread && !m.archived).length;
        setUnreadInboxCount(count);
      } else {
        setUnreadInboxCount(2); // Initial Elena & Carlos unread
      }
    } catch {
      setUnreadInboxCount(2);
    }
  };

  const checkMaintenance = () => {
    try {
      const saved = sessionStorage.getItem('prisma_maintenance_mode');
      if (saved) {
        const conf = JSON.parse(saved);
        setIsMaintenanceOn(conf.active);
      } else {
        setIsMaintenanceOn(false);
      }
    } catch {
      setIsMaintenanceOn(false);
    }
  };

  useEffect(() => {
    updateUnreadCount();
    checkMaintenance();

    window.addEventListener('inbox-updated', updateUnreadCount);
    window.addEventListener('maintenance-updated', checkMaintenance);
    return () => {
      window.removeEventListener('inbox-updated', updateUnreadCount);
      window.removeEventListener('maintenance-updated', checkMaintenance);
    };
  }, []);

  // Keyboard shortcut listener for ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuGroups = [
    {
      title: 'Principal',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutGrid size={16} /> },
        { label: 'Marketplace', path: '/marketplace', icon: <ShoppingBag size={16} /> },
        { label: 'Vista Previa Web', path: '/web', icon: <Eye size={16} /> }
      ]
    },
    {
      title: 'Contenido',
      items: [
        { label: 'Contenido web', path: '/content', icon: <FileText size={16} /> },
        { label: 'Páginas', path: '/pages', icon: <Compass size={16} /> },
        { label: 'Biblioteca', path: '/assets', icon: <ImageIcon size={16} /> },
        { label: 'Obras', path: '/works', icon: <Sparkles size={16} /> },
        { label: 'Álbumes', path: '/albums', icon: <FolderHeart size={16} /> },
        { label: 'Categorías', path: '/categories', icon: <Layers size={16} /> },
        { label: 'Prensa', path: '/press', icon: <Newspaper size={16} /> },
        { label: 'Blog', path: '/blog', icon: <BookOpen size={16} /> },
        { label: 'Secciones', path: '/section-library', icon: <LayoutGrid size={16} /> }
      ]
    },
    {
      title: 'Comunicación',
      items: [
        { label: 'Bandeja de Entrada', path: '/inbox', icon: <Inbox size={16} /> },
        { label: 'Cita Previa', path: '/appointments', icon: <Calendar size={16} /> }
      ]
    },
    {
      title: 'Marketing & IA',
      items: [
        { label: 'Posicionamiento SEO', path: '/seo', icon: <Globe size={16} /> },
        { label: 'Analíticas', path: '/analytics', icon: <TrendingUp size={16} /> }
      ]
    },
    {
      title: 'Marca',
      items: [
        { label: 'Identidad / Branding', path: '/branding', icon: <Palette size={16} /> }
      ]
    },
    {
      title: 'Diseño',
      items: [
        { label: 'Diseños / Themes', path: '/themes', icon: <Palette size={16} /> }
      ]
    },
    {
      title: 'Configuración',
      items: [
        { label: 'Equipo & Permisos', path: '/team', icon: <Users size={16} /> },
        { label: 'Modo Mantenimiento', path: '/maintenance', icon: <Hammer size={16} /> },
        { label: 'Seguridad', path: '/security', icon: <Lock size={16} /> },
        { label: 'Copias de Seguridad', path: '/backups', icon: <Database size={16} /> },
        { label: 'Suscripción / Licencia', path: '/license', icon: <Award size={16} /> },
        { label: 'Textos Legales', path: '/legal', icon: <Scale size={16} /> }
      ]
    },
    {
      title: 'Soporte',
      items: [
        { label: 'Centro de Ayuda', path: '/help', icon: <HelpCircle size={16} /> }
      ]
    }
  ];

  // Dynamically compute breadcrumbs
  const getBreadcrumbs = () => {
    const p = location.pathname;
    if (p === '/dashboard') return [{ label: 'Principal', active: false }, { label: 'Dashboard', active: true }];
    if (p === '/marketplace') return [{ label: 'Principal', active: false }, { label: 'Marketplace', active: true }];
    if (p === '/web') return [{ label: 'Principal', active: false }, { label: 'Vista Previa Web', active: true }];
    if (p === '/content') return [{ label: 'Contenido', active: false }, { label: 'Contenido web', active: true }];
    if (p === '/pages') return [{ label: 'Contenido', active: false }, { label: 'Páginas', active: true }];
    if (p === '/assets') return [{ label: 'Contenido', active: false }, { label: 'Biblioteca', active: true }];
    if (p === '/works') return [{ label: 'Contenido', active: false }, { label: 'Obras', active: true }];
    if (p.startsWith('/works/')) return [{ label: 'Contenido', active: false }, { label: 'Obras', active: false }, { label: 'Detalle de Obra', active: true }];
    if (p === '/albums') return [{ label: 'Contenido', active: false }, { label: 'Álbumes', active: true }];
    if (p === '/categories') return [{ label: 'Contenido', active: false }, { label: 'Categorías', active: true }];
    if (p === '/press') return [{ label: 'Contenido', active: false }, { label: 'Prensa', active: true }];
    if (p.startsWith('/press/')) return [{ label: 'Contenido', active: false }, { label: 'Prensa', active: false }, { label: 'Detalle de Prensa', active: true }];
    if (p === '/blog') return [{ label: 'Contenido', active: false }, { label: 'Blog', active: true }];
    if (p.startsWith('/blog/editor/')) return [{ label: 'Contenido', active: false }, { label: 'Blog', active: false }, { label: 'Editor de Blog', active: true }];
    if (p === '/section-library') return [{ label: 'Contenido', active: false }, { label: 'Secciones', active: true }];
    if (p === '/branding') return [{ label: 'Marca', active: false }, { label: 'Identidad / Branding', active: true }];
    if (p === '/themes') return [{ label: 'Diseño', active: false }, { label: 'Diseños / Themes', active: true }];
    if (p === '/account') return [{ label: 'Configuración', active: false }, { label: 'Mi Perfil', active: true }];
    
    // NEW BREADCRUMBS
    if (p === '/inbox' || p.startsWith('/inbox/')) return [{ label: 'Comunicación', active: false }, { label: 'Bandeja de Entrada', active: true }];
    if (p === '/appointments') return [{ label: 'Comunicación', active: false }, { label: 'Cita Previa', active: true }];
    if (p === '/seo') return [{ label: 'Marketing & IA', active: false }, { label: 'Posicionamiento SEO', active: true }];
    if (p === '/analytics') return [{ label: 'Marketing & IA', active: false }, { label: 'Analíticas de Tráfico', active: true }];
    if (p === '/team') return [{ label: 'Configuración', active: false }, { label: 'Equipo & Permisos', active: true }];
    if (p === '/maintenance') return [{ label: 'Configuración', active: false }, { label: 'Modo Mantenimiento', active: true }];
    if (p === '/security') return [{ label: 'Configuración', active: false }, { label: 'Seguridad', active: true }];
    if (p === '/backups') return [{ label: 'Configuración', active: false }, { label: 'Copias de Seguridad', active: true }];
    if (p === '/license') return [{ label: 'Configuración', active: false }, { label: 'Suscripción / Licencia', active: true }];
    if (p === '/legal') return [{ label: 'Configuración', active: false }, { label: 'Textos Legales', active: true }];
    if (p === '/help') return [{ label: 'Soporte', active: false }, { label: 'Centro de Ayuda', active: true }];
    
    return [{ label: 'Prisma Studio', active: true }];
  };

  const activePath = location.pathname;

  return (
    <div className="h-screen flex overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-foreground transition-colors font-sans antialiased">
      
      {/* SIDEBAR */}
      <aside 
        className={`bg-background border-r flex flex-col justify-between shrink-0 relative transition-all duration-300 z-20 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* LOGO AREA */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              {/* Layered translucent shapes creating a 3D glassmorphic prism */}
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 rounded-lg rotate-12 opacity-80 blur-[0.5px] animate-pulse" />
              <div className="absolute inset-0.5 bg-background rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 rounded-md rotate-45 flex items-center justify-center text-[9px] font-black text-white shadow-inner">
                  <span className="rotate-[-45deg] scale-90">▲</span>
                </div>
              </div>
            </div>
            {!isCollapsed && (
              <span className="font-black text-sm tracking-tight truncate bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">Prisma Studio</span>
            )}
          </div>
        </div>

        {/* TOGGLE CIRCULAR FLOTANTE IN SIDEBAR BORDER */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-[-12px] top-12 w-6 h-6 rounded-full border bg-background shadow-md flex items-center justify-center hover:bg-muted text-muted-foreground z-30 transition-transform"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* NAVIGATION MENUS */}
        <div className="grow py-4 px-3 space-y-6 overflow-y-auto">
          {/* SEARCH TRIGGER */}
          <div 
            onClick={() => setIsCmdOpen(true)}
            className={`flex items-center border rounded-lg p-2 text-muted-foreground hover:bg-muted cursor-pointer transition-colors ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search size={14} />
              {!isCollapsed && <span className="text-xs">Buscar comando...</span>}
            </div>
            {!isCollapsed && (
              <kbd className="text-[10px] bg-zinc-100 dark:bg-zinc-800 border px-1 py-0.5 rounded font-mono">⌘K</kbd>
            )}
          </div>

          {/* GROUPS */}
          {menuGroups.map((group, i) => (
            <div key={i} className="space-y-1 text-left">
              {!isCollapsed && (
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3">
                  {group.title}
                </span>
              )}
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const isActive = activePath === item.path || (item.path === '/inbox' && activePath.startsWith('/inbox/'));
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="shrink-0">{item.icon}</div>
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!isCollapsed && item.path === '/inbox' && unreadInboxCount > 0 && (
                        <span className={`font-extrabold text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ${
                          isActive 
                            ? 'bg-white text-primary' 
                            : 'bg-amber-500 text-white dark:bg-amber-600'
                        }`}>
                          {unreadInboxCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER SIDEBAR (LICENSE & USER SETTINGS) */}
        <div className="p-3 border-t bg-muted/20 space-y-2">
          {/* LICENSE BADGE (Only expanded) */}
          {!isCollapsed && (
            <div className="p-2.5 border rounded-lg bg-background flex items-center gap-2 text-left hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => navigate('/marketplace')}>
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold truncate leading-none">Licencia Activa</p>
                <p className="text-[9px] text-muted-foreground truncate leading-none mt-1">Prisma Soberano Pro</p>
              </div>
            </div>
          )}

          {/* MY PROFILE */}
          <button
            onClick={() => navigate('/account')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${
              isCollapsed ? 'justify-center' : 'text-left'
            }`}
          >
            <UserIcon size={16} />
            {!isCollapsed && <span className="truncate">Mi Perfil</span>}
          </button>

          {/* LOG OUT */}
          <button
            onClick={() => {
              if (confirm('¿Deseas cerrar tu sesión de Prisma Studio? El token se limpiará de la memoria de sesión.')) {
                logout();
                toast.success('Sesión finalizada correctamente.');
              }
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50/50 hover:text-rose-600 transition-all ${
              isCollapsed ? 'justify-center' : 'text-left'
            }`}
          >
            <LogOut size={16} />
            {!isCollapsed && <span className="truncate">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* CONTENT WRAPPER */}
      <div className="grow flex flex-col min-w-0">
        
        {/* SUBHEADER: BREADCRUMBS & CONTEXT */}
        <header className="px-6 py-3 border-b bg-background flex items-center justify-between shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="text-muted-foreground cursor-pointer hover:underline" onClick={() => navigate('/dashboard')}>
              Prisma
            </span>
            {getBreadcrumbs().map((crumb, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-muted-foreground/50">/</span>
                <span className={crumb.active ? 'text-foreground font-bold' : 'text-muted-foreground hover:underline cursor-pointer'} onClick={() => !crumb.active && crumb.label === 'Principal' && navigate('/dashboard')}>
                  {crumb.label}
                </span>
              </div>
            ))}
          </div>

          {/* Right side help info */}
          <div className="flex items-center gap-4 text-xs">
            <Badge variant="outline" className="hidden sm:flex gap-1.5 items-center font-bold px-2 py-0.5 bg-muted/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Soberano
            </Badge>
            <div className="text-muted-foreground flex items-center gap-1">
              <HelpCircle size={14} />
              <span className="hidden md:inline">¿Necesitas ayuda?</span>
            </div>
          </div>
        </header>

        {/* MAINTAINANCE WARNING BANNER FOR PANEL */}
        {isMaintenanceOn && (
          <div className="bg-amber-500 text-white font-bold text-center py-1.5 px-4 text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 select-none shrink-0 animate-pulse">
            <Hammer size={12} />
            <span>Aviso: Modo Mantenimiento Activo. Los visitantes verán la pantalla de cortesía 503.</span>
          </div>
        )}

        {/* MAIN BODY AREA */}
        <main className="grow p-6 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-950/10">
          <Routes>
            <Route path="/dashboard" element={<Dashboard onNavigate={navigate} />} />
            <Route path="/content" element={<ContentEditor />} />
            <Route path="/pages" element={<PagesManager />} />
            <Route path="/themes" element={<ThemesGallery />} />
            <Route path="/assets" element={<AssetLibrary />} />
            <Route path="/works" element={<WorksManager />} />
            <Route path="/works/:id" element={<WorkDetail />} />
            <Route path="/albums" element={<AlbumsManager />} />
            <Route path="/categories" element={<CategoriesManager />} />
            <Route path="/section-library" element={<SectionLibrary />} />
            <Route path="/press" element={<PressManager />} />
            <Route path="/press/:id" element={<PressDetail />} />
            <Route path="/blog" element={<BlogManager />} />
            <Route path="/blog/editor/:id" element={<BlogEditor />} />
            <Route path="/branding" element={<BrandingManager />} />
            <Route path="/web" element={<FullPreview />} />
            <Route path="/account" element={<ProfileSettings />} />
            <Route path="/marketplace" element={<Marketplace />} />
            
            {/* NEW AMPLIFIED ROUTES */}
            <Route path="/inbox" element={<InboxManager />} />
            <Route path="/inbox/:id" element={<InboxManager />} />
            <Route path="/appointments" element={<AppointmentsManager />} />
            <Route path="/seo" element={<SeoManager />} />
            <Route path="/analytics" element={<AnalyticsManager />} />
            <Route path="/team" element={<TeamManager />} />
            <Route path="/maintenance" element={<MaintenanceManager />} />
            <Route path="/security" element={<SecuritySettings />} />
            <Route path="/backups" element={<BackupSettings />} />
            <Route path="/license" element={<LicenseSettings />} />
            <Route path="/legal" element={<LegalSettings />} />
            <Route path="/help" element={<HelpCenter />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* COMMAND MENU COMPONENT */}
      <CommandMenu 
        isOpen={isCmdOpen} 
        onClose={() => setIsCmdOpen(false)} 
        onNavigate={navigate} 
      />
    </div>
  );
}

// ========================================================
// RE-ROUTE ROOT COMPONENT TO AUTH GUARD
// ========================================================
function AuthGuard() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>;
  }

  return <MasterLayout />;
}

// ========================================================
// CORE EXPORTED APP WRAPPER WITH ALL PROVIDERS
// ========================================================
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <PublicThemeProvider>
            <ModuleProvider>
              <AuthGuard />
              <Toaster position="top-right" closeButton richColors />
            </ModuleProvider>
          </PublicThemeProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
