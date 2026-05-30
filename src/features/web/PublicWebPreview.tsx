import { useState, useMemo } from 'react';
import type { ContentModule, Page, Section, PublicTheme, Work } from '../../lib/types';
import { mockWorks } from '../../lib/data/mockData';
import { Sparkles, Phone, Mail, MapPin, Instagram, Youtube, Award, ExternalLink, Calendar } from 'lucide-react';

interface PublicWebPreviewProps {
  theme: PublicTheme | null;
  modules: ContentModule[];
  sections: Section[];
  currentPageId?: string; // If provided, shows sections for this page. Otherwise shows Home page.
}

export function PublicWebPreview({ theme, modules, sections, currentPageId = 'page-1' }: PublicWebPreviewProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string>('Todos');

  // Convert modules list to a lookup map for easy field retrieval
  const modulesMap = useMemo(() => {
    const map = new Map<string, ContentModule>();
    modules.forEach(m => map.set(m.key, m));
    return map;
  }, [modules]);

  if (!theme) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground bg-muted rounded-lg">
        Cargando diseño...
      </div>
    );
  }

  // Get active layout presets from the theme
  const getPreset = (sectionType: string) => {
    return theme.presetMap[sectionType] || 'default';
  };

  // Extract helper for reading field values
  const getFieldVal = (moduleKey: string, fieldKey: string, fallback: any) => {
    const m = modulesMap.get(moduleKey);
    if (!m) return fallback;
    const f = m.fields.find(field => field.key === fieldKey);
    return f !== undefined ? f.value : fallback;
  };

  // Extract list items from a module
  const getModuleItems = (moduleKey: string, fallback: any[]) => {
    const m = modulesMap.get(moduleKey);
    return m?.items || fallback;
  };

  // Custom styles driven by theme tokens
  const webStyle = {
    backgroundColor: theme.tokens['bg'] || '#FAF9F6',
    color: theme.tokens['fg'] || '#1A1A1A',
    fontFamily: theme.tokens['fontFamily'] || 'Geist, sans-serif',
    '--theme-primary': theme.tokens['primary'] || '#2B2B2B',
    '--theme-accent': theme.tokens['accent'] || '#9A847C',
    '--theme-border': theme.tokens['border'] || '#E5E4E2',
    '--theme-radius': theme.tokens['radius'] || '4px',
  } as React.CSSProperties;

  // Let's filter works
  const filteredWorks = mockWorks.filter(w => {
    if (selectedMaterial === 'Todos') return true;
    return w.category === selectedMaterial;
  });

  return (
    <div 
      className="w-full min-h-screen text-left transition-all duration-300 border shadow-2xl relative" 
      style={webStyle}
    >
      {/* HEADER / CABECERA */}
      <header 
        className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b backdrop-blur-md bg-opacity-90"
        style={{ borderColor: 'var(--theme-border)', backgroundColor: `${theme.tokens['bg']}dd` }}
      >
        <span 
          className="text-lg font-bold tracking-wider"
          style={{ color: 'var(--theme-primary)' }}
        >
          {getFieldVal('cabecera', 'brand', 'Antonio Carballo')}
        </span>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <span className="cursor-pointer hover:underline" style={{ color: 'var(--theme-primary)' }}>
            {getFieldVal('cabecera', 'link1', 'Inicio')}
          </span>
          <span className="cursor-pointer hover:underline opacity-80">
            {getFieldVal('cabecera', 'link2', 'Sobre Mí')}
          </span>
          <span className="cursor-pointer hover:underline opacity-80">
            {getFieldVal('cabecera', 'link3', 'El Portfolio')}
          </span>
          <span className="cursor-pointer hover:underline opacity-80">
            {getFieldVal('cabecera', 'link4', 'Exposiciones')}
          </span>
          <span className="cursor-pointer hover:underline opacity-80">
            {getFieldVal('cabecera', 'link5', 'Contacto')}
          </span>
        </nav>
      </header>

      {/* BODY CON SECCIONES MAPEADAS */}
      <main className="space-y-16 pb-24">
        {sections
          .filter(s => s.active)
          .map((sec, index) => {
            const preset = getPreset(sec.type);

            // ==========================================
            // HERO SECTION
            // ==========================================
            if (sec.type === 'hero') {
              const title = getFieldVal('hero', 'title', 'Antonio Carballo');
              const subtitle = getFieldVal('hero', 'subtitle', 'Escultor');
              const ctaText = getFieldVal('hero', 'cta_text', 'Ver Obras');
              const bgImg = getFieldVal('hero', 'bg_image', '');

              if (preset === 'hero-split') {
                return (
                  <section 
                    key={sec.id} 
                    className="grid grid-cols-1 md:grid-cols-2 min-h-[550px] items-center gap-8 px-8 md:px-16 py-12"
                  >
                    <div className="space-y-6">
                      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        {title}
                      </h1>
                      <p className="text-lg opacity-80 leading-relaxed max-w-xl">
                        {subtitle}
                      </p>
                      <button 
                        className="px-6 py-3 font-semibold text-white tracking-wide transition-all"
                        style={{ 
                          backgroundColor: 'var(--theme-primary)', 
                          borderRadius: 'var(--theme-radius)' 
                        }}
                      >
                        {ctaText}
                      </button>
                    </div>
                    {bgImg && (
                      <div className="w-full h-[400px] overflow-hidden shadow-lg border" style={{ borderRadius: 'var(--theme-radius)', borderColor: 'var(--theme-border)' }}>
                        <img 
                          src={bgImg} 
                          alt="Escultura" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                        />
                      </div>
                    )}
                  </section>
                );
              }

              if (preset === 'hero-centered') {
                return (
                  <section 
                    key={sec.id} 
                    className="relative min-h-[600px] flex items-center justify-center text-center px-6 py-20 bg-cover bg-center"
                    style={{ backgroundImage: bgImg ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImg})` : 'none' }}
                  >
                    <div className="max-w-3xl space-y-6 text-white z-10">
                      <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight leading-none text-white">
                        {title}
                      </h1>
                      <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                        {subtitle}
                      </p>
                      <button 
                        className="px-8 py-3 text-sm font-semibold tracking-widest uppercase transition-all shadow-md"
                        style={{ 
                          backgroundColor: 'var(--theme-accent)', 
                          color: '#fff',
                          borderRadius: 'var(--theme-radius)' 
                        }}
                      >
                        {ctaText}
                      </button>
                    </div>
                  </section>
                );
              }

              // Default: hero-minimal
              return (
                <section key={sec.id} className="py-20 px-8 md:px-24 max-w-4xl space-y-8">
                  <h1 className="text-4xl md:text-5xl font-mono tracking-tighter uppercase font-light">
                    {title}
                  </h1>
                  <p className="text-lg md:text-xl border-l-2 pl-6 leading-loose opacity-70" style={{ borderColor: 'var(--theme-primary)' }}>
                    {subtitle}
                  </p>
                  <button 
                    className="px-6 py-2 border-b-2 hover:border-b-4 transition-all"
                    style={{ borderColor: 'var(--theme-primary)' }}
                  >
                    {ctaText} →
                  </button>
                </section>
              );
            }

            // ==========================================
            // ABOUT SECTION
            // ==========================================
            if (sec.type === 'about') {
              const title = getFieldVal('biografia', 'section_title', 'Sobre Mí');
              const p1 = getFieldVal('biografia', 'paragraph1', '');
              const p2 = getFieldVal('biografia', 'paragraph2', '');
              const photo = getFieldVal('biografia', 'author_photo', '');
              const signature = getFieldVal('biografia', 'signature_text', '');

              if (preset === 'about-asymmetric') {
                return (
                  <section key={sec.id} className="px-8 md:px-16 py-12 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      <div className="md:col-span-7 space-y-6">
                        <span className="text-xs uppercase tracking-widest opacity-60">Proceso Creativo</span>
                        <h2 className="text-3xl font-bold">{title}</h2>
                        <p className="opacity-80 leading-relaxed">{p1}</p>
                        <p className="opacity-80 leading-relaxed">{p2}</p>
                        {signature && <p className="font-serif italic text-lg" style={{ color: 'var(--theme-accent)' }}>— {signature}</p>}
                      </div>
                      <div className="md:col-span-5 grid grid-cols-2 gap-4">
                        <div className="h-64 overflow-hidden shadow-md" style={{ borderRadius: 'var(--theme-radius)' }}>
                          <img src={photo || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400'} alt="Taller" className="w-full h-full object-cover" />
                        </div>
                        <div className="h-64 overflow-hidden shadow-md mt-6" style={{ borderRadius: 'var(--theme-radius)' }}>
                          <img src={getFieldVal('taller', 'studio_image', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400')} alt="Mármol" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                  </section>
                );
              }

              // Default: about-classic
              return (
                <section key={sec.id} className="px-8 md:px-16 py-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  {photo && (
                    <div className="w-full h-[450px] overflow-hidden shadow-xl border" style={{ borderRadius: 'var(--theme-radius)', borderColor: 'var(--theme-border)' }}>
                      <img src={photo} alt="Antonio" className="w-full h-full object-cover grayscale contrast-110" />
                    </div>
                  )}
                  <div className="space-y-6">
                    <h2 className="text-3xl font-serif font-semibold">{title}</h2>
                    <div className="w-16 h-1" style={{ backgroundColor: 'var(--theme-primary)' }} />
                    <p className="opacity-85 leading-relaxed text-sm md:text-base">{p1}</p>
                    <p className="opacity-85 leading-relaxed text-sm md:text-base">{p2}</p>
                    {signature && <p className="font-serif text-xl italic tracking-wider pt-4">{signature}</p>}
                  </div>
                </section>
              );
            }

            // ==========================================
            // GALLERY / PORTFOLIO SECTION
            // ==========================================
            if (sec.type === 'gallery') {
              const title = getFieldVal('galeria_obras', 'title', 'Esculturas');
              const showFilters = getFieldVal('galeria_obras', 'show_filters', true);
              const showPrices = getFieldVal('galeria_obras', 'show_prices', false);
              const inquiryText = getFieldVal('galeria_obras', 'inquiry_text', 'Consultar');

              const materials = ['Todos', 'Bronce', 'Mármol', 'Madera', 'Modelados'];

              if (preset === 'gallery-masonry') {
                return (
                  <section key={sec.id} className="px-8 md:px-16 py-12 space-y-8">
                    <div className="text-center max-w-2xl mx-auto space-y-4">
                      <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
                      <div className="h-0.5 w-12 mx-auto" style={{ backgroundColor: 'var(--theme-accent)' }} />
                    </div>

                    {showFilters && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {materials.map(m => (
                          <button
                            key={m}
                            onClick={() => setSelectedMaterial(m)}
                            className="px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all"
                            style={{
                              backgroundColor: selectedMaterial === m ? 'var(--theme-primary)' : 'transparent',
                              color: selectedMaterial === m ? '#fff' : 'var(--theme-primary)',
                              border: '1px solid var(--theme-border)',
                              borderRadius: 'var(--theme-radius)'
                            }}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                      {filteredWorks.slice(0, 12).map((work) => (
                        <div 
                          key={work.id} 
                          className="break-inside-avoid bg-opacity-20 border p-4 space-y-4 shadow-sm"
                          style={{ 
                            borderRadius: 'var(--theme-radius)', 
                            borderColor: 'var(--theme-border)',
                            backgroundColor: `${theme.tokens['bg']}55`
                          }}
                        >
                          <div className="overflow-hidden" style={{ borderRadius: 'var(--theme-radius)' }}>
                            <img src={work.images[0]} alt={work.title} className="w-full h-auto object-cover hover:scale-102 transition-transform duration-500" />
                          </div>
                          <div className="space-y-1 text-left">
                            <h3 className="font-bold text-base">{work.title}</h3>
                            <p className="text-xs opacity-60">{work.materials} • {work.dimensions}</p>
                            <p className="text-xs font-semibold" style={{ color: 'var(--theme-accent)' }}>Año {work.year}</p>
                            {showPrices && (
                              <p className="text-sm font-bold mt-2">
                                {(work.priceCents / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              if (preset === 'gallery-editorial') {
                return (
                  <section key={sec.id} className="px-8 md:px-16 py-12 space-y-12">
                    <div>
                      <h2 className="text-4xl font-serif tracking-tight font-medium border-b pb-4" style={{ borderColor: 'var(--theme-border)' }}>
                        {title}
                      </h2>
                    </div>

                    <div className="space-y-16">
                      {filteredWorks.slice(0, 4).map((work, idx) => (
                        <div 
                          key={work.id} 
                          className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
                        >
                          <div className="w-full md:w-1/2 h-[350px] overflow-hidden" style={{ borderRadius: 'var(--theme-radius)' }}>
                            <img src={work.images[0]} alt={work.title} className="w-full h-full object-cover grayscale" />
                          </div>
                          <div className="w-full md:w-1/2 space-y-4">
                            <span className="text-xs tracking-widest uppercase opacity-50">{work.category}</span>
                            <h3 className="text-2xl font-serif font-bold">{work.title}</h3>
                            <p className="text-sm opacity-80 leading-relaxed border-l-2 pl-4" style={{ borderColor: 'var(--theme-accent)' }}>
                              Ficha técnica: {work.materials}. Moldeado completamente de forma artesanal. Dimensiones {work.dimensions}. Año de creación {work.year}.
                            </p>
                            {showPrices && (
                              <p className="text-lg font-serif">
                                {(work.priceCents / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                              </p>
                            )}
                            <button 
                              className="px-4 py-2 border hover:bg-black hover:text-white transition-all text-xs uppercase tracking-widest"
                              style={{ borderColor: 'var(--theme-primary)', borderRadius: 'var(--theme-radius)' }}
                            >
                              {inquiryText}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              // Default: gallery-grid
              return (
                <section key={sec.id} className="px-8 md:px-16 py-12 space-y-8">
                  <div className="text-left space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                    <p className="text-xs opacity-60">Exploración de la tridimensionalidad contemporánea.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {filteredWorks.slice(0, 6).map((work) => (
                      <div 
                        key={work.id} 
                        className="group border overflow-hidden shadow-sm"
                        style={{ borderRadius: 'var(--theme-radius)', borderColor: 'var(--theme-border)' }}
                      >
                        <div className="h-64 overflow-hidden relative">
                          <img src={work.images[0]} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          {work.featured && (
                            <span 
                              className="absolute top-2 right-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 text-white"
                              style={{ backgroundColor: 'var(--theme-accent)' }}
                            >
                              Destacada
                            </span>
                          )}
                        </div>
                        <div className="p-4 space-y-2">
                          <h3 className="font-bold text-sm tracking-tight">{work.title}</h3>
                          <p className="text-xs opacity-75">{work.materials}</p>
                          <p className="text-xs opacity-50">{work.dimensions}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            // ==========================================
            // EXHIBITIONS SECTION
            // ==========================================
            if (sec.type === 'exhibitions') {
              const title = getFieldVal('exposiciones', 'title', 'Exposiciones');
              const subtitle = getFieldVal('exposiciones', 'subtitle', '');
              const items = getModuleItems('exposiciones', []);

              if (preset === 'exhibitions-cards') {
                return (
                  <section key={sec.id} className="px-8 md:px-16 py-12 space-y-8">
                    <div className="space-y-2 text-center md:text-left">
                      <h2 className="text-3xl font-bold">{title}</h2>
                      {subtitle && <p className="text-sm opacity-60 max-w-xl">{subtitle}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {items.map((item: any, i: number) => (
                        <div 
                          key={item.id || i} 
                          className="p-6 border flex flex-col justify-between"
                          style={{ borderRadius: 'var(--theme-radius)', borderColor: 'var(--theme-border)' }}
                        >
                          <div className="space-y-4">
                            <span className="text-xs tracking-wider uppercase opacity-50">{item.date}</span>
                            <h3 className="text-xl font-serif font-bold">{item.title}</h3>
                            <p className="text-sm opacity-85 flex items-center gap-1">
                              <MapPin size={14} className="opacity-60" /> {item.place}
                            </p>
                          </div>
                          {item.active && (
                            <div className="mt-6 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Activa actualmente</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              // Default: exhibitions-timeline
              return (
                <section key={sec.id} className="px-8 md:px-16 py-12 space-y-8 max-w-4xl mx-auto">
                  <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-serif font-semibold">{title}</h2>
                    {subtitle && <p className="text-xs opacity-60 max-w-md mx-auto">{subtitle}</p>}
                  </div>
                  <div className="relative border-l pl-8 space-y-12" style={{ borderColor: 'var(--theme-border)' }}>
                    {items.map((item: any, i: number) => (
                      <div key={item.id || i} className="relative">
                        <div 
                          className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full border-2" 
                          style={{ 
                            borderColor: 'var(--theme-primary)', 
                            backgroundColor: item.active ? 'var(--theme-accent)' : 'var(--theme-bg)' 
                          }} 
                        />
                        <div className="space-y-2 text-left">
                          <span className="text-xs font-mono tracking-widest opacity-60">{item.date}</span>
                          <h3 className="text-lg font-bold">{item.title}</h3>
                          <p className="text-sm opacity-80 flex items-center gap-1.5">
                            <MapPin size={14} className="opacity-60" /> {item.place}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            // ==========================================
            // TIMELINE SECTION
            // ==========================================
            if (sec.type === 'timeline') {
              const title = getFieldVal('cronologia', 'title', 'Trayectoria');
              const items = getModuleItems('cronologia', []);

              return (
                <section key={sec.id} className="px-8 md:px-16 py-12 space-y-6 max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                  <div className="space-y-6">
                    {items.map((item: any, i: number) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b pb-4" style={{ borderColor: 'var(--theme-border)' }}>
                        <span className="text-lg font-mono font-bold" style={{ color: 'var(--theme-accent)' }}>{item.year}</span>
                        <p className="md:col-span-3 text-sm opacity-80 leading-relaxed">{item.milestone}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            // ==========================================
            // STUDIO / PROCESS SECTION
            // ==========================================
            if (sec.type === 'studio') {
              const title = getFieldVal('taller', 'title', 'El Taller');
              const desc = getFieldVal('taller', 'description', '');
              const img = getFieldVal('taller', 'studio_image', '');

              return (
                <section key={sec.id} className="px-8 md:px-16 py-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6 text-left">
                    <span className="text-xs tracking-widest uppercase font-semibold opacity-60">Espacio de Creación</span>
                    <h2 className="text-3xl font-bold">{title}</h2>
                    <p className="opacity-80 leading-relaxed text-sm md:text-base">{desc}</p>
                  </div>
                  {img && (
                    <div className="h-[350px] overflow-hidden shadow-lg" style={{ borderRadius: 'var(--theme-radius)' }}>
                      <img src={img} alt="Taller" className="w-full h-full object-cover hover:scale-102 transition-transform duration-500" />
                    </div>
                  )}
                </section>
              );
            }

            // ==========================================
            // CONTACT / FORM SECTION
            // ==========================================
            if (sec.type === 'contact') {
              const title = getFieldVal('contacto', 'title', 'Contacto');
              const subtitle = getFieldVal('contacto', 'subtitle', '');
              const phone = getFieldVal('contacto', 'phone_number', '');
              const email = getFieldVal('contacto', 'email_destination', '');

              return (
                <section key={sec.id} className="px-8 md:px-16 py-12 max-w-4xl mx-auto space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                    {subtitle && <p className="text-sm opacity-70 max-w-lg mx-auto">{subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 border" style={{ borderRadius: 'var(--theme-radius)', borderColor: 'var(--theme-border)' }}>
                        <div className="p-3 rounded-full bg-opacity-10 bg-black" style={{ backgroundColor: `${theme.tokens['primary']}15` }}>
                          <Mail size={20} style={{ color: 'var(--theme-primary)' }} />
                        </div>
                        <div>
                          <p className="text-xs opacity-60">Consultas Generales</p>
                          <p className="text-sm font-bold">{email}</p>
                        </div>
                      </div>
                      {phone && (
                        <div className="flex items-center gap-4 p-4 border" style={{ borderRadius: 'var(--theme-radius)', borderColor: 'var(--theme-border)' }}>
                          <div className="p-3 rounded-full bg-opacity-10 bg-black" style={{ backgroundColor: `${theme.tokens['primary']}15` }}>
                            <Phone size={20} style={{ color: 'var(--theme-primary)' }} />
                          </div>
                          <div>
                            <p className="text-xs opacity-60">Teléfono Directo</p>
                            <p className="text-sm font-bold">{phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <form className="space-y-4 text-left">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase opacity-60">Nombre</label>
                          <input type="text" placeholder="Tu nombre" className="w-full p-2.5 text-sm border focus:outline-none" style={{ borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)', backgroundColor: 'var(--theme-bg)' }} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase opacity-60">Email</label>
                          <input type="email" placeholder="Tu correo" className="w-full p-2.5 text-sm border focus:outline-none" style={{ borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)', backgroundColor: 'var(--theme-bg)' }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase opacity-60">Mensaje</label>
                        <textarea rows={4} placeholder="Describe el motivo de tu consulta..." className="w-full p-2.5 text-sm border focus:outline-none resize-none" style={{ borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)', backgroundColor: 'var(--theme-bg)' }} />
                      </div>
                      <button 
                        type="button" 
                        className="w-full py-3 text-white font-semibold uppercase tracking-wider text-xs"
                        style={{ backgroundColor: 'var(--theme-primary)', borderRadius: 'var(--theme-radius)' }}
                      >
                        Enviar Mensaje
                      </button>
                    </form>
                  </div>
                </section>
              );
            }

            // Return null or placeholder for unmapped types
            return (
              <div key={sec.id} className="text-center py-4 text-xs opacity-40 border-t border-dashed" style={{ borderColor: 'var(--theme-border)' }}>
                Sección: {sec.label} ({sec.type}) — Se muestra en la web real.
              </div>
            );
          })}
      </main>

      {/* FOOTER */}
      <footer 
        className="px-8 py-12 border-t flex flex-col md:flex-row justify-between items-center gap-6"
        style={{ borderColor: 'var(--theme-border)', backgroundColor: theme.tokens['bg'] }}
      >
        <div className="text-sm opacity-60 text-center md:text-left">
          <p>{getFieldVal('footer', 'copyright', '© 2026 Antonio Carballo. Todos los derechos reservados.')}</p>
          <p className="text-xs mt-1">{getFieldVal('footer', 'credit', 'Creado con PrismaEditor.')}</p>
        </div>
        <div className="flex gap-4">
          <Instagram size={18} className="opacity-60 cursor-pointer hover:opacity-100" />
          <Youtube size={18} className="opacity-60 cursor-pointer hover:opacity-100" />
        </div>
      </footer>
    </div>
  );
}
