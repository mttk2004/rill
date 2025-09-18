import { useState, useEffect } from 'react';

interface MenuCategory {
    name: string;
    slug: string;
    count: number;
}

interface CategoryMenuData {
    genres: MenuCategory[];
    labels: MenuCategory[];
    special: MenuCategory[];
}

interface UseCategoryMenuReturn {
    data: CategoryMenuData | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

// Default fallback data with some common categories
const defaultData: CategoryMenuData = {
    genres: [
        { name: 'Rock', slug: 'rock', count: 0 },
        { name: 'Pop', slug: 'pop', count: 0 },
        { name: 'Jazz', slug: 'jazz', count: 0 },
        { name: 'Classical', slug: 'classical', count: 0 },
    ],
    labels: [
        { name: 'Universal Music', slug: 'universal-music', count: 0 },
        { name: 'Sony Music', slug: 'sony-music', count: 0 },
        { name: 'Warner Music', slug: 'warner-music', count: 0 },
    ],
    special: [
        { name: 'Sản phẩm nổi bật', slug: 'featured', count: 0 },
        { name: 'Sản phẩm mới', slug: 'new', count: 0 },
        { name: 'Đang giảm giá', slug: 'sale', count: 0 },
    ]
};

// Simple cache to avoid repeated requests
const cache = {
    data: null as CategoryMenuData | null,
    timestamp: 0,
    ttl: 5 * 60 * 1000, // 5 minutes
};

export function useCategoryMenu(): UseCategoryMenuReturn {
    const [data, setData] = useState<CategoryMenuData | null>(cache.data || null);
    const [loading, setLoading] = useState(cache.data === null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        // Check cache first
        const now = Date.now();
        if (cache.data && (now - cache.timestamp) < cache.ttl) {
            setData(cache.data);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/categories/menu-data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Update cache
            cache.data = result;
            cache.timestamp = now;
            
            setData(result);
        } catch (err) {
            console.error('Failed to fetch category menu data:', err);
            setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu danh mục');
            
            // Fall back to default data on error
            setData(defaultData);
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        data,
        loading,
        error,
        refetch
    };
}
