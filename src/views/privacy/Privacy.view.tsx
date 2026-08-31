import Link from 'next/link'

/** 헤더의 '기능/오류 신고'와 동일한 폼. 문의 창구를 한 곳으로 유지한다. */
const FEEDBACK_FORM_URL = 'https://forms.gle/BP9QVkj42xTJ5beQ8'

/**
 * 방침에 명시하는 제3자 서비스.
 *
 * layout.tsx 에서 실제로 로드하는 스크립트와 1:1로 대응해야 한다.
 * 추적 도구를 추가·제거하면 이 목록도 함께 갱신할 것 — 방침과 구현이
 * 어긋나면 고지 의무를 형식적으로만 채우는 셈이 된다.
 */
const THIRD_PARTY_SERVICES = [
  {
    name: 'Google Analytics 4',
    purpose: '이용 통계 분석',
    href: 'https://policies.google.com/privacy',
  },
  {
    name: 'Google AdSense',
    purpose: '광고 게재',
    href: 'https://policies.google.com/technologies/ads',
  },
  {
    name: '네이버 애널리틱스',
    purpose: '방문 통계 분석',
    href: 'https://policies.naver.com/policies/privacy.html',
  },
] as const

/** 개인정보 침해 구제 기관. 국내 개인정보처리방침의 표준 안내 항목이다. */
const RELIEF_AGENCIES = [
  { name: '개인정보침해신고센터', info: 'privacy.kisa.or.kr / 국번없이 118' },
  { name: '개인정보분쟁조정위원회', info: 'www.kopico.go.kr / 1833-6972' },
  { name: '대검찰청 사이버수사과', info: 'www.spo.go.kr / 국번없이 1301' },
  { name: '경찰청 사이버수사국', info: 'ecrm.police.go.kr / 국번없이 182' },
] as const

/**
 * body 배경이 primary-1(#27374D)이라 텍스트는 밝은 쪽을 쓴다.
 * primary-1·primary-2는 배경 대비가 각각 1:1, 1.8:1 수준이라 본문에 쓸 수 없다.
 * 본문 primary-3은 6.5:1, 제목·강조 primary-4는 11.4:1로 WCAG AA(4.5:1)를 만족한다.
 */
const SECTION_CLASS = 'mb-8 last:mb-0'
const HEADING_CLASS = 'text-lg font-bold text-primary-4 mb-3'
const TEXT_CLASS = 'text-sm leading-7 text-primary-3'
const LIST_CLASS = 'list-disc pl-5 mt-2 space-y-1.5'
const STRONG_CLASS = 'font-bold text-primary-4'
const LINK_CLASS = 'font-bold text-primary-4 underline underline-offset-2'

const PrivacyView = () => {
  return (
    <article className="w-full max-w-[1280px] mx-auto px-5 py-10">
      <header className="mb-8 pb-6 border-b border-primary-2">
        <h1 className="text-2xl font-bold text-primary-4 mb-2">
          개인정보처리방침
        </h1>
        <p className="text-xs text-primary-3">최종 수정일: 2026년 8월 31일</p>
      </header>

      <p className={`${TEXT_CLASS} mb-8`}>
        포케코리아(poke-korea.com, 이하 &apos;본 사이트&apos;)는 이용자의
        개인정보를 중요하게 생각하며,{' '}
        <b className={STRONG_CLASS}>
          개인정보보호법 등 관련 법령을 준수합니다.
        </b>{' '}
        본 방침은 본 사이트가 어떤 정보를 수집하고 어떻게 처리하는지 설명합니다.
      </p>

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>1. 수집하는 정보</h2>
        <p className={TEXT_CLASS}>
          본 사이트는{' '}
          <b className={STRONG_CLASS}>회원가입·로그인 절차가 없으며</b>,
          이용자로부터 이름·연락처·이메일 등{' '}
          <b className={STRONG_CLASS}>개인정보를 직접 수집하지 않습니다.</b>{' '}
          다만 서비스 운영 과정에서 아래 정보가 자동으로 수집될 수 있습니다.
        </p>
        <ul className={`${TEXT_CLASS} ${LIST_CLASS}`}>
          <li>
            <b className={STRONG_CLASS}>Google Analytics 4</b>: 페이지 방문
            기록, 기기 유형, 브라우저 종류, 체류 시간 등
          </li>
          <li>
            <b className={STRONG_CLASS}>Google AdSense</b>: 광고 게재 및 성과
            측정을 위한 데이터
          </li>
          <li>
            <b className={STRONG_CLASS}>네이버 애널리틱스</b>: 방문 통계 및 유입
            경로 분석 데이터
          </li>
        </ul>
        <p className={`${TEXT_CLASS} mt-3`}>
          또한 이용자가 문의 폼을 통해 자발적으로 입력한 내용은 해당 폼에
          저장됩니다. 본 사이트는 문의 폼에서 이메일 주소 등 응답자 정보를
          별도로 수집하지 않으며, 이용자가 문의 내용에 직접 기재한 정보만 확인할
          수 있습니다.
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>2. 쿠키 및 브라우저 저장소</h2>
        <p className={TEXT_CLASS}>
          본 사이트는{' '}
          <b className={STRONG_CLASS}>자체적으로 쿠키를 생성하지 않습니다.</b>{' '}
          아래 제3자 서비스가 쿠키를 사용할 수 있습니다.
        </p>
        <ul className={`${TEXT_CLASS} ${LIST_CLASS}`}>
          <li>
            <b className={STRONG_CLASS}>분석 쿠키</b>: Google Analytics 4,
            네이버 애널리틱스
          </li>
          <li>
            <b className={STRONG_CLASS}>광고 쿠키</b>: Google AdSense
          </li>
        </ul>
        <p className={`${TEXT_CLASS} mt-3`}>
          또한 화면의 스크롤 위치 등 이용 편의를 위한 정보를 브라우저 세션
          저장소에 임시 저장합니다. 이 정보에는{' '}
          <b className={STRONG_CLASS}>
            개인을 식별할 수 있는 내용이 포함되지 않으며
          </b>
          , 브라우저 탭을 닫으면 삭제됩니다.
        </p>
        <p className={`${TEXT_CLASS} mt-3`}>
          이용자는 브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있습니다.
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>3. 제3자 서비스</h2>
        <p className={TEXT_CLASS}>
          본 사이트는 아래 제3자 서비스를 이용하며, 각 서비스는 자체
          개인정보처리방침에 따라 데이터를 수집·처리합니다.
        </p>
        <ul className={`${TEXT_CLASS} ${LIST_CLASS}`}>
          {THIRD_PARTY_SERVICES.map((service) => (
            <li key={service.name}>
              <b className={STRONG_CLASS}>{service.name}</b> ({service.purpose})
              —{' '}
              <a
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
              >
                개인정보처리방침 보기
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>4. 맞춤형 광고</h2>
        <p className={TEXT_CLASS}>
          Google을 포함한 제3자 광고 사업자는 쿠키를 사용해 이용자의 이전 방문
          기록에 기반한 광고를 게재합니다. 이용자는{' '}
          <a
            href="https://myadcenter.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            Google 광고 센터
          </a>
          에서{' '}
          <b className={STRONG_CLASS}>개인 맞춤 광고를 해제할 수 있습니다.</b>
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>5. 이용자의 권리</h2>
        <ul className={`${TEXT_CLASS} ${LIST_CLASS}`}>
          <li>브라우저 설정을 통한 쿠키 삭제 및 저장 거부</li>
          <li>Google 광고 센터를 통한 맞춤형 광고 해제</li>
          <li>Google Analytics 차단 브라우저 부가 기능을 통한 수집 거부</li>
        </ul>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>6. 아동의 개인정보</h2>
        <p className={TEXT_CLASS}>
          본 사이트는{' '}
          <b className={STRONG_CLASS}>만 14세 미만 아동을 포함한 모든 이용자</b>
          로부터 개인정보를 직접 수집하지 않습니다. 회원가입 절차가 없으며 개인
          데이터를 서버에 저장하지 않습니다.
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>7. 데이터 보관</h2>
        <p className={TEXT_CLASS}>
          본 사이트는 이용자 계정 시스템을 운영하지 않으며 개인 데이터를 자체
          데이터베이스에 보관하지 않습니다. 제3자 분석 도구를 통해 수집되는
          데이터는 각 사업자의 보존 정책에 따릅니다.
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>8. 데이터 보안</h2>
        <p className={TEXT_CLASS}>
          본 사이트는 <b className={STRONG_CLASS}>HTTPS(SSL/TLS) 암호화 통신</b>
          을 적용하고 있으며, 최소한의 데이터 수집 원칙을 따릅니다.
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>9. 방침 변경</h2>
        <p className={TEXT_CLASS}>
          본 방침은 법령이나 서비스 변경에 따라 수정될 수 있으며, 변경 사항은 본
          페이지에 게시됩니다.
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>10. 문의처 및 개인정보 보호책임자</h2>
        <p className={TEXT_CLASS}>
          본 사이트는 이용자의 개인정보 관련 문의, 불만 처리 및 피해 구제를 위해
          아래 창구를 운영합니다.
        </p>
        <ul className={`${TEXT_CLASS} ${LIST_CLASS}`}>
          <li>
            <b className={STRONG_CLASS}>담당</b>: 포케코리아 운영자
          </li>
          <li>
            <b className={STRONG_CLASS}>문의</b>:{' '}
            <a
              href={FEEDBACK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              기능/오류 신고 및 문의 폼
            </a>
          </li>
        </ul>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className={HEADING_CLASS}>11. 개인정보 침해 구제</h2>
        <p className={TEXT_CLASS}>
          개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의할 수
          있습니다.
        </p>
        <ul className={`${TEXT_CLASS} ${LIST_CLASS}`}>
          {RELIEF_AGENCIES.map((agency) => (
            <li key={agency.name}>
              <b className={STRONG_CLASS}>{agency.name}</b> ({agency.info})
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-10 pt-6 border-t border-primary-2 text-center">
        <Link
          href="/"
          className="inline-block text-sm text-primary-3 underline underline-offset-2"
        >
          홈으로 돌아가기
        </Link>
      </footer>
    </article>
  )
}

export default PrivacyView
