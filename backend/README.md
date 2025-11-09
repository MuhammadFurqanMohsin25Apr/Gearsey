## Backend Architecture

Gearsey's backend is a Node.js service built with TypeScript, Express, and Mongoose. It exposes REST APIs for marketplace features such as listings, auctions, payments, and reviews. Endpoint-specific documentation lives alongside the routers inside `src/api/**`; this document focuses on the shared infrastructure and development workflow.

### Tech Stack
- Node.js 20 runtime with TypeScript for type safety.
- Express 5 for HTTP routing and middleware composition.
- Mongoose ORM targeting a relational database (configured through `MONGO_URI`).
- Zod for runtime validation and schema shaping (used in controllers and services).

### Folder Layout
- `src/server.ts`: Express bootstrap, middleware registration, and router mounting.

- `src/api/`: Route modules grouped by domain (each contains its own README with endpoint details).
- `src/controllers/`: Business logic handlers invoked by routers.
- `src/models/`: Mongoose data models and domain helpers.
- `src/db/config.ts`: MongoDB client instantiation and connection lifecycle helpers.
- `src/lib/auth.ts`: Utilities for decoding and authorizing user sessions.

### Environment Configuration
Configuration is driven by environment variables. Create a `.env` in `backend/` (never commit it) and supply the following keys:

```
DATABASE_URL="postgresql://user:password@localhost:5432/gearsey"
AUTH_SERVICE_URL="http://localhost:4000"
AUTH_SERVICE_SECRET="<shared-secret>"
STRIPE_SECRET_KEY="sk_test_..."
PORT=3000
NODE_ENV=development
```

- `DATABASE_URL` is consumed by Prisma in `src/db/config.ts`.
- `AUTH_SERVICE_URL` and `AUTH_SERVICE_SECRET` configure the auth client for token verification.
- `PORT` defines the HTTP port the Express server listens on.

### Dependency Management and Scripts
Install dependencies with `npm install`. The most important package scripts defined in `package.json` are:

- `npm run dev` — Launches the Express server with `ts-node-dev`, enabling hot reloads.
- `npm run build` — Compiles TypeScript sources into `dist/`.
- `npm run start` — Runs the compiled JavaScript (`node dist/server.js`).
- `npm run lint` — Executes ESLint with the project ruleset.

### Database and MongoDB
- Mongoose client is configured in `src/db/config.ts`; reuse the exported instance to avoid duplicated connections.
- Domain models in `src/models/` wrap Mongoose calls to keep controllers agnostic of raw ORM queries.

### Authentication Flow
- Incoming requests pass through middleware that invokes `src/lib/auth.ts` helpers.
- Controllers expect an attached `req.user` (or similar context) when authorization is required; ensure middleware is mounted before routers.
- Role checks and access policies should be centralized to keep individual controllers small.

### Request Lifecycle
1. `server.ts` initializes Express, loads global middleware (JSON parsing, logging, CORS), and attaches the domain routers from `src/api/`.
2. Routers validate input payloads and forward work to the corresponding controller.
3. Controllers orchestrate domain logic using services/utilities from `src/models/`, `src/lib/`, and third-party SDKs.
4. Responses are normalized (usually JSON) and errors propagate through the centralized error handler.

### Error Handling
- A global error middleware at the end of the stack maps known error types to HTTP responses.
- Use application-specific error classes for predictable failure modes (validation, authorization, third-party failures).
- Unhandled errors should surface a 500 response while logging stack traces for diagnostics.

### Logging and Observability
- `server.ts` wires up basic request logging (e.g., `morgan`). Extend this with structured logging as needed.
- Instrument critical flows (payments, bidding) with additional logs or metrics if available.
- Ensure secrets never appear in logs.

### Coding Conventions
- Favor typed interfaces and enums to describe shared payload shapes.
- Keep controllers thin; push reusable logic into `src/models/` or helper modules.
- Write unit tests or integration tests for non-trivial flows (place test files under `tests/` or co-locate with modules, depending on the chosen convention).
- Validate incoming payloads at the router level to fail fast.

### Local Development Workflow
1. Install dependencies (`npm install`).
2. Launch the dev server (`npm run dev`).
3. Use the per-endpoint README files under `src/api/**` for request/response examples.

### Deployment Notes
- Build artifacts in `dist/` are platform agnostic; ensure environment variables are provided by the hosting platform.
- Use a process manager (PM2, systemd) or managed platform to keep the Node process healthy.

