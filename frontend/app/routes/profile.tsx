import { useState } from "react";
import { useSession } from "~/lib/auth-client";
import type { Route } from "./+types/profile";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Package,
  ShoppingBag,
  Award,
  Edit2,
  Save,
  X,
} from "lucide-react";

export function meta() {
  return [
    { title: "Profile - Gearsey" },
    { name: "description", content: "Manage your profile" },
  ];
}

export default function Profile() {
  const { data: session } = useSession();
  const user = session?.user;
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+92 300 1234567",
    address: "Lahore, Punjab, Pakistan",
    bio: "Passionate about selling quality automotive parts and electronics.",
    shopName: "Premium Auto Parts",
    businessAddress: "123 Main Street, Lahore",
    taxId: "NTN-1234567",
  });

  // Mock stats
  const stats = {
    totalSales: 156,
    totalRevenue: 2450000,
    rating: 4.8,
    reviews: 89,
    memberSince: "January 2024",
    successRate: 94,
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // TODO: API call to update profile
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "+92 300 1234567",
      address: "Lahore, Punjab, Pakistan",
      bio: "Passionate about selling quality automotive parts and electronics.",
      shopName: "Premium Auto Parts",
      businessAddress: "123 Main Street, Lahore",
      taxId: "NTN-1234567",
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
                  <User className="w-16 h-16 text-white" />
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-1">
                  {formData.name || "User"}
                </h2>
                <p className="text-gray-600 mb-2">{formData.email}</p>
                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-bold">
                  {user?.role === "seller"
                    ? "✅ Verified Seller"
                    : user?.role === "buyer"
                      ? "👤 Buyer"
                      : "👑 Admin"}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </span>
                  <span className="text-gray-900 font-bold">
                    {stats.memberSince}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Rating
                  </span>
                  <span className="text-gray-900 font-bold">
                    {stats.rating} ⭐
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm font-semibold flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Success Rate
                  </span>
                  <span className="text-gray-900 font-bold">
                    {stats.successRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            {user?.role === "seller" && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-black text-gray-900 mb-4">
                  Performance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">
                          Total Sales
                        </p>
                        <p className="text-xl font-black text-gray-900">
                          {stats.totalSales}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">
                          Revenue
                        </p>
                        <p className="text-xl font-black text-gray-900">
                          PKR {stats.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">
                          Reviews
                        </p>
                        <p className="text-xl font-black text-gray-900">
                          {stats.reviews}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-gray-900">
                  Personal Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-all flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-md flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
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
                        ? "border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 bg-gray-50"
                    } transition-all`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl font-semibold ${
                      isEditing
                        ? "border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 bg-gray-50"
                    } transition-all`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
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
                        ? "border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 bg-gray-50"
                    } transition-all`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
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
                        ? "border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 bg-gray-50"
                    } transition-all`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-4 py-3 border-2 rounded-xl font-semibold ${
                      isEditing
                        ? "border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 bg-gray-50"
                    } transition-all`}
                  />
                </div>
              </div>
            </div>

            {/* Business Information (for sellers) */}
            {user?.role === "seller" && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-black text-gray-900 mb-6">
                  Business Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Shop Name
                    </label>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-xl font-semibold ${
                        isEditing
                          ? "border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-gray-200 bg-gray-50"
                      } transition-all`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Tax ID / NTN
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-xl font-semibold ${
                        isEditing
                          ? "border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-gray-200 bg-gray-50"
                      } transition-all`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Business Address
                    </label>
                    <input
                      type="text"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-xl font-semibold ${
                        isEditing
                          ? "border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-gray-200 bg-gray-50"
                      } transition-all`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Account Security */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-2xl font-black text-gray-900 mb-6">
                Account Security
              </h3>
              <div className="space-y-4">
                <button className="w-full px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 font-bold rounded-xl transition-all text-left flex items-center justify-between">
                  <span>Change Password</span>
                  <svg
                    className="w-5 h-5"
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
                <button className="w-full px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 font-bold rounded-xl transition-all text-left flex items-center justify-between">
                  <span>Two-Factor Authentication</span>
                  <svg
                    className="w-5 h-5"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
