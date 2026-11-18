# SportCycle – Technical Architecture & System Design
**Tagline:** Gear. Play. Repeat.  
**Version:** 1.0.0 (Production Architecture)

---

## 1. High-Level System Architecture

SportCycle is designed with a strict layered decoupling model:
- **Client Tier:** Next.js (App Router, TypeScript, Tailwind CSS, Lucide React). The client interacts exclusively via RESTful JSON APIs and never connects directly to the PostgreSQL database.
- **API & Application Tier:** Java 21 + Spring Boot 3.3.5. Enforces role-based security, cryptographic payment validation, inventory integrity, stock deductions, and server-side pricing recalculation.
- **Database Tier:** Supabase PostgreSQL with Flyway database version control (`V1__initial_schema.sql`, `V2__seed_data.sql`).
- **Object Storage Tier:** Supabase Storage for secure, performant product images and media uploads.
- **Payment Gateway:** Razorpay order creation and HMAC-SHA256 signature verification.

```
┌────────────────────────────────────────────────────────┐
│               SPORTCYCLE NEXT.JS FRONTEND              │
│      (App Router, Mobile-First, Tailwind CSS Tokens)   │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / REST (JSON)
                           ▼
┌────────────────────────────────────────────────────────┐
│             SPRING BOOT BACKEND (JAVA 21)              │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Security Filter Chain (JWT + Roles + BCrypt)   │  │
│  └───────────────────────┬──────────────────────────┘  │
│                          ▼                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Controllers (REST Endpoints & Validation)      │  │
│  └───────────────────────┬──────────────────────────┘  │
│                          ▼                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Service Layer (Business Logic & Transactions)  │  │
│  └───────────────────────┬──────────────────────────┘  │
│                          ▼                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Data Layer (Spring Data JPA + Specifications)  │  │
│  └───────────────────────┬──────────────────────────┘  │
└──────────────────────────┼─────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           ▼                               ▼
┌──────────────────────┐       ┌──────────────────────┐
│  SUPABASE POSTGRESQL │       │   SUPABASE STORAGE   │
│   (Relational DB)    │       │    (Media Bucket)    │
└──────────────────────┘       └──────────────────────┘
```

---

## 2. Brand Identity & Design System Tokens

The application strictly implements the required SportCycle color tokens:

| Token Name | Hex Code | Purpose |
|---|---|---|
| **Primary Lime** | `#B8D94B` | Primary call-to-actions, Add to Cart, badges, interactive accents |
| **Ivory Background** | `#F8F9E9` | Dominant hero background, pill backgrounds, warm contrast |
| **Pure White** | `#FFFFFF` | Dominant card surfaces, container backgrounds, modals |
| **Olive Green** | `#52642A` | Brand headings, active navigation states, certified badges |
| **Dark Readable Text**| `#26321A` | Main typography, high-contrast readable copy |
| **Light Grey** | `#F3F4F6` | Secondary surfaces, thumbnail backgrounds |
| **Border** | `#E5E7EB` | Card borders, dividers, inputs |

---

## 3. Layered Backend Architecture

### 3.1 Security & Authentication Flow
1. **Password Hashing:** `BCryptPasswordEncoder` with strength 10. No plaintext passwords stored.
2. **Access Tokens:** Standard JWT signed with HMAC-SHA256 (256+ bit secret). Valid for 24 hours.
3. **Refresh Tokens:** Long-lived 7-day cryptographic tokens stored securely.
4. **Role-Based Access Control (RBAC):**
   - `ROLE_CUSTOMER`: Browse, purchase, review verified purchases, manage saved addresses.
   - `ROLE_SELLER`: Access seller dashboard, create listings, toggle inventory status.
   - `ROLE_CLUB_ADMIN`: Manage club profiles, accept/reject trainee memberships, list academy gear.
   - `ROLE_ADMIN`: Full marketplace oversight, listing moderation, verification badges, user suspension, audit logs.

### 3.2 Server-Side Pricing & Inventory Integrity
- **Zero Client Trust:** Prices submitted by the frontend are strictly ignored during cart checkout.
- **Stock Decrement:** When an order is placed, inventory is atomically validated and deducted in a database transaction (`@Transactional`). If stock reaches 0, status transitions to `SOLD_OUT`.
- **Payment Verification:** Webhook and return signature verified via HMAC-SHA256 (`order_id + "|" + payment_id`). Orders are never marked as paid based purely on client confirmation.

---

## 4. Database Entities & Relationships

The database is normalized into 24 distinct relational entities:
1. `users`: Master athlete and admin identities.
2. `roles`: Distinct role definitions.
3. `user_roles`: Many-to-many role mapping.
4. `user_addresses`: Customer delivery addresses with default flags.
5. `sports`: 12 canonical sports categories.
6. `categories`: Subcategories associated with specific sports.
7. `brands`: Manufacturer and gear brands.
8. `sellers`: Verified vendor and individual athlete seller profiles.
9. `clubs`: Sports clubs and academy entities.
10. `club_memberships`: Trainee membership requests and statuses.
11. `products`: Comprehensive equipment listings with condition, wear details, and verification status.
12. `product_images`: Multi-image gallery references.
13. `carts`: User or guest shopping cart sessions.
14. `cart_items`: Cart equipment selections with sizes and quantities.
15. `wishlists`: Saved favourite gear.
16. `wishlist_items`: Wishlist item associations.
17. `orders`: Placed customer orders with financial amounts and address snapshots.
18. `order_items`: Line items capturing historical pricing and item snapshots.
19. `order_status_history`: Audit trail of status transitions with timestamps.
20. `payments`: Payment gateway order IDs, transaction IDs, and verification statuses.
21. `refunds`: Refund tracking.
22. `reviews`: Customer reviews with verified purchase checks.
23. `notifications`: In-app user notifications.
24. `audit_logs`: Administrative action logs with actor email, resource ID, and IP address.

