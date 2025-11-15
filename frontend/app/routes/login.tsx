import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { authClient, useSession } from "~/lib/auth-client";

export function meta() {
  return [
    { title: "Login - Gearsey" },
    { name: "description", content: "Sign in to your Gearsey account" },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in (client-side check)
  useEffect(() => {
    // Only check after session has loaded
    if (!isPending && session?.user) {
      // Redirect based on user role
      const role = session.user.role || "buyer";
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "seller") {
        navigate("/dashboard", { replace: true });
      } else {
        // buyer, customer, or any other role
        navigate("/products", { replace: true });
      }
    }
  }, [session?.user?.id, session?.user?.role, isPending, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onRequest: () => {
            // Show loading state
          },
          onSuccess: (ctx) => {
            // Successfully signed in
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Login failed");
          },
        }
      );

      if (signInError) {
        setError(signInError.message || "Login failed");
      } else if (data?.user) {
        // Redirect based on user role after successful login
        const userRole = data.user.role || "buyer";
        if (userRole === "admin") {
          navigate("/admin", { replace: true });
        } else if (userRole === "seller") {
          navigate("/dashboard", { replace: true });
        } else {
          // buyer, customer, or any other role
          navigate("/products", { replace: true });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
          <h2 className="text-xl font-black text-white mb-1">Welcome Back!</h2>
          <p className="text-gray-400 text-xs">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 text-red-700 px-3 py-2 rounded mb-4 flex items-center text-sm">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
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
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                />
                <span className="ml-2 text-gray-600 text-xs">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
