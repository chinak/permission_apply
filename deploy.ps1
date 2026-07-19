# ============================================
# 一键部署脚本 - 构建并上传到服务器
# 用法: npm run deploy
# ============================================

# ===== 服务器配置 =====
$SERVER_IP = "111.231.55.6"
$SERVER_USER = "root"
$DEPLOY_PATH = "/var/www/management-platform"
# ======================

$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Deploy - Management Platform" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Build
Write-Host "[1/4] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build FAILED!" -ForegroundColor Red
    exit 1
}
Write-Host "Build OK" -ForegroundColor Green
Write-Host ""

# 2. Check dist
if (-not (Test-Path ".\dist")) {
    Write-Host "Error: dist directory not found" -ForegroundColor Red
    exit 1
}

# 3. Upload
Write-Host "[2/4] Uploading to server ($SERVER_USER@$SERVER_IP)..." -ForegroundColor Yellow
scp -r -q .\dist\* "${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Upload FAILED! Check SSH connection" -ForegroundColor Red
    exit 1
}
Write-Host "Upload OK" -ForegroundColor Green
Write-Host ""

# 4. Reload Nginx
Write-Host "[3/4] Reloading Nginx..." -ForegroundColor Yellow
ssh "${SERVER_USER}@${SERVER_IP}" "nginx -s reload 2>/dev/null; echo done"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Nginx reload failed (files uploaded, may need manual reload)" -ForegroundColor Yellow
} else {
    Write-Host "Nginx reloaded" -ForegroundColor Green
}
Write-Host ""

# 5. Done
Write-Host "[4/4] Deploy complete!" -ForegroundColor Green
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  URL: http://$SERVER_IP" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
