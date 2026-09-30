# Selah Girl Society

A modern modest fashion e-commerce platform built with **TanStack Start**, **React 19**, **TypeScript**, and **Supabase** (Auth, Postgres, and Realtime). The app is fully client-rendered with TanStack Router, manages server state through TanStack Query, and ships with a polished storefront and a live admin dashboard.

## Features

### Storefront
- Product catalogue with category pages, product detail pages, search, and filtering
- Featured, new arrivals, best sellers, and related products
- Cart and checkout with delivery options
- Customer accounts with order history
- Wishlist and live product updates via Supabase Realtime

### Admin
- Secure admin sign-in with role-based access (`profiles.role = 'admin'`)
- Products, orders, customers, and analytics dashboards
- Live updates - every change in the database is reflected in the admin UI in real time
- Create, edit, duplicate, and delete products
- Update order status and payment status

### Auth
- Supabase Auth with email/password sign-up and sign-in
- Google OAuth via Supabase (`signInWithOAuth`)
- Auto-provisioned `profiles` row on sign-up

## Tech stack
- [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- [React 19](https://react.dev) + [TypeScript 5](https://www.typescriptlang.org)
- [TanStack Query 5](https://tanstack.com/query)
- [Supabase](https://supabase.com) - Auth, Postgres, Realtime
- [Tailwind CSS 4](https://tailwindcss.com) + [Radix UI](https://www.radix-ui.com)
- [Framer Motion](https://www.framer.com/motion), [Lucide](https://lucide.dev), [Sonner](https://sonner.emilkowal.ski)

## Getting started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Supabase
Create a project at [supabase.com](https://supabase.com), then update `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id   # optional, for Google sign-in
```

### 3. Set up the database
Open the Supabase SQL Editor and run [`supabase/schema.sql`](./supabase/schema.sql).
This creates all tables (`profiles`, `products`, `categories`, `customers`, `orders`, `reviews`, `testimonials`), Row Level Security policies, the auto-profile trigger, and the Realtime publication.

### 4. (Optional) Seed demo data
If you want the original demo products, categories, orders, and customers, run the seed script once:
```bash
npx tsx supabase/seed.ts
```
This is entirely optional - you can start with an empty database and add everything through the admin panel.

### 5. Create an admin user
1. Sign up through the app or Supabase Auth dashboard
2. Promote the user to admin in the SQL Editor:
   ```sql
   update public.profiles
   set role = 'admin'
   where id = 'your-user-uuid';
   ```

### 6. Configure Google OAuth (optional)
In the Supabase dashboard, enable the Google provider under **Authentication → Providers**. The OAuth callback URL is:
```
https://your-project.supabase.co/auth/v1/callback
```

### 7. Run the dev server
```bash
npm run dev
```

## Project structure
```
src/
├── components/
│   ├── shared/
│   │   └── RealtimeSync.tsx     # Live updates → React Query cache
│   └── store/                   # Storefront & admin UI
├── context/
│   ├── AuthContext.tsx          # Supabase Auth session
│   ├── CartContext.tsx
│   └── WishlistContext.tsx
├── data/                        # Demo catalogue fixtures (used only for seed)
├── lib/
│   └── supabase.ts              # Supabase client
├── routes/                      # TanStack Router file-based routes
│   ├── account.tsx
│   ├── admin*.tsx
│   ├── checkout.tsx
│   └── ...
├── services/
│   ├── authService.ts           # Supabase Auth wrappers
│   ├── productService.ts        # Supabase products CRUD
│   ├── orderService.ts          # Supabase orders + analytics
│   ├── customerService.ts       # Supabase customers
│   └── paymentService.ts
├── types/
└── supabase/
    ├── schema.sql               # Database schema + RLS
    └── seed.ts                  # Optional demo seed
```

## Realtime

`src/components/shared/RealtimeSync.tsx` subscribes to `postgres_changes` on the `products`, `orders`, and `customers` tables. When a row is inserted, updated, or deleted, the React Query cache is updated immediately so the admin and storefront reflect changes without a manual refresh.

## Scripts
```bash
npm run dev        # Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint
npm run format     # Prettier
```

## Environment variables
| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Your Supabase anon key |
| `VITE_GOOGLE_CLIENT_ID` | No | Google OAuth client ID (if using Google sign-in) |

## License
MIT
