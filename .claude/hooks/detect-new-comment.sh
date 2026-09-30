#!/usr/bin/env bash
# PostToolUse(Write|Edit) 1차 필터: 편집 내용에 새 주석이 들어갔는지만 본다.
#
# Why 이 단계가 따로 있는가: 뒤에 붙는 prompt 훅은 편집마다 LLM을 호출한다.
# src/ 편집의 대다수는 주석을 건드리지 않으므로, 여기서 걸러내면 호출 자체가
# 일어나지 않는다. 판정은 하지 않는다 — 주석 유무만 보고 통과/차단을 가른다.
#
# 통과(주석 없음)  → decision:"block" 없이 빈 출력. 다음 훅은 여전히 실행되지만
#                    additionalContext로 "검사 불필요"를 알려 prompt 훅이 즉시 ok를
#                    반환하게 한다.
# 주석 있음        → additionalContext에 주석 줄을 실어 다음 훅이 판정하게 한다.
#
# 입력: stdin 으로 { tool_name, tool_input: { file_path, content|new_string, ... } }
# 출력: hookSpecificOutput.additionalContext (항상 exit 0)

input=$(cat)
file_path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')

[ -z "$file_path" ] && exit 0

# 자동 생성물은 대상이 아니다 — codegen이 다시 덮어쓴다.
case "$file_path" in
  */src/graphql/*) exit 0 ;;
esac

# Write는 content, Edit는 new_string에 들어온다.
added=$(printf '%s' "$input" | jq -r '.tool_input.new_string // .tool_input.content // empty')
[ -z "$added" ] && exit 0

# 주석 줄만 추출. `//`가 URL(https://)의 일부인 경우를 피하려고 줄 시작 기준으로 본다.
comments=$(printf '%s' "$added" | grep -nE '^\s*(//|/\*|\*[^/]|\{/\*)' | grep -v 'eslint-disable\|@ts-expect-error\|@ts-ignore\|prettier-ignore' || true)

[ -z "$comments" ] && exit 0

# jq로 안전하게 문자열화한다(따옴표·개행 이스케이프).
jq -n --arg c "$comments" --arg f "$file_path" '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: ("COMMENT_CHECK_TARGET\nfile: " + $f + "\n" + $c)
  }
}'
exit 0
