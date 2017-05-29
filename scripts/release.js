'use strict';

if (!process.env.CI) {
  console.error('Create release only on CI server')
  process.exit(1)
}

let branchName = ''
let pullRequestNr = ''
let gitTag = ''

if (process.env.TRAVIS) {
  branchName = process.env.TRAVIS_BRANCH
  pullRequestNr = process.env.TRAVIS_PULL_REQUEST
  gitTag = process.env.TRAVIS_TAG
} else if (process.env.APPVEYOR) {
  branchName = process.env.APPVEYOR_REPO_BRANCH
  pullRequestNr = process.env.APPVEYOR_PULL_REQUEST_NUMBER
  gitTag = process.env.APPVEYOR_REPO_TAG_NAME
}

console.log({ branchName, pullRequestNr, gitTag })

const isReleaseCommit = branchName === gitTag

if (!isReleaseCommit) {
  console.log('It is not a release task. Skipping publish.')
  process.exit(0)
}


const fs = require('fs-extra')
const cp = require('child_process')
const path = require('path')
const builder = require("electron-builder")
const Platform = builder.Platform

let sha = ''
if (process.env.TRAVIS) {
  sha = process.env.TRAVIS_COMMIT
} else if (process.env.APPVEYOR) {
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

if (process.platform === 'darwin') {
  require('./setup-macos-keychain').registerKeyChain()
}

let version = ''
if (gitTag) {
  version = gitTag

  builder.build({
    targets: target,
    config: {
      appId: "com.electron.playground",
      productName: "Electron Playground",
      mac: {
        "category": "com.electron.playground"
      },
      publish: 'github'
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
