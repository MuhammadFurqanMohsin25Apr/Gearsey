import { useState } from "react";
import { api } from "~/lib/api";
import { DollarSign, ImagePlus, X, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddProductDialog({
  isOpen,
  onClose,
  onSuccess,
}: AddProductDialogProps) {
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

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("condition", formData.condition);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("is_auction", isAuction.toString());
    formDataToSend.append("sellerId", "mock-seller-id");

    images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      const response = await api.products.create(formDataToSend);
      alert("Product listed successfully!");
      resetForm();
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      condition: "New",
      price: "",
    });
    setIsAuction(false);
    setImages([]);
    setPreviews([]);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isStep1Complete =
    formData.title && formData.description && formData.category;
  const isStep2Complete = formData.price;
  const isStep3Complete = previews.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 border-0 overflow-hidden max-h-[90vh] flex flex-col bg-white">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            New Listing
          </DialogTitle>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <form id="product-form" onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Product Details */}
              <div className="space-y-6">
                {/* Product Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Product Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product title"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Product Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Enter product description"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900 resize-none placeholder-gray-400"
                  />
                </div>

                {/* Category & Condition */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900 bg-white"
                    >
                      <option value="">Select category</option>
                      <option value="Engine">Engine</option>
                      <option value="Brakes">Brakes</option>
                      <option value="Suspension">Suspension</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Transmission">Transmission</option>
                      <option value="Body">Body Parts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900 bg-white"
                    >
                      <option value="New">New</option>
                      <option value="Used">Used</option>
                      <option value="Refurbished">Refurbished</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column - Pricing & Images */}
              <div className="space-y-6">
                {/* Product Images */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Product Images
                  </label>
                  <p className="text-xs text-gray-600 mb-3">
                    Upload 1-4 images (max 4 images)
                  </p>

                  <div className="relative border-2 border-dashed border-red-300 rounded-lg p-8 text-center hover:border-red-400 hover:bg-red-50 transition-all cursor-pointer group">
                    <input
                      type="file"
                      name="images"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="pointer-events-none">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-red-200 transition-colors">
                        <ImagePlus className="w-6 h-6 text-red-600" />
                      </div>
                      <p className="font-bold text-gray-900 text-sm mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {previews.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-gray-700 mb-2">
                        {previews.length} image
                        {previews.length !== 1 ? "s" : ""} uploaded
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {previews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing Information */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    📍 Pricing Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAuction}
                          onChange={(e) => setIsAuction(e.target.checked)}
                          className="w-4 h-4 rounded border-2 border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500"
                        />
                        <span className="font-bold text-gray-900 text-sm">
                          List as Auction (for vintage/rare parts)
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        {isAuction ? "Starting Bid (PKR)" : "Price (PKR)"}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
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
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm text-gray-900 font-bold bg-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-8 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleCancel}
            type="button"
            className="px-6 py-2.5 bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-900 font-bold rounded-lg transition-all text-sm"
          >
            Cancel
          </button>
          <button
            form="product-form"
            type="submit"
            disabled={
              loading ||
              !isStep1Complete ||
              !isStep2Complete ||
              !isStep3Complete
            }
            className="flex-1 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all text-sm disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <>
                <Package className="w-4 h-4" />
                <span>Create Listing</span>
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
