import { useState, useEffect } from 'react';
import { mockApi } from '../../lib/mock-api';
import type { SiteBranding } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Sparkles, Palette, HelpCircle, Save, RefreshCw, 
  CheckCircle, Image as ImageIcon, Layout, Type, Laptop 
} from 'lucide-react';
import { toast } from 'sonner';

export default function BrandingManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Branding Form State
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [fontFamily, setFontFamily] = useState('Geist Variable, sans-serif');
  const [primaryColor, setPrimaryColor] = useState('#10B981');
  const [bgColor, setBgColor] = useState('#FAFAFA');

  useEffect(() => {
    const fetchBranding = async () => {
      setLoading(true);
      try {
        const brand = await mockApi.branding.get();
        if (brand) {
          setLogoUrl(brand.logoUrl);
          setFaviconUrl(brand.faviconUrl);
          setFontFamily(brand.fontFamily);
          setPrimaryColor(brand.primaryColor);
          setBgColor(brand.bgColor);
        }
      } catch {
        toast.error('Error al recuperar la identidad de marca.');
      } finally {
        setLoading(false);
      }
    };
    fetchBranding();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const t = toast.loading('Guardando configuración de identidad corporativa...');

    const updatedBranding: SiteBranding = {
      logoUrl,
      faviconUrl,
      fontFamily,
      primaryColor,
      bgColor
    };

    try {
      await mockApi.branding.save(updatedBranding);
      toast.dismiss(t);
      toast.success('Identidad de marca guardada y propagada al builder.');
      setSaving(false);
    } catch {
      toast.dismiss(t);
      toast.error('Error al guardar marca.');
      setSaving(false);
    }
  };

  // Presets of primary colors for artists
  const primaryColorPresets = [
    { name: 'Esmeralda', hex: '#10B981' },
    { name: 'Bronce Mate', hex: '#9A847C' },
    { name: 'Negro Carbón', hex: '#1A1A1A' },
    { name: 'Azul Lapislázuli', hex: '#2563EB' },
    { name: 'Rojo Barro', hex: '#C2410C' },
    { name: 'Oro Viejo', hex: '#D97706' },
  ];

  const bgColorPresets = [
    { name: 'Blanco Níveo', hex: '#FFFFFF' },
    { name: 'Piedra Suave', hex: '#FAFAF9' },
    { name: 'Gris Cemento', hex: '#F4F4F5' },
    { name: 'Carbono Oscuro', hex: '#121212' },
  ];

  // Font options
  const fontOptions = [
    { label: 'Geist Sans (Elegante, Técnico)', value: 'Geist Variable, sans-serif' },
    { label: 'Playfair Display (Editorial, Humano)', value: 'Playfair Display, serif' },
    { label: 'Georgia (Revista, Tradición)', value: 'Georgia, serif' },
    { label: 'Space Grotesk (Brutalismo, Mod)', value: 'Space Grotesk, sans-serif' },
  ];

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground text-xs space-y-3">
        <RefreshCw className="animate-spin mx-auto h-8 w-8 text-primary" />
        <p>Iniciando gestor de identidad corporativa...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Identidad y Marca (Branding)</h1>
          <p className="text-sm text-muted-foreground">
            Fija la firma de tu identidad (logotipo, colores base corporativos, tipografía central y favicon).
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-5 gap-8 text-left">
        {/* SETTINGS PANELS (3 COLS) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-background border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Palette size={16} className="text-primary" />
                Colores Base y Tipografía
              </CardTitle>
              <CardDescription className="text-xs">
                Establece la paleta elemental de tu firma para unificar la web pública.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* PRIMARY COLOR */}
              <div className="space-y-2">
                <Label className="text-xs font-bold">Color Primario (Detalles, botones y llamadas)</Label>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <Input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-10 p-0 border rounded-md cursor-pointer overflow-hidden"
                    />
                  </div>
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#10B981"
                    className="h-10 text-xs font-mono uppercase w-32"
                  />
                  
                  {/* Presets */}
                  <div className="flex flex-wrap gap-1.5 ml-2">
                    {primaryColorPresets.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setPrimaryColor(preset.hex)}
                        className="w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-800 transition-transform hover:scale-110 shadow-sm shrink-0"
                        style={{ backgroundColor: preset.hex }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* BACKGROUND COLOR */}
              <div className="space-y-2">
                <Label className="text-xs font-bold">Color de Fondo del Portal</Label>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <Input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 p-0 border rounded-md cursor-pointer overflow-hidden"
                    />
                  </div>
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#FAFAFA"
                    className="h-10 text-xs font-mono uppercase w-32"
                  />
                  
                  {/* Presets */}
                  <div className="flex flex-wrap gap-1.5 ml-2">
                    {bgColorPresets.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setBgColor(preset.hex)}
                        className="w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-800 transition-transform hover:scale-110 shadow-sm shrink-0"
                        style={{ backgroundColor: preset.hex }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* TYPOGRAPHY */}
              <div className="space-y-1.5">
                <Label htmlFor="fontSelector" className="text-xs font-bold flex items-center gap-1.5">
                  <Type size={14} className="text-muted-foreground" />
                  Tipografía Central
                </Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="h-10 text-xs">
                    <SelectValue placeholder="Selecciona tipografía" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ImageIcon size={16} className="text-primary" />
                Logotipo y Favicon de Firma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Logo URL */}
              <div className="space-y-1.5">
                <Label htmlFor="logoUrl" className="text-xs font-bold">URL del Isotipo / Logotipo</Label>
                <Input
                  id="logoUrl"
                  placeholder="https://images.unsplash.com/..."
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="h-10 text-xs font-mono"
                />
              </div>

              {/* Favicon URL */}
              <div className="space-y-1.5">
                <Label htmlFor="faviconUrl" className="text-xs font-bold">URL del Favicon de Navegador (32x32px)</Label>
                <Input
                  id="faviconUrl"
                  placeholder="https://images.unsplash.com/..."
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  className="h-10 text-xs font-mono"
                />
              </div>
            </CardContent>
          </Card>

          {/* CONCEPT SEPARATION NOTIFICATION */}
          <Card className="bg-amber-50/50 dark:bg-amber-950/15 border-amber-100 dark:border-amber-900/50 p-4">
            <div className="flex gap-3 text-left">
              <HelpCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs text-amber-900 dark:text-amber-300">¿Branding vs Theme?</h4>
                <p className="text-xs text-amber-950/70 dark:text-amber-200/70 leading-relaxed">
                  Es importante destacar que el <strong>Branding</strong> (esta pantalla) fija tu identidad inmutable (colores corporativos de tu firma y logotipo). El <strong>Theme</strong> determina la composición espacial, grillas visuales y layouts elegidos en tu web. Ambas capas se combinan en el portal de forma independiente.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* LIVE MOCKUP PREVIEW (2 COLS) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-background border-zinc-200 dark:border-zinc-800 sticky top-6">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Laptop size={14} className="text-primary" />
                Vista Previa del Portal de Antonio
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-muted/20">
              {/* Miniature Website Mockup */}
              <div 
                className="w-full rounded-xl border shadow-lg overflow-hidden flex flex-col text-left transition-all duration-300"
                style={{ 
                  backgroundColor: bgColor,
                  fontFamily: fontFamily,
                  color: bgColor === '#121212' ? '#F5F5F5' : '#1A1A1A'
                }}
              >
                {/* Micro Header */}
                <div 
                  className="px-4 py-3 border-b flex items-center justify-between text-xs"
                  style={{ borderColor: bgColor === '#121212' ? '#2C2C2C' : '#E5E4E2' }}
                >
                  <div className="flex items-center gap-2">
                    {logoUrl ? (
                      <img src={logoUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <span className="font-extrabold text-[10px]">A.C.</span>
                    )}
                    <span className="font-black text-[10px]">Antonio Carballo</span>
                  </div>
                  <div className="flex gap-2 text-[9px] font-bold opacity-75">
                    <span>Inicio</span>
                    <span>Obras</span>
                    <span>Contacto</span>
                  </div>
                </div>

                {/* Micro Hero body */}
                <div className="p-6 space-y-3.5 text-center">
                  <span 
                    className="text-[9px] uppercase tracking-widest font-black"
                    style={{ color: primaryColor }}
                  >
                    Escultor de Materia
                  </span>
                  
                  <h2 className="text-xl font-black tracking-tight leading-snug">
                    Antonio Carballo
                  </h2>
                  
                  <p className="text-[10px] leading-relaxed opacity-75 max-w-[220px] mx-auto">
                    Escultor de la materia y el vacío. Obras contemporáneas en bronce y mármol talladas con calma.
                  </p>

                  {/* Micro CTA Button */}
                  <div className="pt-2">
                    <button 
                      type="button" 
                      onClick={(e) => e.preventDefault()}
                      className="px-4 py-1.5 text-[9px] font-extrabold rounded text-white shadow-sm transition-transform hover:scale-105"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Explorar Obras
                    </button>
                  </div>
                </div>

                {/* Micro Footer */}
                <div 
                  className="p-3 border-t text-[8px] text-center opacity-60 mt-4"
                  style={{ borderColor: bgColor === '#121212' ? '#2C2C2C' : '#E5E4E2' }}
                >
                  © 2026 Antonio Carballo. Creado en Prisma.
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 text-center">
                Previsualización en vivo usando tu fuente corporativa y colores en tiempo real.
              </p>
            </CardContent>
          </Card>

          {/* SAVE ACTIONS */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="h-10 text-xs font-extrabold w-full shadow-md gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Guardar y Propagar Marca
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}