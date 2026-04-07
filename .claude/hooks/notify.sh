#!/bin/bash
# Notification hook: Claude가 사용자 입력 대기 시 macOS 알림 전송

set -euo pipefail

INPUT=$(cat)

# macOS 알림 전송
osascript -e 'display notification "Claude Code가 입력을 기다리고 있습니다." with title "Claude Code" sound name "Glass"' 2>/dev/null || true

exit 0
