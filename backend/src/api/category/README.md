## Category API

Routes mount under `/api/category`. These handlers require JSON bodies and expect upstream middleware to attach authentication context if needed.

### Data Model Snapshot
Category documents follow `ICategory` in `src/models/category.ts`:

```
{
	name: string,
	createdAt: Date,
	updatedAt: Date
}
```

> ⚠️ Current controller logic references a `description` field, but the schema only persists `name`. Until the schema is expanded, any supplied descriptions are ignored.

### Endpoints

#### GET `/api/category`
- **Purpose:** Fetch all categories.
- **Success 200 Response:**

```json
{
	"message": "Categories fetched successfully",
	"categories": [
		{
			"_id": "66f229f3f838d7097bca1111",
			"name": "Suspension",
			"createdAt": "2025-09-17T18:04:35.812Z",
			"updatedAt": "2025-09-17T18:04:35.812Z",
			"__v": 0
		}
	]
}
```
- **Failure 400 Response:** Includes `message` and `error` string when the database query fails.

#### POST `/api/category`
- **Purpose:** Create a new category.
- **Request Body:**

```json
{
	"name": "Wheelsets",
	"description": "Carbon and alloy wheel upgrades" // currently ignored due to schema mismatch
}
```
- **Success 201 Response:**

```json
{
	"message": "Category created successfully",
	"category": {
		"_id": "66f229f3f838d7097bca2222",
		"name": "Wheelsets",
		"createdAt": "2025-09-24T10:12:07.194Z",
		"updatedAt": "2025-09-24T10:12:07.194Z",
		"__v": 0
	}
}
```
- **Failure 404 Response:** Missing `name` or `description` in payload.
- **Failure 400 Response:** Duplicate `name` or other persistence errors; response includes explanatory `message`.

#### PUT `/api/category`
- **Purpose:** Update an existing category's name (and logically description).
- **Request Body:**

```json
{
	"id": "66f229f3f838d7097bca2222",
	"name": "Performance Wheelsets",
	"description": "High-performance wheels" // ignored until schema includes this field
}
```
- **Success 200 Response:**

```json
{
	"message": "Category updated successfully",
	"category": {
		"_id": "66f229f3f838d7097bca2222",
		"name": "Performance Wheelsets",
		"createdAt": "2025-09-24T10:12:07.194Z",
		"updatedAt": "2025-09-24T12:01:33.908Z",
		"__v": 0
	}
}
```
- **Failure 404 Response:** Missing `id`, `name`, or `description` in payload.
- **Failure 400 Response:** Category not found or database error; includes `error` string.

#### DELETE `/api/category`
- **Purpose:** Remove a category by ID.
- **Request Body:**

```json
{
	"id": "66f229f3f838d7097bca2222"
}
```
- **Success 200 Response:**

```json
{
	"message": "Category deleted successfully",
	"category": {
		"_id": "66f229f3f838d7097bca2222",
		"name": "Performance Wheelsets",
		"createdAt": "2025-09-24T10:12:07.194Z",
		"updatedAt": "2025-09-24T12:01:33.908Z",
		"__v": 0
	}
}
```
- **Failure 404 Response:** Missing `id` in payload.
- **Failure 400 Response:** Category not found or deletion failure; includes `error` string.

### Notes & Follow-ups
- Align the Mongoose schema with controller expectations by adding a `description` field or removing it from the handlers.
- Add request validation (e.g., zod/Joi) to provide cleaner error messaging and type coercion.
- Consider soft deletes if categories are referenced by listings/auctions to avoid dangling foreign keys.

