#!/usr/bin/env bash
set -euo pipefail

# Video optimization script - multiple format comparison
VIDEO_URL="https://cdn.shopify.com/videos/c/o/v/e68aa85d4cfb47aca4befae6753a2431.mp4"
TMP_DIR="tmp"
ORIGINAL_FILE="$TMP_DIR/original.mp4"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🎬 Video Optimization Comparison${NC}"
echo "======================================"

# Create tmp directory
mkdir -p "$TMP_DIR"

# Download original video if not exists
if [ ! -f "$ORIGINAL_FILE" ]; then
    echo -e "${YELLOW}📥 Downloading original video...${NC}"
    curl -L -o "$ORIGINAL_FILE" "$VIDEO_URL"
fi

# Get original file size
ORIGINAL_SIZE=$(stat -c%s "$ORIGINAL_FILE" 2>/dev/null || stat -f%z "$ORIGINAL_FILE")
ORIGINAL_SIZE_KB=$((ORIGINAL_SIZE / 1024))

echo -e "${GREEN}✅ Original file size: ${ORIGINAL_SIZE_KB}KB${NC}"
echo ""

# Check if ffmpeg is available
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ ffmpeg not found. Please install ffmpeg.${NC}"
    exit 1
fi

# Function to optimize and report
optimize_format() {
    local format="$1"
    local output_file="$2"
    local codec_args="$3"
    local description="$4"
    
    echo -e "${BLUE}🔧 Testing ${description}...${NC}"
    
    # Run ffmpeg and capture output
    if ffmpeg -i "$ORIGINAL_FILE" $codec_args -y "$output_file" &>/dev/null; then
        # Get file size
        local size=$(stat -c%s "$output_file" 2>/dev/null || stat -f%z "$output_file")
        local size_kb=$((size / 1024))
        local savings=$((ORIGINAL_SIZE - size))
        local savings_percent=$(((savings * 100) / ORIGINAL_SIZE))
        
        echo -e "   ✅ ${format}: ${size_kb}KB (${savings_percent}% reduction)"
        
        # Store results for summary
        eval "${format}_SIZE=${size_kb}"
        eval "${format}_PERCENT=${savings_percent}"
    else
        echo -e "   ❌ ${format}: Failed to encode"
        # Show the actual error for debugging
        echo -e "   Error details:"
        ffmpeg -i "$ORIGINAL_FILE" $codec_args -y "$output_file" 2>&1 | tail -3 | sed 's/^/   /'
        eval "${format}_SIZE=0"
        eval "${format}_PERCENT=0"
    fi
}

# Test different formats
optimize_format "H264" "$TMP_DIR/h264.mp4" \
    "-c:v libx264 -preset slow -crf 28 -an -movflags +faststart" \
    "H.264 (current)"

optimize_format "AV1" "$TMP_DIR/av1.mp4" \
    "-c:v libsvtav1 -crf 35 -preset 8 -an -movflags +faststart" \
    "AV1 (modern, best compression)"

optimize_format "HEVC" "$TMP_DIR/hevc.mp4" \
    "-c:v libx265 -preset slow -crf 28 -an -movflags +faststart" \
    "HEVC/H.265 (good compression)"

optimize_format "VP9" "$TMP_DIR/vp9.webm" \
    "-c:v libvpx-vp9 -crf 35 -b:v 0 -an" \
    "VP9 WebM (web optimized)"

echo ""
echo -e "${GREEN}📊 COMPARISON RESULTS${NC}"
echo "======================================"
echo -e "Original:     ${ORIGINAL_SIZE_KB}KB"
echo -e "H.264:        ${H264_SIZE}KB (${H264_PERCENT}% reduction)"
echo -e "HEVC/H.265:   ${HEVC_SIZE}KB (${HEVC_PERCENT}% reduction)"
echo -e "AV1:          ${AV1_SIZE}KB (${AV1_PERCENT}% reduction)"
echo -e "VP9 WebM:     ${VP9_SIZE}KB (${VP9_PERCENT}% reduction)"

echo ""
echo -e "${YELLOW}🌐 Browser Support:${NC}"
echo "   H.264:     Universal (all browsers)"
echo "   HEVC:      Safari, some mobile browsers"
echo "   AV1:       Chrome 70+, Firefox 67+, Edge 75+"
echo "   VP9:       Chrome, Firefox, Edge (no Safari)"

echo ""
echo -e "${YELLOW}📁 Files saved in: $TMP_DIR/${NC}"
ls -lah "$TMP_DIR"/*.mp4 "$TMP_DIR"/*.webm 2>/dev/null | grep -v "^total" || true