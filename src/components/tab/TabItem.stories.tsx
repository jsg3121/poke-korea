import type { Meta, StoryObj } from '@storybook/nextjs'

import TabItemComponent from './TabItem.component'

/** 탭은 진한 네이비 배경(primary-1) 위에서 쓰이므로 그 맥락으로 렌더한다. */
const NavyBg = (Story: React.ComponentType) => (
  <div className="bg-primary-1 p-6">
    <Story />
  </div>
)

const meta = {
  title: 'Components/TabItem',
  component: TabItemComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '탭 항목 하나 (DS 원자). 라벨 + `active`(선택됨) 상태를 가진 최소 단위.',
          '',
          'Button/LinkButton과 분리: 버튼은 "상태 없는 액션/이동", 탭은 `active` 의미축을 가짐.',
          '',
          '`href` 유무로 모드 자동 분기 — 있으면 이동 탭(next/link, `aria-current`), 없으면 상태 전환 탭(`button`, `role="tab"`).',
          '',
          'variant: `underline`(네비게이션) / `fill`(컨텐츠 전환). 색은 등록된 토큰(primary-1~4)만 사용.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  decorators: [NavyBg],
  args: { children: '챔피언스', href: '#' },
  argTypes: {
    variant: { control: 'select', options: ['underline', 'fill'] },
    active: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof TabItemComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 밑줄형 · 선택됨 (네비게이션 현재 위치) */
export const UnderlineActive: Story = {
  args: { variant: 'underline', active: true },
}

/** 밑줄형 · 미선택 */
export const UnderlineInactive: Story = {
  args: { variant: 'underline', active: false },
}

/** 채움형 · 선택됨 (컨텐츠 전환) */
export const FillActive: Story = {
  args: { variant: 'fill', active: true, children: 'VGC 더블' },
}

/** 채움형 · 미선택 */
export const FillInactive: Story = {
  args: { variant: 'fill', active: false, children: 'BSS 싱글' },
}

/** variant × active 4종 한눈 비교 */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-primary-3 text-xs mb-2">underline (네비게이션)</p>
        <div className="flex items-center gap-6">
          <TabItemComponent href="#" variant="underline" active>
            챔피언스
          </TabItemComponent>
          <TabItemComponent href="#" variant="underline">
            챔피언스 도감
          </TabItemComponent>
          <TabItemComponent href="#" variant="underline">
            티어 리스트
          </TabItemComponent>
          <TabItemComponent href="#" variant="underline">
            대회
          </TabItemComponent>
        </div>
      </div>
      <div>
        <p className="text-primary-3 text-xs mb-2">fill (컨텐츠 전환)</p>
        <div className="flex items-center gap-6">
          <TabItemComponent href="#" variant="fill" active>
            VGC 더블
          </TabItemComponent>
          <TabItemComponent href="#" variant="fill">
            BSS 싱글
          </TabItemComponent>
        </div>
      </div>
    </div>
  ),
}

/** 상태 전환 모드 (href 없음 → button, role="tab") */
export const ButtonMode: Story = {
  render: () => (
    <div className="flex items-center gap-6" role="tablist">
      <TabItemComponent variant="fill" active>
        기술
      </TabItemComponent>
      <TabItemComponent variant="fill">도구</TabItemComponent>
      <TabItemComponent variant="fill">특성</TabItemComponent>
      <TabItemComponent variant="fill">파트너</TabItemComponent>
    </div>
  ),
}
