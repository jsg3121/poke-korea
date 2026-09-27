'use client'

import { ChangeEvent, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import FeedbackIcon from '~/assets/icons/feedback.svg'
import { useDebounce } from '~/hooks/useDebounce'
import { useFeedbackFormUrl } from '~/hooks/useFeedbackFormUrl'
import Image from '~/components/Image.component'

const ListSearch = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchKeyword, debounce] = useDebounce(searchParams.get('name') ?? '')
  const feedbackFormUrl = useFeedbackFormUrl()

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    debounce(e.target.value.trim())
  }

  useEffect(() => {
    const currentName = searchParams.get('name') ?? ''
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
        <Image
          src="/assets/image/search.svg"
          width="1.5rem"
          height="1.5rem"
          imageSize={{ width: 24, height: 24 }}
          alt="포켓몬 검색"
          className="icon-search"
        />
      </div>
      <Link
        href={feedbackFormUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="h-8 text-primary-4 absolute right-0 top-1/2 -translate-y-1/2 bg-primary-1 px-2 rounded-md flex-items-gap-2"
      >
        <FeedbackIcon width={16} height={16} />
        <span className="sr-only">기능/오류 신고</span>
      </Link>
    </div>
  )
}

export default ListSearch
