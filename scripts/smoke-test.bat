@echo off
REM Smoke test script - verifies project builds and runs
echo ========================================
echo  Library Seat Reservation - Smoke Test
echo ========================================
echo.

echo [1/4] Checking dotnet build...
dotnet build src\LibrarySeatReservation.Web\LibrarySeatReservation.Web.csproj 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [FAIL] dotnet build failed
    exit /b 1
)
echo [PASS] dotnet build succeeded
echo.

echo [2/4] Checking npm packages...
if not exist node_modules (
    echo [INFO] node_modules not found, running npm install...
    call npm install
)
echo [PASS] npm packages ready
echo.

echo [3/4] Checking Playwright browsers...
npx playwright install --with-deps chromium 2>&1 | findstr /C:"already" >nul
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Playwright browsers ready
) else (
    echo [INFO] Playwright browsers installed
)
echo.

echo [4/4] Running Playwright smoke tests...
npx playwright test --project=chromium tests\e2e\smoke.spec.js
if %ERRORLEVEL% NEQ 0 (
    echo [FAIL] Smoke tests failed
    exit /b 1
)
echo [PASS] Smoke tests passed
echo.

echo ========================================
echo  ALL SMOKE TESTS PASSED
echo ========================================
exit /b 0
