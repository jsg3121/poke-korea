import type { Meta, StoryObj } from '@storybook/nextjs'

import tailwindConfig from '../../../tailwind.config.js'

const spacing = (
  tailwindConfig as { theme: { extend: { spacing: Record<string, string> } } }
).theme.extend.spacing

// Tailwind 기본 간격 스케일 (자주 쓰는 단계) — 시각 참고용
const BASE_SCALE: { token: string; rem: string }[] = [
  { token: '1', rem: '0.25rem' },
  { token: '2', rem: '0.5rem' },
  { token: '3', rem: '0.75rem' },
  { token: '4', rem: '1rem' },
  { token: '6', rem: '1.5rem' },
  { token: '8', rem: '2rem' },
  { token: '12', rem: '3rem' },
  { token: '16', rem: '4rem' },
]

const remToPx = (rem: string) => `${Math.round(parseFloat(rem) * 16)}px`

const SpacingView = () => (
  <div className="p-8 bg-white-3 min-h-screen">
    <h1 className="text-2xl font-bold text-primary-1 mb-1">
      Spacing &amp; Touch
    </h1>
    <p className="text-sm text-shadow-3 mb-7">
      간격 스케일 · 터치 타겟 토큰 · tailwind.config 직접 로드
    </p>

    <h2 className="text-base text-primary-2 mb-3">간격 스케일</h2>
    <div className="mb-8">
      {BASE_SCALE.map(({ token, rem }) => (
        <div key={token} className="flex items-center gap-4 mb-2.5">
          <div className="w-24 text-xs font-bold text-primary-1">
            space-{token}
          </div>
          <div className="w-16 text-2xs text-shadow-3">{remToPx(rem)}</div>
          <div className="h-4 bg-type-water rounded" style={{ width: rem }} />
        </div>
      ))}
    </div>

    <h2 className="text-base text-primary-2 mb-3">
      터치 타겟{' '}
      <span className="text-[10px] text-white-1 bg-damage-status rounded px-1.5 align-middle">
        NEW
      </span>
    </h2>
    <div className="flex gap-5 items-end">
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center bg-primary-1 text-white-1 rounded-lg text-xs"
          style={{ width: spacing['touch'], height: spacing['touch'] }}
        >
          44
        </div>
        <div className="text-2xs text-shadow-3 mt-1.5">touch (2.75rem)</div>
      </div>
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center bg-primary-1 text-white-1 rounded-lg text-xs"
          style={{ width: spacing['touch-lg'], height: spacing['touch-lg'] }}
        >
          48
        </div>
        <div className="text-2xs text-shadow-3 mt-1.5">touch-lg (3rem)</div>
      </div>
    </div>
    <p className="mt-5 text-xs text-shadow-3">
      touch = WCAG 2.5.5 최소 터치 타겟(44px). touch-lg = Material/HIG
      권장(48px). 공용 컴포넌트에 min-h-touch / min-w-touch로 적용.
    </p>
  </div>
)

const meta = {
  title: 'Foundations/Spacing',
  component: SpacingView,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof SpacingView>

export default meta
export const All: StoryObj<typeof meta> = {}
