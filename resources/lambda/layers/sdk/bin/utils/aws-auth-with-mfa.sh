#!/usr/bin/env bash
#
# Install jq: brew install jq
# Add your ARN for MFA device - You can get it here: https://console.aws.amazon.com/iam/home#/security_credentials"
ARN_MFA_DEVICE=$1;
shift;
REST_OF_ARGUMENTS=$@
#
#
if [ "${ARN_MFA_DEVICE}" == "" ]; then
    echo "Please add the ARN of your MFA Device as a parameter"
    exit 0
fi
TMP_DIR="./aws-mfa"
mkdir -p $TMP_DIR
AWS_TOKEN_FILE=".awstoken"
# Function for prompting for MFA token code
promptForMFA(){
  while true; do
      read -p "Please input your 6 digit MFA token: " token
      case $token in
          [0-9][0-9][0-9][0-9][0-9][0-9] ) _MFA_TOKEN=$token; break;;
          * ) echo "Please enter a valid 6 digit pin." ;;
      esac
  done
  # Run the awscli command
  _authenticationOutput=`aws sts get-session-token --serial-number ${ARN_MFA_DEVICE} --token-code ${_MFA_TOKEN} ${REST_OF_ARGUMENTS}`
  # Save authentication to some file
  echo $_authenticationOutput > $TMP_DIR/$AWS_TOKEN_FILE;
}
# If token is present, retrieve it from file
# Else invoke the prompt for mfa function
if [ -e $TMP_DIR/$AWS_TOKEN_FILE ]; then
  _authenticationOutput=`cat $TMP_DIR/$AWS_TOKEN_FILE`
  _authExpiration=`echo $_authenticationOutput | jq -r '.Credentials.Expiration'`
  _nowTime=`date -u +'%Y-%m-%dT%H:%M:%SZ'`
  # Retrieving is not sufficient, since we are not sure if this token has expired
  # Check for the expiration value against the current time
  # If expired, invoke the prompt for mfa function
  if [ "$_authExpiration" \< "$_nowTime" ]; then
    echo "Your last token has expired"
    promptForMFA
  fi
else
  promptForMFA
fi
# "Return" the values to the calling script.
# There are a few ways to "return", for example writing to file
# Here, we assume that this script is "sourced" - see more on "sourcing" here: https://bash.cyberciti.biz/guide/Source_command
_AWS_ACCESS_KEY_ID=`echo ${_authenticationOutput} | jq -r '.Credentials.AccessKeyId'`
_AWS_SECRET_ACCESS_KEY=`echo ${_authenticationOutput} | jq -r '.Credentials.SecretAccessKey'`
_AWS_SESSION_TOKEN=`echo ${_authenticationOutput} | jq -r '.Credentials.SessionToken'`
echo "Please copy and paste the following lines back into the terminal and press enter: "
echo
echo export AWS_ACCESS_KEY_ID=${_AWS_ACCESS_KEY_ID}
echo
echo export AWS_SECRET_ACCESS_KEY=${_AWS_SECRET_ACCESS_KEY}
echo
echo export AWS_SESSION_TOKEN=${_AWS_SESSION_TOKEN}
rm -r $TMP_DIR