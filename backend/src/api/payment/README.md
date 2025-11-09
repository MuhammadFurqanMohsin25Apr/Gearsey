## Payment API

Domain routes are exposed under `/api/payment`. Authentication middleware should be enforced upstream to validate user identity and ensure proper authorization before payment operations.

### Data Model Snapshot

Payments follow `IPayment` in `src/models/payment.ts`:

```
{
	orderId: string,
	payment_method: "Credit Card" | "Debit Card" | "Cash On Delivery" | "EasyPaisa" | "Bank Transfer",
	amount: number,
	status: "Pending" | "Completed" | "Failed" | "Refunded",
	createdAt: Date,
	updatedAt: Date
}
```

### Endpoints

#### GET `/api/payment/details/:paymentId`
- **Purpose:** Retrieve detailed information about a specific payment transaction.
- **Path Params:**
	- `paymentId` *(string, required)* — The unique MongoDB ObjectId of the payment.
- **Success 200 Response:**

```json
{
	"message": "Payment details fetched successfully",
	"data": {
		"_id": "66f55d621d7e0d1b3ac19999",
		"orderId": "66f33b401d7e0d1b3ac15555",
		"payment_method": "Credit Card",
		"amount": 1245.50,
		"status": "Completed",
		"createdAt": "2025-10-12T16:45:22.331Z",
		"updatedAt": "2025-10-12T16:50:18.442Z",
		"__v": 0
	}
}
```
- **Failure 400 Response:** `{"error": "Payment ID is required"}` — Missing path parameter.
- **Failure 404 Response:** `{"error": "Payment not found"}` — No payment record exists with the provided ID.
- **Failure 400 Response:** `{"error": "<details>"}` — Database query error or invalid payment ID format.

#### GET `/api/payment/details`
- **Purpose:** Retrieve a list of payment transactions for a specific user, sorted by date (most recent first).
- **Query Params:**
	- `limit` *(number, optional, default 10)* — Maximum number of transactions to return.
- **Request Body:**
	- `userId` *(string, required)* — The unique identifier of the user whose transactions to fetch.
- **Success 200 Response:**

```json
{
	"message": "Transactions fetched successfully",
	"count": 3,
	"data": [
		{
			"_id": "66f55d621d7e0d1b3ac19999",
			"amount": 1245.50,
			"status": "Completed"
		},
		{
			"_id": "66f66e731d7e0d1b3ac20000",
			"amount": 320.00,
			"status": "Pending"
		},
		{
			"_id": "66f77f841d7e0d1b3ac21111",
			"amount": 589.99,
			"status": "Completed"
		}
	]
}
```
- **Failure 400 Response:** `{"error": "Invalid limit parameter"}` — Limit query parameter is not a valid number.
- **Failure 400 Response:** `{"error": "<details>"}` — Database query error.
- **Note:** This endpoint uses a GET method but expects `userId` in the request body, which is unconventional. Consider moving `userId` to a path parameter (e.g., `/api/payment/details/user/:userId`) or query parameter for RESTful compliance.

#### POST `/api/payment/create`
- **Purpose:** Create a new payment record associated with an order.
- **Request Body:**

```json
{
	"orderId": "66f33b401d7e0d1b3ac15555",
	"payment_method": "Credit Card",
	"amount": 1245.50
}
```
- **Validation:** All fields (`orderId`, `payment_method`, `amount`) are required. `payment_method` must be one of: "Credit Card", "Debit Card", "Cash On Delivery", "EasyPaisa", "Bank Transfer".
- **Success 201 Response:**

```json
{
	"message": "Payment processed successfully",
	"data": {
		"_id": "66f55d621d7e0d1b3ac19999",
		"orderId": "66f33b401d7e0d1b3ac15555",
		"payment_method": "Credit Card",
		"amount": 1245.50,
		"status": "Pending",
		"createdAt": "2025-10-12T16:45:22.331Z",
		"updatedAt": "2025-10-12T16:45:22.331Z",
		"__v": 0
	}
}
```
- **Failure 400 Response:** `{"error": "Missing required fields"}` — One or more required fields are absent from the request body.
- **Failure 400 Response:** `{"error": "<details>"}` — Database insertion error or validation failure (e.g., invalid payment method).
- **Note:** The success message says "Payment processed successfully" but the status is set to "Pending". Consider updating the message to "Payment created successfully" for clarity.

#### POST `/api/payment/process`
- **Purpose:** Mark a payment as completed, typically after successful transaction processing with a payment gateway.
- **Request Body:**

```json
{
	"paymentId": "66f55d621d7e0d1b3ac19999"
}
```
- **Validation:** `paymentId` is required.
- **Success 200 Response:**

```json
{
	"message": "Payment processed successfully",
	"data": {
		"_id": "66f55d621d7e0d1b3ac19999",
		"orderId": "66f33b401d7e0d1b3ac15555",
		"payment_method": "Credit Card",
		"amount": 1245.50,
		"status": "Completed",
		"createdAt": "2025-10-12T16:45:22.331Z",
		"updatedAt": "2025-10-12T16:50:18.442Z",
		"__v": 0
	}
}
```
- **Failure 400 Response:** `{"error": "Payment ID is required"}` — Missing `paymentId` in request body.
- **Failure 404 Response:** `{"error": "Payment not found"}` — No payment record exists with the provided ID.
- **Failure 400 Response:** `{"error": "<details>"}` — Database update error or invalid payment ID format.
- **Note:** This endpoint does not validate the current payment status before updating. Consider adding checks to prevent processing already completed, failed, or refunded payments.

#### POST `/api/payment/refund`
- **Purpose:** Issue a refund for a payment, marking its status as "Refunded".
- **Request Body:**

```json
{
	"paymentId": "66f55d621d7e0d1b3ac19999"
}
```
- **Validation:** `paymentId` is required.
- **Success 200 Response:**

```json
{
	"message": "Payment refunded successfully",
	"data": {
		"_id": "66f55d621d7e0d1b3ac19999",
		"orderId": "66f33b401d7e0d1b3ac15555",
		"payment_method": "Credit Card",
		"amount": 1245.50,
		"status": "Refunded",
		"createdAt": "2025-10-12T16:45:22.331Z",
		"updatedAt": "2025-10-13T09:22:45.118Z",
		"__v": 0
	}
}
```
- **Failure 400 Response:** `{"error": "Payment ID is required"}` — Missing `paymentId` in request body.
- **Failure 404 Response:** `{"error": "Payment not found"}` — No payment record exists with the provided ID.
- **Failure 400 Response:** `{"error": "<details>"}` — Database update error or invalid payment ID format.
- **Note:** This endpoint does not validate the current payment status or integrate with actual payment gateway refund APIs. Consider adding:
	- Validation to prevent refunding payments that are pending or already refunded
	- Integration with payment gateway APIs to process actual refunds
	- Refund amount tracking if partial refunds are supported

### Notes & Limitations
- **RESTful Convention:** The `GET /api/payment/details` endpoint expects `userId` in the request body, which violates HTTP standards (GET requests should not have bodies). Refactor to use path or query parameters.
- **Status Validation:** Neither `processPayment` nor `refundPayment` validates the current payment status before updating. This could allow:
	- Processing an already completed payment
	- Refunding a pending or failed payment
	- Double-refunding
- **Payment Gateway Integration:** The endpoints update database status but do not integrate with actual payment processors (Stripe, PayPal, etc.). Implement gateway webhooks and API calls for real transaction processing.
- **Security Concerns:**
	- No validation that the requesting user owns the payment/order
	- Missing authentication checks on all endpoints
	- Payment amounts and methods can be modified without authorization
- **Missing Features:**
	- No "Failed" status assignment endpoint
	- No partial refund support
	- No payment method validation at gateway level
	- No transaction ID or gateway reference tracking
- **Error Messages:** All error responses use an `error` key, while success responses use `message` and `data`. Consider standardizing the response structure for consistency.
- **Audit Trail:** The schema lacks fields for tracking:
	- Transaction IDs from payment gateways
	- User who initiated the payment
	- Refund reason or notes
	- Payment gateway response codes
- **Date Sorting:** The `listTransactions` endpoint sorts by `date` field, but the schema uses `createdAt`. This will fail or return unsorted results. Update to sort by `createdAt` instead.
