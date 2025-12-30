import RSS from 'rss'
import { getPublishedPosts } from '~/lib/blog'

export async function GET() {
  const posts = getPublishedPosts()

  const feed = new RSS({
    title: 'Poke Korea Tech Blog',
    description:
      '포켓몬 코리아의 기술 블로그 - 웹 성능 최적화, Next.js, React 등',
    site_url: 'https://poke-korea.com',
    feed_url: 'https://poke-korea.com/blog/rss.xml',
    language: 'ko',
    pubDate: new Date(),
    copyright: `© ${new Date().getFullYear()} Poke Korea`,
  })

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `https://poke-korea.com/blog/${post.slug}`,
      date: post.date,
      categories: post.tags,
      author: post.author,
    })
  })

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1시간 캐시
    },
  })
}
