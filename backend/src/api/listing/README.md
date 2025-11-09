## Listing API

Domain routes are exposed under `/api/products`. The router currently requires no authentication middleware, but upstream layers may enforce auth before requests reach these handlers.

### Data Model Snapshot
Listings map to `IListing` in `src/models/listing.ts`:

```
{
	name: string,
	description: string,
	price: number,
	imageId: ObjectId,
	sellerId: ObjectId,
	categoryId: ObjectId,
	condition: "New" | "Used" | "Refurbished",
	is_auction: boolean,
	status: "Active" | "Sold" | "Removed",
	createdAt: Date,
	updatedAt: Date
}
```

> **Heads-up:** The controller uses `title`/`imageUrl` fields when creating and updating records, which do not align with the schema above (`name`/`imageId`). Adjust the controller or payloads accordingly before production use.

### Endpoints

#### GET `/api/products`
- **Purpose:** Fetch a collection of listings with optional category, seller, and text-search filters.
- **Query Params:**
	- `limit` *(number, optional, default 25)* — Maximum number of listings returned.
	- `category` *(string, optional)* — Human-readable category name. The controller resolves it to a `Category` document `_id`.
	- `sellerId` *(string, optional)* — Filters listings created by the given seller.
	- `query` *(string, optional)* — Full-text search phrase matched against `name` and `description` (via MongoDB text index).
- **Success 200 Response:**

```json
{
	"message": "Products fetched successfully",
	"products": [
		{
			"_id": "66f22a201d7e0d1b3ac13337",
			"title": "SRAM GX Eagle Drivetrain",
			"description": "12-speed drivetrain in excellent condition",
			"price": 395,
			"sellerId": "6655bb17a8caa6f35dcb1111",
			"categoryId": {
				"_id": "6655bb17a8caa6f35dcb2222",
				"name": "Drivetrain"
			},
			"imageUrl": "https://cdn.example.com/listings/gx-eagle.jpg",
			"createdAt": "2025-09-18T10:14:28.119Z",
			"updatedAt": "2025-09-21T08:01:04.512Z",
			"__v": 0
		}
	]
}
```
- **Failure 404 Response:** `{"message": "Category not found"}` — Returned if `category` does not match an existing category.
- **Failure 400 Response:** `{"message": "Failed to fetch products", "error": "<details>"}` — General query or database failure.

#### POST `/api/products`
- **Purpose:** Create a new listing document.
- **Request Body:**

```json
{
	"title": "Fox 38 Performance Elite Fork",
	"description": "170mm travel, recently serviced",
	"price": 850,
	"category": "Suspension",
	"imageUrl": "https://cdn.example.com/listings/fox-38.jpg",
	"sellerId": "6655bb17a8caa6f35dcb3333"
}
```
- **Validation:** All fields above are required. `category` must match an existing `Category.name`; otherwise a `403` is returned.
- **Success 201 Response:**

```json
{
	"message": "Product created successfully",
	"product": {
		"acknowledged": true,
		"insertedId": "66f22a201d7e0d1b3ac14444"
	}
}
```
- **Failure 400 Response:** `{"message": "Missing required fields: ..."}` — Triggered when any required field is absent.
- **Failure 403 Response:** `{"message": "Invalid category"}` — Category lookup failed.
- **Failure 400 Response:** `{"message": "Failed to create product", "error": "<details>"}` — Database or validation exception.

#### PUT `/api/products`
- **Purpose:** Update mutable fields on an existing listing.
- **Request Body:**

```json
{
	"productId": "66f22a201d7e0d1b3ac14444",
	"title": "Fox 38 Performance Elite Fork",
	"description": "170mm travel, freshly serviced with new seals",
	"price": 820,
	"category": "Suspension",
	"imageUrl": "https://cdn.example.com/listings/fox-38.jpg"
}
```
- **Validation:** `productId` is required; other fields are optional and only provided keys are updated.
- **Success 200 Response:** `{"message": "Product updated successfully", "updatedProduct": { ... }}` — Returns the post-update document.
- **Failure 404 Response:** `{"message": "Missing productId in request body"}` or `{"message": "Product not found"}` — Missing identifier or no matching record.
- **Failure 400 Response:** `{"message": "Failed to update product", "error": "<details>"}` — General persistence error.
- **Note:** The controller writes `category` and `imageUrl` directly but the schema expects `categoryId` and `imageId`. Ensure payloads match the intended structure or refactor the controller to resolve names/URLs.

#### DELETE `/api/products`
- **Purpose:** Permanently remove a listing.
- **Request Body:** `{ "productId": "66f22a201d7e0d1b3ac14444" }`
- **Success 200 Response:** `{"message": "Product deleted successfully"}`.
- **Failure 404 Response:** `{"message": "Missing productId in request body"}` or `{"message": "Product not found"}` — Identifier missing or record absent.
- **Failure 400 Response:** `{"message": "Failed to delete product", "error": "<details>"}` — Underlying delete operation failed.

### Notes & Limitations
- Category filtering and assignment rely on category names; consider returning canonical IDs to clients to avoid ambiguity.
- Creation uses `Listing.insertOne`, while updates/deletes rely on Mongoose model helpers. Align data access patterns for transactional safety.
- Text search depends on MongoDB text indexes defined on `name` and `description`; ensure the index is built before enabling search in production environments.
