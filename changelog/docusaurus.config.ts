import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
  title: 'Poke-Korea 개발 블로그',
  tagline: '포케코리아 프로젝트의 기술적 의사결정과 개발 과정을 기록합니다',
  favicon: 'img/favicon.ico',

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
