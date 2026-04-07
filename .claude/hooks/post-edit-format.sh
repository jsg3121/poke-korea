#!/bin/bash
# PostToolUse hook: Edit|Write 후 자동 prettier 포맷팅
# stdin으로 JSON 입력을 받아 수정된 파일 경로를 추출한 뒤 prettier 실행

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# 파일 경로가 없으면 스킵
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# .ts, .tsx, .js, .jsx, .css, .json 파일만 포맷팅
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.css|*.json)
    # 파일이 존재하는 경우에만 실행
    if [ -f "$FILE_PATH" ]; then
      npx prettier --write "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
esac

exit 0
