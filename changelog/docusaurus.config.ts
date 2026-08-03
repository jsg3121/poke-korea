import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
  title: 'Poke-Korea 개발 블로그',
  tagline: '포케코리아 프로젝트의 기술적 의사결정과 개발 과정을 기록합니다',
  favicon: 'img/favicon.ico',

  // [1단계] changelog 전체 색인 제외.
  // 모든 생성 페이지 <head>에 <meta name="robots" content="noindex, nofollow"> 주입.
  // Why: changelog는 개발 내부 기록이라 검색 수요가 없고(GSC 노출<10/일·클릭 0),
  //      태그/페이지네이션 등 thin content가 크롤링 예산을 낭비한다.
  //      크롤은 허용된 상태여야 구글이 noindex를 읽고 색인에서 제거하므로,
  //      이 단계에서는 robots.txt 차단·sitemap 제거를 하지 않는다(2단계에서 진행).
  // Ref: https://docusaurus.io/docs/api/docusaurus-config#noIndex
  //      https://developers.google.com/search/docs/crawling-indexing/block-indexing
  noIndex: true,

  future: {
    v4: true,
  },

  url: 'https://poke-korea.com',
  baseUrl: '/changelog/',

  organizationName: 'jsg3121',
  projectName: 'poke-korea',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          routeBasePath: '/',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          blogSidebarTitle: '최근 포스트',
          blogSidebarCount: 'ALL',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Poke-Korea Dev Blog',
      items: [
        { to: '/', label: '포스트', position: 'left' },
        { to: '/tags', label: '태그', position: 'left' },
        {
          href: 'https://poke-korea.com',
          label: '포케코리아',
          position: 'right',
        },
        {
          href: 'https://github.com/jsg3121/poke-korea',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} Poke-Korea Dev Blog. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['graphql', 'bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
}

export default config
