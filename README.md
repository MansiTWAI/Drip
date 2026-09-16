# Drip Commerce

A full-stack contemporary fashion storefront with a customer shop, admin dashboard, curated launch collection, product management, cart, wishlist, ordering, discounts, and transactional email support.

## Apps

- `frontend` — customer-facing React + Vite shop
- `admin` — inventory and order-management dashboard
- `backend` — Express, MongoDB, Cloudinary, authentication, orders, cart, wishlist, and email API

## Local setup

1. Copy each `.env.example` to `.env` in `frontend`, `admin`, and `backend`.
2. Replace the placeholder brand contact details and service credentials.
3. Install dependencies in each app with `pnpm install`.
4. Seed the launch collection with `npm run seed --prefix backend`.
5. Start the API with `npm run dev:api`, the store with `npm run dev:store`, and the admin app with `npm run dev:admin`.

The storefront can run without the API for layout preview, but product, account, cart, wishlist, and order data require the configured backend.
