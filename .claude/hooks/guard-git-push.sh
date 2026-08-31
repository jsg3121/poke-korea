#!/usr/bin/env bash
# PreToolUse(Bash) 가드: main으로 향하는 git push를 차단한다.
#
# Why: 브랜치 이름만 봐서는 push 목적지를 알 수 없다. 로컬 브랜치가 feature/A 인데
# upstream이 origin/main으로 잡혀 있으면(`git push -u origin main`을 한 번 실행하면
# 이렇게 된다) `git push`가 A의 커밋을 main에 올린다. 화면상 브랜치는 A라 정상으로
# 보이는데 원격에서는 main이 갱신되는, 사람이 알아채기 어려운 사고다.
# 실제로 다른 저장소에서 이 경로로 main이 오염된 사례가 있어 물리적으로 막는다.
#
# GitHub의 "Require a pull request before merging"이 켜져 있어도 이 훅은 필요하다.
# 원격 설정은 개발 중 인지 시점을 주지 않는다 — push가 거부된 뒤에야 알게 되고,
# 보호 규칙이 없는 저장소로 이 습관이 옮겨가면 그대로 사고가 된다.
#
# 입력: stdin 으로 { tool_name, tool_input: { command, ... } } JSON.
# 출력: 차단 시 permissionDecision "deny" JSON. 그 외에는 조용히 통과.

input=$(cat)
command=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')

# git push가 없으면 검사 대상이 아니다.
printf '%s' "$command" | grep -qE '(^|[;&|[:space:]])git[[:space:]]+([^;&|]*[[:space:]])?push([[:space:]]|$)' || exit 0

deny() {
  # 인자를 JSON 문자열로 안전하게 인코딩한다(개행·따옴표 이스케이프).
  jq -n --arg reason "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

GUIDE=$'\n\n작업 브랜치로 push하세요:\n  git push -u origin $(git branch --show-current)\n\n규칙: .claude/conventions/guides/workflow.md'

# 1) main/master를 명시적으로 지정한 push
if printf '%s' "$command" | grep -qE 'push[^;&|]*[[:space:]](main|master)([[:space:]]|$)'; then
  deny "main/master로 직접 push할 수 없습니다. main은 릴리스 PR을 통해서만 변경됩니다.${GUIDE}"
fi

# 2) HEAD:main 형태의 refspec
if printf '%s' "$command" | grep -qE 'push[^;&|]*[[:space:]][^[:space:]]*:(refs/heads/)?(main|master)([[:space:]]|$)'; then
  deny "refspec이 main/master를 가리킵니다. main은 릴리스 PR을 통해서만 변경됩니다.${GUIDE}"
fi

# 3) --all / --mirror — 로컬 main까지 함께 올라간다
if printf '%s' "$command" | grep -qE 'push[^;&|]*[[:space:]]--(all|mirror)([[:space:]]|$)'; then
  deny "--all/--mirror는 로컬 main까지 함께 push합니다. 브랜치를 명시해 push하세요.${GUIDE}"
fi

# 4) 인자 없는 `git push` — upstream이 실제로 어디를 가리키는지 확인한다.
#    이것이 이 훅의 핵심이다. 브랜치 이름은 안전해 보여도 upstream이 main이면 사고다.
branch=$(git branch --show-current 2>/dev/null)
upstream=$(git rev-parse --abbrev-ref '@{upstream}' 2>/dev/null)

if [ -n "$upstream" ]; then
  case "$upstream" in
    */main | */master)
      if [ "$branch" != "main" ] && [ "$branch" != "master" ]; then
        deny "현재 브랜치 '${branch}'의 upstream이 '${upstream}'입니다. 이대로 push하면 작업 커밋이 main에 올라갑니다.

upstream을 올바르게 다시 설정하세요:
  git branch --unset-upstream
  git push -u origin ${branch}

규칙: .claude/conventions/guides/workflow.md"
      fi
      ;;
  esac
fi

# 5) 현재 브랜치가 main인 상태의 push
case "$branch" in
  main | master)
    deny "현재 브랜치가 '${branch}'입니다. main은 릴리스 PR을 통해서만 변경됩니다.${GUIDE}"
    ;;
esac

# 통과: 빈 출력이면 기본 허용
exit 0
