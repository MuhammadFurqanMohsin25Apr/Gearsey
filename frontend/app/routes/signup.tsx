import { Form, Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "~/lib/auth-context";
import type { UserRole } from "~/lib/auth-context";

export function meta() {
  return [
    { title: "Sign Up - Gearsey" },
    { name: "description", content: "Create your Gearsey account" },
  ];
}

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer" as UserRole,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.role
      );
      // Navigate based on role
      if (formData.role === "admin") {
        navigate("/admin");
      } else if (formData.role === "seller") {
        navigate("/sell");
      } else {
        navigate("/products");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo and Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-3 mb-6 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-indigo-600 group-hover:to-blue-600 transition-all duration-500">
              Gearsey
            </span>
          </Link>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Create your account
          </h2>
          <p className="text-gray-600 text-lg">
            Join the marketplace
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-5 border border-white/50">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center animate-shake">
              <svg
                className="w-5 h-5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Your Role
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "buyer" })}
                  className={`p-5 border-2 transition-all transform hover:scale-105 ${
                    formData.role === "buyer"
                      ? "border-sky-500 bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 shadow-2xl rounded-3xl scale-105"
                      : "border-gray-200 hover:border-sky-300 hover:shadow-lg rounded-2xl"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 flex items-center justify-center mb-3 transform ${
                        formData.role === "buyer"
                          ? "bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-500 rounded-2xl shadow-lg"
                          : "bg-gray-100 rounded-xl"
                      }`}
                    >
                      <svg
                        className={`w-8 h-8 ${formData.role === "buyer" ? "text-white" : "text-gray-600"}`}
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
                    </div>
                    <span
                      className={`font-bold text-base ${formData.role === "buyer" ? "text-sky-700" : "text-gray-700"}`}
                    >
                      Buyer
                    </span>
                    <span className="text-xs text-gray-500 mt-1 font-medium">
                      Browse & Purchase
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "seller" })}
                  className={`p-5 border-2 transition-all transform hover:scale-105 ${
                    formData.role === "seller"
                      ? "border-violet-500 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 shadow-2xl rounded-3xl scale-105"
                      : "border-gray-200 hover:border-violet-300 hover:shadow-lg rounded-2xl"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 flex items-center justify-center mb-3 ${
                        formData.role === "seller"
                          ? "bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-500 rounded-2xl shadow-lg"
                          : "bg-gray-100 rounded-xl"
                      }`}
                    >
                      <svg
                        className={`w-8 h-8 ${formData.role === "seller" ? "text-white" : "text-gray-600"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <span
                      className={`font-bold text-base ${formData.role === "seller" ? "text-violet-700" : "text-gray-700"}`}
                    >
                      Seller
                    </span>
                    <span className="text-xs text-gray-500 mt-1 font-medium">
                      List & Manage
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "admin" })}
                  className={`p-5 border-2 transition-all transform hover:scale-105 ${
                    formData.role === "admin"
                      ? "border-amber-500 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 shadow-2xl rounded-3xl scale-105"
                      : "border-gray-200 hover:border-amber-300 hover:shadow-lg rounded-2xl"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 flex items-center justify-center mb-3 ${
                        formData.role === "admin"
                          ? "bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-2xl shadow-lg"
                          : "bg-gray-100 rounded-xl"
                      }`}
                    >
                      <svg
                        className={`w-8 h-8 ${formData.role === "admin" ? "text-white" : "text-gray-600"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <span
                      className={`font-bold text-base ${formData.role === "admin" ? "text-amber-700" : "text-gray-700"}`}
                    >
                      Admin
                    </span>
                    <span className="text-xs text-gray-500 mt-1 font-medium">
                      Control Panel
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit */}
                        <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 text-white font-bold rounded-full shadow-2xl hover:shadow-rose-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 inline-block shadow-lg border border-white/50">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
