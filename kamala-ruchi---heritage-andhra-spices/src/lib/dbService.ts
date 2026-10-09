import { 
  collection, 
  addDoc, 
  setDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, Order, ActivityLog, Product, Announcement, PopupNote } from '../types';
import { PRODUCTS as LOCAL_PRODUCTS } from '../data/products';

// Admin check helper
export const ADMIN_EMAILS = [
  'kruchimade@gmail.com'
];

export function isUserAdmin(email?: string | null, role?: string): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(normalized) || role === 'admin';
}

const LOCAL_ORDERS_KEY = 'kamala_local_orders';
const LOCAL_USERS_KEY = 'kamala_local_users';
const LOCAL_LOGS_KEY = 'kamala_local_logs';

function getLocalData<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalData<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

// Log an action for auditing & admin monitoring
export async function logUserActivity(
  action: ActivityLog['action'],
  details: string,
  user?: { uid?: string; email?: string | null; displayName?: string | null },
  metadata?: Record<string, unknown>
): Promise<void> {
  const newLog: ActivityLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId: user?.uid || 'guest',
    userEmail: user?.email || 'guest@kamalaruchi.com',
    userName: user?.displayName || 'Guest Visitor',
    action,
    details,
    metadata: metadata || {},
    timestamp: new Date().toISOString(),
  };

  // Always save locally for instant offline admin viewing
  const localLogs = getLocalData<ActivityLog>(LOCAL_LOGS_KEY);
  saveLocalData(LOCAL_LOGS_KEY, [newLog, ...localLogs].slice(0, 100));

  try {
    await addDoc(collection(db, 'activityLogs'), {
      ...newLog,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    // Firestore may fail if permissions or offline, graceful fallback
    console.warn('Activity logged locally (Firestore remote skipped):', error);
  }
}

// Fetch or create user profile
export async function fetchOrCreateUserProfile(
  user: { uid: string; email?: string | null; displayName?: string | null; phoneNumber?: string | null }
): Promise<UserProfile> {
  const email = user.email || '';
  const isAdmin = isUserAdmin(email);

  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      const updatedRole = (isAdmin || data.role === 'admin') ? 'admin' : 'customer';
      
      await updateDoc(userRef, {
        lastLoginAt: new Date().toISOString(),
        role: updatedRole,
        displayName: user.displayName || data.displayName || email.split('@')[0],
      });

      const profile: UserProfile = {
        uid: user.uid,
        email: data.email || email,
        displayName: data.displayName || user.displayName || email.split('@')[0],
        role: updatedRole,
        phoneNumber: data.phoneNumber || user.phoneNumber || '',
        address: data.address || '',
        city: data.city || '',
        pincode: data.pincode || '',
        createdAt: data.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        orderCount: data.orderCount || 0,
        totalSpent: data.totalSpent || 0,
      };

      // Sync local users store
      upsertLocalUser(profile);
      return profile;
    } else {
      const profile: UserProfile = {
        uid: user.uid,
        email: email,
        displayName: user.displayName || email.split('@')[0] || 'Spice Enthusiast',
        role: isAdmin ? 'admin' : 'customer',
        phoneNumber: user.phoneNumber || '',
        address: '',
        city: 'Hyderabad',
        pincode: '',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        orderCount: 0,
        totalSpent: 0,
      };

      await setDoc(userRef, {
        ...profile,
        serverCreatedAt: serverTimestamp(),
      });

      upsertLocalUser(profile);
      await logUserActivity('USER_SIGN_UP', `User registered: ${email}`, {
        uid: user.uid,
        email,
        displayName: profile.displayName,
      });

      return profile;
    }
  } catch (err) {
    console.warn('Firestore user fetch failed, using local profile store:', err);
    const localUsers = getLocalData<UserProfile>(LOCAL_USERS_KEY);
    const existing = localUsers.find((u) => u.uid === user.uid || (u.email && u.email.toLowerCase() === email.toLowerCase()));
    
    if (existing) {
      return existing;
    }

    const fallbackProfile: UserProfile = {
      uid: user.uid,
      email: email,
      displayName: user.displayName || email.split('@')[0] || 'Kamala Spice Family',
      role: isAdmin ? 'admin' : 'customer',
      phoneNumber: user.phoneNumber || '+91 98765 43210',
      address: 'Near Temple Road',
      city: 'Hyderabad',
      pincode: '500034',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      orderCount: 0,
      totalSpent: 0,
    };
    upsertLocalUser(fallbackProfile);
    return fallbackProfile;
  }
}

function upsertLocalUser(user: UserProfile) {
  const users = getLocalData<UserProfile>(LOCAL_USERS_KEY);
  const filtered = users.filter((u) => u.uid !== user.uid && u.email !== user.email);
  saveLocalData(LOCAL_USERS_KEY, [user, ...filtered]);
}

// Update user profile details
export async function updateUserProfileDetails(
  uid: string, 
  updates: Partial<UserProfile>
): Promise<void> {
  const users = getLocalData<UserProfile>(LOCAL_USERS_KEY);
  const updatedUsers = users.map((u) => (u.uid === uid ? { ...u, ...updates } : u));
  saveLocalData(LOCAL_USERS_KEY, updatedUsers);

  try {
    const userRef = doc(db, 'users', uid);
    const firestoreUpdates: any = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    Object.keys(firestoreUpdates).forEach((key) => {
      if (firestoreUpdates[key] === undefined) {
        delete firestoreUpdates[key];
      }
    });

    await updateDoc(userRef, firestoreUpdates);
  } catch (err) {
    console.warn('Firestore update profile skipped, persisted locally:', err);
  }
}

// Create new customer order
export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
  const localOrderId = 'KR-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder: Order = {
    ...orderData,
    id: localOrderId,
    createdAt: new Date().toISOString(),
  };

  // Always save locally immediately
  const localOrders = getLocalData<Order>(LOCAL_ORDERS_KEY);
  saveLocalData(LOCAL_ORDERS_KEY, [newOrder, ...localOrders]);

  // Update local user stats
  const localUsers = getLocalData<UserProfile>(LOCAL_USERS_KEY);
  const updatedUsers = localUsers.map((u) => {
    if (u.uid === orderData.userId || u.email === orderData.userEmail) {
      return {
        ...u,
        orderCount: (u.orderCount || 0) + 1,
        totalSpent: (u.totalSpent || 0) + orderData.finalTotal,
        lastOrderAt: new Date().toISOString(),
      };
    }
    return u;
  });
  saveLocalData(LOCAL_USERS_KEY, updatedUsers);

  // Try Firestore persist
  try {
    const firestoreData: any = {
      ...orderData,
      createdAt: new Date().toISOString(),
      serverCreatedAt: serverTimestamp(),
    };
    
    // Remove any undefined top-level fields (Firestore throws error on undefined)
    Object.keys(firestoreData).forEach((key) => {
      if (firestoreData[key] === undefined) {
        delete firestoreData[key];
      }
    });

    const docRef = await addDoc(collection(db, 'orders'), firestoreData);

    try {
      const userRef = doc(db, 'users', orderData.userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const current = snap.data();
        await updateDoc(userRef, {
          orderCount: (current.orderCount || 0) + 1,
          totalSpent: (current.totalSpent || 0) + orderData.finalTotal,
          lastOrderAt: new Date().toISOString(),
        });
      }
    } catch {
      // ignore
    }

    return docRef.id;
  } catch (err) {
    console.warn('Firestore remote addDoc failed, order stored locally:', err);
    return localOrderId;
  }
}

// Fetch orders for a specific user
export async function fetchUserOrders(userId: string): Promise<Order[]> {
  const localOrders = getLocalData<Order>(LOCAL_ORDERS_KEY).filter((o) => o.userId === userId);

  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      limit(50)
    );
    const snap = await getDocs(q);
    const remoteOrders = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
    
    // Merge remote and local (avoiding duplicates)
    const map = new Map<string, Order>();
    remoteOrders.forEach((o) => map.set(o.id, o));
    localOrders.forEach((o) => map.set(o.id, o));

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.warn('Firestore fetchUserOrders failed, returning local orders:', err);
    return localOrders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

// Admin: Fetch all users
export async function adminFetchAllUsers(): Promise<UserProfile[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const remoteUsers = snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile));
    
    return remoteUsers.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.warn('Firestore adminFetchAllUsers failed:', err);
    return [];
  }
}

// Admin: Fetch all orders
export async function adminFetchAllOrders(): Promise<Order[]> {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    const remoteOrders = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
    
    return remoteOrders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.warn('Firestore adminFetchAllOrders failed:', err);
    return [];
  }
}

// Admin: Update order status
export async function adminUpdateOrderStatus(
  orderId: string, 
  status: Order['orderStatus'],
  adminUser?: { uid?: string; email?: string | null }
): Promise<void> {
  // Update local copy
  const localOrders = getLocalData<Order>(LOCAL_ORDERS_KEY);
  const updated = localOrders.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o));
  saveLocalData(LOCAL_ORDERS_KEY, updated);

  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      orderStatus: status,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Remote order status update skipped:', e);
  }

  await logUserActivity(
    'ORDER_STATUS_UPDATE',
    `Order #${orderId} updated to ${status}`,
    adminUser,
    { orderId, status }
  );
}

// Admin: Fetch recent audit / activity logs
export async function adminFetchActivityLogs(limitCount = 100): Promise<ActivityLog[]> {
  try {
    const q = query(
      collection(db, 'activityLogs'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    const remoteLogs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityLog));
    
    return remoteLogs;
  } catch (err) {
    console.warn('Firestore adminFetchActivityLogs failed:', err);
    return [];
  }
}

// Admin: Manage Products
export async function fetchProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, 'products'));
    if (snap.empty) {
      await adminMigrateProducts();
      const newSnap = await getDocs(collection(db, 'products'));
      if (newSnap.empty) return LOCAL_PRODUCTS;
      return newSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  } catch (err) {
    console.warn('Firestore fetchProducts failed, returning local:', err);
    return LOCAL_PRODUCTS;
  }
}

export async function adminSaveProduct(product: Product): Promise<void> {
  const ref = doc(db, 'products', product.id);
  await setDoc(ref, product);
}

export async function adminDeleteProduct(productId: string): Promise<void> {
  const { deleteDoc } = await import('firebase/firestore');
  const ref = doc(db, 'products', productId);
  await deleteDoc(ref);
}

export async function adminMigrateProducts(): Promise<void> {
  for (const product of LOCAL_PRODUCTS) {
    const ref = doc(db, 'products', product.id);
    await setDoc(ref, { ...product, inStock: true });
  }
}

// Announcements & Popups
export async function fetchAnnouncements(): Promise<Announcement[]> {
  try {
    const snap = await getDocs(collection(db, 'announcements'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement));
  } catch (err) {
    return [];
  }
}

export async function adminSaveAnnouncement(announcement: Announcement): Promise<void> {
  if (announcement.id) {
    await setDoc(doc(db, 'announcements', announcement.id), announcement);
  } else {
    await addDoc(collection(db, 'announcements'), announcement);
  }
}

export async function fetchPopups(): Promise<PopupNote[]> {
  try {
    const snap = await getDocs(collection(db, 'popups'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PopupNote));
  } catch (err) {
    return [];
  }
}

export async function adminSavePopup(popup: PopupNote): Promise<void> {
  if (popup.id) {
    await setDoc(doc(db, 'popups', popup.id), popup);
  } else {
    await addDoc(collection(db, 'popups'), popup);
  }
}
