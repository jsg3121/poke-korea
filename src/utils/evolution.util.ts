import {
  EvolutionChainEdge,
  EvolutionRouteGroup,
} from '~/graphql/typeGenerated'

/**
 * 진화 계통(evolutionChain) 가공 유틸.
 *
 * 백엔드 계약(groups 구조):
 * - groups = 폼별 진화 루트 묶음. 리전폼만 그룹을 나누고 기본형·노말폼 진화는 BASE
 *   그룹에 흡수된다(예: 나옹 → 기본/알로라/가라르 3그룹, 침바루 → 히스이 1그룹).
 *   프론트는 폼 필터링을 하지 않고 groups를 groupOrder 순으로 섹션 렌더한다.
 * - 각 그룹의 edges = 진화 화살표(from→to). from·result 양쪽에 폼별 이름·이미지·타입·
 *   index가 완비돼, 진화 전/후 노드를 폼에 맞게(알로라 나인테일 등) 그리고 상세 URL도
 *   폼 경로로 조립할 수 있다. description은 완성 한글 문장이라 그대로 노출한다.
 *
 * 이 유틸은 각 그룹의 edges에서 계통 노드를 뽑아(from·to 모두 노드화) 진화 단계순으로
 * 정렬한 섹션 목록을 만든다. 같은 대상으로 버전만 다른 조건은 versions로 합쳐 버전 탭
 * 후보가 된다(리피아·우라오스 등). 렌더 코드와 섞이면 검증이 어려워 순수 함수로 분리한다.
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
 * 계통 노드 하나(포켓몬 한 마리). 이름·이미지·URL은 edge의 from/result 폼 정보에서
 * 온다. versions는 이 포켓몬으로 진화해 들어오는 조건이다. 최초 단계(진화 전)는
 * versions가 빈 배열이다.
 */
export interface EvolutionNode {
  /** 도감번호(표시용) */
  targetNumber: number
  /** 진화 대상 상세 URL. 리전폼·폼체인지면 해당 폼 경로로 조립된다 */
  targetHref: string
  displayName: string
  imagePath: string
  /** 진화 단계(0=기본, 1=1차, …). from→to 체인으로 계산 */
  stage: number
  /** 진화 방식 한글 라벨(백엔드 triggerLabel). 진화 조건이 없으면 빈 문자열 */
  triggerLabel: string
  /** 이 포켓몬으로 진화하는 조건. 공통(null)이 맨 앞, 이후 versionGroupId 내림차순 */
  versions: Array<EvolutionVersion>
}

/**
 * 한 폼 그룹의 진화 계통 섹션. 라벨(기본/알로라/…)과 그 그룹의 노드 목록을 담는다.
 */
export interface EvolutionGroupSection {
  /** 그룹 식별 키('BASE' 또는 리전폼 코드) — React key용 */
  groupKey: string
  /** 섹션 라벨. BASE→"기본", REGION_FORM→지역명(groupRegion) */
  label: string
  /** 진화 단계순 노드 목록(진화 전 포함) */
  nodes: Array<EvolutionNode>
}

/**
 * 폼 타입·index로 상세 페이지 URL을 조립한다.
 *
 * 백엔드 formType/formIndex는 검색 API(PokemonFormInfo)와 동일한 enum·index 체계라,
 * 검색 결과의 formType→경로 매핑(ResultListData)을 그대로 따른다. REGION_FORM→/region,
 * NORMAL_FORM→/form, MEGA→/mega, BASE→경로 없음. index가 0이면 뒤 index를 생략한다.
 *
 * @param number - 대상 도감번호
 * @param formType - "BASE"|"REGION_FORM"|"NORMAL_FORM"|"MEGA"
 * @param formIndex - 폼 순서(기본형이면 0)
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

const rank = (versionGroupId: number | null) =>
  versionGroupId ?? Number.POSITIVE_INFINITY

/** 그룹 섹션 라벨: BASE는 "기본", 리전폼은 지역명(없으면 "리전") */
const getGroupLabel = (group: EvolutionRouteGroup): string => {
  if (group.groupFormType === 'BASE') return '기본'
  return group.groupRegion ?? '리전'
}

/**
 * 한 그룹의 edges에서 계통 노드 배열을 만든다.
 *
 * from·to 포켓몬을 모두 노드로 수집하되, "폼 identity"(도감번호 + 폼 타입·index)를
 * 키로 삼아 같은 폼은 하나의 노드로 합친다. edge의 to로 한 번도 등장하지 않은 노드가
 * 최초 단계(진화 전)다. 진화 조건(versions)은 그 노드로 들어오는 edge에서 모으고,
 * 같은 대상에 버전만 다른 여러 edge는 versions로 합친다.
 */
const buildNodesFromEdges = (
  edges: Array<EvolutionChainEdge>,
): Array<EvolutionNode> => {
  // 폼 단위 노드 식별 키(같은 번호라도 폼이 다르면 별개 노드).
  const nodeKey = (
    number: number,
    formType: string,
    formIndex: number,
  ): string => `${number}|${formType}|${formIndex}`

  const nodeMap = new Map<string, EvolutionNode>()
  // 위상 전파용: from→to 인접 리스트와 노드별 진입 차수.
  const adjacency = new Map<string, Array<string>>()
  const indegree = new Map<string, number>()

  const ensureNode = (
    key: string,
    number: number,
    displayName: string,
    imagePath: string,
    formType: string,
    formIndex: number,
  ): EvolutionNode => {
    const existing = nodeMap.get(key)
    if (existing) return existing
    const node: EvolutionNode = {
      targetNumber: number,
      targetHref: buildEvolutionTargetHref(number, formType, formIndex),
      displayName,
      imagePath,
      stage: 0,
      triggerLabel: '',
      versions: [],
    }
    nodeMap.set(key, node)
    if (!indegree.has(key)) indegree.set(key, 0)
    return node
  }

  edges.forEach((edge) => {
    const fromKey = nodeKey(
      edge.fromPokemonId,
      edge.fromFormType,
      edge.fromFormIndex,
    )
    const toKey = nodeKey(
      edge.toPokemonId,
      edge.resultFormType,
      edge.resultFormIndex,
    )

    // from 노드(진화 전)는 이미지·이름을 from* 필드에서.
    ensureNode(
      fromKey,
      edge.fromPokemonId,
      edge.fromDisplayName,
      edge.fromImagePath,
      edge.fromFormType,
      edge.fromFormIndex,
    )
    // to 노드(진화 후)는 result* 필드에서. 이 노드로 들어오는 진화 조건을 붙인다.
    const toNode = ensureNode(
      toKey,
      edge.toPokemonId,
      edge.resultDisplayName,
      edge.resultImagePath,
      edge.resultFormType,
      edge.resultFormIndex,
    )
    toNode.triggerLabel = edge.triggerLabel
    toNode.versions.push({
      versionGroupId: edge.versionGroupId ?? null,
      description: edge.description,
      versionLabel: edge.baseVersionGroupName ?? '',
    })

    // 위상 전파용 그래프: from→to 간선과 to 진입 차수.
    const list = adjacency.get(fromKey) ?? []
    list.push(toKey)
    adjacency.set(fromKey, list)
    indegree.set(toKey, (indegree.get(toKey) ?? 0) + 1)
  })

  // stage 계산: 위상 정렬(BFS)로 루트(진입 차수 0)부터 전파한다. edge 배열 순서와
  // 무관하게 정확하다 — 단일 패스는 edges가 위상 순서로 와야만 맞아서 3단계 계통이
  // 순서에 따라 틀릴 수 있었다. 여러 경로로 도달하면 최댓값(가장 깊은 단계)을 쓴다.
  const stageOf = new Map<string, number>()
  const queue: Array<string> = []
  indegree.forEach((deg, key) => {
    if (deg === 0) {
      stageOf.set(key, 0)
      queue.push(key)
    }
  })
  const remaining = new Map(indegree)
  while (queue.length > 0) {
    const key = queue.shift() as string
    const current = stageOf.get(key) ?? 0
    ;(adjacency.get(key) ?? []).forEach((toKey) => {
      stageOf.set(toKey, Math.max(stageOf.get(toKey) ?? 0, current + 1))
      const left = (remaining.get(toKey) ?? 0) - 1
      remaining.set(toKey, left)
      if (left === 0) queue.push(toKey)
    })
  }

  nodeMap.forEach((node, key) => {
    node.stage = stageOf.get(key) ?? 0
    // 공통(null)을 맨 앞(현행/기본 진화법), 이후 최신(vg 큰 값) 우선.
    node.versions.sort(
      (a, b) => rank(b.versionGroupId) - rank(a.versionGroupId),
    )
  })

  return Array.from(nodeMap.values()).sort((a, b) => a.stage - b.stage)
}

/**
 * evolutionChain.groups를 폼별 섹션 배열로 가공한다.
 *
 * groupOrder 순으로 정렬해, 각 그룹을 라벨(기본/알로라/…) + 노드 목록 섹션으로 만든다.
 * 노드가 없는(빈) 그룹은 제외한다.
 *
 * @param groups - evolutionChain.groups
 * @returns groupOrder 순 섹션 배열
 */
export const buildEvolutionGroups = (
  groups: Array<EvolutionRouteGroup>,
): Array<EvolutionGroupSection> => {
  return [...groups]
    .sort((a, b) => a.groupOrder - b.groupOrder)
    .map((group) => ({
      groupKey: group.groupKey,
      label: getGroupLabel(group),
      nodes: buildNodesFromEdges(group.edges),
    }))
    .filter((section) => section.nodes.length > 0)
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
