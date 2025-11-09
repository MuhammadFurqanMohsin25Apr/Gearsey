import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { signUp } from '@/lib/auth-client';
import { useAuthStore } from '@/store/auth.store';
import { User, Mail, Lock, MapPin, Phone, UserPlus } from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
    role: 'customer' as 'customer' | 'seller',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: undefined,
        callbackURL: '/',
      });

      if (result.error) {
        setError(result.error.message || 'Registration failed');
        return;
      }

      // Store user data
      if (result.data) {
        setUser(result.data.user as any);
        navigate('/');
      }
    } catch (err) {
      setError('An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <Card className="bg-white shadow-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 shadow-lg">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h1 className="mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-3xl font-bold text-transparent">
                Join Gearsey
              </h1>
              <p className="text-gray-600">Create your account and start exploring</p>
            </div>
            
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="relative">
                  <User className="absolute left-4 top-9 h-5 w-5 text-gray-400" />
                  <Input
                    label="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="pl-12"
                    required
                  />
                </div>
                
                <div className="relative">
                  <Mail className="absolute left-4 top-9 h-5 w-5 text-gray-400" />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="pl-12"
                    required
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-4 top-9 h-5 w-5 text-gray-400" />
                  <Input
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    className="pl-12"
                    required
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-4 top-9 h-5 w-5 text-gray-400" />
                  <Input
                    label="Address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Your address"
                    className="pl-12"
                    required
                  />
                </div>
                
                <div className="relative">
                  <Phone className="absolute left-4 top-9 h-5 w-5 text-gray-400" />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'customer' })}
                    className={`rounded-lg border-2 p-4 text-center transition-all ${
                      formData.role === 'customer'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <User className="mx-auto mb-2 h-6 w-6" />
                    <div className="font-semibold">Customer</div>
                    <div className="text-xs">Browse & Buy</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'seller' })}
                    className={`rounded-lg border-2 p-4 text-center transition-all ${
                      formData.role === 'seller'
                        ? 'border-secondary-600 bg-secondary-50 text-secondary-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-secondary-300'
                    }`}
                  >
                    <UserPlus className="mx-auto mb-2 h-6 w-6" />
                    <div className="font-semibold">Seller</div>
                    <div className="text-xs">List & Sell</div>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                  Sign in instead
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
