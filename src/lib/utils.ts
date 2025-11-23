import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export function snakeToCamel<T = unknown>(obj: unknown): T {
  if (obj === null || obj === undefined) {
    return obj as T
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => snakeToCamel(item)) as T
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const camelObj: Record<string, unknown> = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = toCamelCase(key)
        camelObj[camelKey] = snakeToCamel((obj as Record<string, unknown>)[key])
      }
    }
    return camelObj as T
  }

  return obj as T
}

export function camelToSnake<T = unknown>(obj: unknown): T {
  if (obj === null || obj === undefined) {
    return obj as T
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => camelToSnake(item)) as T
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const snakeObj: Record<string, unknown> = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeKey = toSnakeCase(key)
        snakeObj[snakeKey] = camelToSnake((obj as Record<string, unknown>)[key])
      }
    }
    return snakeObj as T
  }

  return obj as T
}
