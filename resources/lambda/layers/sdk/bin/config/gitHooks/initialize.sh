#!/usr/bin/env bash
if [ -d ".git" ]
then
  printf "\033[1;34mUpdating git hooks\033[0m\n"
  cp resources/lambda/layers/sdk/bin/config/gitHooks/pre-commit.py ./.git/hooks/pre-commit
  chmod +x ./.git/hooks/pre-commit
fi