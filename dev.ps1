# SoulSupport Development Helper Script
# Provides useful commands for development

param(
    [Parameter(Position=0)]
    [ValidateSet('help', 'start', 'stop', 'reset', 'test', 'build', 'logs')]
    [string]$Command = 'help'
)

function Show-Help {
    Write-Host ""
    Write-Host "SoulSupport Development Helper" -ForegroundColor Cyan
    Write-Host "==============================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\dev.ps1 <command>" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  help    - Show this help message"
    Write-Host "  start   - Start development servers"
    Write-Host "  stop    - Stop running servers"
    Write-Host "  reset   - Reset database and reinstall dependencies"
    Write-Host "  test    - Run tests"
    Write-Host "  build   - Build for production"
    Write-Host "  logs    - Show application logs"
    Write-Host ""
}

function Start-Servers {
    Write-Host "Starting development servers..." -ForegroundColor Cyan
    
    # Start backend
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"
    
    # Start frontend
    Start-Sleep -Seconds 2
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"
    
    Write-Host "Servers started!" -ForegroundColor Green
    Write-Host "Backend: http://localhost:5000/api" -ForegroundColor Yellow
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
}

function Stop-Servers {
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    
    # Kill Node.js processes (be careful with this in production!)
    $processes = Get-Process node -ErrorAction SilentlyContinue
    if ($processes) {
        $processes | Stop-Process -Force
        Write-Host "Servers stopped!" -ForegroundColor Green
    } else {
        Write-Host "No running servers found." -ForegroundColor Yellow
    }
}

function Reset-Project {
    Write-Host "Resetting project..." -ForegroundColor Yellow
    Write-Host "This will:" -ForegroundColor Red
    Write-Host "  - Remove all node_modules" -ForegroundColor Red
    Write-Host "  - Clear MongoDB database" -ForegroundColor Red
    Write-Host "  - Reinstall dependencies" -ForegroundColor Red
    Write-Host ""
    $confirm = Read-Host "Are you sure? (yes/no)"
    
    if ($confirm -eq "yes") {
        # Stop servers
        Stop-Servers
        
        # Remove node_modules
        Write-Host "Removing node_modules..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force .\backend\node_modules -ErrorAction SilentlyContinue
        Remove-Item -Recurse -Force .\frontend\node_modules -ErrorAction SilentlyContinue
        
        # Clear MongoDB
        Write-Host "Clearing database..." -ForegroundColor Yellow
        mongosh soulsupport --eval "db.dropDatabase()" 2>$null
        
        # Reinstall dependencies
        Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
        Set-Location backend
        npm install
        Set-Location ..
        
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        Set-Location frontend
        npm install
        Set-Location ..
        
        Write-Host "Reset complete!" -ForegroundColor Green
    } else {
        Write-Host "Reset cancelled." -ForegroundColor Yellow
    }
}

function Run-Tests {
    Write-Host "Running tests..." -ForegroundColor Cyan
    
    Write-Host "Backend tests:" -ForegroundColor Yellow
    Set-Location backend
    npm test
    Set-Location ..
    
    Write-Host "Frontend tests:" -ForegroundColor Yellow
    Set-Location frontend
    npm test
    Set-Location ..
}

function Build-Project {
    Write-Host "Building for production..." -ForegroundColor Cyan
    
    Write-Host "Building frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm run build
    Set-Location ..
    
    Write-Host "Build complete!" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "Opening logs..." -ForegroundColor Cyan
    
    if (Test-Path .\backend\logs) {
        Get-Content .\backend\logs\*.log -Tail 50 -Wait
    } else {
        Write-Host "No log files found." -ForegroundColor Yellow
    }
}

# Execute command
switch ($Command) {
    'help' { Show-Help }
    'start' { Start-Servers }
    'stop' { Stop-Servers }
    'reset' { Reset-Project }
    'test' { Run-Tests }
    'build' { Build-Project }
    'logs' { Show-Logs }
}
