import { useState } from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Lock, Mail, ChevronRight, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('antonio.carballo@art.es');
  const [password, setPassword] = useState('antonio1964');
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotForgotEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor, rellena todos los campos.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simular login exitoso
      login('mock_token_xyz_123_abc', false);
      toast.success('Bienvenido de nuevo, Antonio. Sesión iniciada.');
    }, 400);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Por favor, introduce tu correo electrónico.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Enlace de recuperación enviado. Revisa tu correo.');
      setIsForgotMode(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* LOGO & BRANDING */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 rounded-2xl rotate-12 opacity-80 blur-[1px] animate-pulse duration-3000" />
            <div className="absolute inset-0.5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 rounded-lg rotate-45 flex items-center justify-center text-sm font-black text-white shadow-inner">
                <span className="rotate-[-45deg] scale-90">▲</span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">Prisma Studio</h1>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Panel de control soberano para tu negocio</p>
          </div>
        </div>

        {!isForgotMode ? (
          <form onSubmit={handleSubmit}>
            <Card className="border shadow-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Iniciar sesión</CardTitle>
                <CardDescription>
                  Inicia sesión para gestionar el contenido de tu web de arte.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      placeholder="antonio.carballo@art.es"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Contraseña</Label>
                    <button
                      type="button"
                      onClick={() => setIsForgotMode(true)}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      ¿La olvidaste?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Comprobando credenciales...' : 'Entrar al panel'}
                  {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
                <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <HelpCircle size={12} />
                  Prisma Studio está alojado de forma soberana en tu servidor.
                </div>
              </CardFooter>
            </Card>
          </form>
        ) : (
          <form onSubmit={handleForgotSubmit}>
            <Card className="border shadow-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Recuperar acceso</CardTitle>
                <CardDescription>
                  Te enviaremos un enlace temporal para restaurar tu contraseña soberana.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="forgot-email"
                      type="email"
                      className="pl-10"
                      placeholder="antonio.carballo@art.es"
                      value={forgotEmail}
                      onChange={(e) => setForgotForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
                </Button>
                <button
                  type="button"
                  onClick={() => setIsForgotMode(false)}
                  className="text-xs text-muted-foreground hover:underline font-medium"
                >
                  Volver al formulario de entrada
                </button>
              </CardFooter>
            </Card>
          </form>
        )}
      </div>
    </div>
  );
}
