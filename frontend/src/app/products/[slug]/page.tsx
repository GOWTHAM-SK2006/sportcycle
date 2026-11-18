'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronRight,
  Clock,
  Sparkles,
  Send,
  Check
} from 'lucide-react';
import { productApi, reviewApi } from '@/lib/api';
import { ProductDetail, Review, ProductSummary } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { ConditionBadge } from '@/components/common/ConditionBadge';
import { RatingStars } from '@/components/common/RatingStars';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { ProductCard } from '@/components/common/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarProducts, setSimilarProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Review form state
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    productApi.getProductBySlug(String(slug))
      .then(async (data) => {
        setProduct(data);
        if (data.imageUrls && data.imageUrls.length > 0) {
          setSelectedImage(data.imageUrls[0]);
        }
        if (data.sizes) {
          const sizeList = data.sizes.split(',').map((s) => s.trim());
          if (sizeList.length > 0) setSelectedSize(sizeList[0]);
        }

        // Fetch reviews and similar
        const [reviewsRes, similarRes] = await Promise.allSettled([
          reviewApi.getProductReviews(data.id),
          productApi.getProducts({ sportSlug: data.sportSlug, size: 4 }),
        ]);

        if (reviewsRes.status === 'fulfilled') {
          setReviews(reviewsRes.value.content || []);
        }
        if (similarRes.status === 'fulfilled') {
          setSimilarProducts(
            (similarRes.value.content || []).filter((p) => p.id !== data.id)
          );
        }
      })
      .catch((err) => {
        console.error('Error loading product details:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
          <div className="lg:col-span-7 aspect-square bg-ivory/60 rounded-3xl" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-6 w-32 bg-ivory rounded-md" />
            <div className="h-10 w-full bg-ivory rounded-md" />
            <div className="h-8 w-40 bg-ivory rounded-md" />
            <div className="h-32 w-full bg-ivory rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-dark">Equipment Not Found</h2>
        <p className="text-sm text-dark-muted mt-2">The equipment you are searching for might have been sold or removed.</p>
        <Link href="/products" className="inline-block mt-6 px-6 py-3 rounded-xl bg-lime font-bold text-xs text-dark">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity, selectedSize);
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on SportCycle!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setSubmittingReview(true);
    setReviewMessage('');

    try {
      const newReview = await reviewApi.addReview(product.id, {
        rating: ratingInput,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviews([newReview, ...reviews]);
      setReviewTitle('');
      setReviewComment('');
      setReviewMessage('Your review has been verified and published!');
    } catch (err: any) {
      setReviewMessage(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const sizesList = product.sizes ? product.sizes.split(',').map((s) => s.trim()) : [];
  const favorited = isInWishlist(product.id);

  return (
    <div className="bg-surface-white pb-24 md:pb-16">
      {/* Breadcrumb Navigation */}
      <div className="bg-ivory/50 border-b border-surface-border py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-dark-muted overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-dark">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/products?sportSlug=${product.sportSlug}`} className="hover:text-dark">{product.sportName}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/products?categorySlug=${product.categorySlug}`} className="hover:text-dark">{product.categoryName}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-dark font-medium truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: IMAGE GALLERY (Thumbnails + Main preview) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar max-h-[500px]">
                {product.imageUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(url)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === url ? 'border-olive shadow-sm' : 'border-surface-border hover:border-lime'
                    }`}
                  >
                    <Image src={url} alt={`Thumbnail ${i}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Interactive Zoomable Container */}
            <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-ivory border border-surface-border shadow-premium">
              <Image
                src={selectedImage || 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=1000'}
                alt={product.title}
                fill
                priority
                className="object-cover transition-transform duration-300 hover:scale-105"
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <ConditionBadge
                  condition={product.condition}
                  isPreOwned={product.isPreOwned}
                  isVerified={product.isVerified}
                />
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={handleShare}
                  aria-label="Share"
                  className="w-10 h-10 rounded-full bg-surface-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-dark hover:text-olive transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Wishlist"
                  className="w-10 h-10 rounded-full bg-surface-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-dark hover:text-red-500 transition-all"
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : 'text-dark-muted'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO & PURCHASE CONTROLS */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div>
              {/* Brand & Sport */}
              <div className="flex items-center justify-between text-xs font-semibold text-dark-muted mb-2">
                <span className="uppercase tracking-widest text-olive">{product.sportName} • {product.categoryName}</span>
                <span>{product.brandName || 'Authentic'}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-dark leading-snug">
                {product.title}
              </h1>

              {/* Rating & Review summary */}
              <div className="mt-2.5 flex items-center gap-3">
                <RatingStars rating={product.rating || 5.0} reviewCount={product.reviewCount} />
                {product.location && (
                  <span className="text-xs text-dark-muted flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-olive" />
                    {product.location}
                  </span>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-ivory/50 border border-surface-border">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-dark">
                  {formatPrice(product.sellingPrice)}
                </span>
                {product.originalPrice > product.sellingPrice && (
                  <>
                    <span className="text-sm text-dark-light line-through font-medium">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-olive text-surface-white">
                      {product.discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-dark-muted mt-1">Inclusive of all taxes. Free courier delivery over ₹999.</p>
            </div>

            {/* Sizes Selection (If applicable) */}
            {sizesList.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-dark mb-2">
                  <span>Select Size / Spec</span>
                  <span className="text-olive font-normal">Authentic specifications</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizesList.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-olive text-surface-white shadow-sm'
                          : 'bg-surface-white border border-surface-border text-dark hover:border-lime'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-dark">Quantity:</span>
              <div className="flex items-center border border-surface-border rounded-xl bg-surface-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-dark font-bold hover:bg-ivory rounded-l-xl"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-dark">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  className="px-3 py-1.5 text-dark font-bold hover:bg-ivory rounded-r-xl"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-dark-muted">
                {product.stockQuantity > 0 ? (
                  <span className="text-emerald-700 font-semibold">In Stock ({product.stockQuantity} available)</span>
                ) : (
                  <span className="text-red-600 font-semibold">Sold Out</span>
                )}
              </span>
            </div>

            {/* Desktop Purchase Buttons */}
            <div className="hidden sm:grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stockQuantity === 0}
                className={`py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                  cartSuccess
                    ? 'bg-emerald-600 text-surface-white'
                    : 'bg-lime hover:bg-lime-500 text-dark active:scale-95'
                } disabled:opacity-50`}
              >
                {cartSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stockQuantity === 0}
                className="py-3.5 rounded-2xl bg-olive hover:bg-olive/90 text-surface-white font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
              >
                <span>Buy Now</span>
              </button>
            </div>

            {/* Pre-Owned Wear & Verification Report Card */}
            {product.isPreOwned && (
              <div className="p-4 rounded-2xl bg-ivory border border-lime-300 space-y-2">
                <div className="flex items-center gap-2 text-olive font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pre-Owned Inspection Details</span>
                </div>
                <div className="text-xs text-dark space-y-1">
                  <p><span className="font-semibold text-dark-muted">Usage Duration:</span> {product.usageDurationMonths} months</p>
                  <p><span className="font-semibold text-dark-muted">Physical Condition:</span> {product.wearDetails || 'Clean match-tested wear with intact structural integrity.'}</p>
                </div>
              </div>
            )}

            {/* Seller or Club Card */}
            {product.seller && (
              <div className="p-4 rounded-2xl border border-surface-border bg-surface-white flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">Listed By Seller</p>
                  <p className="text-sm font-bold text-dark">{product.seller.businessName}</p>
                  <p className="text-xs text-olive font-semibold">{product.seller.sellerType} • {product.seller.totalSales} Sales</p>
                </div>
                <div className="text-right">
                  <RatingStars rating={product.seller.rating || 5.0} size="sm" showCount={false} />
                  <span className="text-[11px] font-bold text-emerald-700">Verified Seller</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DESCRIPTION & SPECIFICATIONS TABS */}
        <div className="mt-16 pt-10 border-t border-surface-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-xl font-bold text-dark">Product Description & Specs</h2>
              <div className="prose prose-sm text-dark-muted leading-relaxed whitespace-pre-line">
                {product.description}
              </div>

              {/* SKU & Spec Table */}
              <div className="bg-ivory/40 rounded-2xl p-4 border border-surface-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-dark mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-dark-muted">SKU:</span>
                    <span className="ml-2 font-mono font-bold text-dark">{product.sku || 'SC-GEN-001'}</span>
                  </div>
                  <div>
                    <span className="text-dark-muted">Sport:</span>
                    <span className="ml-2 font-bold text-dark">{product.sportName}</span>
                  </div>
                  <div>
                    <span className="text-dark-muted">Condition:</span>
                    <span className="ml-2 font-bold text-dark">{product.condition}</span>
                  </div>
                  <div>
                    <span className="text-dark-muted">Authenticity:</span>
                    <span className="ml-2 font-bold text-dark">{product.isVerified ? 'SportCycle Verified' : 'Standard Guarantee'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CUSTOMER REVIEWS & FORM */}
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-xl font-bold text-dark">Customer Reviews ({reviews.length})</h2>

              {/* Review Submission Form */}
              <form onSubmit={handleSubmitReview} className="bg-ivory/50 rounded-2xl p-4 border border-surface-border space-y-3">
                <p className="text-xs font-bold text-dark uppercase tracking-wider">Leave a Review</p>
                <div>
                  <label className="text-[11px] font-semibold text-dark-muted block mb-1">Your Rating</label>
                  <select
                    value={ratingInput}
                    onChange={(e) => setRatingInput(Number(e.target.value))}
                    className="w-full text-xs font-semibold p-2 rounded-xl border border-surface-border bg-surface-white"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                    <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value="3">⭐⭐⭐ (3 - Average)</option>
                    <option value="2">⭐⭐ (2 - Below Expectations)</option>
                    <option value="1">⭐ (1 - Poor)</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Review title (e.g. Great willow ping)"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-surface-white"
                />

                <textarea
                  placeholder="Share your experience with this equipment..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-surface-white"
                />

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2.5 rounded-xl bg-olive text-surface-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-olive/90"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>

                {reviewMessage && (
                  <p className="text-xs font-semibold text-olive mt-1">{reviewMessage}</p>
                )}
              </form>

              {/* Existing Reviews List */}
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="p-3.5 rounded-xl bg-surface-white border border-surface-border text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-dark">{r.userName}</span>
                      <span className="text-[10px] text-dark-muted">{formatDate(r.createdAt)}</span>
                    </div>
                    <RatingStars rating={r.rating} showCount={false} size="sm" />
                    <p className="font-semibold text-dark mt-1">{r.title}</p>
                    <p className="text-dark-muted">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SIMILAR PRODUCTS */}
        {similarProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-surface-border">
            <h2 className="text-2xl font-black text-dark mb-6">Similar {product.sportName} Gear</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM PURCHASE BAR (Phase 07 Requirement) */}
      <div className="sm:hidden fixed bottom-16 left-0 right-0 z-30 bg-surface-white/95 backdrop-blur-md border-t border-surface-border p-3 flex items-center justify-between gap-3 shadow-floating">
        <div>
          <span className="text-lg font-black text-dark">{formatPrice(product.sellingPrice)}</span>
          <p className="text-[10px] text-emerald-700 font-bold">In Stock</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="px-4 py-2.5 rounded-xl bg-lime font-black text-xs text-dark shadow-sm active:scale-95 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="px-5 py-2.5 rounded-xl bg-olive font-black text-xs text-surface-white shadow-sm active:scale-95"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

