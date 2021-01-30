# SLO County Juvenile Hall Apps

### backend
- Code to initialize RDS database tables, AWS Lambda Functions, and an API Gateway
- AWS CloudFormation templates for configuring AWS environment
#### lambda
1. getJuvenileData

    This lambda function mediates the transfer of the following information between API Gateway and Amazon RDS:
    - rewards
    - behaviors
    - locations
    - juveniles
    - transactions
    - modifications (to point totals)

2. updateJuvenile

    This supports an API to create/delete a user, or to set a current user as active or inactive in the database.

3. updatePoints

    This function modifies a user's point totals, by increasing/decreasing, or performing an administrative update to the point total.

4. validateOfficer

    This is a Cognito Trigger that is invoked upon sign-up, restricting the access of credentials to a set of email domains.

To update and publish lambda function code form the CLI (AWS CLI installation required):
```
zip -r zipFile.zip <lambdaFunctionName> [...]
aws lambda update-function-code --function-name <lambdaFunctionName> --zip-file fileb://zipFile.zip
```

extra 'files' to include in zip -> pymysql, utility.py

#### database
.sql scripts are supplied here to initialize the database with Tables as well as populate the tables with test data or rewards, locations, etc. data.

### checkout
[README](checkout/README.md)