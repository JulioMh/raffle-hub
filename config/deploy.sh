#!/bin/bash

path=$HOME/tmp/wealth

while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -d|--dev)
      branch=dev
      shift;;
    -p|--prod)
      branch=master
      shift;;
    *) shift;;
  esac
done

echo "-------------------------"
echo "Clone branch $branch from GitLab"
echo "-------------------------"
git clone --branch $branch git@gitlab.com:sync-backend/wealth/sync-wealth-ms.git $path

cd $path
echo "-------------------------"
echo "Point to CodeCommit"
echo "-------------------------"
git remote rm origin
git remote add origin codecommit::eu-west-2://sync-wealth
git remote -v

echo "-------------------------"
echo "Push to CodeCommit, it might fail if you haven't log into AWS"
echo "-------------------------"
git push --set-upstream origin $branch

echo "-------------------------"
echo "Reset origin"
echo "-------------------------"
git remote rm origin
git remote add origin git@gitlab.com:sync-backend/wealth/sync-wealth-ms.git

echo "-------------------------"
echo "Remove temp"
echo "-------------------------"
cd $current_path
rm -rf $path
