import { useState, useEffect } from 'react';
import { useModules } from '../../lib/contexts/ModuleContext';
import type { ContentModule, ContentField, Asset } from '../../lib/types';
import { mockApi } from '../../lib/mock-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Save, Info, ChevronDown, ChevronUp, Image as ImageIcon, 
  Plus, Trash2, ArrowUp, ArrowDown, HelpCircle, CheckCircle2 
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContentEditor() {
  const { modules, updateModuleFields } = useModules();
  const [expandedModuleKey, setExpandedModuleKey] = useState<string | null>('hero');
  const [editedFields, setExpandedFields] = useState<Record<string, any>>({});
  const [editedItems, setExpandedItems] = useState<Record<string, any[]>>({});
  const [dirtyModules, setDirtyModules] = useState<Record<string, boolean>>({});
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [activePickerField, setActivePickerField] = useState<{ moduleKey: string, fieldKey: string } | null>(null);

  useEffect(() => {
    // Cargar biblioteca para los selectores de fotos
    mockApi.assets.list().then(setAssets);
  }, []);

  // Inicializar estado local de edición al abrir un módulo
  const handleToggleExpand = (moduleKey: string) => {
    if (expandedModuleKey === moduleKey) {
      setExpandedModuleKey(null);
    } else {
      setExpandedModuleKey(moduleKey);
      const mod = modules.find(m => m.key === moduleKey);
      if (mod) {
        // Copiar campos a estado local
        const fieldState: Record<string, any> = {};
        mod.fields.forEach(f => {
          fieldState[f.key] = f.value;
        });
        setExpandedFields(prev => ({ ...prev, [moduleKey]: fieldState }));

        // Copiar items si existen
        if (mod.items) {
          setExpandedItems(prev => ({ ...prev, [moduleKey]: [...mod.items!] }));
        }
      }
    }
  };

  const handleFieldChange = (moduleKey: string, fieldKey: string, value: any) => {
    setExpandedFields(prev => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [fieldKey]: value
      }
    }));
    setDirtyModules(prev => ({ ...prev, [moduleKey]: true }));
  };

  const handleItemFieldChange = (moduleKey: string, index: number, itemKey: string, value: any) => {
    const items = [...(editedItems[moduleKey] || [])];
    if (items[index]) {
      items[index] = { ...items[index], [itemKey]: value };
      setExpandedItems(prev => ({ ...prev, [moduleKey]: items }));
      setDirtyModules(prev => ({ ...prev, [moduleKey]: true }));
    }
  };

  const handleAddItem = (moduleKey: string, defaultSchema: Record<string, any>) => {
    const items = [...(editedItems[moduleKey] || [])];
    items.push({ ...defaultSchema });
    setExpandedItems(prev => ({ ...prev, [moduleKey]: items }));
    setDirtyModules(prev => ({ ...prev, [moduleKey]: true }));
    toast.success('Elemento agregado a la lista.');
  };

  const handleDeleteItem = (moduleKey: string, index: number) => {
    const items = [...(editedItems[moduleKey] || [])];
    items.splice(index, 1);
    setExpandedItems(prev => ({ ...prev, [moduleKey]: items }));
    setDirtyModules(prev => ({ ...prev, [moduleKey]: true }));
    toast.error('Elemento eliminado de la lista de edición.');
  };

  const handleMoveItem = (moduleKey: string, index: number, direction: 'up' | 'down') => {
    const items = [...(editedItems[moduleKey] || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < items.length) {
      const temp = items[index]!;
      items[index] = items[targetIdx]!;
      items[targetIdx] = temp;
      setExpandedItems(prev => ({ ...prev, [moduleKey]: items }));
      setDirtyModules(prev => ({ ...prev, [moduleKey]: true }));
    }
  };

  const handleOpenAssetPicker = (moduleKey: string, fieldKey: string) => {
    setActivePickerField({ moduleKey, fieldKey });
    setIsAssetPickerOpen(true);
  };

  const handleSelectAsset = (url: string) => {
    if (activePickerField) {
      handleFieldChange(activePickerField.moduleKey, activePickerField.fieldKey, url);
      setIsAssetPickerOpen(false);
      setActivePickerField(null);
      toast.success('Imagen seleccionada con éxito.');
    }
  };

  const handleSaveModule = async (moduleKey: string) => {
    const originalMod = modules.find(m => m.key === moduleKey);
    if (!originalMod) return;

    const fieldsToSave = originalMod.fields.map(f => ({
      ...f,
      value: editedFields[moduleKey]?.[f.key] !== undefined ? editedFields[moduleKey][f.key] : f.value
    }));

    const itemsToSave = editedItems[moduleKey];

    const t = toast.loading(`Guardando módulo soberano "${originalMod.label}"...`);
    
    try {
      await updateModuleFields(moduleKey, fieldsToSave, itemsToSave);
      setDirtyModules(prev => ({ ...prev, [moduleKey]: false }));
      toast.dismiss(t);
      toast.success(`Módulo "${originalMod.label}" guardado correctamente.`);
    } catch {
      toast.dismiss(t);
      toast.error('Fallo al guardar el contenido.');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & INSTRUCTIONAL CONCEPT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Contenido web</h1>
          <p className="text-sm text-muted-foreground">Edita los textos, fotos y datos que se renderizan en tu portal.</p>
        </div>
      </div>

      {/* REVELATORY SEPARATION ALERT BADGE */}
      <Card className="border-blue-100 dark:border-blue-950 bg-blue-50/40 dark:bg-blue-950/10">
        <CardContent className="p-4 flex gap-3 text-left">
          <div className="p-2 h-fit bg-primary/10 text-primary rounded-lg">
            <Info size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold flex items-center gap-1.5">
              <span>La Ley Sólida: Separación de Contenido y Aspecto</span>
              <Badge variant="outline" className="text-[10px] font-bold py-0 text-blue-600 border-blue-200 bg-white dark:bg-zinc-900">Concepto Central</Badge>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Aquí editas el <span className="font-semibold text-foreground">contenido puro</span> (textos, números, listas de exposiciones y enlaces). El aspecto final, fuentes, composiciones de cuadrículas o fondos los controla exclusivamente el <span className="font-semibold text-foreground">Diseño / Theme</span> activo. ¡Puedes cambiar de theme cuando quieras sin perder una sola letra de tu trabajo!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* MODULES LIST */}
      <div className="space-y-4">
        {modules.map((mod) => {
          const isExpanded = expandedModuleKey === mod.key;
          const isDirty = !!dirtyModules[mod.key];
          
          // Schema de ejemplo para items repetibles en ciertos módulos
          const defaultSchemas: Record<string, Record<string, any>> = {
            'exposiciones': { title: 'Nueva Exposición', place: 'Galería de Arte', date: 'Septiembre 2026', active: false },
            'cronologia': { year: '2026', milestone: 'Explicación del hito profesional...' },
            'prensa': { media: 'Revista de Arte', headline: 'Título de la mención crítica...', date: 'Mayo 2026', link: 'https://' },
            'premios': { year: '2026', prize: 'Nombre del galardón obtenido' },
            'testimonios': { author: 'Nombre del comprador', role: 'Ciudad / Cargo', text: 'Excelente experiencia de adquisición...' },
            'faq': { q: 'Pregunta frecuente del coleccionista...', a: 'Respuesta detallada...' }
          };

          return (
            <Card 
              key={mod.key} 
              className={`border transition-all ${
                isExpanded 
                  ? 'ring-1 ring-primary shadow-md' 
                  : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30'
              }`}
            >
              {/* ACCORDION TRIGGER HEADER */}
              <div 
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => handleToggleExpand(mod.key)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                      {mod.label}
                      {isDirty && (
                        <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold border-none">
                          Cambios sin guardar
                        </Badge>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground">Clave del módulo: <code className="font-mono">{mod.key}</code></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isDirty && (
                    <Button 
                      size="xs" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveModule(mod.key);
                      }}
                      className="gap-1 shadow-sm text-[11px]"
                    >
                      <Save size={12} />
                      Guardar Módulo
                    </Button>
                  )}
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* CARD EXPANDED CONTENT */}
              {isExpanded && (
                <CardContent className="border-t p-6 bg-zinc-50/30 dark:bg-zinc-900/10 space-y-6">
                  <Tabs defaultValue="fields" className="w-full">
                    <TabsList className="grid w-[400px] grid-cols-2">
                      <TabsTrigger value="fields" className="text-xs font-semibold">Campos del Módulo (Slots)</TabsTrigger>
                      <TabsTrigger 
                        value="items" 
                        disabled={!mod.items}
                        className="text-xs font-semibold"
                      >
                        Lista de Elementos ({mod.items?.length || 0})
                      </TabsTrigger>
                    </TabsList>

                    {/* FIELDS EDIT TAB */}
                    <TabsContent value="fields" className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mod.fields.map((field) => {
                          const localVal = editedFields[mod.key]?.[field.key] !== undefined 
                            ? editedFields[mod.key][field.key] 
                            : field.value;

                          return (
                            <div key={field.key} className="space-y-1.5 text-left">
                              <Label className="text-xs font-bold text-muted-foreground flex items-center justify-between">
                                <span>{field.label}</span>
                                <code className="text-[9px] font-mono opacity-50 font-normal">{field.key}</code>
                              </Label>

                              {/* CONDITIONAL RENDER BY FIELD TYPE */}
                              {field.type === 'boolean' ? (
                                <div className="flex items-center space-x-2 pt-2">
                                  <Switch 
                                    id={`${mod.key}-${field.key}`}
                                    checked={!!localVal}
                                    onCheckedChange={(checked) => handleFieldChange(mod.key, field.key, checked)}
                                  />
                                  <Label htmlFor={`${mod.key}-${field.key}`} className="text-xs font-normal">
                                    {localVal ? 'Activado' : 'Desactivado'}
                                  </Label>
                                </div>
                              ) : field.type === 'textarea' ? (
                                <Textarea 
                                  value={localVal as string}
                                  onChange={(e) => handleFieldChange(mod.key, field.key, e.target.value)}
                                  rows={4}
                                  className="text-xs resize-none"
                                />
                              ) : field.type === 'image' ? (
                                <div className="space-y-2">
                                  <div className="flex gap-2">
                                    <Input 
                                      value={localVal as string}
                                      onChange={(e) => handleFieldChange(mod.key, field.key, e.target.value)}
                                      className="text-xs"
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleOpenAssetPicker(mod.key, field.key)}
                                      className="gap-1.5 shrink-0 text-xs"
                                    >
                                      <ImageIcon size={14} />
                                      Elegir foto
                                    </Button>
                                  </div>
                                  {localVal && (
                                    <div className="h-16 w-24 overflow-hidden border rounded bg-muted">
                                      <img src={localVal as string} alt="Miniatura" className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <Input 
                                  type={field.type === 'number' ? 'number' : 'text'}
                                  value={localVal as string | number}
                                  onChange={(e) => {
                                    const v = field.type === 'number' ? Number(e.target.value) : e.target.value;
                                    handleFieldChange(mod.key, field.key, v);
                                  }}
                                  className="text-xs"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>

                    {/* REPEATABLE ITEMS TAB */}
                    {mod.items && (
                      <TabsContent value="items" className="space-y-4 pt-4">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">Gestiona la lista ordenada de elementos para esta sección.</p>
                          <Button 
                            size="xs" 
                            className="gap-1 text-[11px]"
                            onClick={() => handleAddItem(mod.key, defaultSchemas[mod.key] || {})}
                          >
                            <Plus size={12} />
                            Añadir Elemento
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {(editedItems[mod.key] || []).length === 0 ? (
                            <div className="text-center py-8 border border-dashed rounded-lg bg-zinc-50/50 dark:bg-zinc-900/10">
                              <p className="text-xs text-muted-foreground">No hay elementos configurados. Pulsa en Añadir Elemento.</p>
                            </div>
                          ) : (
                            (editedItems[mod.key] || []).map((item, index) => (
                              <div 
                                key={index} 
                                className="p-4 border rounded-lg bg-zinc-50/50 dark:bg-zinc-900/20 flex gap-4 items-start"
                              >
                                {/* REORDER CONTROLS */}
                                <div className="flex flex-col gap-1 mt-1">
                                  <button 
                                    disabled={index === 0}
                                    onClick={() => handleMoveItem(mod.key, index, 'up')}
                                    className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-30"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button 
                                    disabled={index === (editedItems[mod.key]?.length || 0) - 1}
                                    onClick={() => handleMoveItem(mod.key, index, 'down')}
                                    className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-30"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>

                                {/* EDITABLE FORM IN ITEM */}
                                <div className="grow grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {Object.keys(item).map((itemKey) => {
                                    if (itemKey === 'id' || itemKey === 'active' || itemKey === 'order') return null;
                                    
                                    const val = item[itemKey];
                                    const label = itemKey === 'title' ? 'Título' : 
                                                  itemKey === 'place' ? 'Lugar/Ubicación' : 
                                                  itemKey === 'date' ? 'Fecha/Periodo' :
                                                  itemKey === 'year' ? 'Año' :
                                                  itemKey === 'milestone' ? 'Hito/Acontecimiento' :
                                                  itemKey === 'media' ? 'Medio de Prensa' :
                                                  itemKey === 'headline' ? 'Titular de Prensa' :
                                                  itemKey === 'link' ? 'Enlace En Web' :
                                                  itemKey === 'prize' ? 'Premio/Reconocimiento' :
                                                  itemKey === 'author' ? 'Autor' :
                                                  itemKey === 'role' ? 'Rol/Cargo' :
                                                  itemKey === 'text' ? 'Texto' :
                                                  itemKey === 'q' ? 'Pregunta' :
                                                  itemKey === 'a' ? 'Respuesta' : itemKey;

                                    return (
                                      <div key={itemKey} className="space-y-1 text-left">
                                        <Label className="text-[10px] font-bold text-muted-foreground">{label}</Label>
                                        {itemKey === 'text' || itemKey === 'milestone' || itemKey === 'a' ? (
                                          <Textarea 
                                            value={val as string}
                                            onChange={(e) => handleItemFieldChange(mod.key, index, itemKey, e.target.value)}
                                            rows={2}
                                            className="text-xs resize-none"
                                          />
                                        ) : (
                                          <Input 
                                            value={val as string}
                                            onChange={(e) => handleItemFieldChange(mod.key, index, itemKey, e.target.value)}
                                            className="text-xs"
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* ACTION DELETE BUTTON */}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 mt-1"
                                  onClick={() => handleDeleteItem(mod.key, index)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>

                  {/* DIRTY STATUS AND FOOTER SUBMIT */}
                  {isDirty && (
                    <div className="pt-4 border-t flex justify-end gap-2 bg-zinc-50/50 -mx-6 -mb-6 p-4 rounded-b-lg">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setDirtyModules(prev => ({ ...prev, [mod.key]: false }));
                          handleToggleExpand(mod.key); // Re-collapsing discards or resets on re-expand
                        }}
                      >
                        Descartar cambios
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleSaveModule(mod.key)}
                        className="gap-1.5 shadow"
                      >
                        <Save size={14} />
                        Guardar cambios en {mod.label}
                      </Button>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* PICTURE SELECTOR DIALOG */}
      <Dialog open={isAssetPickerOpen} onOpenChange={setIsAssetPickerOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Biblioteca de medios del Escultor</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
            {assets.map((asset) => (
              <div 
                key={asset.id}
                onClick={() => handleSelectAsset(asset.url)}
                className="group border hover:border-primary rounded-lg overflow-hidden cursor-pointer bg-zinc-50 hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div className="h-28 overflow-hidden bg-muted">
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2 border-t">
                  <p className="text-[10px] font-bold truncate">{asset.name}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{asset.category}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
