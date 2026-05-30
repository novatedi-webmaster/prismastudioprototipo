import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../lib/mock-api';
import type { BlogPost } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, Edit, Trash2, Calendar, User, Search, 
  FileText, CheckCircle, RefreshCw, ChevronLeft, ChevronRight, Eye 
} from 'lucide-react';
import { toast } from 'sonner';

export default function BlogManager() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await mockApi.blog.list();
      setPosts(list);
    } catch {
      toast.error('Error al cargar la bitácora del blog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente la entrada de blog "${title}"?`)) {
      try {
        await mockApi.blog.delete(id);
        toast.success('Entrada de blog eliminada con éxito.');
        loadData();
      } catch {
        toast.error('Error al eliminar la entrada.');
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/blog/editor/new');
  };

  // Filter & Search
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Bitácora / Blog</h1>
          <p className="text-sm text-muted-foreground">
            Escribe crónicas sobre tu taller, reflexiones artísticas y explicaciones de pátinas para tus seguidores.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2 self-start md:self-auto shadow-md">
          <Plus size={16} />
          Escribir Entrada
        </Button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <Card className="bg-background/40 border-zinc-200/80 dark:border-zinc-800/80">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80 text-left">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, extracto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex gap-1.5 self-start sm:self-auto">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
              className="h-8 text-xs font-bold"
            >
              Todos ({posts.length})
            </Button>
            <Button
              variant={statusFilter === 'published' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('published')}
              className="h-8 text-xs font-bold text-emerald-600 dark:text-emerald-400"
            >
              Publicados ({posts.filter(p => p.status === 'published').length})
            </Button>
            <Button
              variant={statusFilter === 'draft' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('draft')}
              className="h-8 text-xs font-bold text-amber-600 dark:text-amber-400"
            >
              Borradores ({posts.filter(p => p.status === 'draft').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* DISPLAY LIST/TABLE */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground text-xs space-y-2">
          <RefreshCw className="animate-spin mx-auto h-7 w-7 text-primary" />
          <p>Cargando bitácoras y reflexiones...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="border-dashed border-2 py-16 text-center">
          <CardContent className="space-y-3">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No se encontraron entradas</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Comparte tu filosofía y técnica con el mundo. Haz clic abajo para redactar tu primera bitácora.
            </p>
            <Button variant="outline" size="sm" onClick={handleCreateNew} className="gap-1.5 mt-2">
              <Plus size={14} /> Redactar artículo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              onClick={() => navigate(`/blog/editor/${post.id}`)}
              className="group overflow-hidden cursor-pointer border-zinc-200 dark:border-zinc-800 bg-card hover:shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Cover visual if available */}
              {post.coverUrl && (
                <div className="aspect-[21/9] bg-muted overflow-hidden relative">
                  <img 
                    src={post.coverUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={
                      post.status === 'published' 
                        ? 'bg-emerald-500 text-emerald-50 text-[9px] font-bold border-none px-2 h-5'
                        : 'bg-amber-500 text-amber-50 text-[9px] font-bold border-none px-2 h-5'
                    }>
                      {post.status === 'published' ? 'Publicado' : 'Borrador'}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Card content text */}
              <CardContent className="p-5 space-y-3 grow">
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    <span>Por {post.author}</span>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <h3 className="font-extrabold text-base text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </CardContent>

              {/* Card Footer Actions */}
              <CardFooter className="px-5 py-3 border-t bg-muted/20 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-muted-foreground">/{post.slug}</span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
                    onClick={() => navigate(`/blog/editor/${post.id}`)}
                  >
                    <Edit size={12} /> Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={(e) => handleDelete(post.id, post.title, e)}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}