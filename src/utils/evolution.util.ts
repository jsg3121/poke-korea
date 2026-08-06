import {
  EvolutionChainEdge,
  EvolutionChainStage,
} from '~/graphql/typeGenerated'

/**
 * 진화 계통(evolutionChain: stages + edges) 가공 유틸.
 *
 * 백엔드 계약:
 * - stages = 계통에 속한 모든 포켓몬(본인 포함, stage 순). 계통 뼈대(노드).
 * - edges = 진화 화살표(from→to). 조건(description)과 진화 후 대상 정보(result*)를 담는다.
 *   ⭐ 진화 대상의 이미지·이름은 stages가 아니라 edge의 result*에서 가져온다 —
 *   리전폼(알로라 나인테일)·노말폼(밤 루가루암)은 stages엔 기본형만, edges에만 폼별
 *   정보가 있기 때문이다.
 *
 * 이 유틸은 stages를 노드로 삼고(본인 포함 계통 전체), 각 노드로 들어오는 edge의
 * result*·조건을 병합해 카드 목록으로 만든다. stage 0(진화 전 최초)은 들어오는 edge가
 * 없어 조건이 비고, stage의 이미지·이름을 그대로 쓴다.
 *
 * 폼 필터링(§4): 현재 보고 있는 폼(리전/일반)에 맞는 edge만 매칭한다. 알로라 식스테일을
 * 보면 나인테일 노드에 알로라 edge(R0038007)를 붙여 "나인테일 (알로라의 모습)"으로 그린다.
 *
 * 렌더 코드와 섞이면 검증이 어려워 순수 함수로 분리한다(기존 skill.util 패턴).
 */

/** 특정 버전 그룹에서의 진화 조건 문장 */
export interface EvolutionVersion {
  /** null=전 버전 공통 */
  versionGroupId: number | null
  description: string
  /**
   * 버전 탭에 표시할 이름. 백엔드 baseVersionGroupName을 그대로 쓴다 — DLC 버전
   * (예: vg=21 갑옷섬)도 base 버전명("소드·실드")으로 온다. 공통(vg=null)이면 빈 문자열.
   */
  versionLabel: string
}

/**
 * 계통 노드 하나(포켓몬 한 마리). 이미지·이름은 들어오는 edge의 result*가 있으면
 * 그것을(리전폼 정확), 없으면 stage 값을 쓴다. versions는 이 포켓몬으로 진화해
 * 들어오는 조건이다. stage 0(진화 전)은 versions가 빈 배열이다.
 */
export interface EvolutionNode {
  /** 도감번호(표시용) */
  targetNumber: number
  /** 진화 대상 상세 URL. 리전폼·폼체인지면 해당 폼 경로로 조립된다 */
  targetHref: string
  displayName: string
  imagePath: string
  stage: number
  /** 진화 방식 한글 라벨(백엔드 triggerLabel). 진화 조건이 없으면 빈 문자열 */
  triggerLabel: string
  /** 이 포켓몬으로 진화하는 조건. 공통(null)이 맨 앞, 이후 versionGroupId 내림차순 */
  versions: Array<EvolutionVersion>
}

/**
 * 진화 대상의 폼 타입·index로 상세 페이지 URL을 조립한다.
 *
 * 백엔드 resultFormType/resultFormIndex는 검색 API(PokemonFormInfo)와 동일한
 * enum·index 체계라, 검색 결과의 formType→경로 매핑(ResultListData)을 그대로 따른다.
 * REGION_FORM→/region, NORMAL_FORM→/form, MEGA→/mega, BASE→경로 없음. index가 0이면
 * 뒤 index를 생략한다(예: /detail/38/region).
 *
 * @param number - 진화 대상 도감번호
 * @param formType - 백엔드 resultFormType ("BASE"|"REGION_FORM"|"NORMAL_FORM"|"MEGA")
 * @param formIndex - 백엔드 resultFormIndex (기본형이면 0)
 * @returns 진화 대상 상세 URL
 */
export const buildEvolutionTargetHref = (
  number: number,
  formType: string,
  formIndex: number,
): string => {
  const base = `/detail/${number}`
  const segment: Record<string, string> = {
    REGION_FORM: 'region',
    NORMAL_FORM: 'form',
    MEGA: 'mega',
  }
  const path = segment[formType]
  if (!path) return base
  return formIndex > 0 ? `${base}/${path}/${formIndex}` : `${base}/${path}`
}

/**
 * 현재 보고 있는 폼(리전/일반)에 맞는 진화 edge인지 판정한다.
 *
 * 판정 기준은 진화 "전"(from) 폼이다. 알로라 식스테일을 보면 fromRegionFormCode가
 * 리전폼인 edge를 고른다 — 그 edge의 from/result로 진화 전(식스테일)과 후(나인테일)를
 * 모두 알로라로 그린다(백엔드가 edge에 from* 추가로 양쪽 폼을 완결함). from과 to의
 * 리전 코드는 함께 움직이므로 결과적으로 진화 후도 알로라만 남는다.
 */
const matchesForm = (
  edge: EvolutionChainEdge,
  isRegionForm: boolean,
): boolean => {
  return isRegionForm
    ? edge.fromRegionFormCode !== null && edge.fromRegionFormCode !== undefined
    : (edge.fromRegionFormCode ?? null) === null
}

/**
 * stages를 노드로 삼아 계통 전체(본인 포함)를 만들고, 각 노드에 들어오는 edge의
 * 조건·대상 정보를 병합한다.
 *
 * 각 stage로 들어오는(toPokemonId=stage) edge 중 현재 폼에 맞는 것만 고른다. 그런 다음
 * edge를 폼(resultRegionFormCode + resultNormalFormCode) 조합으로 그룹핑한다:
 * - 폼 조합이 하나면(이상해씨·이브이) stage당 노드 하나. 버전만 다른 조건은 versions로
 *   합쳐 버전 탭 후보가 된다(리피아 등).
 * - 폼 조합이 여럿이면(암멍이 → 루가루암 낮/밤/황혼, resultNormalFormCode로 갈림) 폼마다
 *   별도 노드로 쪼갠다 — 같은 도감번호라도 폼이 다르므로 카드가 나뉜다.
 * 이미지·이름은 edge의 result*(리전/노말폼 반영)를 쓰고, 들어오는 edge가 없는 최초
 * 단계(stage 0)만 stage 값을 그대로 쓴다.
 *
 * @param stages - evolutionChain.stages(계통 전체)
 * @param edges - evolutionChain.edges
 * @param isRegionForm - 현재 보고 있는 폼이 리전폼이면 true
 * @returns stage 오름차순 노드 배열(본인 포함, 폼별 분리 반영)
 */
export const buildEvolutionChain = (
  stages: Array<EvolutionChainStage>,
  edges: Array<EvolutionChainEdge>,
  isRegionForm: boolean,
): Array<EvolutionNode> => {
  // 폼(진화 전 기준)에 맞는 edge를 to/from별로 모은다.
  const formEdges = edges.filter((edge) => matchesForm(edge, isRegionForm))
  const incomingByTarget = new Map<number, Array<EvolutionChainEdge>>()
  const outgoingBySource = new Map<number, EvolutionChainEdge>()
  formEdges.forEach((edge) => {
    const list = incomingByTarget.get(edge.toPokemonId) ?? []
    list.push(edge)
    incomingByTarget.set(edge.toPokemonId, list)
    // 최초 단계 노드의 폼 정보용: 나가는 edge의 from* 하나면 충분하다.
    if (!outgoingBySource.has(edge.fromPokemonId)) {
      outgoingBySource.set(edge.fromPokemonId, edge)
    }
  })

  const rank = (versionGroupId: number | null) =>
    versionGroupId ?? Number.POSITIVE_INFINITY
  const formKey = (edge: EvolutionChainEdge) =>
    `${edge.resultRegionFormCode ?? ''}|${edge.resultNormalFormCode ?? ''}`

  const nodes: Array<EvolutionNode> = []

  stages.forEach((stage) => {
    const incoming = incomingByTarget.get(stage.pokemonId) ?? []

    // 들어오는 edge가 없는 최초 단계(stage 0): 조건은 없지만, 폼 정보는 나가는
    // edge의 from*에서 가져온다 — 알로라 식스테일을 알로라 이미지·이름으로 그린다.
    if (incoming.length === 0) {
      const outgoing = outgoingBySource.get(stage.pokemonId)
      // stage 0(진화 전)은 어떤 edge에도 to로 안 와서 from 정보로 그린다. edge에
      // from 폼 타입/index는 없으나, from이 리전폼이면(fromRegionFormCode 존재)
      // 리전폼은 포켓몬당 1개라 /detail/{번호}/region(index 0)으로 정확히 조립된다.
      // 알로라 나인테일 상세에서 진화 전 "알로라 식스테일"을 눌러도 알로라로 이동.
      const fromIsRegion =
        outgoing?.fromRegionFormCode !== null &&
        outgoing?.fromRegionFormCode !== undefined
      nodes.push({
        targetNumber: stage.number,
        targetHref: fromIsRegion
          ? `/detail/${stage.number}/region`
          : `/detail/${stage.number}`,
        displayName: outgoing?.fromDisplayName ?? stage.displayName,
        imagePath: outgoing?.fromImagePath ?? stage.imagePath,
        stage: stage.stage,
        triggerLabel: '',
        versions: [],
      })
      return
    }

    // 들어오는 edge를 폼 조합으로 그룹핑 → 폼이 다르면(루가루암 3폼) 노드가 나뉜다.
    const byForm = new Map<string, Array<EvolutionChainEdge>>()
    incoming.forEach((edge) => {
      const key = formKey(edge)
      const list = byForm.get(key) ?? []
      list.push(edge)
      byForm.set(key, list)
    })

    byForm.forEach((formEdges) => {
      const representative = formEdges[0]
      const versions: Array<EvolutionVersion> = formEdges
        .map((edge) => ({
          versionGroupId: edge.versionGroupId ?? null,
          description: edge.description,
          // 버전 라벨은 백엔드 baseVersionGroupName(DLC→base 버전명 정규화됨).
          versionLabel: edge.baseVersionGroupName ?? '',
        }))
        // 공통(null)을 맨 앞(현행/기본 진화법), 이후 최신(vg 큰 값) 우선.
        .sort((a, b) => rank(b.versionGroupId) - rank(a.versionGroupId))

      nodes.push({
        targetNumber: stage.number,
        // 진화 대상 상세 URL은 폼 타입·index로 조립 — 리전폼(알로라 나인테일)·
        // 폼체인지(밤/황혼 루가루암)도 해당 폼 상세로 정확히 이동한다.
        targetHref: buildEvolutionTargetHref(
          stage.number,
          representative.resultFormType,
          representative.resultFormIndex,
        ),
        // 이미지·이름은 edge result*가 정확하다(리전/노말폼 반영).
        displayName: representative.resultDisplayName,
        imagePath: representative.resultImagePath,
        stage: stage.stage,
        triggerLabel: representative.triggerLabel,
        versions,
      })
    })
  })

  return nodes.sort((a, b) => a.stage - b.stage)
}

/**
 * 이 노드의 조건들을 "버전 탭"으로 보여줄지 판정한다.
 *
 * versionGroupId가 실제 값으로 여럿 있으면(리피아 등) 버전마다 조건이 다른 경우라
 * 버전 탭이 맞다. 반대로 vg가 전부 null인데 조건이 여럿이면 버전 차이가 아니므로
 * 버전 탭이 아니라 조건 나열로 보여야 한다. 즉 vg가 하나라도 있어야 버전 탭이다.
 *
 * @param versions - 노드의 진화 조건 목록
 * @returns 버전 탭으로 보여야 하면 true, 조건 나열이어야 하면 false
 */
export const hasVersionVariants = (
  versions: Array<EvolutionVersion>,
): boolean => {
  return (
    versions.length > 1 &&
    versions.some((version) => version.versionGroupId !== null)
  )
}
