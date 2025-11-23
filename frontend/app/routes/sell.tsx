import { Form, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { api } from "~/lib/api";
import { useSession } from "~/lib/auth-client";
import type { Route } from "./+types/sell";
import {
  Package,
  FileText,
  DollarSign,
  ImagePlus,
  ChevronRight,
  X,
} from "lucide-react";

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
  const { data: session } = useSession();
  const user = session?.user;
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isAuction, setIsAuction] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "New",
    price: "",
    platform_fee: "",
    auctionStartTime: "",
    auctionEndTime: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 4);
    setImages(files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Ensure user is logged in
    if (!user?.id) {
      alert("You must be logged in to list a product");
      setLoading(false);
      return;
    }

    // Validate auction times if listing as auction
    if (isAuction) {
      if (!formData.auctionStartTime || !formData.auctionEndTime) {
        alert("Please set auction start and end times");
        setLoading(false);
        return;
      }

      const startTime = new Date(formData.auctionStartTime);
      const endTime = new Date(formData.auctionEndTime);
      const now = new Date();

      if (startTime < now) {
        alert("Start time must be in the future");
        setLoading(false);
        return;
      }

      if (endTime <= startTime) {
        alert("End time must be after start time");
        setLoading(false);
        return;
      }
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("condition", formData.condition);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("platform_fee", formData.platform_fee);
    formDataToSend.append("is_auction", isAuction.toString());
    if (isAuction) {
      formDataToSend.append("auctionStartTime", formData.auctionStartTime);
      formDataToSend.append("auctionEndTime", formData.auctionEndTime);
    }
    formDataToSend.append("sellerId", user.id);

    images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      const response = await api.products.create(formDataToSend);
      alert("Product listed successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isStep1Complete =
    formData.title && formData.description && formData.category;
  const isStep2Complete = formData.price;
  const isStep3Complete = previews.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl flex flex-col"
        style={{ maxHeight: "calc(100vh - 32px)" }}
      >
        {/* Header - Fixed */}
        <div className="bg-red-600 px-6 py-3 flex items-center justify-between rounded-t-xl flex-shrink-0">
          <div>
            <h1 className="text-xl font-black text-white">Add New Product</h1>
            <p className="text-red-100 text-xs">
              Fill in the details to list your product
            </p>
          </div>
          <Link
            to="/dashboard"
            className="p-2 hover:bg-red-500 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </Link>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-hidden flex">
          <form onSubmit={handleSubmit} className="flex w-full">
            {/* Left Column */}
            <div className="w-1/2 overflow-y-auto px-6 py-5 border-r border-gray-200">
              <div className="space-y-4">
                {/* Product Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Honda Civic Brake Pads"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900 font-medium"
                  />
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Product Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Provide detailed description of the part..."
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900 font-medium resize-none"
                  />
                </div>

                {/* Category & Condition */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm font-medium"
                    >
                      <option value="">Select</option>
                      <option value="Engine">Engine</option>
                      <option value="Brakes">Brakes</option>
                      <option value="Suspension">Suspension</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Transmission">Transmission</option>
                      <option value="Body">Body Parts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Condition *
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm font-medium"
                    >
                      <option value="New">New</option>
                      <option value="Used">Used</option>
                      <option value="Refurbished">Refurbished</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-1/2 overflow-y-auto px-6 py-5">
              <div className="space-y-4">
                {/* Pricing Section */}
                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-red-600" />
                    Pricing Information
                  </h3>

                  <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAuction}
                        onChange={(e) => {
                          const newValue = e.target.checked;
                          console.log("Auction checkbox changed to:", newValue);
                          console.log("Current isAuction state:", isAuction);
                          setIsAuction(newValue);
                        }}
                        className="w-4 h-4 rounded accent-red-600"
                      />
                      <span className="font-bold text-gray-900 text-xs">
                        Enable Auction Mode
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 mt-1 ml-6">
                      Perfect for vintage, rare, or collectible parts. Let
                      buyers bid on your item!
                    </p>
                  </div>

                  {isAuction && (
                    <>
                      <div className="bg-white p-3 rounded-lg border-2 border-amber-300 mb-4">
                        <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">
                          Auction Duration
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                              Start Time *
                            </label>
                            <input
                              type="datetime-local"
                              name="auctionStartTime"
                              value={formData.auctionStartTime}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm text-gray-900 font-medium"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              When should the auction start?
                            </p>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                              End Time *
                            </label>
                            <input
                              type="datetime-local"
                              name="auctionEndTime"
                              value={formData.auctionEndTime}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm text-gray-900 font-medium"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              When should the auction end?
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      {isAuction ? "Starting Bid (PKR) *" : "Price (PKR) *"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-black text-gray-400">
                        ₨
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="100"
                        placeholder="0"
                        className="w-full pl-9 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Platform Fee (PKR) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-black text-gray-400">
                        ₨
                      </span>
                      <input
                        type="number"
                        name="platform_fee"
                        value={formData.platform_fee}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="10"
                        placeholder="0"
                        className="w-full pl-9 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900 font-bold"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This fee is for platform services and will not be visible to customers
                    </p>
                  </div>

                  {formData.price && formData.platform_fee && (
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-700">Price:</span>
                        <span className="text-sm font-bold text-gray-900">₨ {Number(formData.price).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-700">Platform Fee:</span>
                        <span className="text-sm font-bold text-gray-900">₨ {Number(formData.platform_fee).toLocaleString()}</span>
                      </div>
                      <div className="border-t-2 border-green-300 my-2"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black text-gray-900">TOTAL PRICE:</span>
                        <span className="text-lg font-black text-green-600">
                          ₨ {(Number(formData.price) + Number(formData.platform_fee)).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">
                        Customers will see ₨ {Number(formData.price).toLocaleString()} (platform fee hidden)
                      </p>
                    </div>
                  )}
                </div>

                {/* Product Images Section */}
                <div>
                  <h3 className="text-sm font-black text-gray-900 mb-2 flex items-center gap-2">
                    <ImagePlus className="w-4 h-4 text-red-600" />
                    Product Images
                  </h3>

                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">
                    Upload Photos (At least 1, max 4) *
                  </label>

                  <div className="relative border-2 border-dashed border-red-300 rounded-lg p-4 text-center hover:bg-red-50 transition-colors">
                    <input
                      type="file"
                      name="images"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="pointer-events-none">
                      <ImagePlus className="w-8 h-8 text-red-400 mx-auto mb-1" />
                      <p className="font-bold text-gray-900 text-xs">
                        Click to upload or drag
                      </p>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {previews.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-gray-700 mb-2">
                        {previews.length} photo
                        {previews.length !== 1 ? "s" : ""} uploaded
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {previews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="flex gap-3 px-6 py-3 bg-gray-50 border-t border-gray-200 flex-shrink-0 justify-end">
          <Link
            to="/dashboard"
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded-lg transition-all text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={
              loading ||
              !isStep1Complete ||
              !isStep2Complete ||
              !isStep3Complete
            }
            onClick={(e) => {
              const form = (e.target as HTMLButtonElement).closest("form");
              if (form)
                form.dispatchEvent(new Event("submit", { bubbles: true }));
            }}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-lg transition-all text-sm disabled:cursor-not-allowed flex items-center gap-2"
          >
            ✓ Create Product
          </button>
        </div>
      </div>
    </div>
  );
}
