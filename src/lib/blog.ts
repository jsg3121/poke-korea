import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface PostMetadata {
  title: string
  description: string
  date: string
  tags: string[]
  author: string
  published: boolean
  slug: string
  readingTime: string
  wordCount: number
}

export interface Post extends PostMetadata {
  content: string
}

/**
 * 모든 블로그 포스트의 메타데이터를 가져옵니다
 */
export function getAllPosts(): PostMetadata[] {
  // content/blog 폴더가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        tags: data.tags || [],
        author: data.author || '',
        published: data.published !== false, // 기본값은 true
        readingTime: readingTime(content).text,
        wordCount: content.split(/\s+/g).length,
      } as PostMetadata
    })

  // 날짜 기준 내림차순 정렬 (최신 글이 먼저)
  return allPostsData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

/**
 * 발행된 블로그 포스트만 가져옵니다
 */
export function getPublishedPosts(): PostMetadata[] {
  return getAllPosts().filter((post) => post.published)
}

/**
 * slug로 특정 블로그 포스트를 가져옵니다
 */
export function getPostBySlug(slug: string): Post | null {
  try {
    // URL 인코딩된 slug를 디코딩
    const decodedSlug = decodeURIComponent(slug)
    const fullPath = path.join(postsDirectory, `${decodedSlug}.md`)

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: decodedSlug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || '',
      tags: data.tags || [],
      author: data.author || '',
      published: data.published !== false,
      readingTime: readingTime(content).text,
      wordCount: content.split(/\s+/g).length,
      content,
    }
  } catch (error) {
    console.error('❌ Error in getPostBySlug:', error)
    return null
  }
}

/**
 * 모든 포스트의 slug를 가져옵니다 (Static Generation용)
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''))
}

/**
 * 특정 태그의 포스트를 가져옵니다
 */
export function getPostsByTag(tag: string): PostMetadata[] {
  return getPublishedPosts().filter((post) => post.tags.includes(tag))
}

/**
 * 모든 태그를 가져옵니다
 */
export function getAllTags(): string[] {
  const posts = getPublishedPosts()
  const tags = posts.flatMap((post) => post.tags)
  return Array.from(new Set(tags))
}
