# 워크플로우 가이드

## 절대 규칙: main 브랜치 작업 금지

**`main` 브랜치에서는 어떠한 파일 수정·생성·삭제도 수행하지 않는다.** 문서, 코드, changelog, 설정 파일 모두 예외 없다. 머지 외 직접 변경은 금지된다.

### Why

- `main`은 릴리즈 PR을 통해서만 변경되어야 추적성과 changelog 정합성이 보장된다.
- 사용자의 일반 승인("진행해줘", "이대로 해줘")은 변경 내용에 대한 승인이지 main 직접 수정에 대한 승인이 아니다. 변경을 시작하기 전 반드시 작업 브랜치로 분기해야 한다.
- 작업 도중 main에 직접 변경이 누적되면 다음 릴리즈 PR과 충돌이 발생하고, changelog 폴더 구조가 깨진다.

### How to apply

- 작업 요청 수신 시 가장 먼저 `git branch --show-current`로 현재 브랜치를 확인한다.
- `main`이면 **무조건 사용자에게 새 브랜치 생성을 제안**하고, 분기 완료 후에만 Edit/Write/Bash(파일 수정)를 호출한다.
- 사용자가 "main에서 그대로 작업해줘"라고 **명시적으로 지시한 경우에만** 예외를 허용한다(이 경우에도 한 번 더 위험을 안내한다).
- 이미 미커밋 변경이 main에 있는 상태로 작업 요청을 받았다면, `git stash`로 보관 → 브랜치 분기 → `git stash pop`으로 복원 → 작업 계속 순서로 즉시 정상화한다.

## 브랜치 전략

### 브랜치 네이밍 규칙

```text
feature/{version}
예: feature/1.25.0, feature/1.26.0
```

- 모든 새로운 작업은 `feature/{version}` 형식의 브랜치에서 진행
- 버전 번호는 Semantic Versioning 준수
  - **Major (X.0.0)**: 대규모 변경, Breaking Changes
  - **Minor (1.X.0)**: 새로운 기능 추가, 하위 호환성 유지
  - **Patch (1.26.X)**: 버그 수정, 소규모 개선
- 브랜치는 사용자가 직접 생성하므로, 새로운 작업 시작 시 브랜치 생성 여부 확인 필요

### 버전 확인: main에 머지된 마지막 PR 기준

**IMPORTANT**: 다음 버전을 정할 때는 반드시 `origin/main`에 **머지된 마지막 PR의 버전**을 확인한다. 추측하거나 로컬 폴더 목록을 눈대중으로 훑고 정하지 않는다.

```bash
git fetch origin
git log origin/main --oneline | grep -m1 -oE '[0-9]+\.[0-9]+\.[0-9]+'
```

> **Why:** `changelog/blog/` 폴더 목록이나 로컬 브랜치 이름은 근거가 되지 못한다. 로컬에 없는 버전이 원격에 있을 수 있고(원격에서만 머지된 hotfix), `ls | tail`류 출력은 정렬이 사전순이라 `1.58.10`이 `1.58.2`보다 앞에 오는 등 오독하기 쉽다. 실제로 이미 배포된 `1.58.6`을 놓치고 `1.58.1`로 브랜치를 만든 사고가 있었다 — 당시 `ls` 출력에 `1.58.6`이 있었는데도 읽지 않았다. **머지 이력이 유일한 권위 원본이다.**

### 브랜치는 origin/main에서 직접 분기한다

```bash
git fetch origin
git checkout -b feature/{version} origin/main
```

로컬 `main`을 경유하지 않는다. 로컬 main은 뒤처져 있거나 커밋되지 않은 변경이 남아 있을 수 있고, 그 상태에서 분기하면 오염이 그대로 딸려 들어간다.

> **주의:** 이 명령은 시작 커밋만 `origin/main`으로 지정할 뿐 upstream을 설정하지 않는다. push 목적지와는 무관하다 — upstream은 최초 push 때 `git push -u origin {브랜치명}`으로 정해진다.

### push 전 upstream 확인

**CRITICAL**: push하기 전에 **실제 목적지**를 확인한다. 브랜치 이름만으로는 알 수 없다.

```bash
git branch --show-current          # 로컬 브랜치
git rev-parse --abbrev-ref @{upstream}   # 실제 push 대상
```

두 값이 대응하지 않으면 push하지 않는다. 특히 upstream이 `origin/main`인데 현재 브랜치가 main이 아니면 **즉시 교정**한다.

```bash
git branch --unset-upstream
git push -u origin "$(git branch --show-current)"
```

> **Why:** `git push -u origin main`을 한 번이라도 실행하면 그 브랜치의 upstream이 main으로 고정된다. 이후 `git push`는 브랜치 이름이 `feature/A`여도 커밋을 **main에 올린다**. 로컬에서는 브랜치가 A로 보여 정상 같은데 원격 main만 조용히 갱신되는, 사람이 알아채기 가장 어려운 사고다. 실제 사례로 기능 브랜치 작업이 main에 쌓인 적이 있다.
>
> GitHub의 "Require a pull request before merging"이 켜져 있어도 이 확인은 필요하다. 원격 보호는 push가 거부된 뒤에야 알려주므로 개발 중 인지 시점을 주지 못하고, 보호 규칙이 없는 저장소로 같은 습관이 옮겨가면 그대로 사고가 된다.

### 자동 가드 (훅)

위 규칙은 판독에 맡기지 않고 `PreToolUse` 훅으로 강제한다. 설정은 `.claude/settings.json`에 있다.

| 훅 | 대상 | 차단 조건 |
| --- | --- | --- |
| `block-main-branch-edit.sh` | `Write`/`Edit` | 현재 브랜치가 `main`·`master` |
| `guard-git-push.sh` | `Bash` | main을 향하는 push (명시 지정, `HEAD:main` refspec, `--all`/`--mirror`, upstream이 main인 브랜치, 현재 브랜치가 main) |

훅에 차단되면 우회하지 말고 안내된 명령으로 브랜치를 정상화한 뒤 진행한다. 차단 메시지에 교정 명령이 함께 출력된다.

> **Why:** "main에서 작업하지 않는다"는 규칙은 이미 CLAUDE.md에 절대 규칙으로 있었는데도 실제로 뚫렸다. 브랜치를 만들었다고 보고한 뒤 어떤 이유로 main으로 돌아온 채 파일을 쓴 사례다 — 브랜치 생성과 파일 편집 사이에 checkout이 끼면 그 사이를 확인하는 절차가 없었기 때문이다. 편집·push 시점마다 물리적으로 검사해야 재발하지 않는다.

### 기본 워크플로우

1. 사용자가 main에서 신규 버전 루트 브랜치 생성 (예: `feature/1.28.0`)
2. 해당 신규 버전의 루트 브랜치에서 작업 브랜치를 생성 (예: `feature/1.28.0-{작업기능명}`)
3. 기능 작업이 완료되면 루트 버전 브랜치를 향하는 PR 생성
   - Base: `feature/1.28.0`
   - Compare: `feature/1.28.0-refactor`
   - PR 제목: `[1.28.0] {작업명}` (예: `[1.28.0] CSS 패턴 추출 및 최적화`)
4. 코드 리뷰 후 루트 브랜치로 머지 (`feature/1.28.0-refactor` → `feature/1.28.0`)
5. 2~4번 작업이 반복되다 해당 버전의 모든 작업이 완료됐을 때 main을 향하는 릴리즈 PR 생성
6. 릴리즈 PR을 통해 배포

### 다중 Phase 체이닝 워크플로우

대규모 기능 세트를 여러 Phase로 나누어 개발하되, main에는 한 번에 배포하는 전략입니다.

```text
main
 └→ feature/1.37.0 (Phase 1 루트, main에서 분기)
      ├→ feature/1.37.0-작업A → PR → feature/1.37.0에 머지
      └→ feature/1.37.0-작업B → PR → feature/1.37.0에 머지
           ↓ Phase 1 완료 후
      └→ feature/1.38.0 (Phase 2 루트, feature/1.37.0에서 분기)
           ├→ feature/1.38.0-작업C → PR → feature/1.38.0에 머지
           └→ feature/1.38.0-작업D → PR → feature/1.38.0에 머지
                ↓ Phase 2 완료 후
           └→ feature/1.39.0 (Phase 3 루트, feature/1.38.0에서 분기)
                └→ ...
```

#### 규칙

1. **분기 원점**: 각 Phase 루트 브랜치는 **이전 Phase 루트 브랜치**에서 분기 (main이 아님)
2. **작업 PR**: 각 작업 브랜치는 해당 Phase 루트 브랜치를 향해 PR 생성
3. **main 배포**: 마지막 Phase 루트 브랜치에서 main으로 릴리즈 PR 1회 (모든 Phase 포함)
4. **중간 배포 전환**: 필요 시 특정 Phase 루트 브랜치에서 main으로 PR 가능 (유연성 확보)
5. **changelog**: Phase별 버전 폴더 분리 (`changelog/blog/1.37.0/`, `1.38.0/`, `1.39.0/`)

## 새 작업 시작 시 체크리스트

Claude가 **새 컨텍스트(새 대화)**에서 처음 작업 요청을 받았을 때, 그리고 **파일 수정·생성·삭제가 수반되는 신규 작업을 시작할 때마다**:

1. **브랜치 확인** (필수, 매 신규 작업 진입 시점):
   - 현재 브랜치 확인 (`git branch --show-current`)
   - `main` 브랜치인 경우 → **파일을 절대 수정하지 말고**, 새 브랜치 생성을 사용자에게 제안한다
   - 이미 `feature/*` 브랜치인 경우 → 바로 작업 진행

2. **브랜치 생성 필요 시** (`main`에서 작업 시작하는 경우):
   - 사용자에게 새 브랜치 생성 여부 확인
   - 루트 브랜치: `feature/{version}` (예: `feature/1.28.0`)
   - 작업 브랜치: `feature/{version}-{작업기능명}` (예: `feature/1.28.0-refactor`)
   - 권장 패턴: 루트 + 작업 브랜치 모두 분기 (예: `feature/1.28.0` 생성 → 그 위에 `feature/1.28.0-refactor` 분기)

   ```text
   "현재 main 브랜치입니다. 이 작업을 위한 새 feature 브랜치를 생성할까요?
   예: feature/1.28.0-{작업기능명}"
   ```

   > **Note**: 동일 컨텍스트 내에서 이미 브랜치를 확인했다면, 이후 작업에서는 매번 확인하지 않아도 됨. 단, 새 작업으로 전환되면 다시 확인한다.

3. **미커밋 변경이 main에 누적된 경우 복구 절차**:
   - `git stash push -u -m "{작업명}"` — 변경 보관
   - `git checkout -b feature/{version}` (루트) → `git checkout -b feature/{version}-{작업기능명}` (작업)
   - `git stash pop` — 변경 복원
   - 이후 정상 워크플로우 재개

4. **Changelog 폴더 확인**:
   - `changelog/blog/{version}/` 폴더 존재 여부 확인
   - 없으면 생성: `mkdir -p changelog/blog/{version}`

5. **Changelog 파일 생성**:
   - 작업 브랜치명에서 작업 기능명 추출
   - `changelog/blog/{version}/{YYYY-MM-DD}-{작업기능명}.md` 파일 생성
   - Docusaurus frontmatter + 템플릿에 따라 초기 구조 작성

6. **로그 실시간 업데이트**:
   - 주요 변경사항 발생 시 해당 changelog 파일 업데이트
   - 통계 정보 업데이트 (파일 수, 변경 횟수, 감소율 등)

7. **작업 완료 시**:
   - Changelog 최종 검토 및 완성
   - MDX 파싱 이슈 없는지 확인 (코드블록 밖 `{}`, `<숫자` 등)

## 작업 패턴 예시

### 분석/기획 작업이 포함된 버전

UX 설계, 시장 분석, 비즈니스 전략 보고서 등 **기획 산출물이 코드 작업 이전에 필요한 경우**, 분석 문서 작업도 기능 개발의 일부로 간주하여 동일 버전 루트 아래에 묶어 진행한다.

```text
feature/1.39.0 (트래픽 성장 — 기능 루트)
 ├→ feature/1.39.0-research-docs (분석 보고서·실행 계획서)
 ├→ feature/1.39.0-meta-optimization (메타 description 최적화)
 ├→ feature/1.39.0-champions-meta (챔피언스 메타 다양화)
 └→ ...
```

#### 분석/기획 작업 규칙

1. **문서 작업도 작업 브랜치로 분리**: 분석 보고서, 실행 계획서 등도 `feature/{version}-{작업기능명}` 브랜치에서 작업 후 PR
2. **루트 브랜치에 누적**: 분석 문서 PR이 머지되면 후속 코드 작업 브랜치는 루트에서 분기하여 분석 결과를 자연스럽게 인계
3. **기능 루트 브랜치 단위로 main 릴리즈**: 모든 분석·코드 작업이 완료된 후 기능 루트 브랜치 → main으로 단일 릴리즈 PR

> **Why:** 분석 결과(보고서)와 그에 따른 코드 변경(메타 최적화, 신규 페이지 등)이 같은 버전 안에 누적되어야 추적성이 확보된다. 문서와 코드를 별도 버전으로 분리하면 어떤 분석이 어떤 코드 변경의 근거였는지 혼란스러워진다.

---

## PR 규칙

- PR 템플릿: `.github/PULL_REQUEST_TEMPLATE.md`
- 상세 PR 생성 절차는 `/create-pr` 스킬 참조
