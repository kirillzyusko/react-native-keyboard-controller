#!/usr/bin/env bash
set -uo pipefail

directory="artifacts/full-suite"
mkdir -p "$directory"
adb logcat -c
adb logcat -v threadtime > "$directory/logcat.txt" 2>&1 &
logcat_pid=$!
yarn detox test --configuration example.android.emu-31.release \
  --retries 0 --loglevel verbose --take-screenshots all --record-videos all \
  --artifacts-location "$directory" 2>&1 | tee "$directory/detox.log"
result=${PIPESTATUS[0]}
kill "$logcat_pid" 2>/dev/null || true
wait "$logcat_pid" 2>/dev/null || true
exit "$result"
