// Downloads one photo per menu item into public/images/<id>.jpg.
// Run on a computer with internet access:   npm run images
//
// Photos come from loremflickr.com (random Flickr photos matching the keywords),
// so a few may not look perfect. To use a better photo for any dish, just replace
// its file in public/images/ (keep the same file name). Existing files are skipped,
// so your replacements are never overwritten. Use --force to re-download everything.

import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'images')
const force = process.argv.includes('--force')

// Search keywords per dish (max two, comma-separated).
const keywords = {
  'pancake-stack': 'pancakes,syrup',
  'egg-sandwich': 'egg,sandwich',
  'omelette-toast': 'omelette,toast',
  'chicken-fried-rice': 'fried,rice',
  'kung-pao-chicken': 'kungpao,chicken',
  'veg-chow-mein': 'chowmein,noodles',
  'sweet-sour-chicken': 'sweetandsour,chicken',
  'chicken-burger': 'chicken,burger',
  'margherita-pizza': 'pizza,margherita',
  'club-sandwich': 'club,sandwich',
  'spring-rolls': 'spring,rolls',
  'steamed-dumplings': 'dumplings,dimsum',
  'french-fries': 'french,fries',
  'chicken-nuggets': 'chicken,nuggets',
  'iced-tea': 'iced,tea',
  'fresh-lime-soda': 'lime,soda',
  'mango-shake': 'mango,smoothie',
  'hot-chocolate': 'hot,chocolate',
  'cold-coffee': 'iced,coffee',
  'choco-brownie': 'chocolate,brownie',
  'ice-cream': 'icecream,scoop',
  'cheesecake': 'cheesecake,slice',
}

async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function download(id, index) {
  const file = join(outDir, `${id}.jpg`)
  if (!force && (await exists(file))) return 'skipped (already there)'

  const tags = keywords[id] ?? id.replace(/-/g, ',')
  // "lock" makes the same dish always get the same photo.
  const url = `https://loremflickr.com/800/600/${tags}?lock=${index + 1}`
  const response = await fetch(url, { redirect: 'follow' })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length < 2000) throw new Error('response was too small to be a photo')
  await writeFile(file, bytes)
  return `saved (${Math.round(bytes.length / 1024)} KB)`
}

const menu = JSON.parse(await readFile(join(root, 'public', 'menu.json'), 'utf8'))
await mkdir(outDir, { recursive: true })

let failed = 0
for (const [index, item] of menu.items.entries()) {
  try {
    console.log(`${item.id.padEnd(22)} ${await download(item.id, index)}`)
  } catch (error) {
    failed += 1
    console.log(`${item.id.padEnd(22)} FAILED: ${error.message}`)
  }
}

console.log(
  failed === 0
    ? '\nDone. Refresh the page to see the photos.'
    : `\n${failed} photo(s) failed. Run "npm run images" again, or save your own as public/images/<id>.jpg.`,
)
