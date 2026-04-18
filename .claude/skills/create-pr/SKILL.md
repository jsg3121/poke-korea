---
name: create-pr
description: |
  PR 생성 스킬. 사용자가 선택한 검증 옵션에 따라 조건부로 품질 검증 후 PR을 생성한다.
  TRIGGER when: "PR 만들어줘", "PR 생성", "풀 리퀘스트 만들어줘", 작업 완료 후 PR 생성 필요
  DO NOT TRIGGER when: 커밋만 필요(/commit 사용), 코드 리뷰만 필요(code-review 사용), 브랜치 생성/전환만 필요
disable-model-invocation: true
---

# PR 생성 스킬

사용자가 선택한 검증 옵션에 따라 조건부로 품질 검증을 수행하고 PR을 생성한다.

## 전체 플로우

```
┌─────────────────────────────────────────────────────────────┐
│                       create-pr                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 현재 상태 확인 (브랜치, 변경 사항)                         │
│                     ▼                                       │
│  2. 대상 브랜치 확인                                         │
│                     ▼                                       │
│  3. 검증 옵션 선택 (사용자 확인)                              │
│     ┌─────────────────────────────────────────┐             │
│     │ □ 정적 분석 (lint, format, type-check) │             │
│     │ □ 코드 리뷰                            │             │
│     │ □ 단위 테스트                          │             │
│     │ □ E2E 테스트                           │             │
│     └─────────────────────────────────────────┘             │
│                     ▼                                       │
│  4. [선택 시] 해당 검증 실행                                 │
│                     ▼                                       │
│  5. [이슈 발견 시] 보고 + 계속 여부 확인                      │
│                     ▼                                       │
│  6. PR 본문 작성 + 생성                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: 상태 확인

### 1.1 현재 상태 확인

```bash
git branch --show-current
git status
git log --oneline -10
```

### 1.2 대상 브랜치 확인

사용자에게 어느 브랜치로 머지할 것인지 확인한다.

- 하위 작업 브랜치 → `release/{version}`: 세부 기능 단위 PR
- `release/{version}` → `main`: 릴리즈 PR

---

## Phase 2: 검증 옵션 선택

### 2.1 AskUserQuestion으로 검증 옵션 선택받기

`AskUserQuestion` 도구를 사용하여 체크박스 형태로 검증 옵션을 선택받는다.

```json
{
  "questions": [
    {
      "question": "PR 생성 전 어떤 검증을 실행할까요?",
      "header": "검증 옵션",
      "multiSelect": true,
      "options": [
        {
          "label": "전체 QA",
          "description": "QA agent를 이용해 모든 검증, 테스트 과정을 실행합니다"
        },
        {
          "label": "정적 분석",
          "description": "ESLint, Prettier, TypeScript 타입 검사를 실행합니다"
        },
        {
          "label": "코드 리뷰",
          "description": "서브에이전트가 변경 코드를 검토하여 잠재적 이슈를 찾습니다"
        },
        {
          "label": "단위 테스트",
          "description": "Vitest로 단위 테스트를 실행합니다"
        },
        {
          "label": "E2E 테스트",
          "description": "Playwright로 E2E 테스트를 실행합니다 (빌드 포함)"
        }
      ]
    }
  ]
}
```

### 2.2 기본값 정책

| 대상 브랜치 | 기본 선택 | 이유 |
|------------|----------|------|
| `main` | 정적 분석 + 단위 테스트 선택 권장 | 릴리즈 품질 보장 |
| 그 외 | 모두 미선택 (검증 없이 바로 PR) | 빠른 피드백 루프 |

**main 머지 시 안내 메시지:**
> "main 브랜치로 머지하는 PR입니다. 정적 분석과 단위 테스트를 권장합니다."

**그 외 브랜치 머지 시:**
> "검증 없이 바로 PR을 생성하거나, 필요한 검증을 선택하세요."

### 2.3 사용자가 "Other"를 선택한 경우

사용자 입력에 따라 유연하게 대응한다:
- "전체 QA" → qa-agent 호출
- "린트만" → 정적 분석만 실행
- "스킵" / "없음" → 검증 없이 PR 생성

---

## Phase 3: 조건부 검증 실행

사용자가 선택한 옵션에 따라 해당 검증만 실행한다.

### 3.1 정적 분석 (선택 시)

변경된 파일을 대상으로 실행한다:

```bash
# 변경된 파일 목록
git diff {대상 브랜치}...HEAD --name-only --diff-filter=ACMR

# Prettier 검사
pnpm prettier --check {변경된 파일들}

# ESLint 검사
pnpm eslint {변경된 ts/svelte/astro 파일들}

# TypeScript 타입 검사
pnpm astro check
```

**이슈 발견 시:**
- 에러 목록을 보고한다
- 자동 수정 가능 여부를 안내한다
- **에러(error)가 있으면 PR 생성을 중단**한다. 경고(warn)는 사용자 판단에 맡긴다

### 3.2 코드 리뷰 (선택 시)

서브에이전트를 생성하여 **사전 맥락 없이** 변경된 코드만으로 리뷰한다:

```
Agent({
  subagent_type: "general-purpose",
  prompt: "다음 변경 사항을 코드 리뷰해주세요. 잠재적 이슈, 타입 안전성, 코드 품질을 검토하고 심각도별로 분류해주세요.\n\n{diff 내용}"
})
```

**검토 항목:**
- 잠재적 이슈 (런타임 에러, 로직 오류, 보안 취약점)
- 코드 개선 제안 (복잡도, 중복, 가독성)
- 타입 안전성 (any 사용, as 단언, 타입 가드 누락)

**이슈 발견 시:**
- 심각도별(심각/권장/참고)로 분류하여 보고
- 심각 이슈가 있으면 수정을 권고하고 계속 여부를 확인

### 3.3 단위 테스트 (선택 시)

```bash
pnpm vitest run
```

**실패 시:**
- 실패한 테스트 목록을 보고
- 계속 여부를 사용자에게 확인 (main 머지 시에는 중단 권고)

### 3.4 E2E 테스트 (선택 시)

```bash
pnpm build && pnpm playwright test
```

**실패 시:**
- 실패한 테스트 목록을 보고
- 계속 여부를 사용자에게 확인 (main 머지 시에는 중단 권고)

### 3.5 검증 결과 요약

모든 선택된 검증이 완료되면 요약을 보고한다:

```markdown
## 검증 결과 요약

| 검증 항목 | 결과 | 상세 |
|----------|------|------|
| 정적 분석 | ✅ 통과 | - |
| 코드 리뷰 | ⚠️ 권장 2건 | 타입 개선 제안 |
| 단위 테스트 | ✅ 통과 | 12/12 |
| E2E 테스트 | - | 미선택 |
```

---

## Phase 4: PR 생성

### 4.1 변경 사항 분석

```bash
git diff {대상 브랜치}...HEAD --stat
git log {대상 브랜치}...HEAD --oneline
```

### 4.2 PR 본문 작성

`.claude/conventions/templates/pr-template.md` 템플릿을 기반으로 작성한다.

**작업 유형 체크 규칙:**
- 변경 사항에 해당하는 작업 유형은 `[x]`로 체크한다
- **해당하지 않는 작업 유형도 삭제하지 않고** `[ ]` 상태로 유지한다

```markdown
## 📋 작업 유형

- [x] ✨ 새 기능 (New Feature)
- [ ] 🐛 버그 수정 (Bug Fix)
- [ ] 🚨 핫픽스 (Hotfix)
- [x] 🔧 리팩토링 (Refactoring)
- [ ] 🚀 성능 개선 (Performance)
- [ ] 🔍 SEO 개선 (SEO)
- [ ] 🎨 디자인 변경 (Design)
- [ ] 📝 문서 (Documentation)
- [ ] 🔨 Breaking Changes
```

### 4.3 PR 라벨 매핑

체크된 작업 유형에 맞는 라벨을 부여한다:

| 작업 유형 | 라벨 |
|----------|------|
| ✨ 새 기능 | `feature` |
| 🐛 버그 수정 | `bug` |
| 🚨 핫픽스 | `hotfix` |
| 🔧 리팩토링 | `refactoring` |
| 🚀 성능 개선 | `performance` |
| 🔍 SEO 개선 | `seo` |
| 🎨 디자인 변경 | `design` |
| 📝 문서 | `documentation` |
| 🔨 Breaking Changes | `breaking-change` |

### 4.4 PR 제목

Conventional Commits 형식을 따른다:

```
feat: 설정 생성기 ESLint 옵션 UI 구현
fix: ZIP 다운로드 시 빈 파일이 포함되는 문제 수정
```

### 4.5 PR 생성 실행

사용자에게 제목, 본문, 라벨, 대상 브랜치를 보여주고 확인을 받은 후 실행한다:

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

### 4.6 완료 후

생성된 PR URL을 사용자에게 전달한다.

---

## 검증 옵션별 토큰 비용

| 옵션 | 실행 방식 | 토큰 비용 | 소요 시간 |
|------|----------|----------|----------|
| 정적 분석 | Bash 직접 실행 | 낮음 | ~10초 |
| 코드 리뷰 | 서브에이전트 | 중간 | ~30초 |
| 단위 테스트 | Bash 직접 실행 | 낮음 | ~15초 |
| E2E 테스트 | Bash 직접 실행 | 중간 | ~60초 (빌드 포함) |

**토큰 절약 팁:**
- 단순 버그 수정, 스타일 변경: 검증 없이 바로 PR
- 로직 변경이 있는 기능: 정적 분석 + 단위 테스트
- 릴리즈 PR: 전체 검증 권장

---

## 참고

- PR 템플릿: `.claude/conventions/templates/pr-template.md`
- 워크플로우 컨벤션: `.claude/conventions/guides/workflow.md`
- 코드 리뷰 스킬: `.claude/skills/code-review/SKILL.md`
- QA 에이전트: `.claude/agents/qa-agent.md`
