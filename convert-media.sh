#!/bin/bash

# Portfolio Media Conversion Script
# Converte: MOV → MP4 H.264, GIF → MP4, PNG/JPG → WebP
# Mantiene i file originali (non sovrascrive)

set -e

PORTFOLIO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$PORTFOLIO_DIR/media-conversion.log"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

{
  echo "=== PORTFOLIO MEDIA CONVERSION STARTED ==="
  echo "Date: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "Directory: $PORTFOLIO_DIR"
  echo ""
} | tee "$LOG_FILE"

# MOV → MP4
echo -e "${YELLOW}>>> Converting MOV files to MP4...${NC}" | tee -a "$LOG_FILE"
find "$PORTFOLIO_DIR" -name "*.mov" -type f | while read mov_file; do
    if [[ "$mov_file" == *.backup ]]; then
        continue
    fi
    
    mp4_file="${mov_file%.mov}.mp4"
    
    if [ -f "$mp4_file" ]; then
        echo -e "${YELLOW}SKIP${NC}: $mp4_file already exists" | tee -a "$LOG_FILE"
        continue
    fi
    
    echo -e "${YELLOW}CONVERT${NC}: $(basename "$mov_file") → $(basename "$mp4_file")" | tee -a "$LOG_FILE"
    
    ffmpeg -i "$mov_file" \
        -c:v libx264 \
        -preset slow \
        -crf 23 \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        "$mp4_file" >> "$LOG_FILE" 2>&1
    
    if [ -f "$mp4_file" ]; then
        orig_size=$(du -sh "$mov_file" | cut -f1)
        new_size=$(du -sh "$mp4_file" | cut -f1)
        echo -e "${GREEN}✓${NC}: $orig_size → $new_size" | tee -a "$LOG_FILE"
    fi
done

# GIF → MP4
echo -e "\n${YELLOW}>>> Converting GIF files to MP4...${NC}" | tee -a "$LOG_FILE"
find "$PORTFOLIO_DIR" -name "*.gif" -type f | while read gif_file; do
    if [[ "$gif_file" == *.backup ]]; then
        continue
    fi
    
    mp4_file="${gif_file%.gif}.mp4"
    
    if [ -f "$mp4_file" ]; then
        echo -e "${YELLOW}SKIP${NC}: $mp4_file already exists" | tee -a "$LOG_FILE"
        continue
    fi
    
    echo -e "${YELLOW}CONVERT${NC}: $(basename "$gif_file") → $(basename "$mp4_file")" | tee -a "$LOG_FILE"
    
    ffmpeg -i "$gif_file" \
        -c:v libx264 \
        -preset medium \
        -crf 20 \
        -pix_fmt yuv420p \
        -movflags +faststart \
        "$mp4_file" >> "$LOG_FILE" 2>&1
    
    if [ -f "$mp4_file" ]; then
        orig_size=$(du -sh "$gif_file" | cut -f1)
        new_size=$(du -sh "$mp4_file" | cut -f1)
        echo -e "${GREEN}✓${NC}: $orig_size → $new_size" | tee -a "$LOG_FILE"
    fi
done

# PNG/JPG → WebP
echo -e "\n${YELLOW}>>> Converting images to WebP...${NC}" | tee -a "$LOG_FILE"
find "$PORTFOLIO_DIR" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | while read img_file; do
    if [[ "$img_file" == *.backup ]]; then
        continue
    fi
    
    webp_file="${img_file%.*}.webp"
    
    if [ -f "$webp_file" ]; then
        echo -e "${YELLOW}SKIP${NC}: $webp_file already exists" | tee -a "$LOG_FILE"
        continue
    fi
    
    quality=80
    if [[ "$img_file" =~ [Rr][Aa][Ww]|photo|high ]]; then
        quality=85
    fi
    
    echo -e "${YELLOW}CONVERT${NC}: $(basename "$img_file") → $(basename "$webp_file") (q:$quality)" | tee -a "$LOG_FILE"
    
    ffmpeg -i "$img_file" \
        -c:v libwebp \
        -quality $quality \
        -lossless 0 \
        -compression_level 6 \
        "$webp_file" >> "$LOG_FILE" 2>&1
    
    if [ -f "$webp_file" ]; then
        orig_size=$(du -sh "$img_file" | cut -f1)
        new_size=$(du -sh "$webp_file" | cut -f1)
        echo -e "${GREEN}✓${NC}: $orig_size → $new_size" | tee -a "$LOG_FILE"
    fi
done

# Remove duplicate
if [ -f "$PORTFOLIO_DIR/08-Theremin900/theremin copia.mp4" ]; then
    echo -e "\n${YELLOW}DELETE${NC}: Removing duplicate file..." | tee -a "$LOG_FILE"
    rm "$PORTFOLIO_DIR/08-Theremin900/theremin copia.mp4"
    echo -e "${GREEN}✓${NC}: Deleted 08-Theremin900/theremin copia.mp4" | tee -a "$LOG_FILE"
fi

echo -e "\n${GREEN}=== CONVERSION COMPLETED ===${NC}" | tee -a "$LOG_FILE"
echo "Log saved to: $LOG_FILE" | tee -a "$LOG_FILE"
