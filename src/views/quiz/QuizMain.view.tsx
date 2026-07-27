import Link from 'next/link'
import PageHeaderComponent from '~/components/pageHeader/PageHeader.component'
import { QUIZ_CONFIG } from '~/constants/quiz.constants'

/**
 * 퀴즈 허브 (/quiz) 본문. desktop/mobile 2벌(QuizMain.desktop/mobile)을 반응형
 * 단일로 통합했다(ADR-0007). 크롬(헤더/푸터/탭바)은 page.tsx가 UA 분기로 렌더하고
 * 여기선 본문만 담당한다.
 *
 * PageHeader는 구버전 2벌 대신 DS PageHeaderComponent로 교체(champions/moves 선례).
 * 퀴즈 카드는 CTA 강조안(안 B): 밝은 카드 유지 + 하단 "시작하기"를 텍스트 링크에서
 * primary-1 채운 full-width 버튼(시각)으로 승격. 카드 전체가 Link이므로 버튼은
 * 시각 요소(span)이고 클릭은 카드가 받는다(중첩 링크 방지).
 */
const QuizMainView = () => {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pb-8 desktop:px-5">
      <PageHeaderComponent
        title="포켓몬 퀴즈"
        description="다양한 포켓몬 퀴즈를 통해 여러분의 포켓몬 지식을 테스트해보세요!"
      />

      <article className="mt-6 bg-primary-4 rounded-[1rem] p-5 desktop:p-6">
        <h2 className="text-lg desktop:text-xl font-bold text-primary-1 mb-3 desktop:mb-4">
          포켓몬 퀴즈에 도전하세요!
        </h2>
        <div className="space-y-3 text-sm desktop:text-base text-primary-1 leading-relaxed">
          <p>
            포케 코리아 퀴즈는 포켓몬에 대한 다양한 지식을 테스트할 수 있는
            4종류의 퀴즈를 제공합니다.
          </p>
          <p>
            <b className="font-bold">실루엣 퀴즈</b>,{' '}
            <b className="font-bold">특성 퀴즈</b>,{' '}
            <b className="font-bold">타입 퀴즈</b>,{' '}
            <b className="font-bold">타입 상성 퀴즈</b>까지{' '}
            <b className="font-bold">총 4가지</b> 유형으로 구성되어 있으며, 각
            퀴즈는 20문제 4지선다 객관식으로 진행됩니다.
          </p>
          <p>
            초보 트레이너부터 포켓몬 마스터까지, 자신의 포켓몬 지식 수준을
            확인해보세요. 퀴즈를 완료하면 정답률과 소요 시간을 바로 확인할 수
            있습니다.
          </p>
        </div>
      </article>

      <article className="mt-4 bg-primary-4 rounded-[1rem] p-5 desktop:p-6">
        <h2 className="text-lg desktop:text-xl font-bold text-primary-1 mb-3 desktop:mb-4">
          퀴즈 안내
        </h2>
        <ul className="space-y-2 text-sm desktop:text-base text-primary-1">
          {[
            '총 20문제로 이루어진 퀴즈를 풀어보세요',
            '모든 문제는 4지선다 형식으로 이루어져 있습니다',
            '퀴즈 시작 시 카운트가 지나면 타이머가 작동됩니다',
            '모든 문제를 완료하면 정답을 포함한 점수를 확인할 수 있습니다',
          ].map((text) => (
            <li key={text} className="flex-items-gap-2">
              <span className="w-1.5 h-1.5 bg-primary-2 rounded-full shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </article>

      <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4 desktop:gap-5 mt-6">
        {QUIZ_CONFIG.map((quiz) => (
          <Link
            key={quiz.type}
            href={quiz.route}
            aria-label={`${quiz.title} 시작하기`}
            className="group flex flex-col bg-primary-4 rounded-[1rem] p-5 desktop:p-6 border border-solid border-transparent hover:border-primary-2 hover:-translate-y-0.5 transition-[transform,border-color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
          >
            <h2 className="flex items-center gap-2.5 text-xl desktop:text-2xl font-bold text-primary-1 mb-3">
              <span className="text-[1.35rem]" aria-hidden="true">
                {quiz.icon}
              </span>
              {quiz.title}
            </h2>
            <p className="text-sm desktop:text-base text-primary-1 mb-4">
              {quiz.description}
            </p>
            <div className="mt-auto flex flex-col gap-3">
              <span className="text-xs desktop:text-sm text-primary-2">
                예상 소요시간: 5-10분
              </span>
              <span className="inline-flex min-h-touch-lg items-center justify-center gap-1.5 rounded-xl bg-primary-1 text-primary-4 text-sm desktop:text-base font-bold group-hover:bg-primary-2 transition-colors">
                {quiz.title} 시작하기 <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default QuizMainView
