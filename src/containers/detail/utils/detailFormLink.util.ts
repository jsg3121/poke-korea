/**
 * 폼 전환 링크의 클래스를 만든다.
 * @param active 현재 선택된 폼인지
 * @returns 링크 className
 */
export const getFormLinkClass = (active: boolean) =>
  `flex h-8 items-center gap-1 rounded-2xl bg-primary-4 px-3 text-xs font-semibold text-black-2 transition-opacity desktop:text-sm ${
    active
      ? 'opacity-100'
      : 'opacity-65 hover:opacity-100 focus-visible:opacity-100'
  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4`
