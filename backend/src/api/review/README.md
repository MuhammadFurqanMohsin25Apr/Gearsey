## Review API

Domain routes are exposed under `/api/review`. Authentication middleware should be enforced upstream to validate user identity and prevent unauthorized review creation or deletion.

### Data Model Snapshot

Reviews follow `IReview` in `src/models/review.ts`:

```
{
	userId: string,
	partId: string,
	rating: 0 | 1 | 2 | 3 | 4 | 5,
	comment: string,
	createdAt: Date,
	updatedAt: Date
}
```

### Endpoints

#### GET `/api/review`
- **Purpose:** Retrieve all reviews across the platform with optional pagination.
- **Query Params:**
	- `limit` *(number, optional, default 10)* — Maximum number of reviews to return.
- **Success 200 Response:**

```json
{
	"message": "Reviews fetched successfully",
	"count": 2,
	"reviews": [
		{
			"_id": "66f88g951d7e0d1b3ac22222",
			"userId": "6655bb17a8caa6f35dcb1111",
			"partId": "PART-GPS-840",
			"rating": 5,
			"comment": "Excellent fork, exactly as described. Quick shipping!",
			"createdAt": "2025-10-13T11:20:15.441Z",
			"updatedAt": "2025-10-13T11:20:15.441Z",
			"__v": 0
		},
		{
			"_id": "66f99ha61d7e0d1b3ac33333",
			"userId": "6655bb17a8caa6f35dcb2222",
			"partId": "PART-DT-SWISS",
			"rating": 4,
			"comment": "Great wheels but needed some truing out of the box.",
			"createdAt": "2025-10-13T14:35:22.118Z",
			"updatedAt": "2025-10-13T14:35:22.118Z",
			"__v": 0
		}
	]
}
```
- **Failure 400 Response:** `{"message": "Error fetching reviews", "error": "<details>"}` — Database query error.

#### GET `/api/review/:productId`
- **Purpose:** Retrieve all reviews for a specific product/listing.
- **Path Params:**
	- `productId` *(string, required)* — The unique identifier of the product/listing.
- **Query Params:**
	- `limit` *(number, optional, default 10)* — Maximum number of reviews to return.
- **Success 200 Response:**

```json
{
	"message": "Product reviews fetched successfully",
	"reviews": [
		{
			"_id": "66f88g951d7e0d1b3ac22222",
			"userId": "6655bb17a8caa6f35dcb1111",
			"partId": "PART-GPS-840",
			"rating": 5,
			"comment": "Excellent fork, exactly as described. Quick shipping!",
			"createdAt": "2025-10-13T11:20:15.441Z",
			"updatedAt": "2025-10-13T11:20:15.441Z",
			"__v": 0
		},
		{
			"_id": "66faaib71d7e0d1b3ac44444",
			"userId": "6655bb17a8caa6f35dcb3333",
			"partId": "PART-GPS-840",
			"rating": 4,
			"comment": "Very good suspension, minor scratches on the stanchions.",
			"createdAt": "2025-10-13T18:42:09.331Z",
			"updatedAt": "2025-10-13T18:42:09.331Z",
			"__v": 0
		}
	]
}
```
- **Failure 404 Response:** `{"message": "Product ID is required"}` — Missing path parameter.
- **Failure 400 Response:** `{"message": "Error fetching product reviews", "error": "<details>"}` — Database query error.

#### GET `/api/review/user/:userId`
- **Purpose:** Retrieve all reviews written by a specific user.
- **Path Params:**
	- `userId` *(string, required)* — The unique identifier of the user.
- **Query Params:**
	- `limit` *(number, optional, default 10)* — Maximum number of reviews to return.
- **Success 200 Response:**

```json
{
	"message": "User reviews fetched successfully",
	"reviews": [
		{
			"_id": "66f88g951d7e0d1b3ac22222",
			"userId": "6655bb17a8caa6f35dcb1111",
			"partId": "PART-GPS-840",
			"rating": 5,
			"comment": "Excellent fork, exactly as described. Quick shipping!",
			"createdAt": "2025-10-13T11:20:15.441Z",
			"updatedAt": "2025-10-13T11:20:15.441Z",
			"__v": 0
		},
		{
			"_id": "66fbbjc81d7e0d1b3ac55555",
			"userId": "6655bb17a8caa6f35dcb1111",
			"partId": "PART-SRAM-GX",
			"rating": 3,
			"comment": "Decent drivetrain but had some shifting issues.",
			"createdAt": "2025-10-14T09:15:44.552Z",
			"updatedAt": "2025-10-14T09:15:44.552Z",
			"__v": 0
		}
	]
}
```
- **Failure 404 Response:** `{"message": "User ID is required"}` — Missing path parameter.
- **Failure 400 Response:** `{"message": "Error fetching user reviews", "error": "<details>"}` — Database query error.

#### POST `/api/review`
- **Purpose:** Create a new review for a product/part.
- **Request Body:**

```json
{
	"userId": "6655bb17a8caa6f35dcb1111",
	"partId": "PART-GPS-840",
	"rating": 5,
	"comment": "Excellent fork, exactly as described. Quick shipping!"
}
```
- **Validation:** `userId`, `partId`, `rating`, and `comment` are all required. `rating` must be an integer from 0 to 5.
- **Success 201 Response:**

```json
{
	"message": "Review created successfully",
	"review": {
		"_id": "66f88g951d7e0d1b3ac22222",
		"userId": "6655bb17a8caa6f35dcb1111",
		"partId": "PART-GPS-840",
		"rating": 5,
		"comment": "Excellent fork, exactly as described. Quick shipping!",
		"createdAt": "2025-10-13T11:20:15.441Z",
		"updatedAt": "2025-10-13T11:20:15.441Z",
		"__v": 0
	}
}
```
- **Failure 400 Response:** `{"message": "Part ID, User ID and Rating are required. Some are missing."}` — Missing required fields.
- **Failure 400 Response:** `{"message": "Error creating review", "error": "<details>"}` — Database insertion error or validation failure.

#### DELETE `/api/review/:reviewId`
- **Purpose:** Permanently delete a review from the system.
- **Path Params:**
	- `reviewId` *(string, required)* — The unique MongoDB ObjectId of the review to delete.
- **Success 200 Response:**

```json
{
	"message": "Review deleted successfully",
	"review": {
		"_id": "66f88g951d7e0d1b3ac22222",
		"userId": "6655bb17a8caa6f35dcb1111",
		"partId": "PART-GPS-840",
		"rating": 5,
		"comment": "Excellent fork, exactly as described. Quick shipping!",
		"createdAt": "2025-10-13T11:20:15.441Z",
		"updatedAt": "2025-10-13T11:20:15.441Z",
		"__v": 0
	}
}
```
- **Failure 404 Response:** `{"message": "Review ID is required"}` — Missing path parameter.
- **Failure 404 Response:** `{"message": "Review not found"}` — No review exists with the provided ID.
- **Failure 400 Response:** `{"message": "Error deleting review", "error": "<details>"}` — Database deletion error or invalid review ID format.
- **Security Issue:** No validation that the requesting user owns the review. Any authenticated user can delete any review. Implement authorization checks to ensure only review authors or administrators can delete reviews.

### Notes & Limitations
- **Missing Authorization:**
	- No validation that users can only delete their own reviews
	- No admin role checks for privileged operations
	- No verification that users purchased the product before reviewing
- **Missing Features:**
	- No update/edit review endpoint
	- No duplicate review prevention (users can submit multiple reviews for the same product)
	- No helpful/unhelpful voting system
	- No review verification (confirmed purchase badge)
	- No pagination metadata (total count, pages) in product/user review queries
- **Rating Validation:** Ratings allow `0` which might be confusing (typically ratings are 1-5). Consider whether 0 is intentional or should be excluded from the enum.
- **Missing Population:** Review responses don't populate user or part details, forcing clients to make additional requests. Consider using Mongoose's `.populate()` to include user names and part information.
- **Sorting:** Reviews are sorted by `createdAt` in descending order for product and user reviews, but the general `getAllReviews` endpoint returns unsorted results. Consider consistent sorting behavior.
