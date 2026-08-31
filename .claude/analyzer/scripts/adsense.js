#!/usr/bin/env node
/**
 * AdSense Management API 리포트 조회.
 *
 * 사용법:
 *   node .claude/analyzer/scripts/adsense.js [옵션]
 *
 *   --start=YYYY-MM-DD   시작일 (기본: 30일 전)
 *   --end=YYYY-MM-DD     종료일 (기본: 어제 — 당일 수익은 미확정)
 *   --dim=PAGE_URL       차원(쉼표 구분, 기본 DATE)
 *   --met=CLICKS,...     지표(쉼표 구분, 기본 ESTIMATED_EARNINGS,IMPRESSIONS,CLICKS)
 *   --contains=/detail/  첫 번째 차원에 이 문자열이 포함된 행만(응답 후 필터)
 *   --limit=30           출력 행 수 (기본 30)
 *   --account=pub-...    계정 지정 (기본: 첫 번째 계정 자동 선택)
 *   --json=경로           결과를 JSON으로 저장
 *
 * 자주 쓰는 차원: DATE, MONTH, PAGE_URL, AD_UNIT_NAME, COUNTRY_CODE,
 *                PLATFORM_TYPE_CODE
 * 자주 쓰는 지표: ESTIMATED_EARNINGS, IMPRESSIONS, CLICKS, PAGE_VIEWS,
 *                PAGE_VIEWS_RPM, IMPRESSIONS_RPM, IMPRESSIONS_CTR
 *
 * 예:
 *   node ... adsense.js --dim=PAGE_URL --met=ESTIMATED_EARNINGS,PAGE_VIEWS_RPM
 *   node ... adsense.js --dim=DATE --start=2026-08-01
 */

const fs = require('fs')
const { getAccessTokenFromRefreshToken } = require('./google-auth')

const BASE = 'https://adsense.googleapis.com/v2'

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}

const daysAgo = (n) =>
  new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)

const call = async (token, url) => {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(`애드센스 오류(${res.status}): ${JSON.stringify(json)}`)
  }
  return json
}

/** 계정 목록에서 첫 번째를 고른다. 대부분 계정이 하나다. */
const resolveAccount = async (token) => {
  const explicit = arg('account')
  if (explicit) {
    return explicit.startsWith('accounts/') ? explicit : `accounts/${explicit}`
  }

  const { accounts } = await call(token, `${BASE}/accounts`)
  if (!accounts || accounts.length === 0) {
    throw new Error(
      '애드센스 계정을 찾을 수 없다. 인증에 사용한 구글 계정이 애드센스 소유자인지 확인할 것.',
    )
  }
  return accounts[0].name
}

/** {units, nanos} 형태의 금액을 숫자로 변환한다. */
const toNumber = (cell) => {
  if (cell.value !== undefined) return Number(cell.value)
  const units = Number(cell.units ?? 0)
  const nanos = Number(cell.nanos ?? 0)
  return units + nanos / 1e9
}

const main = async () => {
  const dimensions = arg('dim', 'DATE').split(',')
  const metrics = arg(
    'met',
    'ESTIMATED_EARNINGS,IMPRESSIONS,CLICKS',
  ).split(',')
  const startDate = arg('start', daysAgo(30))
  const endDate = arg('end', daysAgo(1))
  const contains = arg('contains')
  const limit = Number(arg('limit', 30))

  const token = await getAccessTokenFromRefreshToken()
  const account = await resolveAccount(token)

  const [sy, sm, sd] = startDate.split('-')
  const [ey, em, ed] = endDate.split('-')

  const params = new URLSearchParams()
  dimensions.forEach((d) => params.append('dimensions', d))
  metrics.forEach((m) => params.append('metrics', m))
  params.set('startDate.year', sy)
  params.set('startDate.month', String(Number(sm)))
  params.set('startDate.day', String(Number(sd)))
  params.set('endDate.year', ey)
  params.set('endDate.month', String(Number(em)))
  params.set('endDate.day', String(Number(ed)))
  // 첫 번째 지표 내림차순. DATE 차원일 때는 날짜순이 자연스러워 정렬을 생략한다.
  if (!dimensions.includes('DATE')) {
    params.append('orderBy', `-${metrics[0]}`)
  }

  const report = await call(
    token,
    `${BASE}/${account}/reports:generate?${params}`,
  )

  let rows = report.rows || []
  // API 필터(filters=)는 차원별 문법이 제각각이라 응답 후 거른다.
  // 행 수가 많지 않아 성능 문제도 없다.
  if (contains) {
    rows = rows.filter((r) => (r.cells?.[0]?.value ?? '').includes(contains))
  }

  const currency = report.headers?.find((h) => h.currencyCode)?.currencyCode

  console.log(`기간 ${startDate} ~ ${endDate} / 계정 ${account}`)
  if (contains) console.log(`필터 ${dimensions[0]} contains "${contains}"`)
  console.log(
    `행 ${rows.length}${report.totalMatchedRows ? ` / 전체 ${report.totalMatchedRows}` : ''}${
      currency ? ` / 통화 ${currency}` : ''
    }\n`,
  )

  // 합계는 필터 전 전체 기준이라, 필터를 걸었으면 표시하지 않는다.
  if (!contains && report.totals?.cells) {
    const totals = report.totals.cells
      .slice(dimensions.length)
      .map((c, i) => `${metrics[i]} ${toNumber(c).toLocaleString()}`)
    if (totals.length) console.log(`합계: ${totals.join(' / ')}\n`)
  }

  console.log(
    [
      ...dimensions.map((d) => d.slice(0, 44).padEnd(44)),
      ...metrics.map((m) => m.slice(0, 14).padStart(15)),
    ].join(''),
  )

  rows.slice(0, limit).forEach((r) => {
    const cells = r.cells ?? []
    const dims = cells
      .slice(0, dimensions.length)
      .map((c) => String(c.value ?? '').slice(0, 44).padEnd(44))
    const mets = cells.slice(dimensions.length).map((c) => {
      const n = toNumber(c)
      if (!Number.isFinite(n)) return '-'.padStart(15)
      return (Number.isInteger(n) ? String(n) : n.toFixed(2)).padStart(15)
    })
    console.log([...dims, ...mets].join(''))
  })
  if (rows.length > limit) console.log(`... 외 ${rows.length - limit}행`)

  const out = arg('json')
  if (out) {
    fs.writeFileSync(out, JSON.stringify(report, null, 2))
    console.log(`\n저장: ${out}`)
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
}

module.exports = { call, resolveAccount }
