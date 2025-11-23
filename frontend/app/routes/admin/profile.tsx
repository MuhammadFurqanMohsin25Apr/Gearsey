import { useSession } from "~/lib/auth-client";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "~/lib/api";
import { Edit2, Save, X } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: session?.user?.phone || "",
    address: session?.user?.address || "",
  });

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
        setFormData({
          name: response.data?.name || session?.user?.name || "",
          email: response.data?.email || session?.user?.email || "",
          phone: response.data?.phone || session?.user?.phone || "",
          address: response.data?.address || session?.user?.address || "",
        });
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setError("");
    setSuccessMsg("");
    setIsSaving(true);

    try {
      if (!session?.user?.id) {
        throw new Error("User ID not found");
      }

      await api.users.updateProfile(session.user.id, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      setSuccessMsg("Admin profile updated successfully!");
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: session?.user?.phone || "",
      address: session?.user?.address || "",
    });
  };

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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-md flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {successMsg}
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
                  {formData.name || "Admin User"}
                </h2>
                <p className="text-gray-600">{formData.email}</p>
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
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-xl font-semibold ${
                    isEditing
                      ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      : "border-gray-200 bg-gray-50"
                  } transition-all`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled={true}
                  className="w-full px-4 py-3 border-2 rounded-xl font-semibold border-gray-200 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-xl font-semibold ${
                    isEditing
                      ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      : "border-gray-200 bg-gray-50"
                  } transition-all`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-xl font-semibold ${
                    isEditing
                      ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      : "border-gray-200 bg-gray-50"
                  } transition-all`}
                />
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
