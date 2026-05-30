import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { mockApi } from '../../lib/mock-api';
import type { User } from '../../lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  User as UserIcon, Lock, Settings, Moon, Sun, Palette, 
  Database, ShieldCheck, Check 
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSettings() {
  const { logout } = useAuth();
  const { theme, palette, toggleTheme, setPalette } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isSavingPass, setIsSavingPass] = useState(false);

  useEffect(() => {
    mockApi.user.get().then(u => {
      setUser(u);
      setUserName(u.name);
      setUserEmail(u.email);
    });
  }, []);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) {
      toast.error('Rellena todos los campos.');
      return;
    }
    setIsSavingUser(true);
    try {
      const updated = await mockApi.user.update({
        id: user?.id || 'user-1',
        name: userName,
        email: userEmail
      });
      setUser(updated);
      toast.success('Perfil de Antonio actualizado correctamente.');
    } catch {
      toast.error('Fallo al actualizar.');
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error('Por favor rellena ambas contraseñas.');
      return;
    }
    setIsSavingPass(true);
    setTimeout(() => {
      setIsSavingPass(false);
      setOldPassword('');
      setNewPassword('');
      toast.success('Contraseña del panel soberano cambiada correctamente.');
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Mi Perfil</h1>
          <p className="text-sm text-muted-foreground">Administra los accesos del administrador y define el aspecto de tu panel de control.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PROFILE DETAILS - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* USER FORM */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon size={18} className="text-muted-foreground" />
                Datos Personales
              </CardTitle>
              <CardDescription>Edita tu firma oficial y el correo del administrador.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateUser} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="username">Nombre completo / Firma</Label>
                    <Input 
                      id="username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="useremail">Correo electrónico de acceso</Label>
                    <Input 
                      id="useremail"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                      className="text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSavingUser}>
                    {isSavingUser ? 'Guardando...' : 'Actualizar Perfil'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* PASSWORD FORM */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock size={18} className="text-muted-foreground" />
                Seguridad Soberana
              </CardTitle>
              <CardDescription>Actualiza tu contraseña. Al ser un panel auto-alojado, las llaves son tuyas.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="old-pass">Contraseña actual</Label>
                    <Input 
                      id="old-pass"
                      type="password"
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-pass">Nueva contraseña</Label>
                    <Input 
                      id="new-pass"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="secondary" disabled={isSavingPass}>
                    {isSavingPass ? 'Procesando...' : 'Cambiar contraseña'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* ADMIN PANEL PREFERENCES - 1/3 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Settings size={16} /> Look del Panel Admin
              </CardTitle>
              <CardDescription>Personaliza tu experiencia de trabajo diaria.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-left">
              {/* CLEAR/DARK MODE TOGGLE */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                    Modo Oscuro del Panel
                  </span>
                  <p className="text-[10px] text-muted-foreground">Cambia el contraste completo del panel admin.</p>
                </div>
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>

              {/* PALETTE SELECTOR (§5) */}
              <div className="space-y-3">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Palette size={14} />
                  Paleta de colores del panel
                </span>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Elige entre las 3 paletas premium diseñadas para la usabilidad limpia de Antonio:
                </p>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  {/* Palette Blue */}
                  <button
                    onClick={() => setPalette('blue')}
                    className={`p-2.5 border rounded-lg text-xs flex items-center justify-between transition-all ${
                      palette === 'blue' ? 'border-primary ring-1 ring-primary font-bold bg-muted/40' : 'hover:bg-muted/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-600 block shrink-0" />
                      <span>Azul Wix Premium (Default)</span>
                    </div>
                    {palette === 'blue' && <Check size={14} className="text-primary" />}
                  </button>

                  {/* Palette Black */}
                  <button
                    onClick={() => setPalette('black')}
                    className={`p-2.5 border rounded-lg text-xs flex items-center justify-between transition-all ${
                      palette === 'black' ? 'border-primary ring-1 ring-primary font-bold bg-muted/40' : 'hover:bg-muted/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-zinc-950 dark:bg-white border block shrink-0" />
                      <span>Negro Premium Sobrio</span>
                    </div>
                    {palette === 'black' && <Check size={14} className="text-primary" />}
                  </button>

                  {/* Palette Jade */}
                  <button
                    onClick={() => setPalette('jade')}
                    className={`p-2.5 border rounded-lg text-xs flex items-center justify-between transition-all ${
                      palette === 'jade' ? 'border-primary ring-1 ring-primary font-bold bg-muted/40' : 'hover:bg-muted/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-700 block shrink-0" />
                      <span>Verde Jade Escultor</span>
                    </div>
                    {palette === 'jade' && <Check size={14} className="text-primary" />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
