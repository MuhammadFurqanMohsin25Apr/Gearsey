import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { signIn } from '@/lib/auth-client';
import { useAuthStore } from '@/store/auth.store';
import { Lock, Mail, LogIn } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || 'Login failed');
        return;
      }

      // Store user data
      if (result.data) {
        setUser(result.data.user as any);
        navigate('/');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <div className="container">
        <div className="mx-auto max-w-md">
          <Card className="bg-white shadow-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 shadow-lg">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <h1 className="mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-3xl font-bold text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-600">Sign in to your Gearsey account</p>
            </div>
            
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-9 h-5 w-5 text-gray-400" />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-12"
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-9 h-5 w-5 text-gray-400" />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                  Create one now
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
