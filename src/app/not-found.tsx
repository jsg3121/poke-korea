import { Metadata } from 'next'
import Link from 'next/link'

import { imageMode } from '~/modules/buildMode.module'
import Image from '~/components/Image.component'

export const metadata: Metadata = {
  title: '404 - 페이지를 찾을 수 없습니다',
  description: '요청하신 페이지가 존재하지 않거나 잘못되었습니다.',
  robots: {
    index: false,
    follow: true,
  },
}

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full px-4 text-center desktop:px-0">
        <h1
          className={`text-[4rem] desktop:text-[6rem] mb-4 font-bold text-primary-3`}
        >
          404
        </h1>
        <h2
          className={`text-2xl desktop:text-[2rem] mb-6 font-bold text-primary-3`}
        >
          페이지를 찾을 수 없습니다
        </h2>
        <strong
          className={`text-[1.2rem] desktop:text-lg mb-8 text-primary-3 block`}
        >
          요청하신 페이지가 존재하지 않거나 잘못되었습니다.
        </strong>
        <Link
          href="/"
          className={`w-1/2 desktop:w-[15rem] mx-auto text-xl text-aligned-xl text-white h-12 border-solid border-primary-4 border block mb-12`}
        >
          홈으로 돌아가기
        </Link>
        <div className="px-4 desktop:px-0">
          <p
            className={`text-base desktop:text-lg text-primary-3 mb-4 font-medium`}
          >
            인기 포켓몬 보러가는건 어때요?
          </p>
          <div
            className={`flex flex-wrap justify-center gap-3 desktop:flex-nowrap`}
          >
            <Link href="/detail/25">
              <Image
                height="10rem"
                width="10rem"
                src={`${imageMode}/25`}
                alt="피카츄 포켓몬"
                imageSize={{ width: 160, height: 160 }}
                densities={[1, 1.5]}
                sizes="10rem"
                loading="lazy"
              />
              <p className="px-4 h-10 bg-primary-2 text-primary-4 rounded-lg hover:bg-primary-3 hover:text-primary-1 text-aligned-lg transition-colors">
                피카츄
              </p>
            </Link>
            <Link href="/detail/6">
              <Image
                height="10rem"
                width="10rem"
                src={`${imageMode}/6`}
                alt="리자몽 포켓몬"
                imageSize={{ width: 160, height: 160 }}
                densities={[1, 1.5]}
                sizes="10rem"
                loading="lazy"
              />
              <p className="px-4 h-10 bg-primary-2 text-primary-4 rounded-lg hover:bg-primary-3 hover:text-primary-1 text-aligned-lg transition-colors">
                리자몽
              </p>
            </Link>
            <Link href="/detail/133">
              <Image
                height="10rem"
                width="10rem"
                src={`${imageMode}/133`}
                alt="이브이 포켓몬"
                imageSize={{ width: 160, height: 160 }}
                densities={[1, 1.5]}
                sizes="10rem"
                loading="lazy"
              />
              <p className="px-4 h-10 bg-primary-2 text-primary-4 rounded-lg hover:bg-primary-3 hover:text-primary-1 text-aligned-lg transition-colors">
                이브이
              </p>
            </Link>
            <Link href="/detail/150">
              <Image
                height="10rem"
                width="10rem"
                src={`${imageMode}/150`}
                alt="뮤츠 포켓몬"
                imageSize={{ width: 160, height: 160 }}
                densities={[1, 1.5]}
                sizes="10rem"
                loading="lazy"
              />
              <p className="px-4 h-10 bg-primary-2 text-primary-4 rounded-lg hover:bg-primary-3 hover:text-primary-1 text-aligned-lg transition-colors">
                뮤츠
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
