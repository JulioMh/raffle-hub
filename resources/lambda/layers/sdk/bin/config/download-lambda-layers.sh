#!/usr/bin/env bash
#
printf "\033[1;34mRunning download-lambda-layers\033[0m\n"
ENVIRONMENT=$1;
shift;
#
if [ "${ENVIRONMENT}" != "sbx" ] && [ "${ENVIRONMENT}" != "dev" ] && [ "${ENVIRONMENT}" != "prod" ]
then
  echo "Please add the environment as a parameter. Possible values are sbx, dev and prod"
  exit 1
fi
rm -r resources/lambda/layers/sdk||:
LAMBDA_LAYERS_ARRAY=`jq -r ".${ENVIRONMENT}.Parameters | keys_unsorted | map(select(startswith(\"LAMBDA_LAYER\")))" cdk.context.json | tr -d '[],"'`
for LAMBDA_LAYER_ENV_VARIABLE_NAME in $LAMBDA_LAYERS_ARRAY
do
  printf "\033[1;35m$LAMBDA_LAYER_ENV_VARIABLE_NAME download: \033[0m\n"
  LAMBDA_LAYER_VERSION_ARN=`jq -r .${ENVIRONMENT}.Parameters.${LAMBDA_LAYER_ENV_VARIABLE_NAME} cdk.context.json`
  echo $LAMBDA_LAYER_VERSION_ARN
  LAMBDA_LAYER_VERSION_ARN_PARTS=(${LAMBDA_LAYER_VERSION_ARN//:/ })
  #
  curl $(aws lambda get-layer-version --layer-name ${LAMBDA_LAYER_VERSION_ARN_PARTS[6]} --version-number ${LAMBDA_LAYER_VERSION_ARN_PARTS[7]} --query Content.Location --output text) -o lambda-layer.zip
  mkdir -p resources/lambda/layers/sdk
  unzip -qo lambda-layer.zip -d resources/lambda/layers/sdk
  rm lambda-layer.zip
done