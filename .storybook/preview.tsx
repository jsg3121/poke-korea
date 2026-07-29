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
    // Storybook 10: backgrounds는 options 객체 + initialGlobals로 지정한다
    // (구버전 default/values 형식은 동작하지 않음).
    backgrounds: {
      options: {
        primary: { name: 'Primary', value: '#27374D' }, // primary-1 (앱 기본 배경)
        light: { name: 'Light', value: '#f2f3f4' }, // white-3
        white: { name: 'White', value: '#ffffff' },
      },
    },
    // 프로젝트 브레이크포인트(mobile ≤768 / desktop ≥769) 기준 viewport 프리셋.
    viewport: {
      options: {
        mobile: {
          name: 'Mobile (390)',
          styles: { width: '390px', height: '844px' },
        },
        desktop: {
          name: 'Desktop (760)',
          styles: { width: '760px', height: '640px' },
        },
      },
    },
  },
  // 기본 전역값 (Storybook 10: default 대신 initialGlobals로 지정)
  initialGlobals: {
    backgrounds: { value: 'primary' },
  },
}

export default preview
