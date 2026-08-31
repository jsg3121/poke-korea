#!/usr/bin/env bash
# PreToolUse(Write|Edit) 가드: main 브랜치에서 파일을 수정하지 못하게 차단한다.
#
# Why: CLAUDE.md와 workflow.md의 절대 규칙("main에서는 어떠한 파일 수정·생성·삭제도
# 하지 않는다")을 사람/에이전트의 판독에 맡기면 실제로 뚫린다. 브랜치를 만들었다고
# 보고한 뒤 main에서 파일을 쓴 사례가 있었다 — 브랜치 생성과 파일 편집 사이에
# checkout이 끼면 그 사이 확인이 없기 때문이다. 편집 시점마다 물리적으로 막는다.
#
# 입력: stdin 으로 { tool_name, tool_input: { file_path, ... } } JSON.
# 출력: 차단 시 permissionDecision "deny" JSON. 그 외에는 조용히 통과(빈 출력 = allow).

input=$(cat)
file_path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')

# 대상 파일이 없으면 판단 불가 — 통과시킨다(다른 가드가 처리).
[ -z "$file_path" ] && exit 0

# 저장소 밖(스크래치패드, ~/.config 등)은 대상이 아니다.
# 편집 대상 파일 기준으로 저장소를 판별해야 한다. 훅의 실행 디렉토리가
# 저장소 안이어도 파일은 밖일 수 있고, 그 반대도 가능하다.
target_dir=$(dirname "$file_path")
[ -d "$target_dir" ] || exit 0

repo_root=$(git -C "$target_dir" rev-parse --show-toplevel 2>/dev/null) || exit 0

branch=$(git -C "$repo_root" branch --show-current 2>/dev/null)

case "$branch" in
  main | master)
    cat <<'JSON'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "main 브랜치에서는 파일을 수정할 수 없습니다(CLAUDE.md 절대 규칙). 먼저 작업 브랜치를 만드세요.\n\n1) 다음 버전 확인 — main에 머지된 마지막 PR 기준:\n   git log origin/main --oneline | grep -m1 -oE '[0-9]+\\.[0-9]+\\.[0-9]+'\n\n2) origin/main에서 직접 분기(로컬 main 오염 차단):\n   git fetch origin && git checkout -b feature/{version} origin/main\n\n규칙: .claude/conventions/guides/workflow.md"
  }
}
JSON
    exit 0
    ;;
esac

# 통과: 빈 출력이면 기본 허용
exit 0
