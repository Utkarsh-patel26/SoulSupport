# SoulSupport Stop Script
# Stops local dev servers used by this workspace without killing unrelated apps.

$ErrorActionPreference = 'SilentlyContinue'

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   SoulSupport Stop Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$portsToCheck = @(5000, 3000, 3001, 3002, 3003, 3004, 3010)
$stoppedPids = @()

function Stop-ByPort {
    param(
        [int]$Port
    )

    $listeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    foreach ($listener in $listeners) {
        $owningPid = $listener.OwningProcess
        if ($owningPid -and ($stoppedPids -notcontains $owningPid)) {
            if ($owningPid -eq $PID) {
                Write-Host "[SKIP] Port $Port is attached to current script process PID $owningPid" -ForegroundColor DarkYellow
                continue
            }

            $proc = Get-Process -Id $owningPid
            if ($proc) {
                if ($proc.ProcessName -in @('powershell', 'pwsh')) {
                    $children = Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $owningPid -and $_.Name -eq 'node.exe' }
                    if ($children) {
                        foreach ($child in $children) {
                            if ($stoppedPids -notcontains $child.ProcessId) {
                                Write-Host "[STOP] Port $Port -> child node PID $($child.ProcessId) (parent $owningPid)" -ForegroundColor Yellow
                                Stop-Process -Id $child.ProcessId -Force
                                $script:stoppedPids += $child.ProcessId
                            }
                        }
                    }
                    else {
                        Write-Host "[STOP] Port $Port -> PID $owningPid ($($proc.ProcessName))" -ForegroundColor Yellow
                        Stop-Process -Id $owningPid -Force
                        $script:stoppedPids += $owningPid
                    }
                }
                else {
                    Write-Host "[STOP] Port $Port -> PID $owningPid ($($proc.ProcessName))" -ForegroundColor Yellow
                    Stop-Process -Id $owningPid -Force
                    $script:stoppedPids += $owningPid
                }
            }
        }
    }
}

foreach ($port in $portsToCheck) {
    Stop-ByPort -Port $port
}

# Extra safety: kill stray Node processes only if command line includes this workspace path.
$workspacePath = (Get-Location).Path
$nodeProcesses = Get-CimInstance Win32_Process | Where-Object {
    $_.Name -eq 'node.exe' -and $_.CommandLine -like "*$workspacePath*"
}

foreach ($proc in $nodeProcesses) {
    $nodePid = $proc.ProcessId
    if ($nodePid -eq $PID) {
        Write-Host "[SKIP] Current script PID $nodePid" -ForegroundColor DarkYellow
        continue
    }
    if ($stoppedPids -notcontains $nodePid) {
        Write-Host "[STOP] Workspace node PID $nodePid" -ForegroundColor Yellow
        Stop-Process -Id $nodePid -Force
        $stoppedPids += $nodePid
    }
}

Write-Host ""
if ($stoppedPids.Count -eq 0) {
    Write-Host "[INFO] No SoulSupport dev servers were running." -ForegroundColor Green
}
else {
    Write-Host "[OK] Stopped $($stoppedPids.Count) process(es)." -ForegroundColor Green
}

Write-Host ""
Write-Host "Tip: Run .\start.ps1 to launch fresh servers." -ForegroundColor Cyan
