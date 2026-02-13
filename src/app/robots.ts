import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: [
        '/image',
        '/src/',
        '/changelog/*.md',
        '/package.json',
        '/CLAUDE.md',
      ],
    },
    sitemap: [
      'https://poke-korea.com/sitemap.xml',
      'https://poke-korea.com/changelog/sitemap.xml',
    ],
  }
}
