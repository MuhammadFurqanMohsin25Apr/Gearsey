## Auction API

Domain routes are exposed under `/api/auction`. Authentication middleware is expected to run ahead of this router (see `src/server.ts`) so requests should include the appropriate session context (e.g., bearer token) if authorization rules are introduced later.

### Data Model Snapshot
Auction documents follow `IAuction` in `src/models/auction.ts`:

```
{
	partId: string,
	start_price: number,
	current_price: number,
	start_time: Date,
	end_time: Date,
	status: "Active" | "Closed" | "Cancelled",
	winnerId?: string
}
```

### Endpoints

#### GET `/api/auction`
- **Purpose:** Retrieve a paginated slice of auctions filtered by optional `start_time` and `end_time` equality matches.
- **Query Params:**
	- `limit` *(number, optional, default 10)* — Max documents returned.
	- `start_time` *(ISO 8601 string, optional)* — Only auctions whose `start_time` equals this value are returned.
	- `end_time` *(ISO 8601 string, optional)* — Only auctions whose `end_time` equals this value are returned.
- **Success 200 Response:**

```json
{
	"auctions": [
		{
			"_id": "66f114f71d7e0d1b3ac11111",
			"partId": "PART-GPS-840",
			"start_price": 400,
			"current_price": 512,
			"start_time": "2025-10-01T10:00:00.000Z",
			"end_time": "2025-10-08T10:00:00.000Z",
			"status": "Active",
			"winnerId": null,
			"createdAt": "2025-09-20T09:20:19.441Z",
			"updatedAt": "2025-09-24T18:01:44.911Z",
			"__v": 0
		}
	],
	"message": "Auctions fetched successfully."
}
```
- **Failure 400 Response:** `{"message": "Failed to fetch auctions."}` — Lookup or parsing error.

#### PUT `/api/auction`
- **Purpose:** Placeholder for updating auction metadata. The controller body is currently empty; calling this route will hang and should be avoided until implementation is completed.
- **Status:** TODO — implement payload contract, validation, and response structure.

#### PUT `/api/auction/close`
- **Purpose:** Mark an auction as closed.
- **Request Body:**

```json
{
	"auctionId": "66f114f71d7e0d1b3ac11111"
}
```
- **Success 200 Response:**

```json
{
	"updatedAuction": {
		"_id": "66f114f71d7e0d1b3ac11111",
		"status": "Closed",
		"partId": "PART-GPS-840",
		"start_price": 400,
		"current_price": 550,
		"start_time": "2025-10-01T10:00:00.000Z",
		"end_time": "2025-10-08T10:00:00.000Z",
		"winnerId": "USR-24519",
		"createdAt": "2025-09-20T09:20:19.441Z",
		"updatedAt": "2025-10-08T10:00:01.221Z",
		"__v": 0
	},
	"message": "Auction closed successfully"
}
```
- **Failure 404 Response:** `{"message": "Auction not found"}` — No record for `auctionId`.
- **Failure 400 Response:** `{"message": "Failed to close the auction. Auction is still going on."}` — Database error or invalid state.

#### PUT `/api/auction/cancel`
- **Purpose:** Mark an auction as cancelled, preventing further bids.
- **Request Body:** Same as close: `{ "auctionId": "<mongo-id>" }`.
- **Success 200 Response:**

```json
{
	"updatedAuction": {
		"_id": "66f115a31d7e0d1b3ac12222",
		"status": "Cancelled",
		"partId": "PART-FOX36-GRIP2",
		"start_price": 600,
		"current_price": 640,
		"start_time": "2025-10-04T16:00:00.000Z",
		"end_time": "2025-10-06T16:00:00.000Z",
		"winnerId": null,
		"createdAt": "2025-09-24T12:15:06.914Z",
		"updatedAt": "2025-09-26T09:03:55.102Z",
		"__v": 0
	},
	"message": "Auction cancelled successfully"
}
```
- **Failure 404 Response:** `{"message": "Auction not found"}`.
- **Failure 400 Response:** `{"message": "Failed to cancel the auction."}` — General error wrapper.

#### DELETE `/api/auction`
- **Purpose:** Placeholder for deleting an auction. The controller currently contains no logic and responds with no data.
- **Status:** TODO — define contract (likely `auctionId` in body or path) and implement.

### Notes & Limitations
- `start_time` and `end_time` filters currently perform equality matches, so consider enhancing the controller to support date ranges (`$gte`, `$lte`).
- Errors beyond the explicit responses are logged server-side; add structured error objects when the controller implementations are finalized.
- Close/Cancel operations update `status` only and return the post-update document. Trigger bid settlement logic in the controller once available.

