@echo off
echo ============================================================
echo   HMS DOCTOR ANDROID APPLICATION - BUILD & TEST RUNNER
echo   Location: E:\DOWNLOADS\Users\Mr.Ratul\Hospital_Android_Application\doctor-android
echo ============================================================
echo.

echo [1/3] Checking Gradle build environment...
if exist "gradlew.bat" (
    echo Gradle wrapper found.
) else (
    echo Error: gradlew.bat not found in current folder.
    pause
    exit /b 1
)

echo.
echo [2/3] Running Unit Tests and Architecture Verification...
call gradlew.bat testDebugUnitTest --continue

echo.
echo [3/3] Assembling Debug APK...
call gradlew.bat assembleDebug

echo.
echo ============================================================
echo   Build process completed!
echo   Debug APK Location: app\build\outputs\apk\debug\app-debug.apk
echo ============================================================
pause
