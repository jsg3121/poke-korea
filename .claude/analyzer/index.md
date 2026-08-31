# 분석 데이터

이 폴더는 서비스 분석에 필요한 외부 데이터(애드센스, GA 등)를 관리합니다.

**Search Console·GA4·애드센스는 모두 API로 직접 조회할 수 있습니다.** 수동 다운로드보다 이쪽을 우선하세요 — 아래 "Google API 연동" 절을 참고하면 항상 최신 데이터를 얻을 수 있습니다.

## 폴더 구조

```text
.claude/analyzer/
├── index.md                          # 이 파일
├── scripts/                          # API 조회 스크립트 (버전 관리 대상)
│   ├── google-auth.js                #   토큰 발급 (서비스 계정 / OAuth 양쪽)
│   ├── search-console.js             #   Search Console 검색 분석
│   ├── ga4.js                        #   GA4 리포트
│   ├── adsense.js                    #   애드센스 리포트
│   └── adsense-authorize.js          #   애드센스 OAuth 최초 인증 (1회용)
├── 광고이름_id.txt                    # 광고 슬롯 ID 매핑
└── *.csv                             # 과거 수동 다운로드 데이터 (API로 대체됨)
```

> `.claude/analyzer/*.*`는 `.gitignore` 대상이라 **직속 데이터 파일은 커밋되지 않습니다.** `scripts/` 하위는 확장자 패턴에 걸리지 않아 정상 추적됩니다.

## 데이터 설명

### 애드센스 보고서

- **출처**: AdSense Management API (`adsense.js`)
- **갱신 주기**: 조회 시점 기준 최신
- **주요 지표**: 페이지별 노출수, 클릭수, RPM, 예상 수익

### GA 페이지 데이터

- **출처**: Google Analytics 4
- **갱신 주기**: 필요 시 수동 다운로드
- **주요 지표**: 페이지 조회수, 사용자 수, 평균 체류 시간

### 광고 슬롯 ID 매핑

- 각 광고 컴포넌트의 `data-ad-slot` ID와 위치 매핑
- 새 광고 슬롯 추가 시 여기에 기록

## Google API 연동

Search Console과 GA4를 API로 직접 조회합니다. zip·CSV를 수동으로 내려받아 올릴 필요가 없고, 조회 시점 기준 최신 데이터를 얻습니다.

### 왜 API인가

수동 다운로드 파일은 **받은 시점에 고정**됩니다. 실제로 이 폴더의 서치콘솔 zip은 2026-08-03 기준이라, 이후 변화를 반영하지 못합니다. 또 CSV는 상위 N행만 담기는 경우가 많아 롱테일 분석이 불가능합니다 — API는 검색어 25,000행까지 한 번에 받을 수 있습니다.

### GA4·Search Console 사전 준비 (최초 1회, 사람이 직접)

에이전트가 대신할 수 없는 단계입니다. 브라우저 작업이 필요합니다.

1. **GCP 프로젝트에서 API 활성화** — `Google Search Console API`, `Google Analytics Data API`
2. **서비스 계정 생성 + JSON 키 발급** — IAM 및 관리자 → 서비스 계정 → 키 추가(JSON)
3. **속성에 서비스 계정 이메일 추가**
   - Search Console: 설정 → 사용자 및 권한 → 권한 `제한됨`(읽기 전용으로 충분)
   - GA4: 관리 → 속성 액세스 관리 → 역할 `뷰어`
4. **키 파일을 저장소 밖에 배치**

```bash
mkdir -p ~/.config/poke-korea
mv ~/Downloads/<발급받은키>.json ~/.config/poke-korea/gcp-service-account.json
chmod 600 ~/.config/poke-korea/gcp-service-account.json
```

> **키 파일을 저장소 안에 두지 마세요.** 서비스 계정 비밀키는 유출되면 분석 데이터 접근 권한이 통째로 넘어갑니다. `~/.config/` 같은 홈 디렉토리에 두고 경로만 참조합니다. 스크립트는 이 경로를 기본값으로 쓰며, `GOOGLE_APPLICATION_CREDENTIALS` 환경변수로 덮어쓸 수 있습니다.

### 애드센스만 인증 방식이 다르다

**애드센스는 서비스 계정을 쓸 수 없습니다.** 공식 문서가 명시합니다.

> "Note that AdSense doesn't support Service Accounts, instead you must use the Installed Application flow."
> — [Make direct requests](https://developers.google.com/adsense/management/direct_requests)

GA4·Search Console은 속성에 서비스 계정 이메일을 사용자로 추가할 수 있지만, 애드센스 계정은 소유자 1인에게 귀속되는 수익 계정이라 제3자 주체를 추가하는 개념이 없습니다. 그래서 **본인이 브라우저에서 한 번 동의한 리프레시 토큰**으로만 접근합니다.

두 방식은 나란히 공존합니다. `google-auth.js`가 함수 두 개를 제공하고, 각 스크립트가 필요한 쪽을 씁니다.

```text
google-auth.js
├── getAccessToken()                  → search-console.js, ga4.js
└── getAccessTokenFromRefreshToken()  → adsense.js
```

#### 애드센스 사전 준비 (최초 1회, 사람이 직접)

1. **AdSense Management API 활성화** — GA4·Search Console과 같은 GCP 프로젝트에서
2. **OAuth 클라이언트 ID 발급** — 유형은 반드시 **데스크톱 앱**
   - 웹 애플리케이션 유형은 루프백 포트를 미리 등록해야 해서 맞지 않습니다
3. **동의 화면을 프로덕션으로 게시** ⚠️
   - 브랜딩에 앱 이름·지원 이메일·홈페이지 URL·개인정보처리방침 URL이 모두 필요합니다
   - **테스트 상태로 두면 리프레시 토큰이 7일 후 만료**됩니다. 게시하면 해제됩니다
   - "확인되지 않은 앱" 경고는 무시해도 됩니다 — 본인 계정만 쓰는 100명 미만 개인 사용은 [심사 면제](https://support.google.com/cloud/answer/13464323) 대상입니다
4. **클라이언트 JSON 배치 후 인증 실행**

```bash
mv ~/Downloads/client_secret_*.json ~/.config/poke-korea/adsense-client.json
chmod 600 ~/.config/poke-korea/adsense-client.json

node .claude/analyzer/scripts/adsense-authorize.js
```

브라우저가 열리면 동의합니다. 토큰이 `~/.config/poke-korea/adsense-oauth.json`에 저장되고, **이후로는 자동 갱신**되어 재실행할 일이 없습니다.

> `invalid_grant` 오류가 반복되면 동의 화면이 '테스트 중'으로 되돌아갔는지 확인하세요. 그 상태에서는 7일마다 조용히 깨집니다.

### 자격증명 관리 규약

**스크립트와 자격증명은 분리한다.** 스크립트는 버전 관리하고, 비밀값은 저장소 밖에 둔 뒤 경로만 참조한다.

| 대상 | 위치 | 커밋 |
| --- | --- | --- |
| 조회 스크립트 (`scripts/*.js`) | `.claude/analyzer/scripts/` | O |
| 서비스 계정 키 | `~/.config/poke-korea/gcp-service-account.json` | X |
| OAuth 클라이언트 시크릿 | `~/.config/poke-korea/adsense-client.json` | X |
| OAuth 리프레시 토큰 | `~/.config/poke-korea/adsense-oauth.json` | X |

새 스크립트를 추가할 때도 **비밀값을 파일에 직접 쓰지 않는다.** 토큰을 저장해야 하면 위 규약대로 `~/.config/poke-korea/` 아래에 쓰고 `chmod 600`을 건다.

`.gitignore`에 `*service-account*.json`, `gcp-*.json`, `*oauth*.json`, `*-client.json`, `client_secret*.json` 방어선이 있어 실수로 저장소 안에 옮겨와도 커밋되지 않는다. 다만 이는 **최후의 안전망일 뿐 1차 규칙이 아니다** — 파일명이 패턴에서 벗어나면 그대로 뚫린다.

> **Why 스크립트는 커밋하는가:** `.claude/analyzer/*.*` 패턴은 폴더 직속 파일(수익 CSV·zip 등 민감 데이터)만 제외한다. `scripts/` 하위는 한 단계 더 들어가 있어 걸리지 않으며, 이는 의도된 설계다. 스크립트에는 비밀값이 없고 경로만 있어 공유해도 안전하며, 버전 관리해야 다른 환경에서 재현할 수 있다.

### 사용법

외부 의존성이 없습니다. Node 내장 모듈만 쓰므로 `npm install` 없이 바로 실행됩니다.

```bash
# 상세 페이지 유입 검색어 전수 (롱테일 분석용)
node .claude/analyzer/scripts/search-console.js \
  --dim=query --contains=/detail/ --limit=25000 --json=/tmp/queries.json

# 페이지별 실적
node .claude/analyzer/scripts/search-console.js --dim=page --limit=50

# 특정 기간
node .claude/analyzer/scripts/search-console.js --start=2026-08-01 --end=2026-08-25

# GA4 랜딩 페이지 행동 지표
node .claude/analyzer/scripts/ga4.js \
  --dim=landingPagePlusQueryString --met=sessions,bounceRate,averageSessionDuration \
  --contains=/detail/

# 애드센스 일자별 수익
node .claude/analyzer/scripts/adsense.js --dim=DATE

# 페이지별 수익성 (RPM 내림차순)
node .claude/analyzer/scripts/adsense.js \
  --dim=PAGE_URL --met=ESTIMATED_EARNINGS,PAGE_VIEWS,PAGE_VIEWS_RPM --limit=50

# 특정 하루만
node .claude/analyzer/scripts/adsense.js --start=2026-08-30 --end=2026-08-30 --dim=DATE
```

옵션 전체는 각 스크립트 상단 주석에 있습니다.

애드센스에서 자주 쓰는 값입니다.

| 축 | 값 |
| --- | --- |
| 차원 | `DATE`, `MONTH`, `PAGE_URL`, `AD_UNIT_NAME`, `COUNTRY_CODE`, `PLATFORM_TYPE_CODE` |
| 지표 | `ESTIMATED_EARNINGS`, `IMPRESSIONS`, `CLICKS`, `PAGE_VIEWS`, `PAGE_VIEWS_RPM`, `IMPRESSIONS_RPM`, `IMPRESSIONS_CTR` |

### 설정값

민감 정보가 아니라 환경변수 기본값으로 두었습니다. 필요 시 덮어쓸 수 있습니다.

| 항목 | 기본값 | 환경변수 |
| --- | --- | --- |
| Search Console 속성 | `sc-domain:poke-korea.com` | `SC_SITE` |
| GA4 속성 ID | `453267557` | `GA4_PROPERTY_ID` |
| 서비스 계정 키 | `~/.config/poke-korea/gcp-service-account.json` | `GOOGLE_APPLICATION_CREDENTIALS` |
| 애드센스 OAuth 토큰 | `~/.config/poke-korea/adsense-oauth.json` | `ADSENSE_OAUTH_PATH` |
| 애드센스 계정 | 첫 번째 계정 자동 선택 | `--account=pub-...` |

### 해석 시 주의

- **종료일은 3일 전이 기본입니다.** Search Console은 최근 며칠 데이터가 확정되지 않아 과소 집계됩니다. 최신일까지 당겨 보면 "최근 급감"으로 오독할 수 있습니다.
- **GA4는 과거 텐센트 봇에 오염된 이력이 있습니다.** 해당 유입은 차단됐으나, 오래된 기간을 조회할 때는 서치콘솔·네이버 지표와 교차 확인하세요.
- **CTR 이상치는 순위와 함께 보세요.** 순위가 좋은데 CTR이 낮으면 랭킹 문제가 아니라 title·description이 검색 의도에 응답하지 못하는 문제입니다.
- **애드센스 수익은 어제까지만 정확합니다.** 공식 문서상 `ESTIMATED_EARNINGS`는 "earnings up to yesterday are accurate"이며, `adsense.js`의 종료일 기본값도 어제입니다. 당일을 포함해 조회하면 과소 집계된 값을 보게 됩니다.
- **애드센스 `PAGE_URL`은 쿼리 파라미터를 포함한 전체 URL입니다.** GA4의 `landingPagePlusQueryString`과 조인하려면 양쪽 다 파라미터를 제거해 키를 맞춰야 합니다.
- **애드센스 통화는 계정 설정을 따릅니다.** 응답 헤더의 `currencyCode`로 확인하세요(현재 USD). 대시보드 표시 통화와 다르면 환율 차이로 숫자가 어긋나 보입니다.

## 활용 사례

1. **애드센스 배치 최적화**: 페이지별 수익 분석 후 광고 위치/크기 조정
2. **트래픽 기반 우선순위**: 방문자 많은 페이지에 광고 집중 배치
3. **A/B 테스트 기준**: 변경 전후 RPM 비교

## 주의사항

- **서비스 계정 키를 저장소에 커밋하지 말 것.** `~/.config/poke-korea/`에 두고 경로만 참조한다
- 수익 관련 데이터는 민감 정보이므로 `.gitignore`에 추가
- 데이터 갱신 시 파일명에 날짜 포함 또는 기존 파일 덮어쓰기
- API 조회 결과(JSON)는 스크래치패드나 `/tmp`에 저장한다. 이 폴더에 두면 `.gitignore`에 걸려 어차피 추적되지 않는다
- 분석 결과는 `.claude/research/reports/`에 보고서로 정리
