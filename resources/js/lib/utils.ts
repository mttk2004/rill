import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Vietnamese currency (VND)
 * @param amount - The amount to format (can be number or string)
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "2 394 000 ₫")
 *
 * @example
 * formatVND(2394000) // "2 394 000 ₫"
 * formatVND(2394000.50) // "2 394 001 ₫" (rounded)
 * formatVND("2394000") // "2 394 000 ₫"
 * formatVND(2394000, { showSymbol: false }) // "2 394 000"
 */
export function formatVND(
  amount: number | string,
  options: {
    showSymbol?: boolean;
    separator?: string;
  } = {}
): string {
  const { showSymbol = true, separator = ' ' } = options;

  // Convert to number and round to remove decimals
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const roundedAmount = Math.round(numAmount);

  // Format with space as thousand separator
  const formatted = roundedAmount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return showSymbol ? `${formatted} ₫` : formatted;
}
