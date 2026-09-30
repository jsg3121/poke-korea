import { existsSync, readdirSync } from 'fs'
import { join } from 'path'

export function getCssFiles(): string[] {
  if (process.env.NODE_ENV === 'development') {
    return []
  }

  try {
    const cssDir = join(process.cwd(), '.next', 'static', 'css')
    const files = readdirSync(cssDir)

    return files
      .filter((file) => file.endsWith('.css'))
      .map((file) => `/_next/static/css/${file}`)
  } catch (error) {
    console.warn('CSS files not found:', error)
    return []
  }
}

export function getFontFiles(): Array<{
  href: string
  type: string
}> {
  if (process.env.NODE_ENV === 'development') {
    return []
  }

  const fontFiles: Array<{ href: string; type: string }> = []

  try {
    const publicFontsDir = join(process.cwd(), 'public', 'fonts')
    if (existsSync(publicFontsDir)) {
      const files = readdirSync(publicFontsDir)
      files
        .filter((file) => file.match(/\.(woff2|woff|ttf|otf)$/))
        .forEach((file) => {
          const ext = file.split('.').pop()
          let type = 'font/woff2'
          if (ext === 'woff') type = 'font/woff'
          else if (ext === 'ttf') type = 'font/ttf'
          else if (ext === 'otf') type = 'font/otf'

          fontFiles.push({
            href: `/fonts/${file}`,
            type,
          })
        })
    }

    const assetsFontsDir = join(process.cwd(), 'src', 'assets', 'font')
    if (existsSync(assetsFontsDir)) {
      const files = readdirSync(assetsFontsDir)
      files
        .filter((file) => file.match(/\.(woff2|woff|ttf|otf)$/))
        .forEach((file) => {
          const ext = file.split('.').pop()
          let type = 'font/woff2'
          if (ext === 'woff') type = 'font/woff'
          else if (ext === 'ttf') type = 'font/ttf'
          else if (ext === 'otf') type = 'font/otf'

          const mediaDir = join(process.cwd(), '.next', 'static', 'media')
          if (existsSync(mediaDir)) {
            const mediaFiles = readdirSync(mediaDir)
            const matchedFile = mediaFiles.find((f) =>
              f.includes(file.split('.')[0]),
            )
            if (matchedFile) {
              fontFiles.push({
                href: `/_next/static/media/${matchedFile}`,
                type,
              })
            }
          }
        })
    }

    return fontFiles
  } catch (error) {
    console.warn('Font files not found:', error)
    return []
  }
}
