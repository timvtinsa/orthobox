#!/bin/sh
# Cloudflare's Deploy command (Workers & Pages > Settings > Build > Deploy
# command), replacing the default `npx wrangler deploy`.
#
# Workers Builds triggers a build on every push to the production branch
# (`main`), but only a release should actually reach production: release-please
# is what tags a release, on `main`, when its release pull request is merged.
# So this only runs `wrangler deploy` when the commit Workers Builds just
# checked out is one of those tagged commits, and simply skips deploying
# otherwise (exit 0: an ordinary push to `main` skipping deploy is not a build
# failure).
set -eu

sha=$(git rev-parse HEAD)

if git ls-remote --tags origin | cut -f1 | grep -qx "$sha"; then
  echo "HEAD ($sha) is tagged: deploying."
  npx wrangler deploy
else
  echo "HEAD ($sha) is not tagged: not a release, skipping deploy."
fi
