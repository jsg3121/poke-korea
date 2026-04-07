주간 성장 리뷰를 수행하고 핵심 지표를 점검해줘.

## 트리거

사용자가 "주간 리뷰", "이번 주 지표", "성장 현황" 등을 요청할 때 자동 트리거

## 입력

- 리뷰 기간: $ARGUMENTS (인자가 없으면 최근 1주)

## 실행 순서

1. **병렬 실행**: growth-analyst, competitive-watcher, user-insight-analyst 동시 실행
2. **취합**: 세 결과를 growth-strategist에게 전달하여 종합 분석
3. **저장**: `.claude/outputs/weekly/YYYY-MM-DD.md`에 저장

## 체크리스트

- 핵심 지표 현황 (`references/metrics-definition.md` 참조)
- 지난 주 실험 결과 (`.claude/outputs/experiments/`)
- 경쟁사 주요 변화
- 사용자 VOC 주요 테마
- 이번 주 집중 액션 3가지

## 주의사항

- 데이터가 없는 항목은 "데이터 미확보"로 표기하고 수집 방안을 제안한다.
- 이전 주간 리뷰가 있다면 비교 분석을 포함한다.
