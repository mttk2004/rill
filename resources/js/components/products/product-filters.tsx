import { router } from '@inertiajs/react';
import { ProductFilters as ProductFiltersType } from '@/types';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ProductFiltersProps {
    filters: ProductFiltersType;
    currentFilters: {
        search?: string;
        genre?: string;
        label?: string;
        artist?: string;
        sort?: string;
    };
}

export default function ProductFilters({ filters, currentFilters }: ProductFiltersProps) {
    const [expandedSections, setExpandedSections] = useState({
        genre: true,
        label: true,
        artist: false,
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section as keyof typeof prev]
        }));
    };

    const updateFilter = (filterType: string, value: string) => {
        const newFilters: Record<string, string | undefined> = { ...currentFilters };

        if (newFilters[filterType] === value) {
            // Remove filter if clicking the same value again
            delete newFilters[filterType];
        } else {
            // Set new filter value
            newFilters[filterType] = value;
        }

        // Reset page to 1 when filters change
        delete newFilters.page;

        router.get('/products', newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearAllFilters = () => {
        router.get('/products', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters = Object.keys(currentFilters).some(
        key => key !== 'search' && key !== 'sort' && currentFilters[key as keyof typeof currentFilters]
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Bộ lọc</h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-accent hover:text-accent/80 transition-colors"
                    >
                        Xóa tất cả
                    </button>
                )}
            </div>

            {/* Sort */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sắp xếp</h4>
                <select
                    value={currentFilters.sort || 'featured'}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:bg-gray-700 dark:text-white"
                >
                    {filters.sort_options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Genre Filter */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection('genre')}
                    className="w-full flex items-center justify-between mb-2 font-medium text-gray-900 dark:text-white"
                >
                    <span>Thể loại</span>
                    <ChevronDown 
                        className={`h-4 w-4 transition-transform ${expandedSections.genre ? 'rotate-180' : ''}`} 
                    />
                </button>
                {expandedSections.genre && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {filters.genres.map((genre) => (
                            <label 
                                key={genre}
                                className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded"
                            >
                                <input
                                    type="radio"
                                    name="genre"
                                    value={genre}
                                    checked={currentFilters.genre === genre}
                                    onChange={() => updateFilter('genre', genre)}
                                    className="mr-2 text-accent focus:ring-accent"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                    {genre}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Label Filter */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection('label')}
                    className="w-full flex items-center justify-between mb-2 font-medium text-gray-900 dark:text-white"
                >
                    <span>Hãng phát hành</span>
                    <ChevronDown 
                        className={`h-4 w-4 transition-transform ${expandedSections.label ? 'rotate-180' : ''}`} 
                    />
                </button>
                {expandedSections.label && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {filters.labels.slice(0, 10).map((label) => (
                            <label 
                                key={label}
                                className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded"
                            >
                                <input
                                    type="radio"
                                    name="label"
                                    value={label}
                                    checked={currentFilters.label === label}
                                    onChange={() => updateFilter('label', label)}
                                    className="mr-2 text-accent focus:ring-accent"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                    {label}
                                </span>
                            </label>
                        ))}
                        {filters.labels.length > 10 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                và {filters.labels.length - 10} hãng khác...
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Artist Filter */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection('artist')}
                    className="w-full flex items-center justify-between mb-2 font-medium text-gray-900 dark:text-white"
                >
                    <span>Nghệ sĩ</span>
                    <ChevronDown 
                        className={`h-4 w-4 transition-transform ${expandedSections.artist ? 'rotate-180' : ''}`} 
                    />
                </button>
                {expandedSections.artist && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {filters.artists.slice(0, 15).map((artist) => (
                            <label 
                                key={artist.slug}
                                className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded"
                            >
                                <input
                                    type="radio"
                                    name="artist"
                                    value={artist.slug}
                                    checked={currentFilters.artist === artist.slug}
                                    onChange={() => updateFilter('artist', artist.slug)}
                                    className="mr-2 text-accent focus:ring-accent"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                    {artist.name}
                                </span>
                            </label>
                        ))}
                        {filters.artists.length > 15 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                và {filters.artists.length - 15} nghệ sĩ khác...
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
