import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // Storybook 10은 controls/backgrounds 등 essentials 기능이 코어에 내장되어
  // 별도 @storybook/addon-essentials 설치가 필요 없다(8.x용 패키지만 존재).
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/nextjs',
  staticDirs: ['../public'],
  // next.config.js의 @svgr/webpack 설정을 Storybook에도 적용한다.
  // (Storybook은 next.config의 webpack 설정을 자동 상속하지 않는다)
  webpackFinal: async (config) => {
    const imageRule = config.module?.rules?.find((rule) => {
      if (rule && typeof rule === 'object' && rule.test instanceof RegExp) {
        return rule.test.test('.svg')
      }
      return false
    })
    if (imageRule && typeof imageRule === 'object') {
      imageRule.exclude = /\.svg$/i
    }

    config.module?.rules?.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

export default config
