#!/usr/bin/env node
/**
 * GA4 Data API 리포트 조회.
 *
 * 사용법:
 *   node .claude/analyzer/scripts/ga4.js [옵션]
 *
 *   --start=YYYY-MM-DD          시작일 (기본: 90일 전). "28daysAgo" 같은 상대 표기도 가능
 *   --end=YYYY-MM-DD            종료일 (기본: yesterday)
 *   --dim=landingPagePlusQueryString   차원(쉼표 구분)
 *   --met=sessions,bounceRate   지표(쉼표 구분, 기본 sessions)
 *   --contains=/detail/         첫 번째 차원에 이 문자열이 포함된 것만
 *   --limit=50                  행 수 (기본 50)
 *   --json=경로                  결과를 JSON으로 저장
 *
 * 자주 쓰는 차원: landingPagePlusQueryString, pagePath, sessionSource,
 *                sessionMedium, deviceCategory, country
 * 자주 쓰는 지표: sessions, activeUsers, screenPageViews, bounceRate,
 *                averageSessionDuration, engagementRate
 *
 * 예:
 *   node ... ga4.js --dim=landingPagePlusQueryString --met=sessions,bounceRate --contains=/detail/
 */

const fs = require('fs')
const { getAccessToken } = require('./google-auth')

const PROPERTY = process.env.GA4_PROPERTY_ID || '453267557'
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly'

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}

const daysAgo = (n) =>
  new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)

const runReport = async (body) => {
  const token = await getAccessToken([SCOPE])
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )
  const json = await res.json()
  if (!res.ok) {
    throw new Error(`GA4 오류(${res.status}): ${JSON.stringify(json)}`)
  }
  return json
}

const main = async () => {
  const dimensions = arg('dim', 'landingPagePlusQueryString').split(',')
  const metrics = arg('met', 'sessions').split(',')
  const contains = arg('contains')

  const body = {
    dateRanges: [{ startDate: arg('start', daysAgo(90)), endDate: arg('end', 'yesterday') }],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: metrics.map((name) => ({ name })),
    orderBys: [{ metric: { metricName: metrics[0] }, desc: true }],
    limit: Number(arg('limit', 50)),
  }
  if (contains) {
    body.dimensionFilter = {
      filter: {
        fieldName: dimensions[0],
        stringFilter: { matchType: 'CONTAINS', value: contains },
      },
    }
  }

  const report = await runReport(body)
  const rows = report.rows || []

  console.log(
    `기간 ${body.dateRanges[0].startDate} ~ ${body.dateRanges[0].endDate} / 속성 ${PROPERTY}`,
  )
  console.log(`행 ${rows.length}\n`)
  console.log(
    [...dimensions.map((d) => d.slice(0, 40).padEnd(40)), ...metrics.map((m) => m.slice(0, 12).padStart(13))].join(''),
  )

  rows.forEach((r) => {
    // 일부 필드가 빠진 행이 섞여도 리포트 전체를 버리지 않는다
    const dims = (r.dimensionValues ?? []).map((v) =>
      String(v.value ?? '').slice(0, 40).padEnd(40),
    )
    const mets = (r.metricValues ?? []).map((v) => {
      const n = Number(v.value)
      if (!Number.isFinite(n)) return '-'.padStart(13)
      return (Number.isInteger(n) ? String(n) : n.toFixed(2)).padStart(13)
    })
    console.log([...dims, ...mets].join(''))
  })

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

module.exports = { runReport }
