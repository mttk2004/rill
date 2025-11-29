# 🚀 UI Migration Guide - From Temp SPA to Laravel Inertia

## 📋 Migration Progress

### ✅ Phase 1: Backup & Copy (COMPLETED)
- [x] Backup old UI to `.backup/` folder
- [x] Copy components from `temp/` to `resources/js/components/`
- [x] Copy pages from `temp/` to `resources/js/pages/`
- [x] Copy context, hooks, utils, services

### ✅ Phase 2: Basic Imports Replacement (COMPLETED)
- [x] Replace `Link` from react-router-dom with Inertia Link

### 🔄 Phase 3: Component Adaptation (IN PROGRESS)

#### Components requiring adaptation:

**Navigation Components:**
- [ ] `Navbar.tsx` - Remove `useNavigate`, `NavLink` 
- [ ] `navbar/MegaMenu.tsx` - Already using Link ✅
- [ ] `navbar/MobileMenu.tsx` - Remove `NavLink`
- [ ] `navbar/UserDropdown.tsx` - Already using Link ✅
- [ ] `navbar/CartFlyout.tsx` - Remove Link to `/cart`, use Inertia
- [ ] `navbar/SearchOverlay.tsx` - Review search navigation

**Product Components:**
- [ ] `ProductCard.tsx` - Already using Link ✅, review data structure
- [ ] `product-list/FilterSidebar.tsx` - Review filter links
- [ ] `product-list/ActiveFilters.tsx` - Already adapted ✅
- [ ] `product-detail/RelatedProducts.tsx` - Already adapted ✅

**Other Components:**
- [ ] `Footer.tsx` - Already using Link ✅
- [ ] `admin/AdminLayout.tsx` - Remove `Outlet`, create Inertia layout
- [ ] `admin/AdminHeader.tsx` - Remove `NavLink`, `useNavigate`

### 📄 Phase 4: Page Adaptation (TODO)

Each page needs:
1. Add `Head` component from @inertiajs/react
2. Convert to receive props from Inertia instead of mock data
3. Remove `useParams()` - get params from props
4. Remove `useNavigate()` - use `router` from Inertia
5. Export as default function
6. Add proper TypeScript interface for props

#### Customer Pages:

**Home Page (`pages/Home.tsx`)**
```tsx
// BEFORE
import { Link } from 'react-router-dom';
import { PRODUCTS, ARTISTS, COLLECTIONS } from '../data';

const Home = () => {
  const featuredProducts = PRODUCTS.slice(0, 4);
  // ...
}

// AFTER
import { Head, Link } from '@inertiajs/react';
import { Product, Collection } from '@/types';

interface HomeProps {
  featuredProducts: Product[];
  collections: Collection[];
}

export default function Home({ featuredProducts, collections }: HomeProps) {
  return (
    <>
      <Head title="Trang chủ - Rill" />
      {/* ... */}
    </>
  );
}
```

**Products Page (`pages/ProductList.tsx`)**
- Replace mock data with props
- Remove `useLocation` - use URL query params from props or `usePage()`
- Add filters from backend

**Product Detail Page (`pages/ProductDetail.tsx`)**
- Remove `useParams()` - receive product from props
- Add related products from backend

**Cart Page (`pages/Cart.tsx`)**
- Use cart from shared props or context
- Integrate with backend cart

**Checkout Page (`pages/Checkout.tsx`)**
- Use Inertia form for checkout
- Handle form submission with router.post()

**Auth Pages:**
- [ ] `Login.tsx` - Use Inertia forms
- [ ] `Register.tsx` - Use Inertia forms

**Account Pages:**
- [ ] `Orders.tsx`
- [ ] `OrderDetail.tsx`
- [ ] `Addresses.tsx`
- [ ] `Settings.tsx`

**Other:**
- [ ] `About.tsx`
- [ ] `Support.tsx`

#### Admin Pages:

All admin pages need similar adaptation:
- Remove `useNavigate()` - use `router`
- Remove `useParams()` - get ID from props
- Use Inertia forms for create/edit
- Add proper layouts

**Admin Dashboard:**
- [ ] `admin/Dashboard.tsx`
- [ ] `admin/Settings.tsx`

**Product Management:**
- [ ] `admin/products/ProductList.tsx`
- [ ] `admin/products/ProductForm.tsx`

**Order Management:**
- [ ] `admin/orders/OrderList.tsx`
- [ ] `admin/orders/OrderDetail.tsx`

**Artist Management:**
- [ ] `admin/artists/ArtistList.tsx`
- [ ] `admin/artists/ArtistForm.tsx`

**Collection Management:**
- [ ] `admin/collections/CollectionList.tsx`
- [ ] `admin/collections/CollectionForm.tsx`

**Customer Management:**
- [ ] `admin/customers/CustomerList.tsx`
- [ ] `admin/customers/CustomerForm.tsx`

**Voucher Management:**
- [ ] `admin/vouchers/VoucherList.tsx`
- [ ] `admin/vouchers/VoucherForm.tsx`

### 🔧 Phase 5: Context Integration (TODO)

**Contexts to integrate:**
- [ ] `context/ShopContext.tsx` - Cart management
- [ ] `context/PlayerContext.tsx` - Music player state
- [ ] `context/ToastContext.tsx` - Notifications

**Integration approach:**
1. Wrap app with context providers in `app.tsx`
2. Connect ShopContext with backend cart (use Inertia shared props)
3. Keep PlayerContext as-is (client-side only)
4. Replace ToastContext with existing react-toastify or keep both

### 📦 Phase 6: Dependencies (TODO)

**Check package.json:**
- [ ] Ensure `lucide-react` is installed
- [ ] Remove `react-router-dom` (or keep for specific use cases)
- [ ] Check if all Radix UI components are available

**Run:**
```bash
npm install lucide-react
# or
npm install
```

### 🎨 Phase 7: Layouts (TODO)

Create Inertia-compatible layouts:

**Customer Layout:**
```tsx
// resources/js/layouts/customer-layout.tsx
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MusicPlayer } from '@/components/MusicPlayer';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <MusicPlayer />
      <Footer />
    </div>
  );
}
```

**Admin Layout:**
```tsx
// resources/js/layouts/admin-layout.tsx
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="p-6">{children}</main>
    </div>
  );
}
```

### 🖼️ Phase 8: App.tsx Integration (TODO)

Update `resources/js/app.tsx`:

```tsx
import '../css/app.css';
import 'react-toastify/dist/ReactToastify.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { ShopProvider } from './context/ShopContext';
import { PlayerProvider } from './context/PlayerContext';
import { ToastProvider } from './context/ToastContext';
import { Ziggy } from './ziggy';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => title ? `${title} - ${appName}` : appName,
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    window.Ziggy = Ziggy;

    const root = createRoot(el);

    root.render(
      <ShopProvider>
        <PlayerProvider>
          <ToastProvider>
            <App {...props} />
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </ToastProvider>
        </PlayerProvider>
      </ShopProvider>
    );
  },
  progress: {
    color: '#4B5563',
  },
});
```

### 🎯 Phase 9: Backend Routes (TODO)

Ensure Laravel routes match new page structure:

**web.php:**
```php
// Customer routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');
// ... etc

// Admin routes
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::resource('products', AdminProductController::class);
    // ... etc
});
```

### 🧪 Phase 10: Testing (TODO)

- [ ] Test home page renders
- [ ] Test navigation between pages
- [ ] Test product list with filters
- [ ] Test product detail page
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Test admin pages
- [ ] Test authentication
- [ ] Test mobile responsiveness

---

## 🔑 Key Migration Patterns

### Pattern 1: React Router → Inertia Link

```tsx
// BEFORE
import { Link } from 'react-router-dom';
<Link to="/products">Products</Link>

// AFTER
import { Link } from '@inertiajs/react';
<Link href="/products">Products</Link>
```

### Pattern 2: useNavigate → router

```tsx
// BEFORE
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/login');

// AFTER
import { router } from '@inertiajs/react';
router.visit('/login');
```

### Pattern 3: useParams → Props

```tsx
// BEFORE
import { useParams } from 'react-router-dom';
const { id } = useParams();

// AFTER
interface PageProps {
  product: Product; // or id: string
}
export default function ProductDetail({ product }: PageProps) {
  // use product directly
}
```

### Pattern 4: Mock Data → Inertia Props

```tsx
// BEFORE
import { PRODUCTS } from '../data';
const products = PRODUCTS;

// AFTER
interface PageProps {
  products: Product[];
}
export default function ProductList({ products }: PageProps) {
  // use products from props
}
```

### Pattern 5: Forms

```tsx
// BEFORE
const handleSubmit = (data) => {
  fetch('/api/endpoint', { method: 'POST', body: JSON.stringify(data) });
};

// AFTER
import { useForm } from '@inertiajs/react';
const { data, setData, post, processing, errors } = useForm({
  name: '',
  email: '',
});

const handleSubmit = (e) => {
  e.preventDefault();
  post('/endpoint');
};
```

---

## 📝 Notes

- **Keep commits small and frequent** - easier to rollback if needed
- **Test after each major change** - don't wait until the end
- **Check console for errors** - fix TypeScript errors immediately
- **Review backend controllers** - ensure they return correct data structure
- **Update types** - keep `types/index.d.ts` in sync with backend

---

## 🆘 Troubleshooting

**Issue: "Cannot find module '@/components/...'"**
- Solution: Check tsconfig.json paths are correct

**Issue: "Link is not defined"**
- Solution: Ensure correct import from @inertiajs/react

**Issue: "router.visit is not a function"**
- Solution: Import `{ router }` from @inertiajs/react, not useNavigate

**Issue: "Property 'Ziggy' does not exist on type 'Window'"**
- Solution: Ensure ziggy types are declared

**Issue: "Page component not found"**
- Solution: Check file path in `pages/` matches route name

---

## ✨ Next Steps

1. **Start with simple pages** - About, Support (no data dependencies)
2. **Then product pages** - Home, ProductList (need backend data)
3. **Then complex pages** - Cart, Checkout (need full integration)
4. **Finally admin pages** - All CRUD operations

**Current Status:** Phase 3 - Component Adaptation in progress

**Last Updated:** November 29, 2025
