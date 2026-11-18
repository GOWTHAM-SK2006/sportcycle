# SPORTCYCLE – REST API Documentation

**Application Name:** SportCycle  
**Tagline:** Gear. Play. Repeat.  
**Version:** 1.0.0  
**Base URL:** `http://localhost:8080/api/v1` (Development) / `https://api.sportcycle.com/api/v1` (Production)  
**OpenAPI / Swagger UI:** `http://localhost:8080/swagger-ui.html`  
**OpenAPI JSON:** `http://localhost:8080/v3/api-docs`

---

## 1. Authentication & Security

SportCycle uses **JWT (JSON Web Token)** for stateless authentication.
All secure endpoints require the HTTP Header:

```http
Authorization: Bearer <your_jwt_access_token>
```

### Standard User Roles
| Role | Description |
|---|---|
| `ROLE_CUSTOMER` | Standard consumer: browse, purchase, review, manage personal cart, wishlist, orders. |
| `ROLE_SELLER` | Vendor/reseller: list new/pre-owned gear, track sales, manage inventory. |
| `ROLE_CLUB_ADMIN` | Sports club representative: manage club profile, review member requests. |
| `ROLE_ADMIN` | Platform administrator: product moderation, order overrides, user management, audit logs. |

---

## 2. Standard Response & Error Envelope

All API responses follow a consistent JSON envelope or standard Spring Boot pagination structure.

### Success Envelope
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Standard Error Envelope
```json
{
  "timestamp": "2026-11-19T00:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Field 'email' cannot be blank",
  "path": "/api/v1/auth/register",
  "validationErrors": {
    "email": "must be a well-formed email address"
  }
}
```

### Common HTTP Status Codes
- `200 OK` – Request succeeded with returned body.
- `201 Created` – Resource successfully created.
- `204 No Content` – Operation succeeded with no body (e.g. deletion).
- `400 Bad Request` – Validation failure or missing required parameter.
- `401 Unauthorized` – Missing or invalid Bearer token.
- `403 Forbidden` – Authenticated user lacks the required role.
- `404 Not Found` – Resource not found.
- `409 Conflict` – Conflict with existing resource (e.g. duplicate email).
- `500 Internal Server Error` – Unhandled server-side exception.

---

## 3. Endpoints Directory

### 3.1 Authentication (`/auth`)

#### `POST /auth/register`
Register a new customer account.
- **Access:** Public
- **Request Body:**
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1-555-0199",
    "password": "password123",
    "role": "ROLE_CUSTOMER"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "type": "Bearer",
    "userId": 5,
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "role": "ROLE_CUSTOMER"
  }
  ```

#### `POST /auth/login`
Authenticate existing user and retrieve JWT token.
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "customer@sportcycle.com",
    "password": "password123"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "type": "Bearer",
    "userId": 4,
    "fullName": "Alex Morgan",
    "email": "customer@sportcycle.com",
    "role": "ROLE_CUSTOMER"
  }
  ```

#### `GET /auth/me`
Retrieve profile of currently authenticated user.
- **Access:** Authenticated (`CUSTOMER`, `SELLER`, `CLUB_ADMIN`, `ADMIN`)
- **Response `200 OK`:**
  ```json
  {
    "id": 4,
    "fullName": "Alex Morgan",
    "email": "customer@sportcycle.com",
    "phone": "+1-555-0104",
    "profileImageUrl": null,
    "role": "ROLE_CUSTOMER",
    "status": "ACTIVE"
  }
  ```

---

### 3.2 User Profile & Addresses (`/users`)

#### `PUT /users/profile`
Update current user's profile details.
- **Access:** Authenticated
- **Request Body:**
  ```json
  {
    "fullName": "Alex Morgan Updated",
    "phone": "+1-555-0198",
    "profileImageUrl": "https://images.sportcycle.com/avatars/u4.jpg"
  }
  ```

#### `PUT /users/change-password`
Change user account password.
- **Access:** Authenticated
- **Request Body:**
  ```json
  {
    "oldPassword": "password123",
    "newPassword": "newSecretPassword456"
  }
  ```

#### `GET /users/addresses`
List saved shipping addresses for current user.
- **Access:** Authenticated
- **Response `200 OK`:**
  ```json
  [
    {
      "id": 1,
      "fullName": "Alex Morgan",
      "addressLine1": "742 Evergreen Terrace",
      "addressLine2": "Apt 4B",
      "city": "Springfield",
      "state": "Oregon",
      "postalCode": "97477",
      "country": "United States",
      "phone": "+1-555-0104",
      "isDefault": true
    }
  ]
  ```

#### `POST /users/addresses`
Create a new shipping address.
- **Access:** Authenticated
- **Request Body:**
  ```json
  {
    "fullName": "Alex Morgan",
    "addressLine1": "100 Broadway St",
    "addressLine2": null,
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "United States",
    "phone": "+1-555-0104",
    "isDefault": false
  }
  ```

---

### 3.3 Sports, Categories & Brands (`/sports`, `/categories`, `/brands`)

#### `GET /sports`
List all active sports.
- **Access:** Public
- **Response `200 OK`:**
  ```json
  [
    {
      "id": 1,
      "name": "Cricket",
      "slug": "cricket",
      "icon": "Trophy",
      "imageUrl": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
      "itemCount": 24
    }
  ]
  ```

#### `GET /sports/{slug}`
Get sport by slug with subcategories.
- **Access:** Public

#### `GET /categories`
List product categories. Filter by sport via query param: `?sportId=1`.
- **Access:** Public

#### `GET /brands`
List all equipment brands.
- **Access:** Public

---

### 3.4 Products (`/products`)

#### `GET /products`
Advanced product search, filtering, and pagination.
- **Access:** Public
- **Query Parameters:**
  - `query` (string, optional) – Full-text search across title, brand, description
  - `sportId` (long, optional) – Filter by sport ID
  - `categoryId` (long, optional) – Filter by subcategory ID
  - `brandId` (long, optional) – Filter by brand ID
  - `condition` (string, optional) – `BRAND_NEW`, `LIKE_NEW`, `EXCELLENT`, `GOOD`, `FAIR`
  - `isPreOwned` (boolean, optional) – Filter pre-owned or new items
  - `minPrice` (decimal, optional) – Price lower bound
  - `maxPrice` (decimal, optional) – Price upper bound
  - `page` (integer, default `0`) – Page number (0-indexed)
  - `size` (integer, default `12`) – Page size
  - `sortBy` (string, default `createdAt`) – `price`, `createdAt`, `title`, `popularity`
  - `direction` (string, default `desc`) – `asc`, `desc`
- **Response `200 OK`:**
  ```json
  {
    "content": [
      {
        "id": 1,
        "title": "Kookaburra Kahuna Pro Cricket Bat",
        "slug": "kookaburra-kahuna-pro-cricket-bat",
        "description": "Grade 1 English Willow cricket bat with supreme balance.",
        "price": 389.99,
        "originalPrice": 449.99,
        "condition": "BRAND_NEW",
        "isPreOwned": false,
        "isVerified": true,
        "stockQuantity": 8,
        "sku": "KB-KAH-PRO-01",
        "sportName": "Cricket",
        "categoryName": "Cricket Bats",
        "brandName": "Kookaburra",
        "sellerName": "ProSport Official Gear",
        "primaryImageUrl": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
        "averageRating": 4.9,
        "totalReviews": 38
      }
    ],
    "pageNumber": 0,
    "pageSize": 12,
    "totalElements": 24,
    "totalPages": 2,
    "last": false
  }
  ```

#### `GET /products/{slug}`
Get detailed product data by slug.
- **Access:** Public
- **Response `200 OK`:** Includes full image gallery, specifications JSON, seller metadata, wear details (if pre-owned), and recent customer reviews.

#### `GET /products/pre-owned`
Convenience endpoint to retrieve only pre-owned equipment with verification statuses.
- **Access:** Public

---

### 3.5 Shopping Cart (`/cart`)

#### `GET /cart`
Retrieve the current authenticated user's cart with recalculated totals and stock checks.
- **Access:** Authenticated
- **Response `200 OK`:**
  ```json
  {
    "id": 1,
    "items": [
      {
        "id": 10,
        "productId": 1,
        "productTitle": "Kookaburra Kahuna Pro Cricket Bat",
        "productSlug": "kookaburra-kahuna-pro-cricket-bat",
        "productImageUrl": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
        "price": 389.99,
        "quantity": 1,
        "subtotal": 389.99,
        "stockAvailable": 8
      }
    ],
    "subtotal": 389.99,
    "shippingCost": 0.00,
    "taxAmount": 31.20,
    "totalAmount": 421.19
  }
  ```

#### `POST /cart/items`
Add an item to the shopping cart.
- **Access:** Authenticated
- **Request Body:**
  ```json
  {
    "productId": 1,
    "quantity": 1
  }
  ```

#### `PUT /cart/items/{itemId}`
Update item quantity in cart.
- **Access:** Authenticated
- **Request Body:**
  ```json
  {
    "quantity": 2
  }
  ```

#### `DELETE /cart/items/{itemId}`
Remove an item from the cart.
- **Access:** Authenticated

#### `POST /cart/merge`
Merge guest cart items stored in local browser into the authenticated user's persistent cart upon login.
- **Access:** Authenticated

---

### 3.6 Wishlist (`/wishlist`)

#### `GET /wishlist`
Retrieve items saved in user's wishlist.
- **Access:** Authenticated

#### `POST /wishlist/{productId}`
Add a product to user's wishlist.
- **Access:** Authenticated

#### `DELETE /wishlist/{productId}`
Remove a product from user's wishlist.
- **Access:** Authenticated

---

### 3.7 Orders & Checkout (`/orders`, `/payments`)

#### `POST /payments/create-order`
Initialize checkout and generate a Razorpay / Gateway order ID with server-side recalculated totals.
- **Access:** Authenticated
- **Request Body:**
  ```json
  {
    "addressId": 1
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "orderId": "order_H5kF81ksZ92Lmq",
    "amount": 42119,
    "currency": "INR",
    "keyId": "rzp_test_sampleKey123"
  }
  ```

#### `POST /payments/verify`
Verify Razorpay payment signature (HMAC-SHA256) and complete the order.
- **Access:** Authenticated
- **Request Body:**
  ```json
  {
    "razorpayOrderId": "order_H5kF81ksZ92Lmq",
    "razorpayPaymentId": "pay_H5kF81ksZ92L99",
    "razorpaySignature": "3d59bc441c9ecba324482eead5258cf3ba2d1007efab3f173b9e4a3c10",
    "shippingAddressId": 1
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "orderNumber": "SC-20261119-0001",
    "status": "PROCESSING",
    "totalAmount": 421.19,
    "message": "Payment verified and order confirmed successfully"
  }
  ```

#### `GET /orders`
List orders placed by the current user.
- **Access:** Authenticated

#### `GET /orders/{orderNumber}`
Get full order details, tracking timeline, line items, and shipping address.
- **Access:** Authenticated

#### `PUT /orders/{orderNumber}/cancel`
Cancel an order (allowed only if order is in `PENDING` or `PROCESSING` status).
- **Access:** Authenticated

---

### 3.8 Seller Operations (`/seller`)

#### `POST /seller/register`
Onboard current user as an equipment seller.
- **Access:** Authenticated
- **Request Body:**
  ```json
  {
    "storeName": "Apex Cricket Gear",
    "description": "Certified dealer for high-grade cricket willows.",
    "businessPhone": "+1-555-0155"
  }
  ```

#### `GET /seller/dashboard`
Retrieve seller dashboard metrics (total revenue, active listings, orders pending shipment).
- **Access:** Authenticated (`SELLER`, `ADMIN`)

#### `POST /seller/products`
Create a new product listing (New or Pre-Owned).
- **Access:** Authenticated (`SELLER`, `ADMIN`)
- **Request Body:**
  ```json
  {
    "title": "Yonex Astrox 99 Pro Badminton Racket",
    "description": "Head-heavy power racket used in 3 matches. Strung at 28 lbs with BG80.",
    "price": 149.99,
    "originalPrice": 229.99,
    "condition": "EXCELLENT",
    "isPreOwned": true,
    "sportId": 3,
    "categoryId": 8,
    "brandId": 4,
    "stockQuantity": 1,
    "yearsUsed": 0.5,
    "wearDescription": "Slight cosmetic scuff at 2 o'clock on racket frame; grommets fresh.",
    "imageUrls": [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80"
    ]
  }
  ```

#### `PUT /seller/products/{id}/status`
Toggle product listing status (`ACTIVE`, `PAUSED`, `ARCHIVED`).
- **Access:** Authenticated (`SELLER`, `ADMIN`)

---

### 3.9 Sports Club Marketplace (`/clubs`)

#### `GET /clubs`
List all verified sports clubs and academies.
- **Access:** Public

#### `GET /clubs/{slug}`
Get club profile, facilities, coaches, and associated gear requirements.
- **Access:** Public

#### `POST /clubs/{slug}/join`
Submit a membership inquiry / join request to a sports club.
- **Access:** Authenticated
- **Request Body:**
  ```json
  {
    "message": "Interested in weekend cricket league training."
  }
  ```

#### `GET /clubs/{slug}/memberships`
Review membership join requests for the club.
- **Access:** Authenticated (`CLUB_ADMIN`, `ADMIN`)

---

### 3.10 Customer Reviews & In-App Notifications (`/reviews`, `/notifications`)

#### `POST /reviews`
Submit a review for a purchased product (verified purchase checked server-side).
- **Access:** Authenticated
- **Request Body:**
  ```json
  {
    "productId": 1,
    "rating": 5,
    "headline": "Superb ping and punchy balance!",
    "comment": "Used this bat in our league opener. Clean wood, huge sweet spot."
  }
  ```

#### `GET /notifications`
Retrieve in-app notifications for the user.
- **Access:** Authenticated

#### `PUT /notifications/{id}/read`
Mark a notification as read.
- **Access:** Authenticated

---

### 3.11 Admin Dashboard & Governance (`/admin`)

#### `GET /admin/dashboard/stats`
Platform KPI overview (Total Revenue, Active Users, Pending Moderation, Active Listings).
- **Access:** Authenticated (`ADMIN`)

#### `GET /admin/products/pending`
Retrieve listings waiting for pre-owned verification / quality checks.
- **Access:** Authenticated (`ADMIN`)

#### `PUT /admin/products/{id}/verify`
Approve or reject pre-owned listing verification.
- **Access:** Authenticated (`ADMIN`)

#### `GET /admin/orders`
View and manage all platform orders.
- **Access:** Authenticated (`ADMIN`)

#### `PUT /admin/orders/{orderNumber}/status`
Update order lifecycle status (`PROCESSING`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`).
- **Access:** Authenticated (`ADMIN`)

#### `GET /admin/audit-logs`
Inspect administrative audit log entries for security compliance.
- **Access:** Authenticated (`ADMIN`)

---

### 3.12 Media & Storage (`/media`)

#### `POST /media/upload`
Upload an image to Supabase Storage bucket (`sportcycle-products`).
- **Access:** Authenticated (`SELLER`, `ADMIN`)
- **Content-Type:** `multipart/form-data`
- **Request Parameter:** `file` (Binary image file, e.g. JPEG, PNG, WebP)
- **Response `200 OK`:**
  ```json
  {
    "url": "https://xyzcompany.supabase.co/storage/v1/object/public/sportcycle-products/product_1732000000.webp"
  }
  ```

