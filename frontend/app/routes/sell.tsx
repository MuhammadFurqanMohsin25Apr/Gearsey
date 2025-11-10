import { Form, Link, useNavigate, redirect } from "react-router";
import { useState } from "react";
import { api } from "~/lib/api";
import { useAuth } from "~/lib/auth-context";

export function meta() {
  return [
    { title: "Create Listing - Gearsey" },
    {
      name: "description",
      content: "List your spare parts for sale or auction",
    },
  ];
}

export default function Sell() {
  const { user } = useAuth();
  
  // Redirect if not a seller
  if (!user || user.role !== "seller") {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">Only sellers can list products. Please sign up as a seller to access this page.</p>
          <div className="flex gap-3">
            <Link to="/" className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">Go Home</Link>
            <Link to="/signup" className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-colors font-medium">Sign Up as Seller</Link>
          </div>
        </div>
      </div>
    );
  }
  const navigate = useNavigate();
  const [isAuction, setIsAuction] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // Generate previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await api.products.create(formData);
      alert("Product listed successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Listing
          </h1>
          <p className="text-gray-600">
            List your spare parts for sale or create an auction
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Honda Civic 2015 Brake Pads"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={6}
                  placeholder="Provide detailed description of the part..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Engine">Engine Parts</option>
                    <option value="Brakes">Brake Systems</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Transmission">Transmission</option>
                    <option value="Body">Body Parts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing</h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="is_auction"
                    checked={isAuction}
                    onChange={(e) => setIsAuction(e.target.checked)}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    List as Auction (for vintage/rare parts)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isAuction ? "Starting Price (PKR) *" : "Price (PKR) *"}
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="100"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isAuction
                    ? "Set a minimum starting bid amount"
                    : "Set a fixed price for your item"}
                </p>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Images *</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photos (At least 1 required, max 4)
              </label>
              <input
                type="file"
                name="images"
                accept="image/jpeg,image/jpg,image/png"
                multiple
                required
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: JPG, PNG (max 5MB each)
              </p>
            </div>

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hidden seller ID field - in real app, this would come from auth */}
          <input type="hidden" name="sellerId" value="mock-seller-id" />

          {/* Submit */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex gap-4">
              <Link
                to="/dashboard"
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 text-center font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Creating..."
                  : isAuction
                    ? "Create Auction"
                    : "Create Listing"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
