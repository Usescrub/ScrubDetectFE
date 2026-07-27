import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string | null, email?: string): string {
  if (!name && !email) return '?'
  const source = (name || email || '').trim()
  const parts = source.split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

export function camelToSnake<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(camelToSnake) as T

  return Object.fromEntries(
    Object.entries(obj as Record<string, unknown>).map(([key, value]) => {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      return [snakeKey, camelToSnake(value)]
    })
  ) as T
}

export function snakeToCamel<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(snakeToCamel) as T

  return Object.fromEntries(
    Object.entries(obj as Record<string, unknown>).map(([key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      return [camelKey, snakeToCamel(value)]
    })
  ) as T
}
