import type { Meta, StoryObj } from '@storybook/nextjs'

// 실제 tailwind.config의 토큰을 직접 읽어 렌더한다(손으로 베끼지 않음).
// 토큰이 바뀌면 이 story도 자동 반영된다.
import tailwindConfig from '../../../tailwind.config.js'

const colors = (
  tailwindConfig as { theme: { extend: { colors: Record<string, string> } } }
).theme.extend.colors

const GROUPS: { title: string; prefix: string[] }[] = [
  { title: 'Primary', prefix: ['primary-'] },
  {
    title: '중성 (Neutral)',
    prefix: ['white-', 'black-', 'shadow-', 'card-accent'],
  },
  { title: 'Damage', prefix: ['damage-'] },
  { title: 'Type (18)', prefix: ['type-'] },
]

const Swatch = ({ name, hex }: { name: string; hex: string }) => (
  <div className="border border-white-2 rounded-[10px] overflow-hidden bg-white-1 w-[120px]">
    <div className="h-16" style={{ background: hex }} />
    <div className="p-2">
      <div className="text-xs font-bold text-black-2">{name}</div>
      <div className="text-2xs text-shadow-3 uppercase">{hex}</div>
    </div>
  </div>
)

const ColorsView = () => (
  <div className="p-8 bg-white-3 min-h-screen">
    <h1 className="text-2xl font-bold text-primary-1 mb-1">Colors</h1>
    <p className="text-sm text-shadow-3 mb-7">
      포케코리아 색상 토큰 · tailwind.config에서 직접 로드
    </p>
    {GROUPS.map(({ title, prefix }) => {
      const entries = Object.entries(colors).filter(([name]) =>
        prefix.some((p) => name.startsWith(p) || name === p),
      )
      return (
        <section key={title} className="mb-8">
          <h2 className="text-base text-primary-2 mb-3">{title}</h2>
          <div className="flex flex-wrap gap-3">
            {entries.map(([name, hex]) => (
              <Swatch key={name} name={name} hex={hex} />
            ))}
          </div>
        </section>
      )
    })}
  </div>
)

const meta = {
  title: 'Foundations/Colors',
  component: ColorsView,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorsView>

export default meta
export const All: StoryObj<typeof meta> = {}
