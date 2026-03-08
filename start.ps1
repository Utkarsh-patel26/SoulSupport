# SoulSupport Quick Start Script
# This script helps set up and start the SoulSupport application

# Get the directory where this script is located
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   SoulSupport Quick Start" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Helper function to remove directories with retries (handles locked files)
function Remove-DirectoryWithRetry {
    param([string]$Path, [int]$MaxRetries = 3)
    if (-not (Test-Path $Path)) { return }
    
    for ($i = 0; $i -lt $MaxRetries; $i++) {
        try {
            if (Get-Item $Path -EA SilentlyContinue) {
                robocopy "$Path" "$Path" /purge /s /q /r:0 /w:0 | Out-Null
                Remove-Item -Recurse -Force $Path -EA Stop
                return
            }
        }
        catch {
            if ($i -lt ($MaxRetries - 1)) {
                Start-Sleep -Milliseconds 500
            }
        }
    }
}

# Check Node.js installation
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js installed: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Check MongoDB installation
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "[OK] MongoDB is running" -ForegroundColor Green
}
else {
    Write-Host "[WARNING] MongoDB is not running!" -ForegroundColor Red
    Write-Host "Please start MongoDB or see USER_CONFIGURATION_GUIDE.md" -ForegroundColor Yellow
    $response = Read-Host "Continue anyway? (y/n)"
    if ($response -ne "y") {
        exit 1
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   Backend Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Backend setup
Set-Location backend

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "[ERROR] Backend .env file not found!" -ForegroundColor Red
    if (Test-Path .env.example) {
        Write-Host "Copying .env.example to .env..." -ForegroundColor Yellow
        Copy-Item .env.example .env
        Write-Host "[OK] Created .env file" -ForegroundColor Green
        Write-Host "[IMPORTANT] Please edit backend/.env with your configuration!" -ForegroundColor Yellow
        Write-Host "See USER_CONFIGURATION_GUIDE.md for help" -ForegroundColor Yellow
        $response = Read-Host "Press Enter after configuring .env"
    }
    else {
        Write-Host "[ERROR] .env.example not found!" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "[OK] Backend .env file exists" -ForegroundColor Green
}

# Install backend dependencies only if missing
if (-not (Test-Path node_modules)) {
    Write-Host "Installing backend dependencies (first run)..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Backend dependencies installed" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "[OK] Backend dependencies already installed (skipping install)" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   Frontend Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Frontend setup
Set-Location frontend

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "[ERROR] Frontend .env.local file not found!" -ForegroundColor Red
    if (Test-Path .env.local.example) {
        Write-Host "Copying .env.local.example to .env.local..." -ForegroundColor Yellow
        Copy-Item .env.local.example .env.local
        Write-Host "[OK] Created .env.local file" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] .env.local.example not found!" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "[OK] Frontend .env.local file exists" -ForegroundColor Green
}

# Install frontend dependencies only if missing
if (-not (Test-Path node_modules)) {
    Write-Host "Installing frontend dependencies (first run)..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Frontend dependencies installed" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "[OK] Frontend dependencies already installed (skipping install)" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   Starting Services" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting backend and frontend servers..." -ForegroundColor Yellow
Write-Host "This will open two new terminal windows." -ForegroundColor Yellow
Write-Host ""

# Start backend in new terminal only if port 5000 is not already occupied
$backendListener = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($backendListener) {
    Write-Host "[INFO] Backend already running on port 5000 (PID: $($backendListener.OwningProcess)). Skipping backend start." -ForegroundColor Yellow
}
else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'Starting Backend Server...' -ForegroundColor Cyan; npm run dev"
}

# Wait a moment before starting frontend
Start-Sleep -Seconds 2

# Start frontend in new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'Starting Frontend Server...' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "Frontend App: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check the new terminal windows for server logs." -ForegroundColor Yellow
Write-Host "Press Ctrl+C in each terminal to stop the servers." -ForegroundColor Yellow
Write-Host ""
Write-Host "Happy coding!" -ForegroundColor Green
