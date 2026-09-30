---
name: create-pr
description: |
  PR 생성 스킬. 사용자가 선택한 검증 옵션에 따라 조건부로 품질 검증 후 PR을 생성한다.
  TRIGGER when: "PR 만들어줘", "PR 생성", "풀 리퀘스트 만들어줘", 작업 완료 후 PR 생성 필요
  DO NOT TRIGGER when: 커밋만 필요(/commit 사용), 코드 리뷰만 필요(code-review 사용), 브랜치 생성/전환만 필요
---

# PR 생성 스킬

검증 옵션을 사용자에게 선택받아 조건부로 실행한 뒤 PR을 생성한다.

```text
1. 상태 확인  →  2. 검증 옵션 선택  →  3. 조건부 검증  →  4. PR 생성
   (브랜치·변경)     (AskUserQuestion)     (선택 항목만)      (확인 후 실행)
```

---

## Phase 1: 상태 확인

```bash
git branch --show-current
git status
git log --oneline -10
```

**대상 브랜치를 사용자에게 확인한다.**

- 작업 브랜치(`feature/{version}-{작업명}`) → 버전 루트(`feature/{version}`): 세부 기능 단위 PR
- 버전 루트(`feature/{version}`) → `main`: 릴리즈 PR

---

## Phase 2: 검증 옵션 선택

`AskUserQuestion`으로 `multiSelect: true` 질문을 만들어 선택받는다. 선택지 3종:

| 옵션         | 설명 (사용자에게 보일 문구)                                                      |
| ------------ | -------------------------------------------------------------------------------- |
| QA 종합 검증 | qa-orchestrator가 필요한 검사만 병렬 실행하고 통합 판정합니다                    |
| 정적 분석만  | ESLint, Prettier, TypeScript 타입 검사만 빠르게 실행합니다                       |
| E2E 테스트   | Playwright로 E2E 테스트를 실행합니다 (빌드 포함)                                 |

### 기본값 정책

| 대상 브랜치 | 기본 선택                       | 이유             |
| ----------- | ------------------------------- | ---------------- |
| `main`      | QA 종합 검증 권장               | 릴리즈 품질 보장 |
| 그 외       | 모두 미선택 (검증 없이 바로 PR) | 빠른 피드백 루프 |

"Other" 입력은 유연하게 해석한다 — "린트만"→정적 분석, "전체"/"다"→QA+E2E, "스킵"/"없음"→검증 없이 진행.

---

## Phase 3: 조건부 검증

선택된 옵션만 실행한다. **실행 절차와 판정 처리는 `references/verification.md`를 읽고 따른다.**

검증에서 차단 판정(⛔ 또는 에러)이 나오면 PR 생성을 중단하고 보고한다.

---

## Phase 4: PR 생성

### 4.1 변경 사항 분석

```bash
git diff {대상 브랜치}...HEAD --stat
git log {대상 브랜치}...HEAD --oneline
```

### 4.2 본문 작성

`templates/pr-template.md`를 기반으로 작성한다.

- 변경 사항에 해당하는 작업 유형은 `[x]`로 체크한다
- **해당하지 않는 작업 유형도 삭제하지 않고** `[ ]` 상태로 유지한다

### 4.3 제목과 라벨

제목은 Conventional Commits 형식을 따른다.

```text
feat: 포켓몬 상세 페이지 타입 상성 표 추가
fix: 도감 검색 시 다른 쿼리 파라미터가 유실되는 문제 수정
```

라벨은 체크된 작업 유형에 대응시킨다.

| 작업 유형           | 라벨              |
| ------------------- | ----------------- |
| ✨ 새 기능          | `feature`         |
| 🐛 버그 수정        | `bug`             |
| 🚨 핫픽스           | `hotfix`          |
| 🔧 리팩토링         | `refactor`        |
| 🚀 성능 개선        | `performance`     |
| 🔍 SEO 개선         | `seo`             |
| 🎨 디자인 변경      | `design`          |
| 📝 문서             | `documentation`   |
| 🔨 Breaking Changes | `breaking-change` |

### 4.4 실행

제목·본문·라벨·대상 브랜치를 사용자에게 보여주고 **확인을 받은 후** 실행한다.

```bash
gh pr create \
  --base {대상 브랜치} \
  --title "{PR 제목}" \
  --body "$(cat <<'EOF'
{PR 본문}
EOF
)" \
  --label "{라벨1}" --label "{라벨2}"
```

완료 후 생성된 PR URL을 전달한다.

---

## 참고

- 검증 절차 상세: `references/verification.md`
- PR 템플릿: `templates/pr-template.md`
- 워크플로우 컨벤션: `.claude/conventions/guides/workflow.md`
- QA 오케스트레이터: `.claude/agents/qa-orchestrator.md`
