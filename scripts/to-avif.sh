#!/usr/bin/env bash
#
# to-avif.sh — convert every image in a folder to AVIF for the blog CDN.
#
# Uses ffmpeg + libaom-av1 (no extra dependencies). Encodes still-picture AVIFs
# in constant-quality mode. Output is opaque; transparent images (e.g. PNG
# logos) are flattened onto a white background.
#
# Usage:
#   scripts/to-avif.sh [options] <folder>
#
# Options:
#   -o DIR    Output directory        (default: <folder>/avif)
#   -q N      Quality, CRF 0–63       (default: 32; lower = better & larger)
#   -w PX     Max width in pixels     (default: none; only ever scales down)
#   -s N      Encoder speed 0–8       (default: 6; lower = slower & smaller)
#   -r        Recurse into subfolders (default: top level only)
#   -f        Overwrite existing .avif files (default: skip them)
#   -h        Show this help
#
# Examples:
#   scripts/to-avif.sh ~/photos/sanbravo
#   scripts/to-avif.sh -q 28 -w 1600 -o ./dist-avif ~/photos/sanbravo
#
set -euo pipefail

OUT_DIR=""
CRF=32
MAX_W=""
SPEED=6
RECURSE=0
FORCE=0

die() { printf 'error: %s\n' "$*" >&2; exit 1; }

# Print the header comment block (from line 2 to the first non-comment line).
usage() {
  awk 'NR>1 { if (/^#/) { sub(/^# ?/, ""); print } else { exit } }' "$0"
  exit "${1:-0}"
}

while getopts ':o:q:w:s:rfh' opt; do
  case "$opt" in
    o) OUT_DIR="$OPTARG" ;;
    q) CRF="$OPTARG" ;;
    w) MAX_W="$OPTARG" ;;
    s) SPEED="$OPTARG" ;;
    r) RECURSE=1 ;;
    f) FORCE=1 ;;
    h) usage 0 ;;
    :) die "option -$OPTARG requires an argument (see -h)" ;;
    \?) die "unknown option -$OPTARG (see -h)" ;;
  esac
done
shift $((OPTIND - 1))

[ $# -ge 1 ] || { usage 1 >&2; }
SRC_DIR="$1"

command -v ffmpeg  >/dev/null || die "ffmpeg not found on PATH"
command -v ffprobe >/dev/null || die "ffprobe not found on PATH"
[ -d "$SRC_DIR" ] || die "not a directory: $SRC_DIR"
case "$CRF"   in ''|*[!0-9]*) die "-q must be an integer 0–63" ;; esac
case "$SPEED" in ''|*[!0-9]*) die "-s must be an integer 0–8" ;; esac
[ -z "$MAX_W" ] || case "$MAX_W" in *[!0-9]*) die "-w must be an integer" ;; esac

[ -n "$OUT_DIR" ] || OUT_DIR="$SRC_DIR/avif"
mkdir -p "$OUT_DIR"

# Collect source images (case-insensitive extensions).
exts=(jpg jpeg png webp tif tiff heic heif bmp gif)
find_args=("$SRC_DIR")
[ "$RECURSE" -eq 1 ] || find_args+=(-maxdepth 1)
find_args+=(-type f '(')
for i in "${!exts[@]}"; do
  [ "$i" -eq 0 ] || find_args+=(-o)
  find_args+=(-iname "*.${exts[$i]}")
done
find_args+=(')')

mapfile -d '' files < <(find "${find_args[@]}" -print0 | sort -z)
[ "${#files[@]}" -gt 0 ] || die "no images found in $SRC_DIR"

human() { numfmt --to=iec --suffix=B "$1" 2>/dev/null || echo "${1}B"; }

total=0 done=0 skipped=0 failed=0 in_bytes=0 out_bytes=0
for src in "${files[@]}"; do
  total=$((total + 1))
  base="$(basename "$src")"
  out="$OUT_DIR/${base%.*}.avif"

  if [ -e "$out" ] && [ "$FORCE" -eq 0 ]; then
    printf 'skip   %s (exists)\n' "$base"
    skipped=$((skipped + 1))
    continue
  fi

  # AVIF output is always opaque (yuv420p). Images with an alpha channel are
  # flattened onto white so transparent areas don't turn black.
  pix="$(ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt \
          -of default=nk=1:nw=1 "$src" 2>/dev/null || true)"

  scale=""
  [ -z "$MAX_W" ] || scale="scale='min($MAX_W,iw)':-2:flags=lanczos,"

  if printf '%s' "$pix" | grep -qE 'a$|a[0-9]|rgba|argb|abgr|bgra|yuva|^ya|pal8'; then
    ff_filter=(-filter_complex
      "color=white[bg];[bg][0:v]scale2ref[bg2][img];[bg2][img]overlay=shortest=1,${scale}format=yuv420p")
  else
    ff_filter=(-vf "${scale}format=yuv420p")
  fi

  if ffmpeg -hide_banner -loglevel error -y -i "$src" \
       "${ff_filter[@]}" -frames:v 1 -still-picture 1 \
       -c:v libaom-av1 -crf "$CRF" -b:v 0 -cpu-used "$SPEED" \
       "$out" </dev/null; then
    isz=$(stat -c%s "$src"); osz=$(stat -c%s "$out")
    in_bytes=$((in_bytes + isz)); out_bytes=$((out_bytes + osz))
    done=$((done + 1))
    printf 'ok     %s  →  %s  (%s → %s)\n' \
      "$base" "$(basename "$out")" "$(human "$isz")" "$(human "$osz")"
  else
    failed=$((failed + 1))
    rm -f "$out"
    printf 'FAIL   %s\n' "$base" >&2
  fi
done

echo "------------------------------------------------------------"
printf 'converted %d / %d  (skipped %d, failed %d)\n' "$done" "$total" "$skipped" "$failed"
if [ "$done" -gt 0 ]; then
  printf 'size %s → %s  saved %s\n' \
    "$(human "$in_bytes")" "$(human "$out_bytes")" "$(human "$((in_bytes - out_bytes))")"
fi
echo "output: $OUT_DIR"
[ "$failed" -eq 0 ]
