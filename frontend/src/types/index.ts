export type ProductCondition = 'BRAND_NEW' | 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR';
export type ProductStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'PAUSED' | 'REJECTED' | 'SOLD_OUT';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type SellerType = 'INDIVIDUAL' | 'RETAILER' | 'PRO_ATHLETE' | 'CLUB';
export type MembershipStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type NotificationType = 'ORDER' | 'PAYMENT' | 'SYSTEM' | 'SELLER' | 'CLUB';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  roles: string[];
  isActive: boolean;
}

export interface Address {
  id?: number;
  recipientName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  addressType: string;
}

export interface Category {
  id: number;
  sportId: number;
  sportName: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
}

export interface Sport {
  id: number;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  imageUrl?: string;
  displayOrder: number;
  categories?: Category[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  websiteUrl?: string;
}

export interface ProductSummary {
  id: number;
  title: string;
  slug: string;
  brandName?: string;
  sportName: string;
  sportSlug: string;
  categoryName: string;
  categorySlug: string;
  condition: ProductCondition;
  isPreOwned: boolean;
  isVerified: boolean;
  originalPrice: number;
  sellingPrice: number;
  price?: number;
  discountPercentage: number;
  stockQuantity: number;
  status: ProductStatus;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  primaryImageUrl?: string;
  location?: string;
  sizes?: string;
}

export interface SellerSummary {
  id: number;
  businessName: string;
  sellerType: SellerType;
  isVerified: boolean;
  rating: number;
  totalSales: number;
  phone?: string;
  bio?: string;
}

export interface ClubSummary {
  id: number;
  name: string;
  slug: string;
  location: string;
  city: string;
  state: string;
  logoUrl?: string;
  isVerified: boolean;
  membershipOpen: boolean;
}

export interface ProductDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  sportId: number;
  sportName: string;
  sportSlug: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  brandId?: number;
  brandName?: string;
  brandLogoUrl?: string;
  condition: ProductCondition;
  isPreOwned: boolean;
  usageDurationMonths: number;
  wearDetails?: string;
  isVerified: boolean;
  originalPrice: number;
  sellingPrice: number;
  price?: number;
  discountPercentage: number;
  stockQuantity: number;
  sku?: string;
  sizes?: string;
  status: ProductStatus;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  location?: string;
  imageUrls: string[];
  seller?: SellerSummary;
  club?: ClubSummary;
  createdAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productTitle: string;
  productSlug: string;
  productImage?: string;
  unitPrice: number;
  quantity: number;
  selectedSize?: string;
  totalPrice: number;
  inStock: boolean;
  availableStock: number;
}

export interface Cart {
  id?: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  totalItems: number;
}

export interface WishlistItem {
  id: number;
  product: ProductSummary;
  addedAt: string;
}

export interface Wishlist {
  id?: number;
  items: WishlistItem[];
  totalItems: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productTitle: string;
  productImage?: string;
  selectedSize?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderStatusHistory {
  id: number;
  status: OrderStatus;
  notes?: string;
  updatedBy?: string;
  createdAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  recipientName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  trackingNumber?: string;
  shippingCarrier?: string;
  cancellationReason?: string;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  productId: number;
  productTitle: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface Club {
  id: number;
  adminUserId: number;
  name: string;
  slug: string;
  sportId?: number;
  sportName?: string;
  location: string;
  city: string;
  state: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  membershipOpen: boolean;
  memberCount: number;
  isVerified: boolean;
  createdAt: string;
}

export interface ClubMembership {
  id: number;
  clubId: number;
  clubName: string;
  userId: number;
  userName: string;
  userEmail: string;
  status: MembershipStatus;
  requestedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export interface SellerProfile {
  id: number;
  userId: number;
  businessName: string;
  sellerType: SellerType;
  isVerified: boolean;
  gstin?: string;
  panNumber?: string;
  phone: string;
  bio?: string;
  rating: number;
  totalSales: number;
  createdAt: string;
}

export interface SellerStats {
  totalListings: number;
  activeListings: number;
  pendingApproval: number;
  soldProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalSellers: number;
  totalProducts: number;
  activeListings: number;
  pendingApprovals: number;
  totalClubs: number;
  preOwnedProducts: number;
}

export interface AuditLogItem {
  id: number;
  userEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  details?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

