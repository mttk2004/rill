/**
 * Format a timestamp to Vietnamese date format
 * @param timestamp - ISO 8601 timestamp string or Date object
 * @param includeTime - Whether to include time (default: true)
 * @returns Formatted date string like "08:12 ngày 22/11/2025" or "22/11/2025"
 */
export function formatDate(timestamp: string | Date, includeTime: boolean = true): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  if (!includeTime) {
    return `${day}/${month}/${year}`;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes} ngày ${day}/${month}/${year}`;
}

/**
 * Format a timestamp to relative time (e.g., "2 hours ago", "3 days ago")
 * @param timestamp - ISO 8601 timestamp string or Date object
 * @returns Relative time string in Vietnamese
 */
export function formatRelativeTime(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'Vừa xong';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else {
    return formatDate(date, false);
  }
}
