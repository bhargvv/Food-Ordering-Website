# Food Delivery (TasteCart)

A full-stack food ordering app: customer storefront, admin dashboard, and Express API with MongoDB and Stripe checkout.

## Stack

| Part | Tech |
|------|------|
| **Storefront** | React 19, Vite 7, React Router, Axios |
| **Admin** | React 19, Vite 7, React Router, Axios, React Toastify |
| **API** | Node.js, Express 5, Mongoose, JWT, Multer, Stripe |

## Project layout

```
food-del/
├── frontend/   # Customer app (browse menu, cart, checkout)
├── admin/      # Admin panel (orders, catalog, etc.)
└── backend/    # REST API and file uploads
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- MongoDB ([Atlas](https://www.mongodb.com/cloud/atlas) or self-hosted)
- [Stripe](https://stripe.com/) account (secret key for server-side payments)

## Backend setup

1. Install dependencies and create environment variables:

   ```bash
   cd backend
   npm install
   ```

2. Create `backend/.env`:

   ```env
   JWT_SECRET=your_long_random_secret
   STRIPE_SECRET_KEY=sk_test_...
   ```

   `server.js` loads these via `dotenv`. **MongoDB** is configured in `backend/config/db.js` — point `mongoose.connect(...)` at your cluster (or refactor to `process.env.MONGO_URI` and add that variable here). Do not commit real credentials.

3. Start the API (default port **4000**):

   ```bash
   npm run server
   ```

   Health check: open [http://localhost:4000](http://localhost:4000) — you should see `API working`.

### API surface (high level)

| Prefix | Purpose |
|--------|---------|
| `/api/food` | Food catalog |
| `/api/user` | Auth / users |
| `/api/cart` | Cart |
| `/api/order` | Orders & Stripe flow |
| `/images` | Static uploads |

## Frontend (customer) setup

```bash
cd frontend
npm install
npm run dev
```

The dev server is usually [http://localhost:5173](http://localhost:5173). The app expects the API at `http://localhost:4000` (see `frontend/src/context/StoreContext.jsx`). Change that base URL if your API runs elsewhere.

## Admin panel setup

```bash
cd admin
npm install
npm run dev
```

See [admin/README.md](admin/README.md) for admin-specific notes. The API base URL is set in `admin/src/App.jsx` and `admin/src/assets/assets.js` (default `http://localhost:4000`).

## Running everything locally

1. Start **MongoDB** (or confirm Atlas network access).
2. Start **backend** (`npm run server` in `backend/`).
3. Start **frontend** and/or **admin** with `npm run dev` in each folder.

For payments, use Stripe test keys and complete redirects from your dev frontend origin (the order flow uses `Origin` for Stripe success/cancel URLs).

## Production builds

```bash
cd frontend && npm run build
cd ../admin && npm run build
```

Serve the `dist` folders with your host of choice; point both apps at your deployed API URL (update the hardcoded `localhost:4000` strings or introduce a shared env-style config).

## License

ISC (backend `package.json`). Add a top-level license file if you want to clarify terms for the whole repo.
