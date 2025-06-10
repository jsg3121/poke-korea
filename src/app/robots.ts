import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/image',
    },
    host: 'https://poke-korea.com',
    sitemap: 'https://poke-korea.com/sitemap.xml',
  }
}
