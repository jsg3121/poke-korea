#!/usr/bin/env bash
# PreToolUse(Write|Edit) 가드: 버전 루트 브랜치에서 파일을 수정하지 못하게 차단한다.
#
# Why: `feature/{version}`은 여러 기능 브랜치를 모으는 **통합 브랜치**다. 1.61.0이
# #229~#232를 각각 `feature/1.61.0-import-order`·`-naming`·`-strict-types`·
# `-layout-chrome`에서 만들어 PR로 합친 것이 그 패턴이다. 통합 브랜치에 직접
# 커밋하면 주제별 PR 단위가 사라져 리뷰·되돌리기가 불가능해진다.
#
# 이 규칙은 실제로 뚫린다. 앞선 세션에서 `feature/1.61.0`에 직접 커밋한 사례가
# 있었다 — 머지 이력에 서브 브랜치 패턴이 뚜렷했는데도 읽지 않았다. main 가드와
# 같은 이유로, 판독에 맡기지 않고 편집 시점마다 물리적으로 막는다.
#
# 판별: `feature/1.61.0`(루트, 차단) vs `feature/1.61.0-naming`(서브, 통과).
# 버전 뒤에 `-주제`가 붙으면 작업 브랜치다.
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

# `feature/X.Y.Z` 정확히 일치할 때만 차단한다.
# `feature/X.Y.Z-무엇` 은 서브 브랜치이므로 통과시킨다.
if printf '%s' "$branch" | grep -qE '^feature/[0-9]+\.[0-9]+\.[0-9]+$'; then
  version=${branch#feature/}
  cat <<JSON
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "\`${branch}\`은 통합 브랜치입니다. 여기에 직접 커밋하면 주제별 PR 단위가 사라집니다.\n\n작업은 서브 브랜치에서 하고 PR로 합칩니다(1.61.0의 #229~#232가 이 패턴):\n\n  git checkout -b feature/${version}-{주제} ${branch}\n\n{주제}는 변경 내용을 나타내는 kebab-case — 예: ${version}-naming, ${version}-strict-types\n\n통합 브랜치에 허용되는 것은 머지 커밋뿐입니다.\n규칙: .claude/conventions/guides/workflow.md"
  }
}
JSON
  exit 0
fi

# 통과: 빈 출력이면 기본 허용
exit 0
