import type { MetadataRoute } from 'next'

const SHARED_DISALLOW = [
  '/src/',
  '/changelog/*.md',
  '/package.json',
  '/CLAUDE.md',
]

const AI_SEARCH_AGENTS = ['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot']

const AI_USER_AGENTS = ['ChatGPT-User', 'Claude-User', 'Perplexity-User']

const AI_TRAINING_AGENTS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Meta-ExternalAgent',
  'Bytespider',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: SHARED_DISALLOW,
      },
      {
        userAgent: AI_SEARCH_AGENTS,
        allow: ['/'],
        disallow: SHARED_DISALLOW,
      },
      {
        userAgent: AI_USER_AGENTS,
        allow: ['/'],
      },
      {
        userAgent: AI_TRAINING_AGENTS,
        disallow: ['/'],
      },
    ],
    sitemap: [
      'https://poke-korea.com/sitemap.xml',
      'https://poke-korea.com/changelog/sitemap.xml',
    ],
  }
}
