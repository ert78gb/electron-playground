@ECHO off

SETLOCAL

npm run test

if /I %TRAVIS_BRANCH% == "master"  (
    if /I %TRAVIS_PULL_REQUEST% == "false" (
     npm run release;
    ) else (
       ECHO "1. It is not release job. Release is not created"
    )
 ) else (
    ECHO "2. It is not release job. Release is not created"
 )

ENDLOCAL
