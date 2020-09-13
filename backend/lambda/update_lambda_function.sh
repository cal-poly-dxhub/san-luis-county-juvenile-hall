#!/bin/bash
#script takes the name of the lambda function (same as the folder name in ./lambda/)

if [ $# != 1 ];
then
    echo "** error: invalid use **"
    echo "-> bash update_lambda_function.sh <function_name>"
    echo "-> functions: getJuvenileData, updateJuvenile, updatePoints"
    exit 1
fi

lambdaFunctionName=$1

if [ $lambdaFunctionName != "validateOfficer" ];
then
    cp -R pymysql $lambdaFunctionName/.
fi

cd $lambdaFunctionName

zip zipFile.zip -r *
aws lambda update-function-code --function-name $lambdaFunctionName --zip-file fileb://zipFile.zip
rm zipFile.zip

if [ $lambdaFunctionName != "validateOfficer" ];
then
    rm -r pymysql
fi
