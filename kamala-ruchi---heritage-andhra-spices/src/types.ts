export type ProductCategory = 'all' | 'spice-powders' | 'premixes' | 'instant-pickles';

export interface Product {
  id: string;
  name: string;
  teluguName?: string;
  category: 'spice-powders' | 'premixes' | 'instant-pickles';
  categoryLabel: string;
  basePrice: number; // 100g price
  largePrice: number; // 250g price
  badges: { text: string; variant: 'primary' | 'secondary' | 'surface' }[];
  description: string;
  fullDescription: string;
  ingredients: string[];
  benefits: string[];
  heatLevel: 1 | 2 | 3 | 4 | 5;
  packagingNote: string;
  bestPairedWith: string;
  image: string;
  isBestseller?: boolean;
  inStock?: boolean;
  isCombo?: boolean;
  comboIncludes?: string[];
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  weight: '100gm' | '250gm';
  price: number;
  quantity: number;
  image: string;
  packagingNote: string;
}

export interface Recipe {
  id: string;
  title: string;
  teluguTitle: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: 'Easy' | 'Moderate';
  description: string;
  heroProduct: string;
  heroProductId: string;
  ingredients: string[];
  instructions: string[];
  image: string;
  matriarchTip: string;
}

export type ActivePage = 'home' | 'shop' | 'our-story' | 'recipes' | 'contact' | 'orders' | 'admin';

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  city?: string;
  pincode?: string;
  createdAt: string;
  lastLoginAt: string;
  orderCount?: number;
  totalSpent?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  pincode: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  finalTotal: number;
  paymentMethod: 'online' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'cash_on_delivery' | 'failed';
  orderStatus: 'received' | 'roasting_grinding' | 'packed' | 'dispatched' | 'delivered' | 'cancelled';
  couponApplied?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  action: 'USER_SIGN_UP' | 'USER_LOGIN' | 'USER_LOGOUT' | 'VIEW_PRODUCT' | 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'ORDER_PLACED' | 'ORDER_STATUS_UPDATE' | 'UPDATE_PROFILE';
  details: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface Announcement {
  id?: string;
  message: string;
  isActive: boolean;
  updatedAt: string;
}

export interface PopupNote {
  id?: string;
  title: string;
  message: string;
  buttonText?: string;
  isActive: boolean;
  updatedAt: string;
}
