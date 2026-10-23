#!/usr/bin/env bash
set -uo pipefail

failed=0
for attempt in 1 2 3 4 5; do
  directory="artifacts/sticky-attempt-${attempt}"
  mkdir -p "$directory"
  adb logcat -c
  adb logcat -v threadtime > "$directory/logcat.txt" 2>&1 &
  logcat_pid=$!
  yarn detox test --configuration "example.android.emu-${ANDROID_API_LEVEL:-28}.release" \
    kit/016-aware-scroll-view-with-sticky-view.e2e.ts \
    --retries 0 --loglevel verbose --take-screenshots all --record-videos all \
    --artifacts-location "$directory" > "$directory/detox.log" 2>&1
  result=$?
  cat "$directory/detox.log"
  kill "$logcat_pid" 2>/dev/null || true
  wait "$logcat_pid" 2>/dev/null || true
  echo "STICKY_ATTEMPT $attempt EXIT $result"
  if [ "$result" -ne 0 ]; then
    failed=1
  fi
done
if [ "${STICKY_FULL_SUITE:-0}" = "1" ]; then
  directory="artifacts/full-suite"
  mkdir -p "$directory"
  adb logcat -c
  adb logcat -v threadtime > "$directory/logcat.txt" 2>&1 &
  logcat_pid=$!
  yarn detox test --configuration "example.android.emu-${ANDROID_API_LEVEL:-28}.release" \
    --retries 0 --loglevel verbose --take-screenshots all --record-videos all \
    --artifacts-location "$directory" > "$directory/detox.log" 2>&1
  result=$?
  cat "$directory/detox.log"
  kill "$logcat_pid" 2>/dev/null || true
  wait "$logcat_pid" 2>/dev/null || true
  if [ "$result" -ne 0 ]; then
    failed=1
  fi
fi
exit "$failed"
