const fs = require('fs')
const path = require('path')

const files = [
  '홈화면',
  '도감화면',
  '포켓몬상세화면',
  '포켓몬상세기술화면',
  '기술도감화면',
  '기술도감상세화면',
  '특성도감화면',
  '특성도감상세화면',
  '타입상성계산기화면',
]

const results = []

files.forEach((fileName) => {
  const beforePath = path.join(__dirname, `개선전_${fileName}.json`)
  const afterPath = path.join(__dirname, `개선후_${fileName}.json`)

  try {
    const beforeData = JSON.parse(fs.readFileSync(beforePath, 'utf-8'))
    const afterData = JSON.parse(fs.readFileSync(afterPath, 'utf-8'))

    const beforeAudits = beforeData.audits
    const afterAudits = afterData.audits

    const result = {
      page: fileName,
      before: {
        performance: Math.round(beforeData.categories.performance.score * 100),
        accessibility: Math.round(
          beforeData.categories.accessibility.score * 100,
        ),
        bestPractices: Math.round(
          beforeData.categories['best-practices'].score * 100,
        ),
        seo: Math.round(beforeData.categories.seo.score * 100),
        fcp: beforeAudits['first-contentful-paint'].numericValue,
        lcp: beforeAudits['largest-contentful-paint'].numericValue,
        tbt: beforeAudits['total-blocking-time'].numericValue,
        cls: beforeAudits['cumulative-layout-shift'].numericValue,
        si: beforeAudits['speed-index'].numericValue,
      },
      after: {
        performance: Math.round(afterData.categories.performance.score * 100),
        accessibility: Math.round(
          afterData.categories.accessibility.score * 100,
        ),
        bestPractices: Math.round(
          afterData.categories['best-practices'].score * 100,
        ),
        seo: Math.round(afterData.categories.seo.score * 100),
        fcp: afterAudits['first-contentful-paint'].numericValue,
        lcp: afterAudits['largest-contentful-paint'].numericValue,
        tbt: afterAudits['total-blocking-time'].numericValue,
        cls: afterAudits['cumulative-layout-shift'].numericValue,
        si: afterAudits['speed-index'].numericValue,
      },
    }

    // 개선율 계산
    result.improvement = {
      performance: result.after.performance - result.before.performance,
      accessibility: result.after.accessibility - result.before.accessibility,
      bestPractices: result.after.bestPractices - result.before.bestPractices,
      seo: result.after.seo - result.before.seo,
      fcp: ((result.before.fcp - result.after.fcp) / result.before.fcp) * 100,
      lcp: ((result.before.lcp - result.after.lcp) / result.before.lcp) * 100,
      tbt: ((result.before.tbt - result.after.tbt) / result.before.tbt) * 100,
      cls: ((result.before.cls - result.after.cls) / result.before.cls) * 100,
      si: ((result.before.si - result.after.si) / result.before.si) * 100,
    }

    results.push(result)
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error.message)
  }
})

// 결과 출력
console.log(JSON.stringify(results, null, 2))

// 평균 계산
const avg = {
  before: {
    performance: 0,
    accessibility: 0,
    bestPractices: 0,
    seo: 0,
    fcp: 0,
    lcp: 0,
    tbt: 0,
    cls: 0,
    si: 0,
  },
  after: {
    performance: 0,
    accessibility: 0,
    bestPractices: 0,
    seo: 0,
    fcp: 0,
    lcp: 0,
    tbt: 0,
    cls: 0,
    si: 0,
  },
  improvement: {
    performance: 0,
    accessibility: 0,
    bestPractices: 0,
    seo: 0,
    fcp: 0,
    lcp: 0,
    tbt: 0,
    cls: 0,
    si: 0,
  },
}

results.forEach((result) => {
  Object.keys(avg.before).forEach((key) => {
    avg.before[key] += result.before[key]
    avg.after[key] += result.after[key]
    avg.improvement[key] += result.improvement[key]
  })
})

Object.keys(avg.before).forEach((key) => {
  avg.before[key] = Math.round(avg.before[key] / results.length)
  avg.after[key] = Math.round(avg.after[key] / results.length)
  avg.improvement[key] = Math.round(avg.improvement[key] / results.length)
})

console.log('\n=== 평균 ===')
console.log(JSON.stringify(avg, null, 2))
