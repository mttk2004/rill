
import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
// TODO: Remove react-router-dom - import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { COLLECTIONS } from '../data';
import AnnouncementBar from './AnnouncementBar';
import Button from './Button';

// Sub-components
import MegaMenu from './navbar/MegaMenu';
import CartFlyout from './navbar/CartFlyout';
import UserDropdown from './navbar/UserDropdown';
import MobileMenu from './navbar/MobileMenu';
import SearchOverlay from './navbar/SearchOverlay';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCollectionHovered, setIsCollectionHovered] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  
  // Product Mega Menu States
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  
  // Mock auth state - Default to true for demo purposes
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useShop();
  const navigate = useNavigate();

  // Trigger bounce animation when cart count increases
  useEffect(() => {
    if (cartCount > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 500); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const closeAllMenus = () => {
    setIsProductMenuOpen(false);
    setIsCollectionHovered(false);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <AnnouncementBar />
      <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          
          {/* Search Overlay */}
          <SearchOverlay 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onSearch={handleSearch} 
          />

          {!isSearchOpen && (
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-primary">
                  RILL<span className="text-accent">.</span>
                </Link>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:block h-full">
                <div className="ml-10 flex h-full items-center space-x-8">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-accent ${
                        isActive ? 'text-primary' : 'text-gray-500'
                      }`
                    }
                  >
                    Trang chủ
                  </NavLink>
                  
                  {/* Products Mega Menu */}
                  <div 
                    className="relative group h-full flex items-center"
                    onMouseEnter={() => setIsProductMenuOpen(true)}
                    onMouseLeave={() => setIsProductMenuOpen(false)}
                  >
                    <Link 
                      to="/products"
                      className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent ${isProductMenuOpen ? 'text-primary' : 'text-gray-500'}`}
                      onClick={closeAllMenus}
                    >
                      Sản phẩm <ChevronDown size={14} />
                    </Link>

                    <MegaMenu isOpen={isProductMenuOpen} closeMenu={closeAllMenus} />
                  </div>

                  {/* Collection Dropdown */}
                  <div 
                    className="relative group h-full flex items-center"
                    onMouseEnter={() => setIsCollectionHovered(true)}
                    onMouseLeave={() => setIsCollectionHovered(false)}
                  >
                    <button className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent ${isCollectionHovered ? 'text-primary' : 'text-gray-500'}`}>
                      Bộ sưu tập <ChevronDown size={14} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isCollectionHovered && (
                      <div className="absolute left-0 top-full w-56 rounded-xl border border-gray-100 bg-white shadow-xl animate-in fade-in slide-in-from-top-1 duration-200 pt-2 z-50">
                        <div className="py-2">
                          {COLLECTIONS.map((col) => (
                            <Link 
                              key={col.id}
                              to={`/products?collection=${col.slug}`}
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                              onClick={closeAllMenus}
                            >
                              {col.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-accent ${
                        isActive ? 'text-primary' : 'text-gray-500'
                      }`
                    }
                  >
                    Giới thiệu
                  </NavLink>
                  <NavLink
                    to="/support"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-accent ${
                        isActive ? 'text-primary' : 'text-gray-500'
                      }`
                    }
                  >
                    Hỗ trợ
                  </NavLink>
                </div>
              </div>

              {/* Desktop Icons & Actions */}
              <div className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <Search size={20} />
                </button>

                {isLoggedIn ? (
                  <>
                    {/* Cart with Flyout */}
                    <div 
                      className="relative z-50 h-full flex items-center"
                      onMouseEnter={() => setIsCartHovered(true)}
                      onMouseLeave={() => setIsCartHovered(false)}
                    >
                      <Link 
                        to="/cart" 
                        id="cart-icon-desktop"
                        className={`relative text-gray-500 hover:text-primary transition-colors py-4 ${isBouncing ? 'animate-cart-bounce' : ''}`}
                      >
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                          <span className="absolute -right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                            {cartCount}
                          </span>
                        )}
                      </Link>

                      <CartFlyout isOpen={isCartHovered} />
                    </div>

                    {/* User Dropdown */}
                    <div className="relative">
                      <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className={`text-gray-500 hover:text-primary transition-colors ${isUserMenuOpen ? 'text-primary' : ''}`}
                      >
                        <User size={20} />
                      </button>

                      <UserDropdown 
                        isOpen={isUserMenuOpen} 
                        onClose={() => setIsUserMenuOpen(false)} 
                        onLogout={handleLogout} 
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link to="/login">
                      <Button variant="ghost" className="px-4 py-2 h-auto">Đăng nhập</Button>
                    </Link>
                    <Link to="/register">
                       <Button variant="primary" className="px-4 py-2 h-auto shadow-none">Đăng ký</Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button & Icons */}
              <div className="flex md:hidden items-center gap-4">
                 <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <Search size={20} />
                </button>
                
                {isLoggedIn && (
                  <Link 
                    to="/cart" 
                    id="cart-icon-mobile"
                    className={`relative text-gray-500 hover:text-primary ${isBouncing ? 'animate-cart-bounce' : ''}`}
                  >
                    <ShoppingBag size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isOpen} 
          isSearchOpen={isSearchOpen}
          onClose={() => setIsOpen(false)} 
          isLoggedIn={isLoggedIn} 
          onLogout={handleLogout} 
        />
      </nav>
    </>
  );
};

export default Navbar;