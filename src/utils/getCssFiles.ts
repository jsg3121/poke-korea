import { readdirSync, existsSync } from 'fs'
import { join } from 'path'

/**
 * .next/static/css 디렉토리에서 CSS 파일 목록을 가져옵니다.
 * 빌드된 CSS 파일들을 동적으로 찾아서 반환합니다.
 */
export function getCssFiles(): string[] {
  if (process.env.NODE_ENV === 'development') {
    return []
  }

  try {
    const cssDir = join(process.cwd(), '.next', 'static', 'css')
    const files = readdirSync(cssDir)

    // .css 파일만 필터링하고 전체 경로 반환
    return files
      .filter((file) => file.endsWith('.css'))
      .map((file) => `/_next/static/css/${file}`)
  } catch (error) {
    // 개발 환경이나 빌드 전에는 파일이 없을 수 있음
    console.warn('CSS files not found:', error)
    return []
  }
}

/**
 * 폰트 파일 목록을 가져옵니다.
 * public/fonts 또는 src/assets/font 디렉토리에서 폰트 파일을 찾습니다.
 */
export function getFontFiles(): Array<{
  href: string
  type: string
}> {
  if (process.env.NODE_ENV === 'development') {
    return []
  }

  const fontFiles: Array<{ href: string; type: string }> = []

  try {
    // public/fonts 디렉토리 확인
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

    // src/assets/font 디렉토리 확인
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

          // Next.js의 로컬 폰트는 빌드 시 _next/static/media로 이동됨
          // 실제 경로를 찾기 위해 .next/static/media 디렉토리 확인
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
