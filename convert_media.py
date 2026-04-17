#!/usr/bin/env python3
"""
Portfolio Media Conversion Script
Converte: MOV → MP4, GIF → MP4, PNG/JPG → WebP
Mantiene i file originali
"""

import os
import subprocess
from pathlib import Path
from datetime import datetime

PORTFOLIO_DIR = Path(__file__).parent
LOG_FILE = PORTFOLIO_DIR / "media-conversion.log"

def log(message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_message = f"[{timestamp}] {message}"
    print(log_message)
    with open(LOG_FILE, "a") as f:
        f.write(log_message + "\n")

def run_ffmpeg(input_file, output_file, ffmpeg_args):
    """Execute FFmpeg conversion"""
    cmd = ["ffmpeg", "-i", str(input_file)] + ffmpeg_args + [str(output_file), "-y"]
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        return True
    except subprocess.CalledProcessError as e:
        log(f"ERROR: FFmpeg failed for {input_file}: {e.stderr.decode()}")
        return False

def get_file_size(filepath):
    """Get human-readable file size"""
    size = os.path.getsize(filepath)
    for unit in ["B", "KB", "MB", "GB"]:
        if size < 1024:
            return f"{size:.1f}{unit}"
        size /= 1024
    return f"{size:.1f}TB"

def convert_mov_to_mp4():
    """Convert all MOV files to MP4"""
    log("\n>>> Converting MOV files to MP4...")
    
    for mov_file in PORTFOLIO_DIR.rglob("*.mov"):
        if ".backup" in str(mov_file):
            continue
        
        mp4_file = mov_file.with_suffix(".mp4")
        
        if mp4_file.exists():
            log(f"SKIP: {mp4_file.name} already exists")
            continue
        
        log(f"CONVERT: {mov_file.name} → {mp4_file.name}")
        
        ffmpeg_args = [
            "-c:v", "libx264",
            "-preset", "slow",
            "-crf", "23",
            "-c:a", "aac",
            "-b:a", "128k",
            "-movflags", "+faststart"
        ]
        
        if run_ffmpeg(mov_file, mp4_file, ffmpeg_args):
            orig_size = get_file_size(mov_file)
            new_size = get_file_size(mp4_file)
            log(f"✓ DONE: {orig_size} → {new_size}")

def convert_gif_to_mp4():
    """Convert all GIF files to MP4"""
    log("\n>>> Converting GIF files to MP4...")
    
    for gif_file in PORTFOLIO_DIR.rglob("*.gif"):
        if ".backup" in str(gif_file):
            continue
        
        mp4_file = gif_file.with_suffix(".mp4")
        
        if mp4_file.exists():
            log(f"SKIP: {mp4_file.name} already exists")
            continue
        
        log(f"CONVERT: {gif_file.name} → {mp4_file.name}")
        
        ffmpeg_args = [
            "-c:v", "libx264",
            "-preset", "medium",
            "-crf", "20",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart"
        ]
        
        if run_ffmpeg(gif_file, mp4_file, ffmpeg_args):
            orig_size = get_file_size(gif_file)
            new_size = get_file_size(mp4_file)
            log(f"✓ DONE: {orig_size} → {new_size}")

def convert_images_to_webp():
    """Convert PNG/JPG images to WebP"""
    log("\n>>> Converting images to WebP...")
    
    for img_file in list(PORTFOLIO_DIR.rglob("*.png")) + list(PORTFOLIO_DIR.rglob("*.jpg")) + list(PORTFOLIO_DIR.rglob("*.jpeg")):
        if ".backup" in str(img_file):
            continue
        
        webp_file = img_file.with_suffix(".webp")
        
        if webp_file.exists():
            log(f"SKIP: {webp_file.name} already exists")
            continue
        
        # Determine quality
        quality = "85" if any(x in str(img_file).lower() for x in ["raw", "photo", "high", "dsc"]) else "80"
        
        log(f"CONVERT: {img_file.name} → {webp_file.name} (q:{quality})")
        
        ffmpeg_args = [
            "-c:v", "libwebp",
            "-quality", quality,
            "-lossless", "0",
            "-compression_level", "6"
        ]
        
        if run_ffmpeg(img_file, webp_file, ffmpeg_args):
            orig_size = get_file_size(img_file)
            new_size = get_file_size(webp_file)
            log(f"✓ DONE: {orig_size} → {new_size}")

def remove_duplicates():
    """Remove duplicate files"""
    duplicate = PORTFOLIO_DIR / "08-Theremin900" / "theremin copia.mp4"
    
    if duplicate.exists():
        log(f"\nDELETE: Removing duplicate file...")
        duplicate.unlink()
        log(f"✓ DONE: Deleted 08-Theremin900/theremin copia.mp4 (164 MB)")

def main():
    # Initialize log
    with open(LOG_FILE, "w") as f:
        f.write(f"=== PORTFOLIO MEDIA CONVERSION STARTED ===\n")
        f.write(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Directory: {PORTFOLIO_DIR}\n\n")
    
    log(f"=== PORTFOLIO MEDIA CONVERSION STARTED ===")
    log(f"Directory: {PORTFOLIO_DIR}")
    
    # Run conversions
    convert_mov_to_mp4()
    convert_gif_to_mp4()
    convert_images_to_webp()
    remove_duplicates()
    
    log(f"\n=== CONVERSION COMPLETED ===")
    log(f"Log saved to: {LOG_FILE}")

if __name__ == "__main__":
    main()
