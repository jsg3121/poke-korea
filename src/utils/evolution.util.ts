import {
  EvolutionChainEdge,
  EvolutionRouteGroup,
} from '~/graphql/typeGenerated'

export interface EvolutionVersion {
  versionGroupId: number | null
  description: string
  versionLabel: string
}

export interface EvolutionNode {
  targetNumber: number
  targetHref: string
  displayName: string
  imagePath: string
  stage: number
  triggerLabel: string
  versions: Array<EvolutionVersion>
}

export interface EvolutionGroupSection {
  groupKey: string
  label: string
  nodes: Array<EvolutionNode>
}

/**
 * 폼 타입·index로 상세 페이지 URL을 조립한다.
 * @param number 대상 도감번호
 * @param formType "BASE"|"REGION_FORM"|"NORMAL_FORM"|"MEGA"
 * @param formIndex 폼 순서(기본형이면 0)
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

const getGroupLabel = (group: EvolutionRouteGroup): string => {
  if (group.groupFormType === 'BASE') return '기본'
  return group.groupRegion ?? '리전'
}

const buildNodesFromEdges = (
  edges: Array<EvolutionChainEdge>,
): Array<EvolutionNode> => {
  const nodeKey = (
    number: number,
    formType: string,
    formIndex: number,
  ): string => `${number}|${formType}|${formIndex}`

  const nodeMap = new Map<string, EvolutionNode>()
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

    ensureNode(
      fromKey,
      edge.fromPokemonId,
      edge.fromDisplayName,
      edge.fromImagePath,
      edge.fromFormType,
      edge.fromFormIndex,
    )
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

    const list = adjacency.get(fromKey) ?? []
    list.push(toKey)
    adjacency.set(fromKey, list)
    indegree.set(toKey, (indegree.get(toKey) ?? 0) + 1)
  })

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
    node.versions.sort(
      (a, b) => rank(b.versionGroupId) - rank(a.versionGroupId),
    )
  })

  return Array.from(nodeMap.values()).sort((a, b) => a.stage - b.stage)
}

/**
 * evolutionChain.groups를 폼별 섹션 배열로 가공한다. 빈 그룹은 제외한다.
 * @param groups evolutionChain.groups
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
 * 노드의 조건을 버전 탭으로 보여줄지 판정한다.
 * @param versions 노드의 진화 조건 목록
 * @returns 버전 탭이면 true, 조건 나열이면 false
 */
export const hasVersionVariants = (
  versions: Array<EvolutionVersion>,
): boolean => {
  return (
    versions.length > 1 &&
    versions.some((version) => version.versionGroupId !== null)
  )
}
