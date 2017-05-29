#!/bin/sh

openssl aes-256-cbc -K $encrypted_04061b49eb95_key -iv $encrypted_04061b49eb95_iv -in developer-id-cert.p12.enc -out developer-id-cert.p12 -d

KEY_CHAIN=mac-build.keychain
security create-keychain -p travis $KEY_CHAIN
security default-keychain -s $KEY_CHAIN
security unlock-keychain -p travis $KEY_CHAIN
security set-keychain-settings -t 3600 -u $KEY_CHAIN

security import developer-id-cert.p12 -k $KEY_CHAIN -P $KEY_PASSWORD -T /usr/bin/codesign
