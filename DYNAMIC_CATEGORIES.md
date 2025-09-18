# Dynamic Category Menu Implementation

## Overview
This implementation replaces the hardcoded category data in the CustomerHeader component with dynamic data fetched from the database through a dedicated API endpoint.

## 🏗️ Architecture

### Backend Components

#### 1. API Controller
- **File**: `app/Http/Controllers/Api/CategoryController.php`
- **Endpoint**: `GET /api/categories/menu-data`
- **Purpose**: Fetches dynamic category data from the database

**Features**:
- Fetches unique genres with product counts (limited to top 20)
- Fetches unique labels with product counts (limited to top 20)
- Calculates special category counts (featured, new, sale products)
- Orders by count (descending) then alphabetically
- Includes proper error handling and response caching (5 minutes)

#### 2. API Routes
- **File**: `routes/api.php`
- **Route**: `/api/categories/menu-data`
- **Method**: `GET`
- **No authentication required** (public endpoint for header menu)

#### 3. Bootstrap Configuration
- **File**: `bootstrap/app.php`
- **Added**: API routes configuration to load `routes/api.php`

### Frontend Components

#### 1. Custom Hook
- **File**: `resources/js/hooks/use-category-menu.ts`
- **Purpose**: Manages API data fetching and caching for category menu

**Features**:
- **Caching**: 5-minute client-side cache to reduce API calls
- **Error Handling**: Graceful fallback to default categories on error
- **Loading States**: Proper loading and error states
- **Refetch Function**: Manual data refresh capability
- **TypeScript**: Fully typed interfaces for type safety

#### 2. Updated CustomerHeader
- **File**: `resources/js/components/customer-header.tsx`
- **Changes**: 
  - Removed hardcoded category data
  - Integrated `useCategoryMenu` hook
  - Added loading/error states
  - Dynamic icon mapping based on category slugs
  - Product count badges for each category

## 🗄️ Database Integration

### Data Sources
The API fetches data from the `products` table using these fields:
- **`genre`**: Music genres (Rock, Pop, Jazz, etc.)
- **`label`**: Record labels (Sony Music, Universal, etc.)  
- **`is_featured`**: Featured products flag
- **`created_at`**: For "new products" (last 30 days)
- **`compare_price` vs `price`**: For "sale products"
- **`status`**: Only active products included

### Sample API Response
```json
{
  "genres": [
    {
      "name": "Rock",
      "slug": "rock",
      "count": 15
    }
  ],
  "labels": [
    {
      "name": "Sony Music",
      "slug": "sony-music", 
      "count": 8
    }
  ],
  "special": [
    {
      "name": "Sản phẩm nổi bật",
      "slug": "featured",
      "count": 12
    }
  ],
  "success": true,
  "timestamp": "2025-09-18T03:50:00.000000Z"
}
```

## 🎨 User Experience

### Loading States
- Shows spinner with "Đang tải..." message while fetching data
- Non-blocking - other header functionality remains available

### Error Handling  
- Displays user-friendly error message in Vietnamese
- Falls back to default common categories on API failure
- Logs detailed errors to browser console for debugging

### Performance
- **Client-side caching**: 5-minute cache prevents redundant API calls
- **Server-side optimization**: Limited results (20 per category) and proper indexing
- **Response caching**: HTTP cache headers for browser/proxy caching

### Visual Features
- **Product counts**: Each category shows number of available products
- **Smart icons**: Category-specific icons based on genre/type
- **Responsive design**: Maintains existing responsive behavior
- **Vietnamese localization**: All text in Vietnamese

## 🔧 Technical Details

### Icon Mapping
```typescript
const getIconForCategory = (slug: string) => {
  const iconMap = {
    'rock': Music,
    'pop': Mic, 
    'jazz': Headphones,
    'featured': Star,
    'new': TrendingUp,
    'sale': Clock,
    // ... fallback to Disc
  };
  return iconMap[slug] || Disc;
};
```

### Fallback Data
Default categories are provided for offline/error scenarios:
- **Genres**: Rock, Pop, Jazz, Classical
- **Labels**: Universal Music, Sony Music, Warner Music
- **Special**: Featured, New, Sale (with Vietnamese names)

### URL Generation
Categories link to product pages with proper query parameters:
- Genres: `/products?genre={slug}`
- Labels: `/products?label={slug}`
- Special: `/products?filter={slug}`

## 🚀 Benefits

1. **Dynamic Content**: Categories update automatically as products are added
2. **Real Product Counts**: Shows actual number of products in each category
3. **Performance Optimized**: Caching at multiple levels prevents excessive database queries
4. **Error Resilient**: Graceful degradation when API is unavailable
5. **Maintainable**: Clean separation between data fetching and UI components
6. **Type Safe**: Full TypeScript support with proper interfaces
7. **SEO Friendly**: Categories link to filterable product pages

## 🔮 Future Enhancements

1. **Real-time Updates**: WebSocket integration for live count updates
2. **User Preferences**: Remember collapsed/expanded category sections
3. **Advanced Filtering**: Multiple category selection
4. **Analytics**: Track category click-through rates
5. **Admin Management**: Backend interface to manage category visibility
6. **Localization**: Multi-language category names
7. **Image Support**: Category thumbnails/banners

## 📝 Testing

### Manual Testing
```bash
# Test API endpoint
curl -H "Accept: application/json" http://localhost:8000/api/categories/menu-data

# Expected: JSON response with genres, labels, special categories
```

### Frontend Testing
- Open customer pages and verify category dropdown loads
- Test offline scenario (network disabled)
- Verify caching (check Network tab for subsequent requests)
- Test error handling (temporary API disruption)

This implementation provides a robust, maintainable solution for dynamic category menus that scales with your product catalog and provides an excellent user experience.
