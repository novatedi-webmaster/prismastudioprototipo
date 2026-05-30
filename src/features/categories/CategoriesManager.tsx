import { useState, useEffect } from 'react';
import { mockApi } from '../../lib/mock-api';
import type { Category, Work } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Edit, Save, 
  RefreshCw, CheckCircle, HelpCircle, Layers, ToggleLeft, ToggleRight 
} from 'lucide-react';
import { toast } from 'sonner';

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State for creating/editing inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const catList = await mockApi.categories.list();
      setCategories(catList);
      
      const workList = await mockApi.works.list();
      setWorks(workList);
    } catch {
      toast.error('Error al cargar las categorías del portfolio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setSaving(true);
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      enabled: true,
      order: categories.length + 1
    };

    try {
      await mockApi.categories.save(newCat);
      toast.success(`Categoría "${newCategoryName}" creada con éxito.`);
      setNewCategoryName('');
      loadData();
    } catch {
      toast.error('Error al guardar la categoría.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = async (category: Category) => {
    const updated = { ...category, enabled: !category.enabled };
    const stateText = updated.enabled ? 'habilitada' : 'deshabilitada';
    try {
      await mockApi.categories.save(updated);
      toast.success(`Categoría "${category.name}" ${stateText}.`);
      loadData();
    } catch {
      toast.error('Error al actualizar el estado.');
    }
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setCategoryName(category.name);
  };

  const handleSaveEdit = async (category: Category) => {
    if (!categoryName.trim()) return;

    const updated = { ...category, name: categoryName.trim() };
    try {
      await mockApi.categories.save(updated);
      toast.success('Categoría renombrada.');
      setEditingId(null);
      loadData();
    } catch {
      toast.error('Error al actualizar el nombre.');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    const count = getWorksCount(name);
    if (count > 0) {
      if (!confirm(`La categoría "${name}" contiene ${count} obras asociadas. Si la eliminas, estas obras quedarán sin categoría. ¿Deseas continuar?`)) {
        return;
      }
    } else {
      if (!confirm(`¿Eliminar la categoría "${name}" de forma permanente?`)) {
        return;
      }
    }

    try {
      await mockApi.categories.delete(id);
      toast.success(`Categoría "${name}" eliminada.`);
      loadData();
    } catch {
      toast.error('Error al eliminar la categoría.');
    }
  };

  // Reordering Logic
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const list = [...categories];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < list.length) {
      // Swap elements
      const temp = list[index]!;
      list[index] = list[targetIdx]!;
      list[targetIdx] = temp;

      // Re-assign order numbers sequentially
      const updatedList = list.map((cat, idx) => ({
        ...cat,
        order: idx + 1
      }));

      setCategories(updatedList);
      try {
        await mockApi.categories.updateOrder(updatedList);
        toast.success('Orden de categorías actualizado.');
      } catch {
        toast.error('Fallo al persistir el nuevo orden.');
        loadData();
      }
    }
  };

  const getWorksCount = (catName: string) => {
    return works.filter(w => w.category === catName).length;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Categorías de Portfolio</h1>
          <p className="text-sm text-muted-foreground">
            Administra las materias o categorías que estructuran tu catálogo y su orden visual en la navegación.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* ADD CATEGORY FORM (1 COL) */}
        <div className="space-y-6">
          <Card className="bg-background border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Plus size={16} className="text-primary" />
                Nueva Categoría
              </CardTitle>
              <CardDescription className="text-xs">
                Agrega materias primas o líneas estéticas a tu menú.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="newCategory" className="text-xs font-semibold">Nombre de la Categoría</Label>
                  <Input
                    id="newCategory"
                    placeholder="Ej. Terracota, Metales Nobles..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                    className="h-10 text-xs"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={saving || !newCategoryName.trim()} 
                  className="w-full text-xs font-bold gap-1.5 h-9"
                >
                  {saving ? (
                    <RefreshCw className="animate-spin h-3.5 w-3.5" />
                  ) : (
                    <Plus size={14} />
                  )}
                  Agregar Categoría
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-muted/15 border-zinc-200 dark:border-zinc-800 text-xs text-muted-foreground p-4 space-y-2.5">
            <h4 className="font-bold text-foreground text-xs flex items-center gap-1.5">
              <HelpCircle size={14} className="text-primary" />
              ¿Cómo afecta esto al portal?
            </h4>
            <p className="leading-relaxed">
              Las categorías habilitadas aparecerán automáticamente como botones de filtrado en el catálogo público interactivo de Antonio Carballo.
            </p>
            <p className="leading-relaxed">
              El orden en el que dejes la lista con las flechas de reordenación determinará la secuencia de pestañas de izquierda a derecha.
            </p>
          </Card>
        </div>

        {/* CATEGORIES LIST (2 COLS) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-background border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                Listado y Ordenación
              </CardTitle>
              <Badge className="bg-muted text-muted-foreground border font-bold text-[10px] h-5">
                {categories.length} categorías
              </Badge>
            </CardHeader>
            
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-16 text-muted-foreground text-xs space-y-2">
                  <RefreshCw className="animate-spin mx-auto h-6 w-6 text-primary/75" />
                  <p>Sincronizando categorías...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-xs italic">
                  No hay categorías definidas. Crea una a la izquierda.
                </div>
              ) : (
                <div className="divide-y border-t border-b border-zinc-100 dark:border-zinc-900">
                  {categories.map((cat, idx) => {
                    const isEditing = editingId === cat.id;
                    const worksCount = getWorksCount(cat.name);
                    return (
                      <div 
                        key={cat.id} 
                        className="p-4 flex items-center justify-between gap-4 bg-background hover:bg-muted/15 transition-colors"
                      >
                        {/* LEFT: REORDER & CONTENT */}
                        <div className="flex items-center gap-3.5 min-w-0 grow">
                          {/* Reordering Buttons */}
                          <div className="flex flex-col gap-0.5 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={idx === 0}
                              onClick={() => handleMove(idx, 'up')}
                              className="h-6 w-6 rounded text-muted-foreground hover:bg-muted"
                              title="Subir"
                            >
                              <ArrowUp size={12} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={idx === categories.length - 1}
                              onClick={() => handleMove(idx, 'down')}
                              className="h-6 w-6 rounded text-muted-foreground hover:bg-muted"
                              title="Bajar"
                            >
                              <ArrowDown size={12} />
                            </Button>
                          </div>

                          {/* Category Name or Editor */}
                          <div className="grow min-w-0 text-left">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={categoryName}
                                  onChange={(e) => setCategoryName(e.target.value)}
                                  className="h-8 text-xs max-w-[200px]"
                                  autoFocus
                                />
                                <Button 
                                  size="icon" 
                                  className="h-8 w-8" 
                                  onClick={() => handleSaveEdit(cat)}
                                >
                                  <Save size={12} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2.5">
                                <span className={`font-extrabold text-sm ${cat.enabled ? 'text-foreground' : 'text-muted-foreground/60 line-through'}`}>
                                  {cat.name}
                                </span>
                                <Badge variant="secondary" className="text-[9px] font-semibold bg-muted hover:bg-muted text-muted-foreground px-1.5 py-0 h-4 leading-normal">
                                  {worksCount} {worksCount === 1 ? 'obra' : 'obras'}
                                </Badge>
                              </div>
                            )}
                            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">Posición: {cat.order} • ID: {cat.id}</p>
                          </div>
                        </div>

                        {/* RIGHT: SWITCH ENABLED & EDIT/DELETE ACTIONS */}
                        <div className="flex items-center gap-4 shrink-0">
                          {/* Switch toggle enabled */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider hidden sm:inline">
                              {cat.enabled ? 'Habilitada' : 'Pausada'}
                            </span>
                            <Switch
                              checked={cat.enabled}
                              onCheckedChange={() => handleToggleEnabled(cat)}
                            />
                          </div>

                          {/* Inline Actions */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleStartEdit(cat)}
                              title="Editar nombre"
                            >
                              <Edit size={12} className="text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              title="Eliminar categoría"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}