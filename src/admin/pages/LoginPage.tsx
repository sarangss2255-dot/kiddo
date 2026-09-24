import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Separator } from '../../components/ui/Separator';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(identifier, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Unable to sign in. Check credentials or backend availability.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Unable to sign in with Google. Check Firebase or admin role setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kiddo-warm flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border border-slate-100 rounded-3xl shadow-xl shadow-kiddo-navy/5 bg-white overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-3xl bg-white shadow-sm border border-kiddo-navy/10 flex items-center justify-center overflow-hidden mb-5">
                <img src="/kiddo-logo.png" alt="KidDo Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-2xl block leading-tight">KidDo</span>
              <Badge variant="accent" className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest mt-1.5">
                Admin Workspace
              </Badge>
              <h1 className="text-xl font-extrabold text-slate-800 mt-6">Sign in to the Admin Workspace</h1>
              <p className="text-sm text-slate-500 font-medium mt-1.5">
                Monitor platform health, families, and growth.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-xs font-bold text-slate-600">Email Address</Label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="admin@your-domain.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-11 h-12 rounded-2xl border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-xs font-bold text-slate-600">Password</Label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 rounded-2xl border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle size={16} />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full h-12 rounded-2xl bg-kiddo-navy hover:bg-kiddo-blue hover:text-white shadow-lg shadow-kiddo-navy/10"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <Separator className="flex-1 bg-slate-100" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or</span>
              <Separator className="flex-1 bg-slate-100" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={loading}
              onClick={handleGoogleSubmit}
              className="w-full h-12 rounded-2xl border-slate-200 bg-white font-bold text-slate-700"
            >
              <ShieldCheck size={16} className="text-kiddo-blue" />
              Sign in with Google
            </Button>

            <p className="text-center mt-8">
              <Link href="/" className="text-xs font-bold text-kiddo-blue hover:text-kiddo-navy transition-colors">
                ← Back to KidDo
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
