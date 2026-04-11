/**
 * cn — Class Name utility
 *
 * Combines clsx (conditional class merging) with tailwind-merge
 * (deduplication of conflicting Tailwind utility classes).
 *
 * Usage:
 *   cn('px-4 py-2', isActive && 'bg-accent', 'px-6')
 *   → 'py-2 bg-accent px-6'  (px-4 is removed, px-6 wins)
 */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));
