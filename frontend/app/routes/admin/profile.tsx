import { useSession } from "~/lib/auth-client";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "~/lib/api";

export function meta() {
  return [
    { title: "Admin Profile - Gearsey" },
    {
      name: "description",
      content: "Admin profile settings and information",
    },
  ];
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProfile() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Protect admin profile - only admins can access
    if (!isPending && (!session || session.user?.role !== "admin")) {
      navigate("/");
      return;
    }

    // Fetch admin profile data
    const fetchAdminData = async () => {
      try {
        const response = await api.get("/api/auth/me");
        setAdminData(response.data);
      } catch (err) {
        setError("Failed to load admin profile");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchAdminData();
    }
  }, [session, isPending, navigate]);

  if (isPending || isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/admin"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Admin Profile
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-6 pb-8 border-b border-gray-200">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {session.user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {session.user?.name || "Admin User"}
                </h2>
                <p className="text-gray-600">{session.user?.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Role:{" "}
                  <span className="font-semibold text-gray-700 capitalize">
                    {session.user?.role}
                  </span>
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {session.user?.name || "Not provided"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {session.user?.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  User ID
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-mono text-sm">
                  {session.user?.id || "Not available"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">
                    {session.user?.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Account Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-green-900 font-medium">
                    Status: Active
                  </span>
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-blue-900 font-medium">
                    Admin Access: Granted
                  </span>
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 border-t border-gray-200 flex gap-4">
              <Link
                to="/admin"
                className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
