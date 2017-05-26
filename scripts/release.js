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
const builder = require("electron-builder")
const Platform = builder.Platform

let gitTag = ''
let sha = ''
if (process.env.TRAVIS) {
  gitTag = process.env.TRAVIS_TAG
  sha = process.env.TRAVIS_COMMIT
} else if (process.env.APPVEYOR) {
  gitTag = process.env.APPVEYOR_REPO_TAG_NAME
  sha = process.env.APPVEYOR_REPO_COMMIT
}

let target = ''

if (process.platform === 'darwin') {
  target = Platform.MAC.createTarget()
} else if (process.platform === 'win32') {
  target = Platform.WINDOWS.createTarget()
} else if (process.platform === 'linux') {
  target = Platform.LINUX.createTarget()
} else {
  console.error(`I dunno how to publish a release for ${process.platform} :(`)
  process.exit(1)
}

let version = ''
if (gitTag) {
  version = gitTag

  builder.build({
    targets: target,
    config: {
      "appId": "com.electron.playground",
      "productName": "Electron Playground",
      "mac": {
        "category": "com.electron.playground"
      }
    }
  })
    .then(() => {
      console.log('Packing success.')
    })
    .catch((error) => {
      console.error(`${error}`)
      process.exit(1)
    })
}
else {
  console.log('No git tag')
  // TODO: Need it?
  version = sha.substr(0, 8)
}
