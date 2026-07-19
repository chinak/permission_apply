# ============================================
# One-click startup script - local dev server
# Usage: powershell -ExecutionPolicy Bypass -File start.ps1
#        or npm start
# ============================================

$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Start - Management Platform" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check node_modules
if (-not (Test-Path ".\node_modules")) {
    Write-Host "[1/3] node_modules not found, installing dependencies..." -ForegroundColor Yellow

    # Prefer pnpm, fallback to npm
    $usePnpm = $true
    try {
        $null = Get-Command pnpm -ErrorAction Stop
    } catch {
        $usePnpm = $false
    }

    if ($usePnpm) {
        pnpm install
    } else {
        Write-Host "pnpm not found, using npm" -ForegroundColor Yellow
        npm install
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Install FAILED!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Install OK" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[1/3] Dependencies OK, skip install" -ForegroundColor Green
    Write-Host ""
}

# 2. Check port 5173
$portInUse = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "[2/3] WARNING: Port 5173 is in use, Vite may already be running" -ForegroundColor Yellow
    Write-Host "        Stop the existing process to restart" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "[2/3] Port 5173 is free" -ForegroundColor Green
    Write-Host ""
}

# 3. Start dev server
Write-Host "[3/3] Starting Vite dev server..." -ForegroundColor Yellow
Write-Host ""

# Pick package manager
try {
    $null = Get-Command pnpm -ErrorAction Stop
    pnpm dev
} catch {
    npm run dev
}
