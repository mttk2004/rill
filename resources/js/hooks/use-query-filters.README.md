# useQueryFilters Hook

A reusable React hook for managing URL query string filters with Inertia.js router integration.

## Features

- 🔄 **Automatic URL synchronization** - Keeps filters in sync with browser URL
- ⏱️ **Debounced search** - Automatic debouncing for search fields to reduce API calls
- 🎯 **Type-safe** - Full TypeScript support with proper typing
- 🔀 **Flexible routing** - Supports both Laravel routes and plain paths
- 🎨 **Customizable** - Configurable debounce, preserve state/scroll behavior

## Installation

Already included in the project at `@/hooks/use-query-filters`.

## Usage

### Basic Example (with Laravel Routes)

```tsx
import { useQueryFilters } from '@/hooks/use-query-filters';
import { route } from 'ziggy-js';

function OrdersPage({ orders, filters }) {
  const { filters: currentFilters, handleFilterChange } = useQueryFilters({
    initialFilters: filters,
    routeOrPath: 'admin.orders',
    routeHelper: route,
  });

  return (
    <div>
      <input
        value={currentFilters.search || ''}
        onChange={(e) => handleFilterChange('search', e.target.value)}
        placeholder="Search orders..."
      />

      <select
        value={currentFilters.status || 'all'}
        onChange={(e) => handleFilterChange('status', e.target.value)}
      >
        <option value="all">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}
```

### Example with Plain Path

```tsx
const { filters, handleFilterChange } = useQueryFilters({
  initialFilters: { search: '', genre: '' },
  routeOrPath: '/admin/products',
});
```

## API Reference

### `useQueryFilters(options)`

#### Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialFilters` | `Record<string, string \| undefined>` | **Required** | Initial filter values from server |
| `routeOrPath` | `string` | **Required** | Route name (e.g., 'admin.orders') or path (e.g., '/admin/products') |
| `searchDebounce` | `number` | `500` | Debounce delay in milliseconds for search fields |
| `preserveState` | `boolean` | `true` | Whether to preserve Inertia state on navigation |
| `preserveScroll` | `boolean` | `true` | Whether to preserve scroll position on navigation |
| `routeHelper` | `function` | `undefined` | Laravel route helper (e.g., Ziggy's `route()`) |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `filters` | `Record<string, string \| undefined>` | Current filter values |
| `handleFilterChange` | `(name, value, options?) => void` | Function to update a single filter |
| `resetFilters` | `() => void` | Reset all filters to initial state |
| `setMultipleFilters` | `(filters) => void` | Set multiple filters at once |

### `handleFilterChange(name, value, options?)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Filter name (e.g., 'search', 'status') |
| `value` | `string \| undefined` | New filter value |
| `options.debounce` | `boolean` | Override default debounce behavior (default: true for 'search') |
| `options.debounceMs` | `number` | Custom debounce delay for this specific change |

## Advanced Examples

### Custom Debounce for Specific Field

```tsx
// Debounce with custom delay
handleFilterChange('description', value, { debounce: true, debounceMs: 1000 });

// Force immediate navigation (no debounce) even for search
handleFilterChange('search', value, { debounce: false });
```

### Reset Filters

```tsx
<Button onClick={resetFilters}>
  Clear All Filters
</Button>
```

### Set Multiple Filters at Once

```tsx
// Update multiple filters simultaneously
setMultipleFilters({
  status: 'active',
  genre: 'rock',
  sort: 'price_asc',
});
```

## Migration Guide

### Before (manual implementation)

```tsx
const [filters, setFilters] = useState(initialFilters);
const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

const handleFilterChange = (name: string, value: string) => {
  const newFilters = { ...filters, [name]: value };

  if (name === 'search') {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      setFilters(newFilters);
      router.get(route('admin.orders'), newFilters, { preserveState: true });
    }, 500);
  } else {
    setFilters(newFilters);
    router.get(route('admin.orders'), newFilters, { preserveState: true });
  }
};
```

### After (with useQueryFilters)

```tsx
const { filters, handleFilterChange } = useQueryFilters({
  initialFilters,
  routeOrPath: 'admin.orders',
  routeHelper: route,
});
```

## Benefits

1. **Eliminates boilerplate** - No need to manually manage filter state, debounce timers, or URL updates
2. **Consistent behavior** - All filter pages work the same way
3. **Easy to test** - Centralized logic is easier to test
4. **Better maintainability** - Single source of truth for filter management
5. **Type safety** - Full TypeScript support prevents common bugs

## Notes

- Search fields are automatically debounced by default (500ms)
- Values equal to 'all' or starting with 'all-' are automatically removed from URL
- The hook automatically cleans up timers on unmount
- Works seamlessly with both Inertia's preserveState and preserveScroll options
