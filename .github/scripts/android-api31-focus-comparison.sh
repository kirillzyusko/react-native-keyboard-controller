#!/usr/bin/env bash
set -uo pipefail

mkdir -p artifacts
python3 - <<'CHECK_APK'
import os, json, zipfile
from pathlib import Path
apk=Path('../example/android/app/build/outputs/apk/release/app-release.apk')
with zipfile.ZipFile(apk) as z:
    bundle=z.read('assets/index.android.bundle')
    start=bundle.index(b'function useSmoothKeyboardHandlerTs2(')
    end=bundle.index(b'function useSmoothKeyboardHandlerTs3(',start)
    guarded=b'previous.height' in bundle[start:end]
variant=os.environ['APK_VARIANT']
result={'variant':variant,'containsDuplicateFrameGuard':guarded}
Path('artifacts/apk-verification.json').write_text(json.dumps(result,indent=2))
print(result)
assert guarded == (variant == 'fixed')
CHECK_APK
if [ "$?" -ne 0 ]; then exit 2; fi

failed=0
for attempt in 1 2 3; do
  directory="artifacts/focus-${attempt}"
  mkdir -p "$directory"
  adb logcat -c
  adb logcat -v threadtime > "$directory/logcat.txt" 2>&1 &
  logcat_pid=$!
  # Leave Gboard's previous layout in text mode, as in the full-suite failure.
  yarn detox test --configuration example.android.emu-31.release \
    kit/013-chat-flat-list.e2e.ts --retries 0 --take-screenshots all \
    --artifacts-location "$directory/warmup" > "$directory/warmup.log" 2>&1
  warmup_result=$?
  cat "$directory/warmup.log"
  yarn detox test --configuration example.android.emu-31.release \
    kit/016-aware-scroll-view-with-sticky-view.e2e.ts --retries 0 \
    --take-screenshots all --record-videos all \
    --artifacts-location "$directory/sticky" > "$directory/sticky.log" 2>&1
  result=$?
  cat "$directory/sticky.log"
  kill "$logcat_pid" 2>/dev/null || true
  wait "$logcat_pid" 2>/dev/null || true
  echo "API31_FOCUS ${APK_VARIANT} ${attempt} WARMUP ${warmup_result} STICKY ${result}"
  if [ "$result" -ne 0 ] || [ "$warmup_result" -ne 0 ]; then failed=1; fi
done
exit "$failed"
