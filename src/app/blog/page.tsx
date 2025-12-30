import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedPosts } from '~/lib/blog'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale/ko'

export const metadata: Metadata = {
  title: '기술 블로그 | Poke Korea',
  description:
    '포켓몬 코리아의 기술 블로그입니다. 웹 성능 최적화, Next.js, React 등 다양한 기술을 공유합니다.',
  openGraph: {
    title: '기술 블로그 | Poke Korea',
    description: '포켓몬 코리아의 기술 블로그',
    url: 'https://poke-korea.com/blog',
    type: 'website',
  },
  alternates: {
    canonical: 'https://poke-korea.com/blog',
    types: {
      'application/rss+xml': 'https://poke-korea.com/blog/rss.xml',
    },
  },
}

export default function BlogPage() {
  const posts = getPublishedPosts()

  // 구조화된 데이터 (Blog 목록)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Poke Korea Tech Blog',
    description: '포켓몬 코리아의 기술 블로그',
    url: 'https://poke-korea.com/blog',
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://poke-korea.com/blog/${post.slug}`,
      datePublished: post.date,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <header className="mb-16 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              기술 블로그
            </h1>
            <p className="text-xl text-gray-600">
              웹 개발과 성능 최적화에 대한 경험을 공유합니다
            </p>
          </header>

          {/* 블로그 포스트 그리드 */}
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                아직 작성된 글이 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <time dateTime={post.date}>
                          {format(new Date(post.date), 'yyyy년 M월 d일', {
                            locale: ko,
                          })}
                        </time>
                        <span>·</span>
                        <span>{post.readingTime}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
