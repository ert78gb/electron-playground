'use strict';

let branchName = ''
let pullRequestNr = ''

if (process.env.TRAVIS) {
  branchName = process.env.TRAVIS_BRANCH
  pullRequestNr = process.env.TRAVIS_PULL_REQUEST
} else if (process.env.APPVEYOR) {
  branchName = process.env.APPVEYOR_REPO_BRANCH
  pullRequestNr = process.env.APPVEYOR_PULL_REQUEST_NUMBER
}

console.log({ branchName, pullRequestNr })

if (branchName !== 'master' || pullRequestNr) {
  console.log('It is not a release task. Skipping publish.')
  process.exit(0)
}

const fs = require('fs-extra')
const cp = require('child_process')

console.log('Packaging...')
cp.execSync('npm run semantic-release')
