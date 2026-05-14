import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'
import { createPageUrl } from '@/utils'

describe('cn() utility', () => {
  it('merges simple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes via clsx syntax', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('merges conflicting Tailwind classes (last wins)', () => {
    // tailwind-merge resolves conflicts: p-4 + p-2 => p-2
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('merges conflicting color classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles undefined and null inputs', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })

  it('handles empty string inputs', () => {
    expect(cn('foo', '', 'bar')).toBe('foo bar')
  })

  it('handles array inputs (clsx feature)', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('handles object inputs (clsx feature)', () => {
    expect(cn({ hidden: true, visible: false })).toBe('hidden')
  })

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('')
  })

  it('deduplicates identical classes', () => {
    expect(cn('flex', 'flex')).toBe('flex')
  })

  it('handles complex Tailwind merge scenarios', () => {
    // bg-red-500 + bg-blue-500 => bg-blue-500 (last wins)
    const result = cn('bg-red-500 text-white', 'bg-blue-500')
    expect(result).toBe('text-white bg-blue-500')
  })
})

describe('createPageUrl()', () => {
  it('converts page name to URL path', () => {
    expect(createPageUrl('Dashboard')).toBe('/Dashboard')
  })

  it('replaces spaces with hyphens', () => {
    expect(createPageUrl('My Page')).toBe('/My-Page')
  })

  it('handles single-word page names', () => {
    expect(createPageUrl('Boards')).toBe('/Boards')
  })

  it('handles multi-word page names', () => {
    expect(createPageUrl('User Story Board')).toBe('/User-Story-Board')
  })

  it('preserves casing', () => {
    expect(createPageUrl('Analytics')).toBe('/Analytics')
    expect(createPageUrl('settings')).toBe('/settings')
  })

  it('handles page names used in Layout navigation', () => {
    // These are the actual page names from pages.config.js
    expect(createPageUrl('Dashboard')).toBe('/Dashboard')
    expect(createPageUrl('Boards')).toBe('/Boards')
    expect(createPageUrl('Backlog')).toBe('/Backlog')
    expect(createPageUrl('Calendar')).toBe('/Calendar')
    expect(createPageUrl('Analytics')).toBe('/Analytics')
  })
})
