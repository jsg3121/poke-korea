성장 실험을 설계하고 Growth Sprint 계획을 수립해줘.

## 트리거

사용자가 "성장 실험", "A/B 테스트", "신규 채널", "스프린트" 등을 요청할 때 자동 트리거

## 입력

- 실험 주제 또는 개선 대상 지표: $ARGUMENTS (인자가 없으면 사용자에게 질문)

## 실행 순서

1. 최근 weekly 분석 결과 로드 (`.claude/outputs/weekly/` 최신 파일)
2. 이전 실험 결과 확인 (`.claude/outputs/experiments/`)
3. growth-strategist 에이전트 실행하여 실험 설계
4. `references/experiment-template.md` 형식으로 `.claude/outputs/experiments/[실험명].md`에 저장

## ICE 점수 기준

- **8~10**: North Star 직접 영향 / 선례 있음 / 1주 이내
- **5~7**: 퍼널 중간 지표 / 논리적 근거 / 2~4주
- **1~4**: 간접 효과 / 가설 수준 / 1개월+

## 주의사항

- 코드를 바로 작성하지 않는다. 실험 설계서만 작성한다.
- 모든 가설은 측정 가능한 형태로 기술한다.
- 이전 실험 결과가 있다면 반드시 참조하여 중복 실험을 방지한다.
