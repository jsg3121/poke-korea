# 워크플로우 가이드

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

Claude가 새로운 작업 요청을 받았을 때:

1. **브랜치 확인**:
   - 현재 작업 중인 브랜치 형식 확인 (`git branch --show-current`)
   - 루트 브랜치: `feature/{version}` (예: `feature/1.28.0`)
   - 작업 브랜치: `feature/{version}-{작업기능명}` (예: `feature/1.28.0-refactor`)

2. **브랜치 생성 필요 시**: 사용자에게 새 브랜치 생성 여부 확인
   ```text
   "이 작업을 위한 새 feature 브랜치를 생성하시겠습니까?
   예: feature/1.28.0-{작업기능명}"
   ```

3. **Changelog 폴더 확인**:
   - `changelog/blog/{version}/` 폴더 존재 여부 확인
   - 없으면 생성: `mkdir -p changelog/blog/{version}`

4. **Changelog 파일 생성**:
   - 작업 브랜치명에서 작업 기능명 추출
   - `changelog/blog/{version}/{YYYY-MM-DD}-{작업기능명}.md` 파일 생성
   - Docusaurus frontmatter + 템플릿에 따라 초기 구조 작성

5. **로그 실시간 업데이트**:
   - 주요 변경사항 발생 시 해당 changelog 파일 업데이트
   - 통계 정보 업데이트 (파일 수, 변경 횟수, 감소율 등)

6. **작업 완료 시**:
   - Changelog 최종 검토 및 완성
   - MDX 파싱 이슈 없는지 확인 (코드블록 밖 `{}`, `<숫자` 등)

## PR 규칙

- PR 템플릿: `.github/PULL_REQUEST_TEMPLATE.md`
- 상세 PR 생성 절차는 `/create-pr` 스킬 참조
