#!/bin/sh

set -e

pnpm i --frozen-lockfile

cd docs && pnpm i pro-design-vue@latest

cd .. && pnpm docs:build

echo "✅ Build completed"
