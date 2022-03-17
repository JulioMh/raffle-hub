#!/usr/bin/env bash
#
npmInstall(){
  packageJson=`ls -1 package.json 2>/dev/null | wc -l`
  if [ $packageJson -eq 1 ]
    then
      npm install
    else
      echo "This folder does not contain a package.json file"
  fi
}
#
npmInstallInSubfoldersFunctions(){
  printf "\033[1;35mFunctions: \033[0m\n"
  for folder in *
  do
    cd $folder
    printf "\033[1;36m$folder: \033[0m\n"
    npmInstall
    cd ..
  done
}
#
npmInstallInSubfoldersLayers(){
  printf "\033[1;35mLayers: \033[0m\n"
  for folder in *
  do
    cd $folder
    printf "\033[1;36m$folder: \033[0m\n"
    if [ -d "nodejs" ]
    then
      cd nodejs
      npmInstall
      cd ..
    else
      echo "This folder does not contain a nodejs folder"
    fi
    cd ..
  done
}
#
npmInstallRecursive(){
  cd lambda
  if [ -d "functions" ]
  then
    cd functions
    npmInstallInSubfoldersFunctions
    cd ..
  fi
  if [ -d "layers" ]
  then
    cd layers
    npmInstallInSubfoldersLayers
    cd ..
  fi
  cd ..
}
# MAIN
printf "\033[1;34mRunning npm-install-recursive\033[0m\n"
COMPILED_FOLDER=$1
if [ -z "$COMPILED_FOLDER" ]
then
  printf "\033[1;35mRoot folder: \033[0m\n"
  npm install
else
  printf "\033[1;35m$COMPILED_FOLDER folder: \033[0m\n"
  cd $COMPILED_FOLDER
fi
#
cd resources
if [ -d "lambda" ]
then
  npmInstallRecursive
else #MULTISTACK
  for folder in *
  do
    cd $folder
    printf "\033[1;35m$folder: \033[0m\n"
    npmInstallRecursive
    cd ..
  done
fi
exit $?