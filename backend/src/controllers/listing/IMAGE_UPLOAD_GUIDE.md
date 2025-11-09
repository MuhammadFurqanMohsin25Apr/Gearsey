# Image Upload and Management Guide

This guide explains how to use the image upload functionality for product listings in the Gearsey backend.

## Overview

The system stores product images in two places:
1. **File System**: Physical image files are stored in `public/products/` directory
2. **Database**: Image metadata (filename, mime type, size, listingId) is stored in the `Image` collection

## API Endpoints

### 1. Create Product with Images

**Endpoint**: `POST /api/listing`

**Content-Type**: `multipart/form-data`

**Required Fields**:
- `title` (string): Product title
- `description` (string): Product description
- `price` (number): Product price
- `category` (string): Category name (must exist in Categories collection)
- `sellerId` (string): ObjectId of the seller
- `images` (files): Array of image files (JPG/PNG only)

**Optional Fields**:
- `condition` (string): "New", "Used", or "Refurbished" (default: "Used")
- `is_auction` (boolean): Whether this is an auction listing (default: false)

**Example using cURL**:
```bash
curl -X POST http://localhost:3000/api/listing \
  -F "title=Gaming Laptop" \
  -F "description=High-performance gaming laptop" \
  -F "price=1299.99" \
  -F "category=Electronics" \
  -F "sellerId=507f1f77bcf86cd799439011" \
  -F "condition=Used" \
  -F "is_auction=false" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.png"
```

**Example using JavaScript (fetch)**:
```javascript
const formData = new FormData();
formData.append('title', 'Gaming Laptop');
formData.append('description', 'High-performance gaming laptop');
formData.append('price', '1299.99');
formData.append('category', 'Electronics');
formData.append('sellerId', '507f1f77bcf86cd799439011');
formData.append('condition', 'Used');
formData.append('is_auction', 'false');

// Add multiple images
const fileInput = document.querySelector('input[type="file"]');
for (const file of fileInput.files) {
  formData.append('images', file);
}

const response = await fetch('http://localhost:3000/api/listing', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);
```

**Response**:
```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop",
    "price": 1299.99,
    "condition": "Used",
    "is_auction": false,
    "status": "Active",
    "sellerId": "507f1f77bcf86cd799439011",
    "categoryId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Electronics",
      "description": "Electronic devices"
    },
    "imageIds": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "fileName": "1698345600000-a1b2c3d4e5f6g7h8.jpg",
        "mime": "image/jpg",
        "size": 245678
      },
      {
        "_id": "507f1f77bcf86cd799439014",
        "fileName": "1698345601000-i9j0k1l2m3n4o5p6.png",
        "mime": "image/png",
        "size": 189234
      }
    ],
    "createdAt": "2025-10-27T10:00:00.000Z",
    "updatedAt": "2025-10-27T10:00:00.000Z"
  }
}
```

### 2. Update Product (with optional new images)

**Endpoint**: `PUT /api/listing`

**Content-Type**: `multipart/form-data`

**Required Fields**:
- `productId` (string): ObjectId of the product to update

**Optional Fields** (only include fields you want to update):
- `title` (string): New product title
- `description` (string): New description
- `price` (number): New price
- `category` (string): New category name
- `condition` (string): "New", "Used", or "Refurbished"
- `is_auction` (boolean): Whether this is an auction listing
- `images` (files): Array of NEW images to add (existing images are kept)

**Example using cURL**:
```bash
curl -X PUT http://localhost:3000/api/listing \
  -F "productId=507f1f77bcf86cd799439011" \
  -F "price=1199.99" \
  -F "images=@/path/to/new_image.jpg"
```

**Response**: Similar to create product response

### 3. Get Products

**Endpoint**: `GET /api/listing`

**Query Parameters** (all optional):
- `limit` (number): Maximum number of products to return (default: 25)
- `category` (string): Filter by category name
- `sellerId` (string): Filter by seller ObjectId
- `query` (string): Text search in product name and description

**Example**:
```bash
# Get all products
GET /api/listing

# Get products in Electronics category, limit 10
GET /api/listing?category=Electronics&limit=10

# Search for "laptop"
GET /api/listing?query=laptop

# Get products by specific seller
GET /api/listing?sellerId=507f1f77bcf86cd799439011
```

**Response**:
```json
{
  "message": "Products fetched successfully",
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Gaming Laptop",
      "description": "High-performance gaming laptop",
      "price": 1199.99,
      "categoryId": {
        "name": "Electronics",
        "description": "Electronic devices"
      },
      "imageIds": [
        {
          "fileName": "1698345600000-a1b2c3d4e5f6g7h8.jpg",
          "mime": "image/jpg",
          "size": 245678
        }
      ],
      "sellerId": "507f1f77bcf86cd799439011",
      "condition": "Used",
      "is_auction": false,
      "status": "Active",
      "createdAt": "2025-10-27T10:00:00.000Z",
      "updatedAt": "2025-10-27T10:00:00.000Z"
    }
  ]
}
```

### 4. Get Image

**Endpoint**: `GET /api/listing/images/:filename`

**Parameters**:
- `filename` (string): The filename from the `imageIds.fileName` field

**Example**:
```bash
GET /api/listing/images/1698345600000-a1b2c3d4e5f6g7h8.jpg
```

**Response**: The actual image file (served with appropriate Content-Type header)

**Usage in Frontend**:
```html
<!-- Direct image URL -->
<img src="http://localhost:3000/api/listing/images/1698345600000-a1b2c3d4e5f6g7h8.jpg" 
     alt="Product Image" />
```

```javascript
// In React/JSX
const ImageDisplay = ({ product }) => {
  return (
    <div>
      {product.imageIds.map((image) => (
        <img 
          key={image._id}
          src={`http://localhost:3000/api/listing/images/${image.fileName}`}
          alt={product.name}
        />
      ))}
    </div>
  );
};
```

### 5. Delete Product

**Endpoint**: `DELETE /api/listing`

**Content-Type**: `application/json`

**Required Fields**:
- `productId` (string): ObjectId of the product to delete

**Example**:
```bash
curl -X DELETE http://localhost:3000/api/listing \
  -H "Content-Type: application/json" \
  -d '{"productId": "507f1f77bcf86cd799439011"}'
```

**Response**:
```json
{
  "message": "Product deleted successfully"
}
```

**Note**: This also deletes associated image records from the database.

## Image Specifications

- **Supported Formats**: JPG/JPEG and PNG only
- **Storage Location**: `public/products/` directory
- **Filename Format**: `{timestamp}-{random-hex}.{extension}`
  - Example: `1698345600000-a1b2c3d4e5f6g7h8.jpg`
- **Size**: No specific limit, but handled by multer configuration

## Database Schema

### Image Document
```typescript
{
  _id: ObjectId,
  fileName: string,           // Unique filename
  mime: "image/jpg" | "image/png",
  size: number,               // File size in bytes
  listingId: ObjectId,        // Reference to Listing
  createdAt: Date,
  updatedAt: Date
}
```

### Listing Document (relevant fields)
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  price: number,
  imageIds: ObjectId[],       // Array of Image references
  sellerId: ObjectId,
  categoryId: ObjectId,
  condition: "New" | "Used" | "Refurbished",
  is_auction: boolean,
  status: "Active" | "Sold" | "Removed",
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

Common error responses:

- **400 Bad Request**: Missing required fields or invalid data
  ```json
  {
    "message": "Failed to create product",
    "error": "Missing required fields: title, description, price, category, sellerId, and at least one image"
  }
  ```

- **403 Forbidden**: Invalid category
  ```json
  {
    "message": "Invalid category"
  }
  ```

- **404 Not Found**: Product or image not found
  ```json
  {
    "message": "Product not found"
  }
  ```

- **400 Bad Request**: Unsupported image format
  ```json
  {
    "message": "Failed to create product",
    "error": "Unsupported image format: image/gif. Only JPG and PNG are supported."
  }
  ```

## Complete Frontend Example (React)

```javascript
import { useState } from 'react';

const CreateProductForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    sellerId: '507f1f77bcf86cd799439011', // Replace with actual user ID
    condition: 'Used',
    is_auction: false
  });
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('sellerId', formData.sellerId);
    data.append('condition', formData.condition);
    data.append('is_auction', formData.is_auction);
    
    // Append all selected images
    for (const image of images) {
      data.append('images', image);
    }

    try {
      const response = await fetch('http://localhost:3000/api/listing', {
        method: 'POST',
        body: data
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('Product created:', result.product);
        alert('Product created successfully!');
      } else {
        console.error('Error:', result);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Failed to create product');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />
      
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        required
      />
      
      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({...formData, price: e.target.value})}
        required
      />
      
      <select
        value={formData.category}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
      >
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        {/* Add more categories */}
      </select>
      
      <select
        value={formData.condition}
        onChange={(e) => setFormData({...formData, condition: e.target.value})}
      >
        <option value="New">New</option>
        <option value="Used">Used</option>
        <option value="Refurbished">Refurbished</option>
      </select>
      
      <label>
        <input
          type="checkbox"
          checked={formData.is_auction}
          onChange={(e) => setFormData({...formData, is_auction: e.target.checked})}
        />
        Is Auction
      </label>
      
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        multiple
        onChange={(e) => setImages(Array.from(e.target.files))}
        required
      />
      
      <button type="submit">Create Product</button>
    </form>
  );
};

export default CreateProductForm;
```

## Notes

- Images are stored with unique filenames to prevent conflicts
- When updating a product, new images are ADDED to existing ones (they don't replace)
- Deleting a product also deletes its image metadata from the database
- The `public/products/` directory is created automatically if it doesn't exist
- All image operations are wrapped in try-catch blocks for error handling
