import { useState, useEffect } from "react";
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
import { api } from "~/lib/api";
import type { Listing, ProductsResponse } from "~/types";

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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Listings state
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProducts: 0,
    activeListings: 0,
    soldListings: 0,
    rating: 0,
    reviews: 0,
    memberSince: "January 2024",
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // Update form data when user session loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });

      // Fetch seller stats if user is a seller
      if (user.role === "seller" && user.id) {
        fetchSellerStats(user.id);
        fetchSellerListings(user.id);
      }
    }
  }, [user]);

  const fetchSellerListings = async (userId: string) => {
    setIsLoadingListings(true);
    try {
      const response = (await api.products.getAll({
        sellerId: userId,
      })) as ProductsResponse;
      const listings = response.products || [];
      setMyListings(listings);

      // Calculate total and active listings from the actual data
      const activeListings = listings.filter((l: Listing) => {
        if (l.is_auction && l.auction) {
          return l.auction.status === "Active";
        }
        return l.status === "Active";
      });

      const soldListings = listings.filter((l: Listing) => {
        if (l.is_auction && l.auction) {
          return l.auction.status === "Closed";
        }
        return l.status === "Sold";
      });

      // Update stats with actual listing counts
      setStats((prev) => ({
        ...prev,
        totalProducts: listings.length,
        activeListings: activeListings.length,
        soldListings: soldListings.length,
      }));
    } catch (error) {
      console.error("Failed to fetch seller listings:", error);
    } finally {
      setIsLoadingListings(false);
    }
  };

  const fetchSellerStats = async (userId: string) => {
    setLoadingStats(true);
    try {
      const response = await api.users.getStats(userId);
      if (response?.stats) {
        setStats(response.stats);
      }
    } catch (err) {
      console.error("Error fetching seller stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

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
    setSuccess("");
    setIsSaving(true);

    try {
      if (!user?.id) {
        throw new Error("User ID not found");
      }

      console.log("Saving profile with user ID:", user.id);
      console.log("Update data:", {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      const response = await api.users.updateProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      console.log("Update response:", response);

      if (response) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);

        // Update local form data with the response
        if (response.user) {
          setFormData({
            name: response.user.name || formData.name,
            email: response.user.email || formData.email,
            phone: response.user.phone || formData.phone,
            address: response.user.address || formData.address,
          });
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      const errorMessage =
        err?.message || err?.data?.message || "Failed to update profile";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    // Reset form data
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
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
                          Total Products
                        </p>
                        <p className="text-xl font-black text-gray-900">
                          {stats.totalProducts}
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
                          Active Listings
                        </p>
                        <p className="text-xl font-black text-gray-900">
                          {stats.activeListings}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">
                          Sold Products
                        </p>
                        <p className="text-xl font-black text-gray-900">
                          {stats.soldListings}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
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

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
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

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
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
            {/* Error and Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-700">
                {success}
              </div>
            )}

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
                    disabled={true}
                    className="w-full px-4 py-3 border-2 rounded-xl font-semibold border-gray-200 bg-gray-50"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
