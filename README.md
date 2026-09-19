# Drip Commerce

Drip is a production-ready, full-stack fashion commerce experience with a contemporary brown-toned storefront, customer accounts, persistent shopping tools, order tracking, a protected admin dashboard, and verified post-delivery reviews.

## Live deployment

- Storefront: [https://drip-three-delta.vercel.app/](https://drip-three-delta.vercel.app/)
- Collection: [https://drip-three-delta.vercel.app/collection](https://drip-three-delta.vercel.app/collection)
- Admin portal: [https://drip-three-delta.vercel.app/admin](https://drip-three-delta.vercel.app/admin)
- GitHub repository: [https://github.com/MansiTWAI/Drip](https://github.com/MansiTWAI/Drip)

The storefront, admin SPA, and Express API deploy together as one Vercel project. The rewrites in `vercel.json` make direct links such as `/admin`, `/orders`, and `/product/:productId` work after deployment.

## Features

### Customer storefront

- Responsive editorial home page and searchable product collection
- Category, subcategory, fit, color, fabric, and occasion discovery
- Multi-image product galleries, prices, discounts, sizes, specifications, and related products
- Persistent cart with quantity controls and in-cart size changes
- Local and account-backed wishlists
- JWT customer registration and login
- Validated checkout, order history, filters, cancellation, estimates, and tracking
- Transactional order confirmation and status emails
- Contact, FAQ, shipping, returns, terms, and customer-service pages
- Route-level lazy loading and optimized WebP storefront assets

### Verified ratings and reviews

- Customers can rate a product only after its order status is `Delivered`
- Required 1–5 star rating and a 10–1000 character written description
- One review per customer and product; a new submission safely updates it
- **Rate & Review** and **Edit Review** actions in My Orders
- Live product-page average, count, star breakdown, feedback, date, reviewer name, and verified-purchase badge
- Server-side verification of the authenticated user, delivered order, and purchased product

### Admin dashboard

- Protected administrator login and session verification
- Product creation with up to four Cloudinary-hosted images
- Name, description, category, subcategory, price, discount, sizes, fabric, occasion, fit, color, and bestseller management
- Inventory search, category filters, sorting, metrics, and removal
- Order management with customer details, delivery dates, statuses, revenue, and status emails
- Global maximum-discount control
- Seamless links between storefront and admin portal

## Technology

| Area | Stack |
| --- | --- |
| Storefront | React 19, React Router, Vite, Tailwind CSS 4, Axios, Lucide React, React Toastify |
| Admin | React 19, React Router, Vite, Tailwind CSS 4, Axios, Lucide React |
| API | Node.js 20+, Express 5, Mongoose |
| Data | MongoDB Atlas |
| Media | Cloudinary, Multer |
| Authentication | JSON Web Tokens, bcrypt |
| Email | Nodemailer |
| Hosting | Vercel |

## Repository structure

```text
Drip/
├── frontend/                 # Customer-facing React application
│   ├── public/products/      # Optimized fallback/editorial products
│   └── src/
│       ├── components/       # Shared shopping and layout UI
│       ├── context/          # Products, auth, cart, wishlist, discounts
│       ├── data/             # Curated offline catalog fallback
│       └── pages/            # Storefront routes
├── admin/                    # Protected React admin application
├── backend/
│   ├── config/               # MongoDB, Cloudinary, and email setup
│   ├── controllers/          # API business logic
│   ├── middleware/           # User/admin auth and uploads
│   ├── models/               # User, product, order, review, promotion
│   ├── routes/               # Express API routers
│   └── scripts/              # Catalog seeding
├── api/index.js              # Vercel serverless API entrypoint
├── scripts/                  # Production build assembly and image tools
└── vercel.json               # Build, SPA rewrites, API routing, caching
```

## Local development

### Requirements

- Node.js 20 or later
- npm or pnpm
- MongoDB Atlas database
- Cloudinary account
- SMTP-capable email account or app password

### Install

```bash
npm install
npm install --prefix frontend
npm install --prefix admin
npm install --prefix backend
```

Copy `frontend/.env.example`, `admin/.env.example`, and `backend/.env.example` to `.env` files in the same directories. Replace all placeholders.

Storefront variables:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_BRAND_NAME=Drip
VITE_BRAND_LEGAL_NAME=Drip Clothing
VITE_BRAND_EMAIL=hello@example.com
VITE_BRAND_WHATSAPP=+91 00000 00000
VITE_BRAND_ADDRESS=Your business address
VITE_BRAND_INSTAGRAM_HANDLE=@drip
VITE_BRAND_INSTAGRAM_URL=https://www.instagram.com/drip/
```

Admin variables:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_BRAND_NAME=Drip
```

API variables:

```env
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.example.mongodb.net
MONGODB_DB=drip_store
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_SECRET_KEY=your-secret
EMAIL_USER=hello@example.com
EMAIL_PASS=your-email-app-password
BRAND_NAME=Drip
BRAND_LEGAL_NAME=Drip Clothing
BRAND_ADDRESS=Your business address
BRAND_INSTAGRAM_URL=https://www.instagram.com/drip/
```

Never commit `.env` files or real credentials. Rotate any secret exposed in chat, screenshots, commits, or build logs.

### Seed and run

```bash
npm run seed --prefix backend
```

Use three terminals:

```bash
npm run dev:api
npm run dev:store
npm run dev:admin
```

Default URLs:

- Storefront: `http://localhost:5173`
- Admin: the URL printed by its Vite process, commonly `http://localhost:5174`
- API: `http://localhost:4000`
- Health: `http://localhost:4000/api/health`

The storefront has a curated fallback catalog for visual preview. Accounts, persisted carts, wishlists, orders, admin features, and reviews require the API and MongoDB.

## Core API

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | API and database health |
| `GET` | `/api/product/list` | Public | List catalog products |
| `POST` | `/api/product/add` | Admin | Create a product with images |
| `POST` | `/api/product/remove` | Admin | Remove a product |
| `POST` | `/api/user/register` | Public | Create a customer account |
| `POST` | `/api/user/login` | Public | Customer login |
| `POST` | `/api/user/admin` | Public | Admin login |
| `POST` | `/api/cart/*` | Customer | Persist and modify cart lines |
| `GET/POST` | `/api/wishlist/*` | Customer | Manage wishlist |
| `POST` | `/api/order/place` | Customer | Place an order |
| `POST` | `/api/order/userorders` | Customer | Fetch customer orders |
| `POST` | `/api/order/cancel` | Customer | Cancel an eligible order |
| `POST` | `/api/order/list` | Admin | Fetch all orders |
| `POST` | `/api/order/status` | Admin | Update status and delivery date |
| `GET` | `/api/review/product/:productId` | Public | Review summary and list |
| `GET` | `/api/review/mine` | Customer | Signed-in customer's reviews |
| `POST` | `/api/review/save` | Customer | Create or update a delivered-purchase review |

Customer endpoints expect `Authorization: Bearer <token>`. Admin endpoints use the admin token header implemented by the dashboard.

## Order and review lifecycle

1. A signed-in customer adds a sized item and places an order.
2. The API recalculates prices from MongoDB rather than trusting client totals.
3. Admin moves the order through `Order Placed`, `Confirmed`, `Packing`, `Shipped`, `Out For Delivery`, and `Delivered`.
4. Status changes appear in My Orders and can trigger email notifications.
5. At `Delivered`, the customer receives the **Rate & Review** action.
6. The API verifies ownership, delivery, and the purchased product before saving feedback.
7. The review and aggregate rating appear publicly on the product page.

## Vercel deployment

1. Import `MansiTWAI/Drip` into Vercel and keep Root Directory as `./`.
2. Use `npm run build:vercel` and the `dist` output directory (already configured).
3. Add every variable from `backend/.env.example` to Production and Preview.
4. Add `VITE_*` brand variables when overriding defaults. Production clients use same-origin `/api` requests.
5. Allow Vercel serverless connections in MongoDB Atlas Network Access.
6. Redeploy after environment changes.

The root build compiles both React apps and assembles the storefront plus `/admin`. `api/index.js` initializes services for serverless requests. Static assets receive long-lived caching while application routes fall back to the correct SPA entrypoint.

## Quality checks

```bash
npm run lint
npm run build
```

Before release, verify login, filters, galleries, wishlist, cart quantities and size changes, checkout, status updates, delivery-only review eligibility, review editing, direct `/admin` navigation, mobile layouts, email delivery, and `/api/health`.

## Security

- Prices and review eligibility are validated server-side.
- Passwords are hashed and API authorization uses signed JWTs.
- MongoDB, Cloudinary, SMTP, admin, and JWT secrets belong only in environment variables.
- Review descriptions are plain text rendered by React; raw HTML is never injected.

## License and ownership

This repository is the Drip commerce application. Product imagery, brand assets, copy, and third-party services must be used only with the appropriate rights and account permissions.
