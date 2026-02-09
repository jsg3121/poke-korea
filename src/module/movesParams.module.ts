type MovesType = 'LEVELUP' | 'MACHINE'

interface MovesSegmentParams {
  versionGroupId?: number
  movesType: MovesType
  isValid: boolean
}

interface FormSegmentParams extends MovesSegmentParams {
  activeIndex: number
}

/**
 * 기본 moves 라우트의 segments 파싱
 * 가능한 패턴: (없음 - page.tsx에서 처리)
 * 이 함수는 form/region이 아닌 moves/ 하위의 segments를 파싱하지 않음
 * version/[versionGroupId] 라우트가 별도로 존재하므로 해당 없음
 */

/**
 * form/region 라우트의 [[...segments]] 파싱
 *
 * [] → index=0, 최신 버전, LEVELUP
 * ['1'] → index=1, 최신 버전, LEVELUP
 * ['machine'] → index=0, 최신 버전, MACHINE
 * ['1', 'machine'] → index=1, 최신 버전, MACHINE
 * ['version', '5'] → index=0, version=5, LEVELUP
 * ['1', 'version', '5'] → index=1, version=5, LEVELUP
 * ['version', '5', 'machine'] → index=0, version=5, MACHINE
 * ['1', 'version', '5', 'machine'] → index=1, version=5, MACHINE
 */
export const parseFormSegments = (segments?: string[]): FormSegmentParams => {
  if (!segments || segments.length === 0) {
    return { activeIndex: 0, movesType: 'LEVELUP', isValid: true }
  }

  let activeIndex = 0
  let versionGroupId: number | undefined
  const movesType: MovesType = 'LEVELUP'
  let cursor = 0

  // 첫 번째 세그먼트가 숫자인 경우 → activeIndex
  if (segments[cursor] !== 'version' && segments[cursor] !== 'machine') {
    const parsed = parseInt(segments[cursor], 10)
    if (isNaN(parsed) || parsed < 0 || parsed > 100) {
      return { activeIndex: 0, movesType: 'LEVELUP', isValid: false }
    }
    activeIndex = parsed
    cursor++
  }

  // 남은 세그먼트가 없으면 완료
  if (cursor >= segments.length) {
    return { activeIndex, movesType, isValid: true }
  }

  // 'machine'만 남은 경우
  if (segments[cursor] === 'machine' && cursor === segments.length - 1) {
    return {
      activeIndex,
      movesType: 'MACHINE',
      isValid: true,
    }
  }

  // 'version' 세그먼트 처리
  if (segments[cursor] === 'version') {
    cursor++
    if (cursor >= segments.length) {
      return { activeIndex: 0, movesType: 'LEVELUP', isValid: false }
    }

    const parsedVersion = parseInt(segments[cursor], 10)
    if (isNaN(parsedVersion) || parsedVersion <= 0) {
      return { activeIndex: 0, movesType: 'LEVELUP', isValid: false }
    }
    versionGroupId = parsedVersion
    cursor++

    // 남은 세그먼트가 없으면 완료
    if (cursor >= segments.length) {
      return {
        activeIndex,
        versionGroupId,
        movesType,
        isValid: true,
      }
    }

    // 'machine'이 마지막 세그먼트인 경우
    if (segments[cursor] === 'machine' && cursor === segments.length - 1) {
      return {
        activeIndex,
        versionGroupId,
        movesType: 'MACHINE',
        isValid: true,
      }
    }

    // 유효하지 않은 세그먼트
    return { activeIndex: 0, movesType: 'LEVELUP', isValid: false }
  }

  // 유효하지 않은 세그먼트
  return { activeIndex: 0, movesType: 'LEVELUP', isValid: false }
}

/**
 * Path 기반 URL 빌더
 */
export const buildMovesPath = ({
  pokemonId,
  activeType,
  activeIndex,
  versionGroupId,
  movesType,
}: {
  pokemonId: string
  activeType?: 'region' | 'normalForm'
  activeIndex?: number
  versionGroupId?: number
  movesType?: MovesType
}): string => {
  let basePath = `/detail/${pokemonId}/moves`

  // form/region 분기
  if (activeType === 'region') {
    basePath +=
      activeIndex && activeIndex > 0 ? `/region/${activeIndex}` : '/region'
  } else if (activeIndex && activeIndex > 0) {
    basePath += `/form/${activeIndex}`
  }

  // version 세그먼트
  if (versionGroupId) {
    basePath += `/version/${versionGroupId}`
  }

  // machine 세그먼트
  if (movesType === 'MACHINE') {
    basePath += '/machine'
  }

  return basePath
}
