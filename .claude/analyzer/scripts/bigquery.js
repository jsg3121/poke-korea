#!/usr/bin/env node
/**
 * BigQuery SQL 조회 (GA4 BigQuery Export).
 *
 * 사용법:
 *   node .claude/analyzer/scripts/bigquery.js [옵션]
 *
 *   --sql="SELECT ..."          실행할 SQL (표준 SQL)
 *   --file=경로.sql              SQL을 파일에서 읽는다 (--sql 대신)
 *   --dry                       dry run만 하고 스캔량을 출력한 뒤 종료
 *   --max-gb=1                  스캔 상한(GB, 기본 1). 넘으면 BigQuery가 실행을 거부한다
 *   --limit=50                  화면에 출력할 행 수 (기본 50, --json에는 전체 저장)
 *   --json=경로                  결과를 JSON으로 저장
 *
 * SQL 안의 {{dataset}}은 `프로젝트.데이터셋`으로 치환된다.
 *   예: FROM `{{dataset}}.events_*` WHERE _TABLE_SUFFIX BETWEEN '20261014' AND '20261028'
 *
 * 실행 전에 항상 dry run으로 스캔량을 먼저 출력한다.
 * GA4 Export 테이블은 일자별(events_YYYYMMDD)이라 _TABLE_SUFFIX로 기간을 좁혀야 스캔량이 준다.
 *
 * 예:
 *   node ... bigquery.js --sql="SELECT event_name, COUNT(*) n FROM \`{{dataset}}.events_*\` GROUP BY 1 ORDER BY 2 DESC"
 */

const fs = require('fs')
const { getAccessToken, DEFAULT_KEY_PATH } = require('./google-auth')

const DATASET = process.env.BQ_DATASET || 'analytics_453267557'
const SCOPE = 'https://www.googleapis.com/auth/bigquery'
const API = 'https://bigquery.googleapis.com/bigquery/v2'

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}
const flag = (name) => process.argv.includes(`--${name}`)

const resolveProject = () => {
  if (process.env.BQ_PROJECT) return process.env.BQ_PROJECT
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || DEFAULT_KEY_PATH
  return JSON.parse(fs.readFileSync(keyPath, 'utf8')).project_id
}

const request = async (token, url, body) => {
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(
      `BigQuery 오류(${res.status}): ${JSON.stringify(json.error ?? json)}`,
    )
  }
  return json
}

const formatBytes = (n) => {
  const v = Number(n)
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)} GB`
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)} MB`
  return `${(v / 1e3).toFixed(1)} KB`
}

const runQuery = async (sql, { maxBytes, dryRun = false } = {}) => {
  const project = resolveProject()
  const token = await getAccessToken([SCOPE])
  const query = sql.replaceAll('{{dataset}}', `${project}.${DATASET}`)

  const dry = await request(token, `${API}/projects/${project}/queries`, {
    query,
    useLegacySql: false,
    dryRun: true,
  })
  const scanned = dry.totalBytesProcessed
  if (dryRun) return { scanned, rows: [], fields: [] }

  let res = await request(token, `${API}/projects/${project}/queries`, {
    query,
    useLegacySql: false,
    maximumBytesBilled: String(maxBytes),
    timeoutMs: 60000,
  })
  const { jobId, location } = res.jobReference
  const resultsUrl = (pageToken) =>
    `${API}/projects/${project}/queries/${jobId}?location=${location}&timeoutMs=60000` +
    (pageToken ? `&pageToken=${pageToken}` : '')

  while (!res.jobComplete) {
    res = await request(token, resultsUrl())
  }

  const fields = res.schema.fields.map((f) => f.name)
  const rows = [...(res.rows ?? [])]
  let pageToken = res.pageToken
  while (pageToken) {
    const page = await request(token, resultsUrl(pageToken))
    rows.push(...(page.rows ?? []))
    pageToken = page.pageToken
  }

  return {
    scanned,
    fields,
    rows: rows.map((r) =>
      Object.fromEntries(r.f.map((cell, i) => [fields[i], cell.v])),
    ),
  }
}

const main = async () => {
  const file = arg('file')
  const sql = file ? fs.readFileSync(file, 'utf8') : arg('sql')
  if (!sql) {
    throw new Error('--sql 또는 --file로 SQL을 지정할 것.')
  }

  const maxBytes = Math.round(Number(arg('max-gb', 1)) * 1e9)
  const { scanned, fields, rows } = await runQuery(sql, {
    maxBytes,
    dryRun: flag('dry'),
  })

  console.log(
    `데이터셋 ${DATASET} / 스캔 ${formatBytes(scanned)} (상한 ${formatBytes(maxBytes)})`,
  )
  if (flag('dry')) return

  const limit = Number(arg('limit', 50))
  console.log(`행 ${rows.length}\n`)
  console.log(fields.map((f) => f.slice(0, 24).padEnd(25)).join(''))
  rows.slice(0, limit).forEach((row) => {
    console.log(
      fields
        .map((f) =>
          String(row[f] ?? '')
            .slice(0, 24)
            .padEnd(25),
        )
        .join(''),
    )
  })

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

module.exports = { runQuery }
