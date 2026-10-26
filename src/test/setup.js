import '@testing-library/jest-dom/vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { beforeEach, vi } from 'vitest'

// Vitest runs from the project root, so this is the same file the app serves.
const menuJson = readFileSync(resolve(process.cwd(), 'public/menu.json'), 'utf8')

beforeEach(() => {
  localStorage.clear()
  window.scrollTo = vi.fn()
  // The app fetches /menu.json; serve the real file from disk.
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => JSON.parse(menuJson),
    })),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})
