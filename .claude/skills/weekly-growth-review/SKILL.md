주간 성장 리뷰를 수행하고 핵심 지표를 점검해줘.

## 트리거

이 스킬은 다음 상황에서 자동으로 트리거됩니다:
- 사용자가 "주간 리뷰", "이번 주 지표", "성장 현황" 등을 요청할 때
- 주간 단위 지표 점검이 필요할 때

## 입력

- 리뷰 기간: $ARGUMENTS (인자가 없으면 최근 1주)

## 실행 순서

1. **병렬 실행**: growth-analyst, competitive-watcher, user-insight-analyst 세 에이전트를 동시에 실행
   - growth-analyst: 핵심 지표 현황 분석
   - competitive-watcher: 경쟁사 동향 확인
   - user-insight-analyst: 사용자 행동 패턴 및 VOC 분석
2. **취합**: 세 결과를 growth-strategist에게 전달
3. **전략 도출**: growth-strategist가 종합 분석 및 액션 플랜 수립
4. **저장**: 결과를 `.claude/outputs/weekly/[날짜].md`에 저장

## 주간 리뷰 체크리스트

- [ ] 핵심 지표 기준값 대비 현황 (`references/metrics-definition.md` 참조)
- [ ] 지난 주 실험 결과 확인 (`.claude/outputs/experiments/` 참조)
- [ ] 경쟁사 주요 변화 사항
- [ ] 사용자 VOC 주요 테마
- [ ] 이번 주 집중 액션 3가지

## 출력 형식

```
## 주간 성장 리뷰: {기간}

### 1. 핵심 지표 현황
{growth-analyst 결과 요약}

### 2. 경쟁 환경 변화
{competitive-watcher 결과 요약}

### 3. 사용자 인사이트
{user-insight-analyst 결과 요약}

### 4. 이번 주 액션 플랜
{growth-strategist 결과 — ICE 점수 기반 Top 3}

### 5. 지난 주 실험 결과 (해당 시)
{이전 실험 진행 상황 및 결과}
```

## 주의사항

- 데이터가 없는 항목은 "데이터 미확보"로 표기하고, 데이터 수집 방안을 제안한다
- 이전 주간 리뷰(`.claude/outputs/weekly/`)가 있다면 비교 분석을 포함한다
- 결과 파일명 형식: `YYYY-MM-DD.md` (리뷰 실행일 기준)
