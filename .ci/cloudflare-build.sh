#! /bin/bash

# @author Amit Chauhan
# Cloudflare Pages build script
# Currently, we don't have a branch specific build script.
# So we are using the same script for both production and staging.

# if [ "$CF_PAGES_BRANCH" == "main" ]; then
#   # Run the "production" deploy script in package.json on the "production" branch
#   pnpm run build:cloudflare-production
# else
#   # Else run the staging script
#   pnpm run build:cloudflare-staging
# fi

pnpm run build