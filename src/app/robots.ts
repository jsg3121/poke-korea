import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/image/ogImage.png'],
      disallow: '/image',
    },
    host: 'https://poke-korea.com',
    sitemap: 'https://poke-korea.com/sitemap.xml',
  }
}
