import { useState } from "react";
import { useSession } from "~/lib/auth-client";
import type { Route } from "./+types/admin-profile";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Award,
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  Edit2,
  Save,
  X,
} from "lucide-react";

export function meta() {
  return [
    { title: "Admin Profile - Gearsey" },
    { name: "description", content: "Manage your admin profile" },
  ];
}

export default function AdminProfile() {
  const { data: session } = useSession();
  const user = session?.user;
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+92 300 1234567",
    address: "Lahore, Punjab, Pakistan",
    bio: "Administrator managing the Gearsey marketplace platform.",
    adminLevel: "Super Admin",
    department: "Platform Management",
    employeeId: "ADM-001",
  });

  // Mock stats
  const stats = {
    totalUsers: 5632,
    totalProducts: 1247,
    totalOrders: 892,
    totalRevenue: 4523000,
    platformUptime: "99.9%",
    memberSince: "January 2023",
    resolvedIssues: 245,
    activeReports: 12,
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
      bio: "Administrator managing the Gearsey marketplace platform.",
      adminLevel: "Super Admin",
      department: "Platform Management",
      employeeId: "ADM-001",
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Admin Profile
          </h1>
          <p className="text-gray-600">
            Manage your administrator account and platform access
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
                  <Shield className="w-16 h-16 text-white" />
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-1">
                  {formData.name || "Admin"}
                </h2>
                <p className="text-gray-600 mb-2">{formData.email}</p>
                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full text-sm font-bold">
                  👑 {formData.adminLevel}
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
                    <Award className="w-4 h-4" />
                    Platform Uptime
                  </span>
                  <span className="text-gray-900 font-bold">
                    {stats.platformUptime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Resolved Issues
                  </span>
                  <span className="text-gray-900 font-bold">
                    {stats.resolvedIssues}
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                Platform Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">
                        Total Users
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        {stats.totalUsers.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">
                        Total Products
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        {stats.totalProducts.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">
                        Total Orders
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        {stats.totalOrders.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">
                        Total Revenue
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        PKR {stats.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
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
                        ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
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
                        ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
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
                        ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
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
                        ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
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
                        ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        : "border-gray-200 bg-gray-50"
                    } transition-all`}
                  />
                </div>
              </div>
            </div>

            {/* Admin Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-2xl font-black text-gray-900 mb-6">
                Administrator Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin Level
                  </label>
                  <input
                    type="text"
                    name="adminLevel"
                    value={formData.adminLevel}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl font-semibold ${
                      isEditing
                        ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        : "border-gray-200 bg-gray-50"
                    } transition-all`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    disabled
                    className="w-full px-4 py-3 border-2 rounded-xl font-semibold border-gray-200 bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl font-semibold ${
                      isEditing
                        ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        : "border-gray-200 bg-gray-50"
                    } transition-all`}
                  />
                </div>
              </div>
            </div>

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
                <button className="w-full px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 font-bold rounded-xl transition-all text-left flex items-center justify-between">
                  <span>Admin Access Logs</span>
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

            {/* Activity Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-2xl font-black text-gray-900 mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      Approved 5 new sellers
                    </p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      Reviewed 12 products
                    </p>
                    <p className="text-sm text-gray-600">5 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      Updated platform policies
                    </p>
                    <p className="text-sm text-gray-600">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
