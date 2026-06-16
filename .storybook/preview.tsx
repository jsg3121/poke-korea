import type { Preview } from '@storybook/nextjs'

// 프로젝트 전역 스타일(Tailwind + globals.css)을 Storybook에 주입.
// 이것이 있어야 .type-tag, card-corner-fold, 폰트 등 실제 스타일이 적용된다.
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'primary',
      values: [
        { name: 'primary', value: '#27374D' }, // primary-1 (앱 기본 배경)
        { name: 'light', value: '#f2f3f4' }, // white-3
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
}

export default preview
