# SLO County Juvenile Hall App

## Database configuration: database
With a MySQL database initialized, run *db_config.sql* either with a MySQL client or the MySQL workbench. It can be initially populated by running *populate_relations.sql*, which will fill in information on rewards, behaviors, and locations. This is a mutable set of manually entered values, and it could be beneficial to replace this with a more efficient method in the future.
### Testing
You can use the remaining .sql file *testing.sql* to populate the database with sample juveniles. The APIs layed out in *apiGateway.json* can be tested through the console, or deployed and then called with URLs.
## Lambda configuration: lambda
updates can be made to each lambda function within this repository, and then running *update_lambda_function.sh* will configure the corresponding lambda function with the new code base. To do so, AWS CLI [access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey_CLIAPI) should be properly configured. Refer to the bash script for details.

#### Work-items, bug fixes, etc.
- 1.0.1 Officer user information decoupled between Amazon Cognito and Amazon RDS; full reliance on Amazon Cognito for user list and point assignment/reward claim tagging.
- 1.0.2 ...
