

import React from 'react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { PlayerProvider } from './context/PlayerContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Addresses from './pages/Addresses';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Settings from './pages/Settings';
import Support from './pages/Support';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProductList from './pages/admin/products/ProductList';
import AdminProductForm from './pages/admin/products/ProductForm';
import AdminOrderList from './pages/admin/orders/OrderList';
import AdminOrderDetail from './pages/admin/orders/OrderDetail';
import AdminVoucherList from './pages/admin/vouchers/VoucherList';
import AdminVoucherForm from './pages/admin/vouchers/VoucherForm';
import AdminArtistList from './pages/admin/artists/ArtistList';
import AdminArtistForm from './pages/admin/artists/ArtistForm';
import AdminCollectionList from './pages/admin/collections/CollectionList';
import AdminCollectionForm from './pages/admin/collections/CollectionForm';
import AdminCustomerList from './pages/admin/customers/CustomerList';
import AdminCustomerForm from './pages/admin/customers/CustomerForm';
import AdminSettings from './pages/admin/Settings';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout for Customer (Standard)
const CustomerLayout = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900 pb-20 md:pb-0">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <MusicPlayer />
    <Footer />
  </div>
);

const App = () => {
  return (
    <ToastProvider>
      <ShopProvider>
        <PlayerProvider>
          <MemoryRouter>
            <ScrollToTop />
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                
                {/* Product Management */}
                <Route path="products" element={<AdminProductList />} />
                <Route path="products/create" element={<AdminProductForm />} />
                <Route path="products/:id" element={<AdminProductForm />} />

                {/* Order Management */}
                <Route path="orders" element={<AdminOrderList />} />
                <Route path="orders/:id" element={<AdminOrderDetail />} />

                {/* Voucher Management */}
                <Route path="vouchers" element={<AdminVoucherList />} />
                <Route path="vouchers/create" element={<AdminVoucherForm />} />
                <Route path="vouchers/:id" element={<AdminVoucherForm />} />

                {/* Artist Management */}
                <Route path="artists" element={<AdminArtistList />} />
                <Route path="artists/create" element={<AdminArtistForm />} />
                <Route path="artists/:id" element={<AdminArtistForm />} />

                {/* Collection Management */}
                <Route path="collections" element={<AdminCollectionList />} />
                <Route path="collections/create" element={<AdminCollectionForm />} />
                <Route path="collections/:id" element={<AdminCollectionForm />} />

                {/* Customer Management */}
                <Route path="customers" element={<AdminCustomerList />} />
                <Route path="customers/create" element={<AdminCustomerForm />} />
                <Route path="customers/:id" element={<AdminCustomerForm />} />

                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Customer Routes */}
              <Route path="*" element={
                <CustomerLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/:slug" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/addresses" element={<Addresses />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/support" element={<Support />} />
                  </Routes>
                </CustomerLayout>
              } />
            </Routes>
          </MemoryRouter>
        </PlayerProvider>
      </ShopProvider>
    </ToastProvider>
  );
};

export default App;
