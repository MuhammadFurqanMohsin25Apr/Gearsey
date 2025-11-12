import { Link } from "react-router";
import { useState } from "react";
import { useSession, authClient } from "~/lib/auth-client";

export function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const isAuthenticated = !!user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?query=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-400/50 group-hover:scale-105 transition-all duration-300">
              <span className="text-xl font-black text-white">G</span>
            </div>
            <span className="text-xl font-bold tracking-tight group-hover:text-cyan-300 transition-colors">
              Gearsey
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for parts..."
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all text-sm"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all text-sm"
              >
                Search
              </button>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            <Link to="/products" className="px-4 py-1.5 hover:bg-white/15 backdrop-blur-sm rounded-lg transition-all font-medium text-sm hover:text-cyan-300">
              Products
            </Link>
            <Link to="/auctions" className="px-4 py-1.5 hover:bg-white/15 backdrop-blur-sm rounded-lg transition-all font-medium text-sm hover:text-cyan-300">
              Auctions
            </Link>
            {/* Only Seller can list products */}
            {user?.role === "seller" && (
              <Link to="/sell" className="px-4 py-1.5 hover:bg-white/15 backdrop-blur-sm rounded-lg transition-all font-medium text-sm hover:text-cyan-300">
                Sell
              </Link>
            )}
            {/* Admin can see statistics */}
            {user?.role === "admin" && (
              <Link to="/admin" className="px-4 py-1.5 hover:bg-white/15 backdrop-blur-sm rounded-lg transition-all font-medium text-sm hover:text-cyan-300">
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            {/* Buyer can see cart */}
            {(!user || user?.role === "buyer") && (
              <Link to="/cart" className="relative p-2 hover:bg-white/15 backdrop-blur-sm rounded-lg transition-all group">
                <svg className="w-5 h-5 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">0</span>
              </Link>
            )}

            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                {/* Buyer Dashboard - View Orders & Reviews */}
                {user.role === "buyer" && (
                  <Link to="/dashboard" className="px-4 py-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    My Orders
                  </Link>
                )}
                {/* Seller Dashboard - Manage Products */}
                {user.role === "seller" && (
                  <Link to="/dashboard" className="px-4 py-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    My Products
                  </Link>
                )}
                {/* Admin Dashboard - Statistics & Management */}
                {user.role === "admin" && (
                  <Link to="/admin" className="px-4 py-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="px-4 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-lg transition-all font-medium text-sm shadow-md">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login" className="px-4 py-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-lg transition-all font-semibold text-sm shadow-md">
                  Sign Up
                </Link>
              </div>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white p-2 hover:bg-white/15 rounded-lg transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden pb-3 space-y-1 border-t border-white/20 pt-3">
            <Link to="/products" className="block px-4 py-2 hover:bg-white/15 rounded-lg transition-all text-sm" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link to="/auctions" className="block px-4 py-2 hover:bg-white/15 rounded-lg transition-all text-sm" onClick={() => setIsMenuOpen(false)}>Auctions</Link>
            
            {/* Only Seller can list products */}
            {user?.role === "seller" && (
              <Link to="/sell" className="block px-4 py-2 hover:bg-white/15 rounded-lg transition-all text-sm" onClick={() => setIsMenuOpen(false)}>Sell Products</Link>
            )}
            
            {/* Admin can see statistics */}
            {user?.role === "admin" && (
              <Link to="/admin" className="block px-4 py-2 hover:bg-white/15 rounded-lg transition-all text-sm" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
            )}
            
            {user ? (
              <>
                {user.role === "buyer" && (
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-white/15 rounded-lg transition-all text-sm" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                )}
                {user.role === "seller" && (
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-white/15 rounded-lg transition-all text-sm" onClick={() => setIsMenuOpen(false)}>My Products</Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin" className="block px-4 py-2 hover:bg-white/15 rounded-lg transition-all text-sm" onClick={() => setIsMenuOpen(false)}>Statistics</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 bg-rose-500/80 hover:bg-rose-600 rounded-lg text-sm">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 hover:bg-white/15 rounded-lg transition-all text-sm" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="block px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg font-semibold text-sm" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 py-2 overflow-x-auto">
            <Link to="/products" className="text-xs text-white/90 hover:text-cyan-300 whitespace-nowrap transition-colors font-semibold">All Parts</Link>
            <Link to="/products?category=Engine" className="text-xs text-white/75 hover:text-cyan-300 whitespace-nowrap transition-colors">Engine</Link>
            <Link to="/products?category=Brakes" className="text-xs text-white/75 hover:text-cyan-300 whitespace-nowrap transition-colors">Brakes</Link>
            <Link to="/products?category=Suspension" className="text-xs text-white/75 hover:text-cyan-300 whitespace-nowrap transition-colors">Suspension</Link>
            <Link to="/products?category=Electrical" className="text-xs text-white/75 hover:text-cyan-300 whitespace-nowrap transition-colors">Electrical</Link>
            <Link to="/products?category=Transmission" className="text-xs text-white/75 hover:text-cyan-300 whitespace-nowrap transition-colors">Transmission</Link>
            <Link to="/products?category=Body" className="text-xs text-white/75 hover:text-cyan-300 whitespace-nowrap transition-colors">Body Parts</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
