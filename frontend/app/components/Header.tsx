import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "~/lib/auth-client";
import { cartManager } from "~/lib/cart";
import {
  Search,
  Package,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { AddProductDialog } from "./AddProductDialog";

export function Header() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update cart item count
  useEffect(() => {
    const updateCartCount = () => {
      const count = cartManager.getUniqueItemCount();
      setCartItemCount(count);
    };

    // Initial load
    updateCartCount();

    // Listen for storage changes from other tabs
    window.addEventListener("storage", updateCartCount);
    
    // Also listen for a custom event we'll dispatch when cart changes
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Apply blur effect to body when modal is open
  useEffect(() => {
    if (isAddProductOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("blur-sm");
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.classList.remove("blur-sm");
    }

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.classList.remove("blur-sm");
    };
  }, [isAddProductOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?query=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = async () => {
    cartManager.clearCart();
    await signOut();
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-red-600/50 transition-all duration-300">
              <span className="text-2xl font-black text-white">G</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-red-600 transition-colors">
                Gearsey
              </span>
              <span className="text-xs text-gray-600 font-semibold -mt-1">
                AUTO PARTS
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for auto parts, brands, models..."
                className="w-full px-6 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm font-medium"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-sm flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> SEARCH
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/products"
              className="px-4 py-2 hover:bg-red-50 rounded-lg transition-all duration-300 font-bold text-sm text-gray-700 hover:text-red-600"
            >
              PRODUCTS
            </Link>
            <Link
              to="/auctions"
              className="px-4 py-2 hover:bg-red-50 rounded-lg transition-all duration-300 font-bold text-sm text-gray-700 hover:text-red-600"
            >
              AUCTIONS
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {/* Cart visible for both buyer and seller */}
            {(!user || user?.role === "buyer" || user?.role === "seller") && (
              <Link
                to="/cart"
                className="relative p-3 hover:bg-red-50 rounded-lg transition-all duration-300 group"
              >
                <svg
                  className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-black rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              </Link>
            )}

            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                {/* Seller Dashboard - Manage Products */}
                {user.role === "seller" && (
                  <Link
                    to="/dashboard"
                    className="px-5 py-2.5 bg-gray-100 hover:bg-red-50 rounded-lg transition-all duration-300 font-bold text-sm text-gray-700 hover:text-red-600"
                  >
                    DASHBOARD
                  </Link>
                )}
                {/* Admin Dashboard - Statistics & Management */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-5 py-2.5 bg-gray-100 hover:bg-red-50 rounded-lg transition-all duration-300 font-bold text-sm text-gray-700 hover:text-red-600"
                  >
                    ADMIN
                  </Link>
                )}
                {/* Settings Dropdown */}
                <div className="relative" ref={settingsRef}>
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="p-3 hover:bg-red-50 rounded-lg transition-all duration-300 group"
                  >
                    <svg
                      className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                  {isSettingsOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-xs text-gray-500 font-semibold">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Buyer-specific menu items */}
                      {user.role === "buyer" && (
                        <>
                          <Link
                            to="/dashboard"
                            className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              />
                            </svg>
                            My Orders
                          </Link>
                          <Link
                            to="/profile"
                            className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Profile
                          </Link>
                          <Link
                            to="/help"
                            className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Help & Support
                          </Link>
                          <div className="border-t border-gray-200 my-1"></div>
                        </>
                      )}

                      {/* Seller-specific menu items */}
                      {user.role === "seller" && (
                        <>
                          <Link
                            to="/manage-products"
                            className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                            Manage Products
                          </Link>
                          <Link
                            to="/profile"
                            className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Profile
                          </Link>
                          <Link
                            to="/help"
                            className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Help & Support
                          </Link>
                          <div className="border-t border-gray-200 my-1"></div>
                        </>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-gray-100 hover:bg-red-50 rounded-lg transition-all duration-300 font-bold text-sm text-gray-700 hover:text-red-600"
                >
                  LOGIN
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 font-bold text-sm shadow-md"
                >
                  SIGN UP
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 p-2 hover:bg-red-50 rounded-lg transition-all duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden pb-3 space-y-1 border-t border-gray-200 pt-3">
            <Link
              to="/products"
              className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-all text-sm font-bold text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              PRODUCTS
            </Link>
            <Link
              to="/auctions"
              className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-all text-sm font-bold text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              AUCTIONS
            </Link>

            {/* Only Seller can list products */}
            {user?.role === "seller" && (
              <Link
                to="/manage-products"
                className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-all text-sm font-bold text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                SELL PRODUCTS
              </Link>
            )}

            {user ? (
              <>
                {user.role === "buyer" && (
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-all text-sm font-bold text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    MY ORDERS
                  </Link>
                )}
                {user.role === "seller" && (
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-red-50 rounded-lg transition-all duration-300 text-sm font-bold text-gray-700 hover:text-red-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    DASHBOARD
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-all text-sm font-bold text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ADMIN DASHBOARD
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold text-white"
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-red-50 rounded-lg transition-all duration-300 text-sm font-bold text-gray-700 hover:text-red-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  LOGIN
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 font-bold text-sm text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SIGN UP
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Add Product Dialog */}
      <AddProductDialog
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />
    </header>
  );
}
