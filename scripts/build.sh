yarn run test

if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]; then
     yarn run release;
  else
    echo "It is not release job. Release is not created"
fi
