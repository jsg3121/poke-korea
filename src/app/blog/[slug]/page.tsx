import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPostSlugs } from '~/lib/blog'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale/ko'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'

interface Props {
  params: Promise<{ slug: string }>
}

// 동적 메타데이터 생성 (SEO 핵심!)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post || !post.published) {
    return {
      title: '페이지를 찾을 수 없습니다',
    }
  }

  const url = `https://poke-korea.com/blog/${slug}`
  const ogImage = '/images/blog-og.png' // 기본 OG 이미지

  return {
    title: post.title,
    description: post.description,

    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: 'Poke Korea Tech Blog',
    },

    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },

    alternates: {
      canonical: url,
    },
    keywords: post.tags,
    authors: [{ name: post.author }],
  }
}

// Static Generation을 위한 경로 생성
export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

// MDX 컴포넌트 커스터마이징
const mdxComponents = {
  // 링크 스타일
  a: ({ href, children, ...props }: any) => (
    <a
      href={href}
      className="text-primary-2 hover:text-primary-1 no-underline"
      {...props}
    >
      {children}
    </a>
  ),
  // 코드 블록 스타일
  pre: ({ children, ...props }: any) => (
    <pre
      className="bg-primary-1 text-white rounded-lg p-4 overflow-x-auto my-4"
      {...props}
    >
      {children}
    </pre>
  ),
  // 인라인 코드 스타일
  code: ({ children, ...props }: any) => (
    <code
      className="bg-primary-4 text-primary-1 px-1.5 py-0.5 rounded text-sm font-mono"
      {...props}
    >
      {children}
    </code>
  ),
  // 테이블 스타일
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-primary-3" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th
      className="px-6 py-3 bg-primary-1 text-left text-xs font-medium text-white uppercase tracking-wider"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td
      className="px-6 py-4 whitespace-nowrap text-sm text-primary-4 border-b border-primary-4"
      {...props}
    >
      {children}
    </td>
  ),
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post || !post.published) {
    notFound()
  }

  // 구조화된 데이터 (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: '/images/blog-og.png',
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Poke Korea',
      logo: {
        '@type': 'ImageObject',
        url: 'https://poke-korea.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://poke-korea.com/blog/${slug}`,
    },
    wordCount: post.wordCount,
    keywords: post.tags.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-primary-1 py-12 px-5">
        <article className="max-w-[1280px] mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-primary-3">
          {/* 블로그 헤더 */}
          <header className="border-b border-primary-4 px-8 py-10 bg-gradient-to-r from-primary-1 to-primary-2">
            <Link
              href="/blog"
              className="inline-flex items-center text-white hover:text-primary-3 mb-6 font-medium"
            >
              ← 블로그 목록으로
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-primary-3 mb-6">{post.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-primary-4 mb-6">
              <time dateTime={post.date} className="font-medium">
                {format(new Date(post.date), 'yyyy년 M월 d일', { locale: ko })}
              </time>
              <span>·</span>
              <span>{post.readingTime}</span>
              <span>·</span>
              <span>{post.author}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm bg-white text-primary-1 px-4 py-2 rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* 블로그 본문 */}
          <div className="px-8 py-10 bg-primary-2">
            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-primary-4 prose-a:text-white prose-a:no-underline prose-strong:text-white prose-code:text-white prose-code:bg-primary-1 prose-pre:bg-primary-1 prose-li:text-primary-4">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [
                        rehypeAutolinkHeadings,
                        {
                          behavior: 'wrap',
                          properties: {
                            className: ['anchor'],
                          },
                        },
                      ],
                      [
                        rehypePrettyCode as any,
                        {
                          theme: 'github-dark',
                          keepBackground: true,
                        },
                      ],
                    ],
                  },
                }}
              />
            </div>
          </div>

          {/* 블로그 푸터 */}
          <footer className="border-t border-primary-4 px-8 py-8 bg-gradient-to-r from-primary-1 to-primary-2">
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-block bg-white text-primary-1 px-8 py-3 rounded-lg font-medium hover:bg-primary-3 hover:text-primary-1 transition-colors"
              >
                더 많은 글 보기
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </>
  )
}
