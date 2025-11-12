import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "~/lib/auth-context";

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
    email: "",
    password: "",
    confirmPassword: "",
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
      await signup(formData.email, formData.password, "", "buyer");
      navigate("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <div className="max-w-sm w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-3">
          <h2 className="text-xl font-black text-white mb-1">Create Account</h2>
          <p className="text-gray-400 text-xs">Join the marketplace today</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 text-red-700 px-3 py-2 rounded mb-4 flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                  Confirm
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-3.5 h-3.5 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-0.5"
              />
              <span className="ml-2 text-xs text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-red-600 hover:underline font-semibold">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-red-600 hover:underline font-semibold">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
