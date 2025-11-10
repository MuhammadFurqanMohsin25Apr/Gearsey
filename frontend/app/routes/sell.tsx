import { Form, Link, useNavigate } from "react-router";
import type { Route } from "./+types/sell";
import { useState } from "react";
import { api } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Listing - Gearsey" },
    {
      name: "description",
      content: "List your spare parts for sale or auction",
    },
  ];
}

export default function Sell() {
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
