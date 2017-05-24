npm run test

if %TRAVIS_BRANCH% == "master"  (
    if  %TRAVIS_PULL_REQUEST% == "false" (
     npm run release;
    ) else (
       echo "It is not release job. Release is not created"
    )
 ) else (
    echo "It is not release job. Release is not created"
 )
