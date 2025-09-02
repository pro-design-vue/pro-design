#!/bin/sh

set -e

pnpm i --frozen-lockfile
pnpm update:version

pnpm build

cd dist/pro-design-vue
npm publish --provenance
cd -

echo "✅ Publish completed"
