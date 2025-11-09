## Order API

Domain routes are exposed under `/api/orders`. Authentication middleware may be enforced upstream to ensure proper user authorization before requests reach these handlers.

### Data Model Snapshot

Orders follow `IOrder` in `src/models/order.ts`:

```
{
	userId: string,
	total_amount: number,
	payment_status: "Pending" | "Paid" | "Failed" | "Refunded",
	delivery_status: "Pending" | "Shipped" | "Delivered" | "Cancelled",
	createdAt: Date,
	updatedAt: Date
}
```

Order items follow `IOrderItem` in `src/models/orderItem.ts`:

```
{
	orderId: string,
	partId: string,
	quantity: number,
	price: number,
	createdAt: Date,
	updatedAt: Date
}
```

### Endpoints

#### GET `/api/orders`
- **Purpose:** Retrieve all orders across the system with optional pagination limit.
- **Query Params:**
	- `limit` *(number, optional, default 10)* — Maximum number of orders returned.
- **Success 200 Response:**

```json
{
	"message": "All orders fetched successfully",
	"orders": [
		{
			"_id": "66f33b401d7e0d1b3ac15555",
			"userId": "6655bb17a8caa6f35dcb1111",
			"total_amount": 1245.50,
			"payment_status": "Paid",
			"delivery_status": "Shipped",
			"createdAt": "2025-10-10T14:22:15.441Z",
			"updatedAt": "2025-10-11T09:15:30.112Z",
			"__v": 0
		}
	]
}
```
- **Failure 400 Response:** `{"message": "Failed to fetch all orders", "error": "<details>"}` — Database query or parsing error.

#### GET `/api/orders/:userId`
- **Purpose:** Retrieve all orders for a specific user with optional pagination limit.
- **Path Params:**
	- `userId` *(string, required)* — The unique identifier of the user.
- **Query Params:**
	- `limit` *(number, optional, default 10)* — Maximum number of orders returned.
- **Success 200 Response:**

```json
{
	"message": "Orders fetched successfully",
	"orders": [
		{
			"_id": "66f33b401d7e0d1b3ac15555",
			"userId": "6655bb17a8caa6f35dcb1111",
			"total_amount": 1245.50,
			"payment_status": "Paid",
			"delivery_status": "Shipped",
			"createdAt": "2025-10-10T14:22:15.441Z",
			"updatedAt": "2025-10-11T09:15:30.112Z",
			"__v": 0
		},
		{
			"_id": "66f44c511d7e0d1b3ac16666",
			"userId": "6655bb17a8caa6f35dcb1111",
			"total_amount": 320.00,
			"payment_status": "Pending",
			"delivery_status": "Pending",
			"createdAt": "2025-10-12T10:05:44.221Z",
			"updatedAt": "2025-10-12T10:05:44.221Z",
			"__v": 0
		}
	]
}
```
- **Failure 403 Response:** `{"message": "Missing userId in request body"}` — Missing path parameter.
- **Failure 400 Response:** `{"message": "Failed to fetch orders", "error": "<details>"}` — Database query error.

#### GET `/api/orders/:userId/:orderId`
- **Purpose:** Retrieve a specific order and its associated order items for a user.
- **Path Params:**
	- `userId` *(string, required)* — The unique identifier of the user.
	- `orderId` *(string, required)* — The unique identifier of the order.
- **Success 200 Response:**

```json
{
	"message": "Order items fetched successfully",
	"order": {
		"_id": "66f33b401d7e0d1b3ac15555",
		"userId": "6655bb17a8caa6f35dcb1111",
		"total_amount": 1245.50,
		"payment_status": "Paid",
		"delivery_status": "Shipped",
		"createdAt": "2025-10-10T14:22:15.441Z",
		"updatedAt": "2025-10-11T09:15:30.112Z",
		"__v": 0
	},
	"items": [
		{
			"_id": "66f33b501d7e0d1b3ac17777",
			"orderId": "66f33b401d7e0d1b3ac15555",
			"partId": "PART-GPS-840",
			"quantity": 1,
			"price": 850.00,
			"createdAt": "2025-10-10T14:22:31.881Z",
			"updatedAt": "2025-10-10T14:22:31.881Z",
			"__v": 0
		},
		{
			"_id": "66f33b501d7e0d1b3ac18888",
			"orderId": "66f33b401d7e0d1b3ac15555",
			"partId": "PART-DT-SWISS",
			"quantity": 1,
			"price": 395.50,
			"createdAt": "2025-10-10T14:22:31.881Z",
			"updatedAt": "2025-10-10T14:22:31.881Z",
			"__v": 0
		}
	]
}
```
- **Failure 403 Response:** `{"message": "Missing userId or orderId in request params"}` — One or both path parameters are absent.
- **Failure 400 Response:** `{"message": "Failed to fetch order items", "error": "<details>"}` — Database lookup error.
- **Note:** Returns `null` for `order` if no matching record is found; items array will be empty if no associated items exist.

#### POST `/api/orders`
- **Purpose:** Create a new order with its associated order items.
- **Request Body:**

```json
{
	"userId": "6655bb17a8caa6f35dcb1111",
	"total_amount": 1245.50,
	"items": [
		{
			"orderId": "66f33b401d7e0d1b3ac15555",
			"partId": "PART-GPS-840",
			"quantity": 1,
			"price": 850.00
		},
		{
			"orderId": "66f33b401d7e0d1b3ac15555",
			"partId": "PART-DT-SWISS",
			"quantity": 1,
			"price": 395.50
		}
	]
}
```
- **Validation:** All fields (`userId`, `total_amount`, `items`) are required. The `items` array must contain at least one item.
- **Success 201 Response:**

```json
{
	"message": "Order created successfully",
	"order": {
		"acknowledged": true,
		"insertedId": "66f33b401d7e0d1b3ac15555"
	},
	"orderItems": {
		"acknowledged": true,
		"insertedCount": 2,
		"insertedIds": {
			"0": "66f33b501d7e0d1b3ac17777",
			"1": "66f33b501d7e0d1b3ac18888"
		}
	}
}
```
- **Failure 400 Response:** `{"message": "Missing required fields: userId, total_amount, items"}` — One or more required fields are missing or items array is empty.
- **Failure 400 Response:** `{"message": "Failed to create order", "error": "<details>"}` — Database insertion error.
- **Note:** The order is created with default status values: `payment_status: "Pending"` and `delivery_status: "Pending"`.

#### PUT `/api/orders/confirm`
- **Purpose:** Confirm an order, updating its payment status to "Confirmed" and delivery status to "Processing".
- **Request Body:**

```json
{
	"userId": "6655bb17a8caa6f35dcb1111",
	"orderId": "66f33b401d7e0d1b3ac15555"
}
```
- **Validation:** Both `userId` and `orderId` are required.
- **Success 200 Response:**

```json
{
	"message": "Order confirmed successfully",
	"updatedOrder": {
		"acknowledged": true,
		"modifiedCount": 1,
		"upsertedId": null,
		"upsertedCount": 0,
		"matchedCount": 1
	}
}
```
- **Failure 403 Response:** `{"message": "Missing userId or orderId in request body"}` — One or both required fields are missing.
- **Failure 404 Response:** `{"message": "Order not found or could not be updated"}` — No matching order exists or update operation failed.
- **Failure 400 Response:** `{"message": "Failed to confirm order", "error": "<details>"}` — Database update error.
- **Note:** The controller currently sets `payment_status: "Confirmed"`, but the schema only allows "Pending", "Paid", "Failed", or "Refunded". Consider using `"Paid"` instead or updating the schema.

#### PUT `/api/orders/cancel`
- **Purpose:** Cancel an order, updating both payment and delivery status to "Cancelled".
- **Request Body:**

```json
{
	"userId": "6655bb17a8caa6f35dcb1111",
	"orderId": "66f33b401d7e0d1b3ac15555"
}
```
- **Validation:** Both `userId` and `orderId` are required.
- **Success 200 Response:**

```json
{
	"message": "Order cancelled successfully",
	"updatedOrder": {
		"acknowledged": true,
		"modifiedCount": 1,
		"upsertedId": null,
		"upsertedCount": 0,
		"matchedCount": 1
	}
}
```
- **Failure 403 Response:** `{"message": "Missing userId or orderId in request body"}` — One or both required fields are missing.
- **Failure 404 Response:** `{"message": "Order not found or could not be updated"}` — No matching order exists or update operation failed.
- **Failure 400 Response:** `{"message": "Failed to cancel order", "error": "<details>"}` — Database update error.
- **Note:** `payment_status: "Cancelled"` is not in the schema enum. Consider using `"Refunded"` or adding "Cancelled" to the payment_status enum.

#### DELETE `/api/orders`
- **Purpose:** Permanently delete an order from the database.
- **Request Body:**

```json
{
	"userId": "6655bb17a8caa6f35dcb1111",
	"orderId": "66f33b401d7e0d1b3ac15555"
}
```
- **Validation:** Both `userId` and `orderId` are required.
- **Success 200 Response:** `{"message": "Order deleted successfully"}`.
- **Failure 403 Response:** `{"message": "Missing userId or orderId in request body"}` — One or both required fields are missing.
- **Failure 404 Response:** `{"message": "Order not found or could not be deleted"}` — No matching order exists or deletion failed.
- **Failure 400 Response:** `{"message": "Failed to delete order", "error": "<details>"}` — Database deletion error.
- **Note:** Deleting an order does not cascade to delete associated order items. Consider implementing cleanup logic to remove orphaned items.

### Notes & Limitations
- **Schema Mismatch:** The `confirmOrder` controller sets `payment_status: "Confirmed"` and `delivery_status: "Processing"`, which are not valid enum values in the schema. The schema allows:
	- `payment_status`: "Pending", "Paid", "Failed", "Refunded"
	- `delivery_status`: "Pending", "Shipped", "Delivered", "Cancelled"
- **Cascading Deletes:** Deleting an order does not automatically remove its associated order items, potentially leaving orphaned records.
- **Mixed Data Access:** The controller uses both Mongoose model methods (`find`, `findOne`) and MongoDB driver methods (`insertOne`, `updateOne`, `deleteOne`). Consider standardizing to one approach for consistency.
- **Authorization:** Currently relies on `userId` matching in queries for security. Implement proper authentication middleware to validate user identity before allowing order operations.
- **Transaction Safety:** Order creation inserts both order and items separately without transaction wrapping. Consider using MongoDB transactions to ensure atomic operations.
- **Item Order ID:** When creating an order via POST, the `items` array includes `orderId` fields, but the order doesn't exist yet. The controller should either auto-populate `orderId` after order creation or accept items without `orderId` in the payload.
