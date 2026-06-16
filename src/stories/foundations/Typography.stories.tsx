import type { Meta, StoryObj } from '@storybook/nextjs'

import tailwindConfig from '../../../tailwind.config.js'

const fontSize = (
  tailwindConfig as { theme: { extend: { fontSize: Record<string, string> } } }
).theme.extend.fontSize

// 본문에서 자주 쓰는 스케일만 노출 (6xl 이상 대형은 생략)
const SHOWN = [
  '2xs',
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
]

const remToPx = (rem: string) => {
  const n = parseFloat(rem)
  return `${Math.round(n * 16)}px`
}

const TypographyView = () => (
  <div className="p-8 bg-white-3 min-h-screen">
    <h1 className="text-2xl font-bold text-primary-1 mb-1">Typography</h1>
    <p className="text-sm text-shadow-3 mb-7">
      Gmarket Sans · fontSize 스케일 · 1rem = 16px · tailwind.config 직접 로드
    </p>
    <table className="w-full bg-white-1 rounded-[10px] overflow-hidden">
      <thead>
        <tr className="bg-primary-4 text-primary-2 text-xs text-left">
          <th className="p-3 w-24">토큰</th>
          <th className="p-3 w-28">크기</th>
          <th className="p-3">샘플</th>
        </tr>
      </thead>
      <tbody>
        {SHOWN.map((token) => {
          const rem = fontSize[token]
          return (
            <tr key={token} className="border-b border-shadow-1">
              <td className="p-3 text-xs font-bold text-primary-1 whitespace-nowrap">
                {token}
                {token === '2xs' && (
                  <span className="ml-1.5 text-[10px] text-white-1 bg-type-water rounded px-1">
                    NEW
                  </span>
                )}
              </td>
              <td className="p-3 text-xs text-shadow-3 whitespace-nowrap">
                {rem} / {remToPx(rem)}
              </td>
              <td className="p-3 text-primary-1" style={{ fontSize: rem }}>
                포케코리아 Pokékorea
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
    <p className="mt-5 text-xs text-shadow-3">
      2xs(11px)는 모바일 최소 폰트 토큰. 기존 탭바 9px(접근성 미달)을 대체.
    </p>
  </div>
)

const meta = {
  title: 'Foundations/Typography',
  component: TypographyView,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof TypographyView>

export default meta
export const All: StoryObj<typeof meta> = {}
