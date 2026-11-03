# 표준 쿼리

자주 묻는 질문별 조회 명령이다. 모두 프로젝트 루트에서 실행한다. 경로 접두사 `node .claude/analyzer/scripts/`는 아래에서 생략한다.

`ga4.js`·`search-console.js`에는 기간 전체 합계 옵션이 없다. **합계는 행이 적은 차원(월, 디바이스)으로 나눠 받아 더하거나, 스크립트가 출력하는 합계 줄을 쓴다.**

## 규모

| 질문 | 명령 |
| --- | --- |
| 월별 활성 사용자·세션·PV | `ga4.js --start=YYYY-MM-01 --dim=yearMonth --met=activeUsers,sessions,screenPageViews` |
| 일별 추이 | `ga4.js --start=28daysAgo --dim=date --met=activeUsers,sessions --limit=60` |
| 신규·재방문 | `ga4.js --start=28daysAgo --dim=newVsReturning --met=activeUsers,sessions,screenPageViews` |
| 디바이스 | `ga4.js --start=28daysAgo --dim=deviceCategory --met=activeUsers,sessions` |

월별 `activeUsers`는 그 달의 순 활성 사용자(MAU)다. 일별 값을 더하면 중복이 생기므로 MAU를 일별 합으로 구하지 않는다.

## 유입

| 질문 | 명령 |
| --- | --- |
| 채널·소스 | `ga4.js --start=28daysAgo --dim=sessionDefaultChannelGroup,sessionSource --met=sessions,activeUsers --limit=20` |
| 랜딩 페이지 | `ga4.js --start=28daysAgo --dim=landingPage --met=sessions,engagementRate --limit=30` |
| 특정 라우트 랜딩 | `ga4.js --start=28daysAgo --dim=landingPage --met=sessions --contains=/type-effectiveness` |

## 검색 (Search Console, Google만)

| 질문 | 명령 |
| --- | --- |
| 전체 클릭·노출·CTR·순위 | `search-console.js --start=YYYY-MM-DD --dim=device` (출력 첫 줄이 전체 합계, 순위는 디바이스별) |
| 페이지별 실적 | `search-console.js --dim=page --limit=50` |
| 라우트별 검색어 | `search-console.js --dim=query --contains=/detail/ --limit=25000 --json=<스크래치패드>/q.json` |
| 페이지×검색어 | `search-console.js --dim=page,query --contains=/type-effectiveness/ --limit=1000` |

`search-console.js`의 `--start`는 날짜만 받는다. 종료일 기본값이 3일 전이므로 28일 창은 `--start`를 31일 전 날짜로 준다.

## 수익 (애드센스)

| 질문 | 명령 |
| --- | --- |
| 월별 수익·RPM | `adsense.js --start=YYYY-MM-01 --dim=MONTH --met=ESTIMATED_EARNINGS,PAGE_VIEWS,PAGE_VIEWS_RPM` |
| 페이지별 수익성 | `adsense.js --dim=PAGE_URL --met=ESTIMATED_EARNINGS,PAGE_VIEWS,PAGE_VIEWS_RPM --limit=50` |
| 광고 단위별 | `adsense.js --dim=AD_UNIT_NAME --met=ESTIMATED_EARNINGS,IMPRESSIONS,IMPRESSIONS_CTR` |

## 커스텀 이벤트 (BigQuery)

이벤트 정의는 `src/`의 `trackEvent` 호출부와 `.claude/conventions/guides/coding.md` "분석 이벤트 전송"이 권위 원본이다.

```bash
# 이벤트별 건수 (기간은 _TABLE_SUFFIX로 좁힌다)
bigquery.js --sql="SELECT event_name, COUNT(*) n FROM \`{{dataset}}.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN 'YYYYMMDD' AND 'YYYYMMDD' GROUP BY 1 ORDER BY 2 DESC"

# 이벤트 매개변수별 집계 (예: 상세 능력치 탭 전환)
bigquery.js --sql="SELECT (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'tab') tab,
  COUNT(*) n FROM \`{{dataset}}.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN 'YYYYMMDD' AND 'YYYYMMDD' AND event_name = 'stats_tab_status'
  GROUP BY 1 ORDER BY 2 DESC"

# 이벤트를 쓴 사용자 수
bigquery.js --sql="SELECT event_name, COUNT(DISTINCT user_pseudo_id) users FROM \`{{dataset}}.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN 'YYYYMMDD' AND 'YYYYMMDD'
    AND event_name IN ('use_type_calc','use_name_search','stats_tab_status')
  GROUP BY 1"
```

숫자 매개변수는 `value.int_value`, 문자열은 `value.string_value`에 들어 있다. 어느 쪽인지 모르면 두 값을 함께 SELECT해 본다.

BigQuery Export는 2026-10-14부터 쌓였다. 그 이전 이벤트 건수는 `ga4.js --dim=eventName --met=eventCount`로 조회한다(매개변수별 분해는 GA4 맞춤 측정기준 등록 후에만 가능).
