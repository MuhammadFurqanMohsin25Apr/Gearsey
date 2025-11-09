import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { signOut } from '@/lib/auth-client';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());

  const handleLogout = async () => {
    await signOut();
    logout();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary-100 bg-white/95 shadow-sm backdrop-blur-sm">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-md transition-transform group-hover:scale-110">
              <span className="text-xl font-bold">G</span>
            </div>
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-2xl font-bold text-transparent">
              Gearsey
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/products" className="group relative text-sm font-semibold text-gray-700 transition-colors hover:text-primary-600">
              Products
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary-600 to-secondary-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/auctions" className="group relative text-sm font-semibold text-gray-700 transition-colors hover:text-primary-600">
              Auctions
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary-600 to-secondary-600 transition-all group-hover:w-full"></span>
            </Link>
            {isAuthenticated && user?.role === 'seller' && (
              <Link to="/my-listings" className="group relative text-sm font-semibold text-gray-700 transition-colors hover:text-primary-600">
                My Listings
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary-600 to-secondary-600 transition-all group-hover:w-full"></span>
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="group relative text-sm font-semibold text-gray-700 transition-colors hover:text-primary-600">
                Admin
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary-600 to-secondary-600 transition-all group-hover:w-full"></span>
              </Link>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="relative rounded-full p-2 transition-colors hover:bg-primary-50">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-xs font-bold text-white shadow-md">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="hidden items-center gap-2 rounded-lg bg-gradient-to-r from-primary-50 to-secondary-50 px-3 py-2 transition-all hover:from-primary-100 hover:to-secondary-100 md:flex">
                <User className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="hidden items-center gap-2 rounded-lg p-2 transition-colors hover:bg-red-50 md:flex"
                title="Logout"
              >
                <LogOut className="h-5 w-5 text-gray-700 hover:text-red-600" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline hidden px-4 py-2 text-sm md:inline-flex">
                Login
              </Link>
              <Link to="/register" className="btn-primary hidden px-4 py-2 text-sm md:inline-flex">
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="rounded-lg p-2 transition-colors hover:bg-primary-50 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-primary-100 bg-white py-4 shadow-lg md:hidden">
          <div className="container flex flex-col gap-4">
            <Link to="/products" className="text-sm font-semibold text-gray-700 hover:text-primary-600">
              Products
            </Link>
            <Link to="/auctions" className="text-sm font-semibold text-gray-700 hover:text-primary-600">
              Auctions
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'seller' && (
                  <Link to="/my-listings" className="text-sm font-semibold text-gray-700 hover:text-primary-600">
                    My Listings
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-semibold text-gray-700 hover:text-primary-600">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="text-sm font-semibold text-gray-700 hover:text-primary-600">
                  Profile
                </Link>
                <button onClick={handleLogout} className="text-left text-sm font-semibold text-gray-700 hover:text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-semibold text-gray-700 hover:text-primary-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
