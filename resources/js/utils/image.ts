/**
 * Image utility functions for handling Supabase storage URLs
 */

/**
 * Get the full Supabase storage URL for an image path
 * @param path - The image path (e.g., "products/abc.webp")
 * @returns Full URL or null if path is empty
 */
export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  // If already a full URL (http/https), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Get Supabase config from window (passed from Laravel)
  const supabaseUrl = (window as any).supabaseUrl;
  const supabaseBucket = (window as any).supabaseBucket;

  if (!supabaseUrl || !supabaseBucket) {
    console.warn('Supabase config not found in window object');
    return path; // Return original path as fallback
  }

  // Construct full URL
  return `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${path}`;
}

/**
 * Get image URL with fallback
 * @param path - The image path
 * @param fallback - Fallback URL if path is empty
 * @returns Full URL or fallback
 */
export function getImageUrlWithFallback(
  path: string | null | undefined,
  fallback: string = '/images/placeholder.png'
): string {
  return getImageUrl(path) || fallback;
}
