#!/usr/bin/env node
/**
 * Search Console 검색 분석 조회.
 *
 * 사용법:
 *   node .claude/analyzer/scripts/search-console.js [옵션]
 *
 *   --start=YYYY-MM-DD   시작일 (기본: 90일 전)
 *   --end=YYYY-MM-DD     종료일 (기본: 3일 전 — 최근 데이터는 확정 지연이 있다)
 *   --dim=query,page     차원 (기본: query). query|page|country|device|date
 *   --contains=/detail/  page에 이 문자열이 포함된 것만
 *   --limit=1000         행 수 (기본 1000, 최대 25000)
 *   --json=경로           결과를 JSON으로 저장
 *
 * 예:
 *   node ... search-console.js --dim=query --contains=/detail/ --limit=25000 --json=out.json
 *   node ... search-console.js --dim=page --start=2026-08-01
 */

const fs = require('fs')
const { getAccessToken } = require('./google-auth')

const SITE = process.env.SC_SITE || 'sc-domain:poke-korea.com'
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}

const daysAgo = (n) =>
  new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)

/**
 * 검색 분석 질의. rowLimit이 25000을 넘으면 startRow로 페이지네이션한다.
 */
const query = async (body) => {
  const token = await getAccessToken([SCOPE])
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    SITE,
  )}/searchAnalytics/query`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(`Search Console 오류(${res.status}): ${JSON.stringify(json)}`)
  }
  return json.rows || []
}

const main = async () => {
  const dimensions = arg('dim', 'query').split(',')
  const contains = arg('contains')

  const body = {
    startDate: arg('start', daysAgo(90)),
    endDate: arg('end', daysAgo(3)),
    dimensions,
    rowLimit: Number(arg('limit', 1000)),
  }
  if (contains) {
    body.dimensionFilterGroups = [
      {
        filters: [
          { dimension: 'page', operator: 'contains', expression: contains },
        ],
      },
    ]
  }

  const rows = await query(body)
  const clicks = rows.reduce((s, r) => s + r.clicks, 0)
  const impressions = rows.reduce((s, r) => s + r.impressions, 0)

  console.log(`기간 ${body.startDate} ~ ${body.endDate} / 차원 ${dimensions.join(',')}`)
  if (contains) console.log(`필터 page contains "${contains}"`)
  console.log(
    `행 ${rows.length} / 클릭 ${clicks.toLocaleString()} / 노출 ${impressions.toLocaleString()} / CTR ${
      impressions ? ((clicks / impressions) * 100).toFixed(2) : '0.00'
    }%\n`,
  )

  rows.slice(0, 30).forEach((r, i) => {
    const key = r.keys.join(' | ').slice(0, 46).padEnd(46)
    console.log(
      `${String(i + 1).padStart(3)}. ${key} 클릭 ${String(r.clicks).padStart(
        5,
      )} 노출 ${String(r.impressions).padStart(7)} CTR ${(r.ctr * 100)
        .toFixed(2)
        .padStart(5)}% 순위 ${r.position.toFixed(1)}`,
    )
  })
  if (rows.length > 30) console.log(`... 외 ${rows.length - 30}행`)

  const out = arg('json')
  if (out) {
    fs.writeFileSync(out, JSON.stringify(rows, null, 2))
    console.log(`\n저장: ${out}`)
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
}

module.exports = { query }
