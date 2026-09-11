# Common Cause — Full-Stack Charity Ecommerce Platform

A full-stack ecommerce platform where every purchase funds a charity: admins
launch time-boxed campaigns, list products against them, and a fixed
platform / donation / seller-profit split is shown on every listing before
checkout — built with a **Node.js + Express + MongoDB** API and a
**React + Vite + Tailwind** storefront and admin dashboard.

## 1. Project structure

```
common-cause/
├── backend/            # Express REST API + MongoDB (Mongoose)
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Auth, validation, file upload
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API route definitions
│   ├── scripts/        # CLI helpers (e.g. promoting a user to admin)
│   └── utils/          # Cloudinary, email/SMS notifications
├── frontend/            # React + Vite + Tailwind
│   └── src/
│       ├── api/         # Axios calls per resource
│       ├── components/  # Shared UI (nav, forms, ledger rows, fee-split bar)
│       ├── context/     # Auth context
│       └── pages/        # Public pages + role-gated admin dashboard
└── README.md
```

## 2. Features

- **Auth & roles** — JWT-based login/register, with `user`, `admin`, and
  `super-admin` roles enforced server-side.
- **Charity campaigns** — time-boxed campaigns with a platform / donation /
  profit fee split that must add up to exactly 100%.
- **Products** — listed under a charity and a category, with image upload
  via Cloudinary, stock, discounts, and status control.
- **Orders** — single-product checkout against a saved delivery address,
  with SMS + email confirmation.
- **Admin dashboard** — create/manage charities, categories, and products;
  view orders per charity.
- **Transparent receipts** — every product and order shows exactly where
  the money goes, visualized as a fee-split bar.

## 3. Tech stack

| | |
|---|---|
| **Backend** | Node.js, Express, MongoDB/Mongoose, JWT, Cloudinary, Twilio, Nodemailer |
| **Frontend** | React 19, Vite, React Router, Axios |

## 4. Getting started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your Mongo URL, JWT secret, Cloudinary, Twilio, Gmail values
npm start
```

Registration always creates a plain `user` account (by design — see
Security notes below). Promote your own account to admin from the command
line:

```bash
node scripts/setUserRole.js you@example.com admin
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # points at your backend, defaults to localhost:5000
npm run dev
```

## 5. API overview

All routes are prefixed `/api/v1`.

| Resource | Public | Authenticated | Admin |
|---|---|---|---|
| `/users` | register, login | `GET /me` | — |
| `/charity` | list, get one | create, update own | list all (super-admin sees every charity) |
| `/category` | list | — | create, rename |
| `/products` | list, get one, filter by charity/category | buy via `/orders` | create, update, change status |
| `/address` | — | get/create/update own | — |
| `/orders` | — | place order, view own | view orders for a charity you run |

## 6. Engineering notes

This backend started as an assignment project with a handful of real bugs
(a few crash-on-request issues, a role-based-access bug, and a privilege
escalation issue in registration) — all fixed, with details in the git
history. The frontend was built from scratch against the fixed API, with a
deliberate "ledger/receipt" visual identity rather than a generic
templated look, since the fee-split-per-purchase is a real, central part
of what the product does.
