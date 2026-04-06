#!/bin/bash
# Stop hook: 작업 완료 시 changelog 파일 존재 여부 검증
# 현재 브랜치가 feature/ 작업 브랜치인 경우에만 검사

set -euo pipefail

INPUT=$(cat)

# stop_hook_active 체크 (무한 루프 방지)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
if [ "$STOP_HOOK_ACTIVE" = "true" ]; then
  exit 0
fi

# 현재 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")

# feature/{version}-{작업명} 패턴인 경우에만 검사
if ! echo "$CURRENT_BRANCH" | grep -qE '^feature/[0-9]+\.[0-9]+\.[0-9]+-'; then
  exit 0
fi

# 브랜치에서 버전 추출
VERSION=$(echo "$CURRENT_BRANCH" | sed -E 's|^feature/([0-9]+\.[0-9]+\.[0-9]+)-.*|\1|')

# changelog 폴더에 해당 버전의 파일이 있는지 확인
CHANGELOG_DIR="changelog/blog/$VERSION"

if [ ! -d "$CHANGELOG_DIR" ]; then
  echo "⚠️ changelog 폴더가 없습니다: $CHANGELOG_DIR" >&2
  echo "작업 완료 전 changelog를 작성해주세요. (.claude/conventions/guides/changelog.md 참조)" >&2
  exit 0
fi

# 해당 버전 폴더에 .md 파일이 하나도 없으면 경고
MD_COUNT=$(find "$CHANGELOG_DIR" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')

if [ "$MD_COUNT" -eq 0 ]; then
  echo "⚠️ changelog 파일이 비어있습니다: $CHANGELOG_DIR" >&2
  echo "작업 완료 전 changelog를 작성해주세요. (.claude/conventions/guides/changelog.md 참조)" >&2
fi

exit 0
