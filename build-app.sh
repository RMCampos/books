#!/bin/bash

source .env.prod

docker build --no-cache --progress=plain \
  --build-arg VITE_CONVEX_URL="$VITE_CONVEX_URL" \
  --build-arg VITE_CLERK_PUBLISHABLE_KEY="$VITE_CLERK_PUBLISHABLE_KEY" \
  -t docker.io/rmcampos/books:latest .
