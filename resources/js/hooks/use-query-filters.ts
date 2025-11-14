import { useState, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';

type FilterValues = Record<string, string | undefined>;

interface UseQueryFiltersOptions {
  /**
   * Initial filter values from server
   */
  initialFilters: FilterValues;

  /**
   * Route name or path to navigate to
   * Examples: 'admin.orders', '/admin/products'
   */
  routeOrPath: string;

  /**
   * Search debounce delay in milliseconds
   * @default 500
   */
  searchDebounce?: number;

  /**
   * Whether to preserve state on navigation
   * @default true
   */
  preserveState?: boolean;

  /**
   * Whether to preserve scroll on navigation
   * @default true
   */
  preserveScroll?: boolean;

  /**
   * Route helper function (for Laravel routes)
   * If provided, will use route(routeOrPath, filters)
   * If not provided, will use path with query string
   */
  routeHelper?: (name: string, params?: Record<string, unknown>) => string;
}

/**
 * Hook for managing query string filters with URL synchronization
 *
 * @example
 * ```tsx
 * // Using with Laravel routes
 * const { filters, handleFilterChange } = useQueryFilters({
 *   initialFilters: { search: '', status: '' },
 *   routeOrPath: 'admin.orders',
 *   routeHelper: route,
 * });
 *
 * // Using with path
 * const { filters, handleFilterChange } = useQueryFilters({
 *   initialFilters: { search: '', status: '' },
 *   routeOrPath: '/admin/products',
 * });
 *
 * // In component
 * <Input
 *   value={filters.search}
 *   onChange={(e) => handleFilterChange('search', e.target.value)}
 * />
 * ```
 */
export function useQueryFilters({
  initialFilters,
  routeOrPath,
  searchDebounce = 500,
  preserveState = true,
  preserveScroll = true,
  routeHelper,
}: UseQueryFiltersOptions) {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Navigate to the route/path with updated filters
   */
  const navigate = useCallback((updatedFilters: FilterValues) => {
    if (routeHelper) {
      // Use Laravel route helper
      router.get(routeHelper(routeOrPath, updatedFilters), updatedFilters, {
        preserveState,
        preserveScroll,
      });
    } else {
      // Build query string manually
      const params = new URLSearchParams();
      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (value && value !== 'all' && !value.startsWith('all-')) {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      router.get(`${routeOrPath}${queryString ? '?' + queryString : ''}`, {}, {
        preserveState,
        preserveScroll,
      });
    }
  }, [routeOrPath, routeHelper, preserveState, preserveScroll]);

  /**
   * Handle filter change with optional debouncing for search fields
   */
  const handleFilterChange = useCallback((
    name: string,
    value: string | undefined,
    options?: { debounce?: boolean; debounceMs?: number }
  ) => {
    const shouldDebounce = options?.debounce ?? name === 'search';
    const debounceMs = options?.debounceMs ?? searchDebounce;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);

    if (shouldDebounce) {
      // Debounce for search fields
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      searchTimerRef.current = setTimeout(() => {
        navigate(updatedFilters);
      }, debounceMs);
    } else {
      // Immediate navigation for non-search fields
      navigate(updatedFilters);
    }
  }, [filters, navigate, searchDebounce]);

  /**
   * Reset all filters to initial state
   */
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    navigate(initialFilters);
  }, [initialFilters, navigate]);

  /**
   * Set multiple filters at once
   */
  const setMultipleFilters = useCallback((newFilters: Partial<FilterValues>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    navigate(updatedFilters);
  }, [filters, navigate]);

  return {
    filters,
    handleFilterChange,
    resetFilters,
    setMultipleFilters,
  };
}
