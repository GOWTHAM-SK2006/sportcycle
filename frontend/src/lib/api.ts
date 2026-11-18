import {
  ApiResponse,
  PagedResponse,
  ProductSummary,
  ProductDetail,
  Sport,
  Category,
  Brand,
  Cart,
  Wishlist,
  Order,
  Review,
  NotificationItem,
  Club,
  ClubMembership,
  SellerProfile,
  SellerStats,
  AdminStats,
  User,
  Address,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? '/api/v1' : 'http://127.0.0.1:8080/api/v1');

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = localStorage.getItem('sportcycle_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('sportcycle_session_id', sid);
  }
  return sid;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sportcycle_token') : null;
  const sessionId = getSessionId();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (sessionId) {
    headers['X-Session-ID'] = sessionId;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const json: ApiResponse<T> = await response.json();
    return json.data;
  } catch (err: any) {
    // If backend is not running during local inspection or static build, throw with clear message
    throw err;
  }
}

// 1. Auth APIs
export const authApi = {
  login: (data: any) => apiFetch<{ token: string; refreshToken: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  register: (data: any) => apiFetch<{ token: string; refreshToken: string; user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  refreshToken: (refreshToken: string) => apiFetch<{ token: string; refreshToken: string; user: User }>('/auth/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  }),
};

// 2. User & Addresses
export const userApi = {
  getProfile: () => apiFetch<User>('/user/profile'),
  updateProfile: (data: any) => apiFetch<User>('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  changePassword: (data: any) => apiFetch<void>('/user/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getAddresses: () => apiFetch<Address[]>('/user/addresses'),
  addAddress: (data: Address) => apiFetch<Address>('/user/addresses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateAddress: (id: number, data: Address) => apiFetch<Address>(`/user/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteAddress: (id: number) => apiFetch<void>(`/user/addresses/${id}`, {
    method: 'DELETE',
  }),
  setDefaultAddress: (id: number) => apiFetch<Address>(`/user/addresses/${id}/default`, {
    method: 'PATCH',
  }),
};

// 3. Catalog & Products
export const catalogApi = {
  getSports: () => apiFetch<Sport[]>('/sports'),
  getSportBySlug: (slug: string) => apiFetch<Sport>(`/sports/${slug}`),
  getCategories: () => apiFetch<Category[]>('/categories'),
  getBrands: () => apiFetch<Brand[]>('/brands'),
};

export const productApi = {
  getProducts: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return apiFetch<PagedResponse<ProductSummary>>(`/products?${query.toString()}`);
  },
  getFeaturedProducts: () => apiFetch<ProductSummary[]>('/products/featured'),
  getPreOwnedProducts: (page = 0, size = 12) => apiFetch<PagedResponse<ProductSummary>>(`/products/pre-owned?page=${page}&size=${size}`),
  getProductBySlug: (slug: string) => apiFetch<ProductDetail>(`/products/${slug}`),
  createProduct: (data: any) => apiFetch<ProductDetail>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteProduct: (id: number) => apiFetch<void>(`/products/${id}`, {
    method: 'DELETE',
  }),
};

// 4. Cart & Wishlist
export const cartApi = {
  getCart: () => apiFetch<Cart>('/cart'),
  addToCart: (data: { productId: number; quantity: number; selectedSize?: string }) =>
    apiFetch<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateItem: (itemId: number, data: { quantity: number; selectedSize?: string }) =>
    apiFetch<Cart>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  removeItem: (itemId: number) => apiFetch<Cart>(`/cart/items/${itemId}`, {
    method: 'DELETE',
  }),
  clearCart: () => apiFetch<void>('/cart', {
    method: 'DELETE',
  }),
  mergeGuestCart: (guestSessionId: string) =>
    apiFetch<Cart>(`/cart/merge?guestSessionId=${encodeURIComponent(guestSessionId)}`, {
      method: 'POST',
    }),
};

export const wishlistApi = {
  getWishlist: () => apiFetch<Wishlist>('/wishlist'),
  addToWishlist: (productId: number) => apiFetch<Wishlist>(`/wishlist/products/${productId}`, {
    method: 'POST',
  }),
  removeFromWishlist: (productId: number) => apiFetch<Wishlist>(`/wishlist/products/${productId}`, {
    method: 'DELETE',
  }),
  moveToCart: (productId: number) => apiFetch<void>(`/wishlist/products/${productId}/move-to-cart`, {
    method: 'POST',
  }),
};

// 5. Orders & Payments
export const orderApi = {
  checkout: (data: any) => apiFetch<Order>('/orders/checkout', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getUserOrders: (page = 0, size = 10) => apiFetch<PagedResponse<Order>>(`/orders?page=${page}&size=${size}`),
  getOrderByNumber: (orderNumber: string) => apiFetch<Order>(`/orders/${orderNumber}`),
  cancelOrder: (id: number, reason: string) =>
    apiFetch<Order>(`/orders/${id}/cancel?reason=${encodeURIComponent(reason)}`, {
      method: 'POST',
    }),
};

export const paymentApi = {
  createPaymentOrder: (orderNumber: string) =>
    apiFetch<any>(`/payments/create-order?orderNumber=${encodeURIComponent(orderNumber)}`, {
      method: 'POST',
    }),
  verifyPayment: (data: { orderNumber: string; gatewayOrderId: string; gatewayPaymentId: string; gatewaySignature: string }) =>
    apiFetch<boolean>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// 6. Seller Portal
export const sellerApi = {
  register: (data: any) => apiFetch<SellerProfile>('/seller/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getProfile: () => apiFetch<SellerProfile>('/seller/profile'),
  getStats: () => apiFetch<SellerStats>('/seller/stats'),
  getProducts: () => apiFetch<ProductSummary[]>('/seller/products'),
  toggleStatus: (productId: number) => apiFetch<ProductSummary>(`/seller/products/${productId}/toggle-status`, {
    method: 'PATCH',
  }),
};

// 7. Clubs
export const clubApi = {
  getAll: () => apiFetch<Club[]>('/clubs'),
  getBySlug: (slug: string) => apiFetch<Club>(`/clubs/${slug}`),
  getClubProducts: (slug: string) => apiFetch<ProductSummary[]>(`/clubs/${slug}/products`),
  requestMembership: (clubId: number, notes?: string) =>
    apiFetch<ClubMembership>(`/clubs/${clubId}/memberships?notes=${encodeURIComponent(notes || '')}`, {
      method: 'POST',
    }),
  getMemberships: (clubId: number) => apiFetch<ClubMembership[]>(`/clubs/admin/${clubId}/memberships`),
  reviewMembership: (clubId: number, membershipId: number, status: string) =>
    apiFetch<ClubMembership>(`/clubs/admin/${clubId}/memberships/${membershipId}?status=${status}`, {
      method: 'PATCH',
    }),
  createClub: (data: any) => apiFetch<Club>('/clubs/admin/create', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// 8. Reviews & Notifications
export const reviewApi = {
  getProductReviews: (productId: number, page = 0, size = 10) =>
    apiFetch<PagedResponse<Review>>(`/reviews/product/${productId}?page=${page}&size=${size}`),
  addReview: (productId: number, data: { rating: number; title: string; comment: string }) =>
    apiFetch<Review>(`/reviews/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const notificationApi = {
  getAll: () => apiFetch<NotificationItem[]>('/notifications'),
  getUnreadCount: () => apiFetch<number>('/notifications/unread-count'),
  markAsRead: (id: number) => apiFetch<void>(`/notifications/${id}/read`, {
    method: 'PATCH',
  }),
  markAllAsRead: () => apiFetch<void>('/notifications/read-all', {
    method: 'PATCH',
  }),
};

// 9. Admin Operations
export const adminApi = {
  getStats: () => apiFetch<AdminStats>('/admin/stats'),
  getOrders: (page = 0, size = 15) => apiFetch<PagedResponse<Order>>(`/admin/orders?page=${page}&size=${size}`),
  updateOrderStatus: (id: number, data: any) => apiFetch<Order>(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  getUsers: (page = 0, size = 15) => apiFetch<PagedResponse<User>>(`/admin/users?page=${page}&size=${size}`),
  toggleUserStatus: (id: number) => apiFetch<User>(`/admin/users/${id}/toggle-status`, {
    method: 'PATCH',
  }),
  moderateProduct: (id: number, data: any) => apiFetch<ProductDetail>(`/admin/products/${id}/moderate`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  toggleFeatured: (id: number) => apiFetch<ProductDetail>(`/admin/products/${id}/toggle-featured`, {
    method: 'PATCH',
  }),
  getAuditLogs: (page = 0, size = 20) => apiFetch<PagedResponse<any>>(`/admin/audit-logs?page=${page}&size=${size}`),
};

