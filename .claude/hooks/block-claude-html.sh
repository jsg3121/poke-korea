#!/usr/bin/env bash
# PreToolUse(Write|Edit) 가드: .claude/ 하위에 .html 파일을 만들지 못하게 차단한다.
#
# Why: UI 시안(.html)은 항상 `public/preview/`에 저장하는 것이 확립된 규칙이다
# (ui-publisher.md, gitignore /public/preview). 그런데 시안을 `.claude/playwright/`
# 등 잘못된 위치에 저장하는 실수가 반복돼(메모리에 기록됨), 사람 판독에 의존하지 않는
# 물리적 안전망으로 이 훅을 둔다. `.claude/`는 하네스 문서(md/json) 전용이며 시안 HTML을
# 두는 곳이 아니다.
#
# 입력: stdin 으로 { tool_name, tool_input: { file_path, ... } } JSON.
# 출력: 차단 시 permissionDecision "deny" JSON. 그 외에는 조용히 통과(빈 출력 = allow).

input=$(cat)
file_path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')

# 대상 경로가 .claude/ 하위의 .html 이면 차단
case "$file_path" in
  */.claude/*.html | .claude/*.html)
    cat <<'JSON'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "시안(.html)은 .claude/ 하위에 저장하지 않습니다. UI 시안은 항상 public/preview/에 저장하세요(예: public/preview/champions-source-change-preview.html). 규칙: .claude/agents/ui-publisher.md 136행, .claude/는 하네스 문서 전용입니다."
  }
}
JSON
    exit 0
    ;;
esac

# 통과: 빈 출력이면 기본 허용
exit 0
