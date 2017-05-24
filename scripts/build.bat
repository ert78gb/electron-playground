@ECHO off

SETLOCAL ENABLEEXTENSIONS

if /I %APPVEYOR_REPO_BRANCH% == "master"  (
     if NOT DEFINED APPVEYOR_PULL_REQUEST_NUMBER (
     npm run dist
    ) else (
       ECHO "1. It is not release job. Release is not created"
    )
 ) else (
    ECHO "2. It not master branch. Release is not created"
 )

ENDLOCAL
