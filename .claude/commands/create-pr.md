Pull Request를 생성해줘.

## 입력

- base 브랜치: $ARGUMENTS (인자가 없으면 사용자에게 어떤 브랜치로 PR을 보낼지 질문)
- head 브랜치: 현재 체크아웃된 브랜치

## 실행 절차

1. 현재 브랜치 확인 (`git branch --show-current`)
2. base 브랜치 대비 커밋 히스토리 분석 (`git log {base}..HEAD --oneline`)
3. 변경된 파일 목록 확인 (`git diff {base}...HEAD --stat`)
4. 원격 브랜치 푸시 상태 확인 — 푸시되지 않은 커밋이 있으면 사용자에게 알리고 푸시 여부를 확인
5. `.github/PULL_REQUEST_TEMPLATE.md` 템플릿을 읽고 해당 형식에 맞춰 PR 본문을 작성
6. `gh pr create --base {base} --head {현재 브랜치} --title "{제목}" --body "{본문}"` 으로 PR 생성
7. 생성된 PR URL을 사용자에게 전달

## PR 제목 규칙

- 브랜치가 `feature/{version}` 형식이면: `v{version} {작업 요약}`
- 그 외: 커밋 히스토리를 분석하여 적절한 제목 생성

## PR 본문 규칙

- `.github/PULL_REQUEST_TEMPLATE.md` 템플릿 형식을 반드시 따른다
- 커밋 히스토리와 변경된 파일을 분석하여 작업 유형 체크박스를 선택한다
- 템플릿 내 작업 유형의 경우 실제 작업사항에 포함되지 않은 미체크 항목도 같이 포함하여 작성한다.
- 작업 사항은 변경 내용을 카테고리별로 그룹핑하여 상세히 작성한다

## Label 규칙

- PR 본문의 작업 유형 체크박스에서 체크된 항목에 대응하는 GitHub Label을 `--label` 옵션으로 지정한다
- 작업 유형과 라벨의 매핑:

| 작업 유형                  | Label             |
| -------------------------- | ----------------- |
| ✨ 새 기능 (New Feature)   | `feature`         |
| 🐛 버그 수정 (Bug Fix)     | `bug`             |
| 🚨 핫픽스 (Hotfix)         | `hotfix`          |
| 🔧 리팩토링 (Refactoring)  | `refactor`        |
| 🚀 성능 개선 (Performance) | `performance`     |
| 🔍 SEO 개선 (SEO)          | `seo`             |
| 🎨 디자인 변경 (Design)    | `design`          |
| 📝 문서 (Documentation)    | `documentation`   |
| 🔨 Breaking Changes        | `breaking-change` |

- 여러 유형에 해당하면 `--label`을 복수로 지정한다

## 주의사항

- PR 생성 전에 반드시 사용자에게 제목과 본문 초안을 보여주고 확인을 받는다
- `gh` CLI 인증이 안 되어 있으면 사용자에게 `gh auth login`을 안내한다
