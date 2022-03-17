#!/usr/bin/env python3
from subprocess import check_call
import sys
import os
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

try:
  check_call(["npm","run","test:silent"])
  print(bcolors.OKGREEN+'Test passed!'+bcolors.ENDC);
except:
  print(bcolors.FAIL+'Unit test Failed'+bcolors.ENDC);
  sys.exit(1)
try:
  check_call(["npx", "eslint", "resources/", "--cache", "--quiet"])
  check_call(["npx", "eslint", "bin/", "--cache", "--quiet"])
  check_call(["npx", "eslint", "lib/", "--cache", "--quiet"])
  check_call(["npx", "eslint", "tests/", "--cache", "--quiet"])
  if os.path.isdir('openapi'):
    check_call(["npx", "eslint", "openapi/", "--cache", "--quiet"])
  print(bcolors.OKCYAN+'Linter passed!'+bcolors.ENDC);
except:
  print(bcolors.FAIL+'Linter Failed'+bcolors.ENDC);
  sys.exit(1)
