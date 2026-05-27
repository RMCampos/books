#!/bin/bash

docker run -it --rm --name books -p 3000:3000 ghcr.io/rmcampos/books/app:latest
