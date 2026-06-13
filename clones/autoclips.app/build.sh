#!/usr/bin/env bash
# build.sh — ghép các partial thành index.html (Pha 4)
set -e
cd "$(dirname "$0")"
OUT="index.html"
cat index.head.html > "$OUT"
for f in sections/*.html; do
  echo "" >> "$OUT"
  echo "<!-- ===== $(basename "$f") ===== -->" >> "$OUT"
  cat "$f" >> "$OUT"
done
echo "" >> "$OUT"
cat index.foot.html >> "$OUT"
echo "Built $OUT from $(ls sections/*.html | wc -l) sections."
