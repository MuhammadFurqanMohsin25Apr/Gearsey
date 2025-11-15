import { useState, useEffect } from "react";
import { api } from "~/lib/api";
import {
  DollarSign,
  ImagePlus,
  X,
  Package,
  ShoppingBag,
  Tag,
  Gavel,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import type { Category, Listing } from "~/types";
import { useSession } from "~/lib/auth-client";

interface EditProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product: Listing | null;
}

export function EditProductDialog({
  isOpen,
  onClose,
  onSuccess,
  product,
}: EditProductDialogProps) {
  const { data: session } = useSession();
  const [isAuction, setIsAuction] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "New",
    price: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = (await api.categories.getAll()) as {
          categories: Category[];
        };
        setCategories(response.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        title: product.name,
        description: product.description,
        category: typeof product.categoryId === 'object' ? product.categoryId._id : product.categoryId,
        condition: product.condition,
        price: product.price.toString(),
      });
      setIsAuction(product.is_auction);
      setExistingImages(product.imageIds || []);
      setNewImages([]);
      setNewPreviews([]);
    }
  }, [product, isOpen]);

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
    setNewImages(files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewPreviews(newPreviews);
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!product?._id) {
      alert("Product ID not found");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("productId", product._id);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("condition", formData.condition);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("is_auction", isAuction.toString());

    newImages.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      const response = await api.products.update(formDataToSend);
      alert("Product updated successfully!");
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to update listing:", error);
      alert("Failed to update listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const isStep1Complete =
    formData.title && formData.description && formData.category;
  const isStep2Complete = formData.price;

  const cardBaseClasses =
    "bg-white rounded-2xl border border-gray-200/70 shadow-sm hover:shadow-lg transition-shadow";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-none w-[100vw] p-0 border-0 overflow-y-auto max-h-[95vh] flex flex-col bg-white shadow-2xl">
        <DialogHeader className="px-8 py-6 border-b border-gray-100 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white flex items-center justify-center shadow-md">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-gray-900">
                Edit Listing
              </DialogTitle>
              <p className="text-sm text-gray-500">
                Update your product details and information.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/80">
          <form
            id="edit-product-form"
            onSubmit={handleSubmit}
            className="p-8 space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Product Details */}
              <div className="space-y-6">
                {/* Product Title Card */}
                <div className={cardBaseClasses + " p-6"}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <label className="block text-base font-bold text-gray-900">
                      Product Title
                    </label>
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Vintage Harley-Davidson Exhaust System"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm text-gray-900 placeholder-gray-400 hover:border-gray-300"
                  />
                </div>

                {/* Product Description Card */}
                <div className={cardBaseClasses + " p-6"}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <label className="block text-base font-bold text-gray-900">
                      Product Description
                    </label>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Describe your product in detail... Include specifications, condition, and any important details."
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm text-gray-900 resize-none placeholder-gray-400 hover:border-gray-300"
                  />
                </div>

                {/* Category & Condition Card */}
                <div className={cardBaseClasses + " p-6"}>
                  <h3 className="text-base font-bold text-gray-900 mb-4">
                    Classification
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        disabled={loadingCategories}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm text-gray-900 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300"
                      >
                        <option value="">
                          {loadingCategories ? "Loading..." : "Select"}
                        </option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Condition
                      </label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                      >
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                        <option value="Refurbished">Refurbished</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Pricing & Images */}
              <div className="space-y-6">
                {/* Product Images Card */}
                <div className={cardBaseClasses + " p-6"}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-gray-900">
                        Product Images
                      </label>
                      <p className="text-xs text-gray-500">
                        Up to 4 high-quality images
                      </p>
                    </div>
                  </div>

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mb-5 pb-5 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Current Images ({existingImages.length})
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        {existingImages.map((image: any, index: number) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm group-hover:shadow-md transition-all">
                              <img
                                src={api.products.getImage(image.fileName)}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute -top-2 -right-2 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                              #{index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-50 transition-all cursor-pointer group">
                    <input
                      type="file"
                      name="images"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="pointer-events-none">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                        <ImagePlus className="w-8 h-8 text-white" />
                      </div>
                      <p className="font-bold text-gray-900 text-base mb-1">
                        Add new images or click to browse
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        PNG, JPG, JPEG • Max 10MB per file
                      </p>
                    </div>
                  </div>

                  {/* New Image Previews */}
                  {newPreviews.length > 0 && (
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {newPreviews.length} new image
                          {newPreviews.length !== 1 ? "s" : ""} selected
                        </p>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {newPreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-green-200 shadow-sm group-hover:shadow-md transition-all">
                              <img
                                src={preview}
                                alt={`New Preview ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute -top-2 -right-2 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                              New
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-sm border border-blue-200/70 p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                      Pricing Information
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {/* Auction Toggle */}
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-blue-300 transition-all">
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={isAuction}
                            onChange={(e) => setIsAuction(e.target.checked)}
                            className="w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Gavel className="w-4 h-4 text-blue-600" />
                            <span className="font-bold text-gray-900 text-sm">
                              Enable Auction Mode
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Perfect for vintage, rare, or collectible parts. Let
                            buyers bid on your item!
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Price Input */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        {isAuction ? (
                          <>
                            <Gavel className="w-4 h-4 text-blue-600" />
                            Starting Bid Amount
                          </>
                        ) : (
                          <>
                            <Tag className="w-4 h-4 text-gray-600" />
                            Fixed Price
                          </>
                        )}
                      </label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <span className="text-2xl font-black text-gray-400">
                            ₨
                          </span>
                        </div>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="100"
                          placeholder="0"
                          className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg text-gray-900 font-bold bg-white placeholder-gray-300 hover:border-gray-300"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                          PKR
                        </div>
                      </div>
                      {formData.price && (
                        <p className="text-xs text-gray-600 mt-2 font-medium">
                          ≈ $
                          {Math.round(
                            parseFloat(formData.price) / 280
                          ).toLocaleString()}{" "}
                          USD
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Enhanced Footer */}
        <div className="flex items-center gap-4 px-8 py-5 bg-white border-t-2 border-gray-200 flex-shrink-0 shadow-inner">
          <button
            onClick={handleCancel}
            type="button"
            className="px-8 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-900 font-bold rounded-xl transition-all text-sm shadow-sm hover:shadow"
          >
            Cancel
          </button>
          <button
            form="edit-product-form"
            type="submit"
            disabled={loading || !isStep1Complete || !isStep2Complete}
            className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                <span>Updating Your Listing...</span>
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                <span>Save Changes</span>
                {!isStep1Complete || !isStep2Complete ? (
                  <AlertCircle className="w-4 h-4 ml-1" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 ml-1" />
                )}
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
