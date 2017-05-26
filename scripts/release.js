'use strict';

let branchName = ''
let pullRequestNr = ''

if (process.env.TRAVIS) {
  branchName = process.env.TRAVIS_BRANCH
  pullRequestNr = TRAVIS_PULL_REQUEST
} else if (process.env.APPVEYOR) {
  branchName = process.env.APPVEYOR_REPO_BRANCH
  pullRequestNr = APPVEYOR_PULL_REQUEST_NUMBER
}

console.log({ branchName, pullRequestNr })
