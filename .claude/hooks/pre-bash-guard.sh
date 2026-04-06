#!/bin/bash
# PreToolUse hook: Bash 도구에서 위험 명령어 차단
# exit code 2로 차단, stderr로 피드백 전달

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# 위험 명령어 패턴 검사
DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf ~"
  "rm -rf \."
  "git push --force main"
  "git push --force origin main"
  "git push -f main"
  "git push -f origin main"
  "git push --force master"
  "git push -f master"
  "git reset --hard"
  "git clean -fd"
  "git checkout -- ."
  "DROP TABLE"
  "DROP DATABASE"
  "truncate"
)

for PATTERN in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$PATTERN"; then
    echo "위험 명령어가 감지되어 차단되었습니다: $COMMAND" >&2
    echo "해당 명령어를 실행하려면 사용자에게 직접 확인을 받으세요." >&2
    exit 2
  fi
done

exit 0
