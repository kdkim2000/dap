# smoke.ps1 - DAP Master run & verify driver
# Usage: powershell -ExecutionPolicy Bypass -File smoke.ps1 [dev|build|check|stop]
#   dev   : start dev server, warm up, smoke-test (default)
#   build : production build
#   check : smoke-test a running server (skip start, includes warm-up)
#   stop  : kill process on port 3000

param([string]$Mode = "dev")

$PORT = 3000
$BASE = "http://127.0.0.1:$PORT"
$ROOT = (Resolve-Path (Join-Path $PSScriptRoot "../../..")).Path
$LOG  = "C:\Temp\next-dev.log"

function Wait-Page([string]$Url, [int]$TimeoutSec = 60) {
    # Wait until a URL returns 200 (Next.js compiles on first request)
    $deadline = (Get-Date).AddSeconds($TimeoutSec)
    while ((Get-Date) -lt $deadline) {
        try {
            $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
            if ($r.StatusCode -eq 200) { return $true }
        } catch {}
        Start-Sleep 3
    }
    return $false
}

function WarmUp {
    # Hit key pages to trigger SSG compilation before smoke test
    Write-Host "Warming up pages (triggering SSG compilation)..."
    $warmRoutes = @("/", "/theory", "/quiz", "/theory/part1_ch1", "/quiz/chapter/part1_ch1", "/quiz/exam")
    foreach ($r in $warmRoutes) {
        $ok = Wait-Page -Url "$BASE$r" -TimeoutSec 90
        if ($ok) { Write-Host "  ready $r" }
        else { Write-Host "  TIMEOUT $r - continuing anyway" }
    }
}

function Stop-Server {
    $pids = netstat -ano | Select-String ":$PORT\s.*LISTENING" |
        ForEach-Object { ($_ -split '\s+')[-1] } | Sort-Object -Unique
    foreach ($p in $pids) {
        if ($p -match '^\d+$') {
            Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
            Write-Host "  killed PID $p"
        }
    }
}

function Run-Smoke {
    $pass = 0; $fail = 0

    # --- HTTP status checks ---
    Write-Host ""
    Write-Host "[HTTP STATUS]"
    $routes = @(
        "/", "/theory", "/quiz", "/quiz/exam",
        "/quiz/wrong", "/quiz/bookmarks",
        "/theory/part1_ch1", "/theory/part4_ch4",
        "/quiz/chapter/part1_ch1", "/quiz/chapter/part4_ch4"
    )
    foreach ($r in $routes) {
        try {
            $code = (Invoke-WebRequest -Uri "$BASE$r" -UseBasicParsing -TimeoutSec 30).StatusCode
            if ($code -eq 200) { Write-Host "  PASS $r"; $pass++ }
            else { Write-Host "  FAIL $r -> $code"; $fail++ }
        } catch {
            Write-Host "  FAIL $r -> $($_.Exception.Message.Split('.')[0])"; $fail++
        }
    }

    # --- Content checks ---
    Write-Host ""
    Write-Host "[CONTENT CHECK]"

    $html = (Invoke-WebRequest -Uri "$BASE/" -UseBasicParsing -TimeoutSec 15).Content
    if ($html -match "quiz|theory|part1") {
        Write-Host "  PASS homepage contains nav links"; $pass++
    } else {
        Write-Host "  FAIL homepage nav links missing"; $fail++
    }

    $th = (Invoke-WebRequest -Uri "$BASE/theory/part1_ch1" -UseBasicParsing -TimeoutSec 15).Content
    if ($th -match "EA|Enterprise|part1") {
        Write-Host "  PASS theory/part1_ch1 has chapter content"; $pass++
    } else {
        Write-Host "  FAIL theory/part1_ch1 content missing"; $fail++
    }

    $qz = (Invoke-WebRequest -Uri "$BASE/quiz/chapter/part1_ch1" -UseBasicParsing -TimeoutSec 15).Content
    if ($qz -match "p1c1|quiz|part1|question") {
        Write-Host "  PASS quiz/chapter/part1_ch1 has question content"; $pass++
    } else {
        Write-Host "  FAIL quiz/chapter/part1_ch1 content missing"; $fail++
    }

    $ex = (Invoke-WebRequest -Uri "$BASE/quiz/exam" -UseBasicParsing -TimeoutSec 15).Content
    if ($ex -match "exam|timer|quiz") {
        Write-Host "  PASS quiz/exam page renders"; $pass++
    } else {
        Write-Host "  FAIL quiz/exam page content missing"; $fail++
    }

    # --- 404 check ---
    Write-Host ""
    Write-Host "[404 CHECK]"
    try {
        Invoke-WebRequest -Uri "$BASE/theory/part99_ch1" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop | Out-Null
        Write-Host "  WARN /theory/part99_ch1 returned 200 (check fallback:false in getStaticPaths)"
    } catch {
        Write-Host "  PASS /theory/part99_ch1 -> 404 (expected)"; $pass++
    }

    # --- Summary ---
    Write-Host ""
    Write-Host "================================="
    Write-Host "Result: $pass passed / $fail failed"
    if ($fail -gt 0) { exit 1 }
}

# ── Main dispatch ──────────────────────────────────────────────────────────────
switch ($Mode.ToLower()) {

    "stop" {
        Write-Host "Stopping server on port $PORT..."
        Stop-Server
    }

    "build" {
        Write-Host "Running production build..."
        Set-Location $ROOT
        npx next build 2>&1 | Tee-Object -FilePath "C:\Temp\next-build.log" |
            Select-String "(Route|SSG|Error|warn|Failed)" | Select-Object -Last 30
        if ($LASTEXITCODE -ne 0) {
            Write-Host "BUILD FAILED - see C:\Temp\next-build.log"
            exit 1
        }
        Write-Host "BUILD OK"
    }

    "check" {
        Write-Host "Smoke-testing server at $BASE ..."
        WarmUp
        Run-Smoke
    }

    default {
        # dev: clear stale cache, start fresh, warm up, smoke
        Write-Host "Clearing stale .next cache..."
        Remove-Item -Recurse -Force (Join-Path $ROOT ".next") -ErrorAction SilentlyContinue
        Stop-Server

        Write-Host "Starting dev server on port $PORT..."
        Set-Location $ROOT
        Start-Process -FilePath "cmd.exe" `
            -ArgumentList "/c npx next dev --port $PORT > $LOG 2>&1" `
            -WindowStyle Hidden

        Write-Host "Waiting for initial server response..."
        if (-not (Wait-Page -Url "$BASE/" -TimeoutSec 40)) {
            Write-Host "ERROR: server did not start in time"
            Get-Content $LOG -Tail 10
            exit 1
        }
        Write-Host "Server is up -> $BASE"
        WarmUp
        Run-Smoke
        Write-Host ""
        Write-Host "Server still running. Stop with: powershell -File .claude\skills\run-dap-master\smoke.ps1 stop"
    }
}
