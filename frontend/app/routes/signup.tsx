import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { authClient, useSession } from "~/lib/auth-client";

export function meta() {
  return [
    { title: "Sign Up - Gearsey" },
    { name: "description", content: "Create your Gearsey account" },
  ];
}

export default function Signup() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in (client-side check)
  useEffect(() => {
    if (session?.user) {
      const role = session.user.role || "customer";
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "seller") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/products", { replace: true });
      }
    }
  }, [session, navigate]);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Move to step 2
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signUpError } = await authClient.signUp.email(
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          role: formData.role,
          rating: 0,
          total_reviews: 0,
        },
        {
          onRequest: () => {
            // Show loading state
          },
          onSuccess: async (ctx) => {            
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Signup failed");
          },
        }
      );
      

      if (signUpError) {
        setError(signUpError.message || "Signup failed");
      } else if (data?.user) {
        // Wait a moment for session to update, then redirect based on role
        setTimeout(() => {
          const userRole = formData.role || "customer";
          if (userRole === "admin") {
            navigate("/admin", { replace: true });
          } else if (userRole === "seller") {
            navigate("/dashboard", { replace: true });
          } else {
            // customer, customer, or any other role
            navigate("/products", { replace: true });
          }
        }, 500);
      }
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

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-3">
          <h2 className="text-xl font-black text-white mb-1">
            {step === 1 ? "Create Account" : "Complete Your Profile"}
          </h2>
          <p className="text-gray-400 text-xs">
            {step === 1
              ? "Step 1 of 2: Account credentials"
              : "Step 2 of 2: Personal information"}
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 text-red-700 px-3 py-2 rounded mb-4 flex items-center text-sm">
              <svg
                className="w-4 h-4 mr-2 shrink-0"
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

          {/* Step 1: Email and Password */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              {/* Email */}
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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
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
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide"
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
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900"
                  placeholder="••••••••"
                />
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
                  <Link
                    to="/terms"
                    className="text-red-600 hover:underline font-semibold"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-red-600 hover:underline font-semibold"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Next Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
              >
                <span>Next Step</span>
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </form>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide"
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
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900"
                  placeholder="John Doe"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900"
                  placeholder="+92 300 1234567"
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900"
                  placeholder="City, State"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide"
                >
                  I want to
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900 bg-white"
                >
                  <option value="customer">Buy auto parts</option>
                  <option value="seller">Sell auto parts</option>
                  <option value="admin">Manage the platform (Admin)</option>
                </select>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-all text-sm uppercase tracking-wide"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
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
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
