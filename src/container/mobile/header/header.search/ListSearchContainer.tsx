'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect } from 'react'
import FeedbackIcon from '~/assets/icons/feedback.svg'
import ImageComponent from '~/components/Image.component'
import { useDebounce } from '~/hook/useDebounce'

/**
 * /list 전용 헤더 검색 (모바일). 셸(인풋 h-8·12px 폰트·피드백 버튼)은
 * HeaderSearchContainer(전역 검색)와 동일하되, 동작만 다르다:
 * 드롭다운(→상세 이동) 대신 **리스트 필터**(`?name=` 디바운스 반영).
 *
 * 데스크톱이 이미 쓰는 MainSearch/DetailSearch 분기 패턴을 모바일에 맞춘 것
 * (UX-004 검색 동작 확정 — 셸은 전 페이지 동일, /list만 필터 동작).
 */
const ListSearchContainer = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchKeyword, debounce] = useDebounce()

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    debounce(e.target.value.trim())
  }

  useEffect(() => {
    const currentName = searchParams.get('name') ?? ''
    // 마운트 직후(keyword='')나 이미 반영된 값이면 URL을 건드리지 않는다
    if (searchKeyword === currentName) return

    const params = new URLSearchParams(searchParams)
    if (searchKeyword === '') {
      params.delete('name')
    } else {
      params.set('name', searchKeyword)
    }
    router.replace(`/list?${params.toString()}`, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword])

  return (
    <div
      className="flex-1 min-w-0 relative"
      role="search"
      aria-label="포켓몬 이름으로 목록 검색"
    >
      <div className="w-4/5 h-8 flex items-center relative bg-white rounded-[1.125rem] px-[7px] overflow-hidden">
        <input
          type="text"
          name="search-pokemon-list"
          placeholder="포켓몬 검색"
          autoComplete="off"
          defaultValue={searchParams.get('name') ?? ''}
          onChange={handleChangeKeyword}
          className="w-full h-full text-xs text-[#333333] bg-white border-0 px-[3px] py-[5px] [-webkit-appearance:textfield]"
        />
        <ImageComponent
          src="/assets/image/search.svg"
          width="1.5rem"
          height="1.5rem"
          imageSize={{ width: 24, height: 24 }}
          alt="포켓몬 검색"
          className="icon-search"
        />
      </div>
      <Link
        href="https://forms.gle/BP9QVkj42xTJ5beQ8"
        target="_blank"
        className="h-8 text-primary-4 absolute right-0 top-1/2 -translate-y-1/2 bg-primary-1 px-2 rounded-md flex-items-gap-2"
      >
        <FeedbackIcon width={16} height={16} />
        <span className="sr-only">기능/오류 신고</span>
      </Link>
    </div>
  )
}

export default ListSearchContainer
