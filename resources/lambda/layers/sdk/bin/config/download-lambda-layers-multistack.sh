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
STACKS_ARRAY=`jq -r ".${ENVIRONMENT}.Parameters | keys_unsorted" cdk.context.json | tr -d '[],"'`
for STACK in $STACKS_ARRAY
do
  LAMBDA_LAYERS_ARRAY=`jq -r ".${ENVIRONMENT}.Parameters.${STACK} | keys_unsorted | map(select(startswith(\"LAMBDA_LAYER\")))" cdk.context.json | tr -d '[],"'`
  STACK_LOWERCASE_FIRST_LETTER=`echo ${STACK} | perl -ne 'print lcfirst'`
  printf "\033[1;35m$STACK_LOWERCASE_FIRST_LETTER download: \033[0m\n"
  for LAMBDA_LAYER_ENV_VARIABLE_NAME in $LAMBDA_LAYERS_ARRAY
  do
    printf "\033[1;36m$LAMBDA_LAYER_ENV_VARIABLE_NAME download: \033[0m\n"
    LAMBDA_LAYER_VERSION_ARN=`jq -r .${ENVIRONMENT}.Parameters.${STACK}.${LAMBDA_LAYER_ENV_VARIABLE_NAME} cdk.context.json`
    echo $LAMBDA_LAYER_VERSION_ARN
    LAMBDA_LAYER_VERSION_ARN_PARTS=(${LAMBDA_LAYER_VERSION_ARN//:/ })
    #
    curl $(aws lambda get-layer-version --layer-name ${LAMBDA_LAYER_VERSION_ARN_PARTS[6]} --version-number ${LAMBDA_LAYER_VERSION_ARN_PARTS[7]} --query Content.Location --output text) -o lambda-layer.zip
    mkdir -p resources/lambda/layers/sdk/${STACK_LOWERCASE_FIRST_LETTER}
    unzip -qo lambda-layer.zip -d resources/lambda/layers/sdk/${STACK_LOWERCASE_FIRST_LETTER}
    rm lambda-layer.zip
  done
done
exit 0