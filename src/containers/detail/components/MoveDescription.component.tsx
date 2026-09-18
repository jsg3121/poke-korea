/**
 * 전용 기술 카드(전용기·거다이맥스·전용 Z기술)에서 표 아래에 붙는 보조 텍스트 2종.
 * 기술 정보(표)가 주인공이고 이 텍스트는 보조라, 강조색(amber) 대신 중립 톤으로
 * 가시성을 낮춘다(사용자 요청 — 설명이 기술 정보보다 부각되던 문제 해소).
 */

/**
 * 기술 효과 설명 — 데이터의 effect/description을 표시한다. name을 주면 기술명
 * 라벨을 앞에 붙여(전용기·Z기술처럼 기술이 여러 개일 때 어느 설명인지 구분).
 * 좌측 강조 바(border-l-4) + 배경(primary-1/10)으로 개념 안내보다 부각한다.
 *
 * 개행 치환은 제거했다 — 원본 description에 있던 게임 내 표시용 줄바꿈(\n)을
 * 백엔드가 적재 시점에 정규화한다. 프론트 치환은 이 컴포넌트를 쓰는 곳에만
 * 적용돼 화면마다 처리가 달랐는데(기술 상세 히어로·목록 카드는 미적용),
 * 출처에서 해결되어 그 불일치도 사라졌다.
 */
export const MoveEffectDescription = ({
  name,
  text,
}: {
  name?: string
  text: string
}) => (
  <div className="mt-3 rounded-lg border-l-4 border-primary-2 bg-primary-1/10 px-3 py-2.5">
    {name && (
      <p className="mb-0.5 text-xs font-bold text-primary-1 desktop:text-sm">
        {name}
      </p>
    )}
    <p className="text-xs leading-relaxed text-primary-1 desktop:text-sm">
      {text}
    </p>
  </div>
)

/**
 * 개념 안내 — "전용기란 무엇인가" 같은 섹션 고정 설명. 제목+본문 박스 구조는
 * 유지하되(텍스트만 두면 허전), 강조색(amber) 대신 중립 primary 톤을 써서
 * 기술 정보(표)를 압도하지 않게 한다. 본문은 primary-2로 가독성을 확보한다
 * (primary-3은 밝은 배경과 대비 부족 ~1.9:1로 WCAG 미달이었다).
 */
export const MoveConceptNote = ({
  title,
  text,
}: {
  title: string
  text: string
}) => (
  <div className="mt-4 rounded-lg border border-primary-3/40 bg-primary-1/5 p-3">
    <h3 className="mb-1 text-xs font-bold text-primary-1 desktop:text-sm">
      {title}
    </h3>
    <p className="text-2xs leading-relaxed text-primary-2 desktop:text-sm">
      {text}
    </p>
  </div>
)
