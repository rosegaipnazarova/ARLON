# ARLON — Digital Culture & Limited Drops Platform

> A full-stack Gen-Z digital collectibles platform with limited edition drops, QR-verified certificates, 3D product viewers, artist feeds, and gamification.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 13 (App Router), Tailwind CSS, Zustand |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| 3D Viewer | Three.js / React Three Fiber |
| Auth | JWT (access + refresh tokens, HTTP-only cookies) |
| QR Codes | `qrcode` (server) + `qrcode.react` (client) |

---

## Project Structure

```
arlon/
├── client/                   # Next.js frontend
│   ├── app/
│   │   ├── page.js           # Home (hero, countdown, trending)
│   │   ├── layout.js         # Root layout with Navbar
│   │   ├── loading.js        # Global loading UI
│   │   ├── not-found.js      # 404 page
│   │   ├── products/
│   │   │   ├── page.js       # Products listing + filters
│   │   │   └── [id]/page.js  # Product detail + 3D viewer
│   │   ├── auth/
│   │   │   ├── login/page.js
│   │   │   └── register/page.js
│   │   ├── profile/page.js   # Dashboard: collection, orders, badges
│   │   ├── feed/page.js      # Artist feed (Weverse-style)
│   │   ├── artists/
│   │   │   ├── page.js       # Artist directory + follow
│   │   │   └── [id]/page.js  # Artist profile + drops + posts
│   │   ├── cart/page.js      # Cart + checkout
│   │   ├── verify/page.js    # Certificate verification
│   │   └── admin/page.js     # Admin panel (orders + products)
│   ├── components/
│   │   ├── layout/Navbar.js
│   │   └── ui/
│   │       ├── ProductCard.js
│   │       ├── CollectionCard.js  # With QR certificate expand
│   │       ├── FeedPost.js
│   │       ├── Badge.js
│   │       └── CountdownTimer.js
│   │   └── 3d/ModelViewer.js     # React Three Fiber viewer
│   ├── lib/api.js                # Axios instance + auto-refresh
│   └── store/
│       ├── authStore.js          # Zustand auth state
│       └── cartStore.js          # Zustand cart state
│
└── server/                   # Express backend
    ├── index.js              # Entry point
    ├── seed.js               # Database seeder
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   ├── Order.js
    │   ├── Certificate.js
    │   ├── Artist.js
    │   └── Post.js
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── productController.js
    │   ├── orderController.js
    │   ├── certificateController.js
    │   ├── artistController.js
    │   └── feedController.js
    ├── routes/
    │   ├── auth.js
    │   ├── users.js
    │   ├── products.js
    │   ├── orders.js
    │   ├── certificates.js
    │   ├── artists.js
    │   └── feed.js
    ├── middleware/auth.js     # JWT protect + restrict
    └── utils/
        ├── tokens.js         # JWT generation + cookie helpers
        └── gamification.js   # Points + badge evaluation
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)
- npm or yarn

---

### 1. Clone & Install

```bash
# Server
cd arlon/server
npm install

# Client
cd ../client
npm install
```

---

### 2. Configure Environment Variables

**Server** — copy `server/.env.example` to `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/arlon
JWT_ACCESS_SECRET=change_this_to_a_long_random_string
JWT_REFRESH_SECRET=change_this_to_another_long_random_string
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_URL=http://localhost:3000
```

**Client** — copy `client/.env.example` to `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### 3. Seed the Database (optional but recommended)

```bash
cd server
node seed.js
```

This creates:
- **Admin user**: `admin@arlon.io` / `Admin1234!`
- **Collector user**: `collector@arlon.io` / `Collector1234!`
- 4 artists, 6 products, 3 posts

---

### 4. Run the App

Open two terminals:

```bash
# Terminal 1 — API server
cd server
npm run dev     # uses nodemon for hot reload

# Terminal 2 — Next.js client
cd client
npm run dev
```

Visit `http://localhost:3000`

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, receive tokens |
| POST | `/api/auth/logout` | — | Clear cookies |
| POST | `/api/auth/refresh` | cookie | Refresh access token |
| GET | `/api/auth/me` | ✓ | Get current user |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/:id` | — | Get user profile |
| PUT | `/api/users/update` | ✓ | Update profile |
| GET | `/api/users/collection` | ✓ | Get digital collection |

### Products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | — | List products (filter: type, category) |
| GET | `/api/products/:id` | — | Get single product |
| POST | `/api/products` | admin/artist | Create product |

### Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | ✓ | Place order |
| GET | `/api/orders/user/:id` | ✓ | Get user orders |
| PUT | `/api/orders/:id/status` | admin | Update order status |

### Certificates
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/certificate/verify` | optional | Verify by serial number |
| GET | `/api/certificate/:serial` | — | Public certificate lookup |

### Artists & Feed
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/artists` | — | List all artists |
| GET | `/api/artists/:id` | — | Artist profile |
| POST | `/api/artists` | admin | Create artist |
| POST | `/api/artists/follow/:artistId` | ✓ | Toggle follow |
| GET | `/api/feed` | ✓ | Feed from followed artists |
| POST | `/api/feed` | artist/admin | Create post |

---

## Key Features

### 🔐 JWT Auth
- Access token (15 min) stored in HTTP-only cookie + localStorage
- Refresh token (7 days) in HTTP-only cookie
- Axios interceptor auto-refreshes on 401

### 🏅 Gamification System
- **+10 pts** — share a product
- **+50 pts** — purchase an item
- **+100 pts** — verify a certificate
- **Badges**: Collector · Art Ambassador · Verified Collector

### 📜 Certificate System
- Originals auto-generate a UUID serial + QR code on delivery
- Verification endpoint returns `VALID` / `FAKE`
- QR codes embedded in `CollectionCard` for easy scanning

### 🎮 3D Product Viewer
- React Three Fiber + Drei
- Supports `.glb` / `.gltf` model URLs
- Falls back to an animated wireframe box if no model is provided
- Orbit controls, auto-rotate, neon lighting

### 🛡 Role-Based Access
- `user` — browse, buy, follow, collect
- `artist` — create products, post to feed
- `admin` — all of the above + manage orders, create artists

---

## Design System

| Token | Value |
|---|---|
| Background | `#0A0A0F` |
| Surface-1 | `#111118` |
| Surface-2 | `#1A1A24` |
| Neon Cyan | `#00F5FF` |
| Gold | `#FFD700` |
| Font (display) | Rajdhani |
| Font (mono) | Space Mono |

Custom CSS utilities: `.text-glow-cyan`, `.text-glow-gold`, `.glass-card`, `.border-glow`, `.btn-cyber`, `.btn-outline-cyber`, `.badge-pill`, `.grid-bg`, `.scanlines`

---

## Production Deployment

### Server (e.g. Railway, Render, Fly.io)
1. Set all env vars in the platform dashboard
2. Set `NODE_ENV=production`
3. `npm start`

### Client (Vercel recommended for Next.js)
1. Push to GitHub
2. Import in Vercel
3. Set `NEXT_PUBLIC_API_URL` to your deployed API URL
4. Deploy

---

## License

MIT — build freely.
#   A R L O N 
 






















////////////////////////////////////////////


http://116.203.110.119:3000


///////////////////////////////////////
 
