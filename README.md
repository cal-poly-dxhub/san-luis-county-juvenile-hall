# Collaboration

Thanks for your interest in our solution. Having specific examples of replication and usage allows us to continue to grow and scale our work. If you clone or use this repository, kindly shoot us a quick email to let us know you are interested in this work!

<wwps-cic@amazon.com>

# Disclaimers

**Customers are responsible for making their own independent assessment of the information in this document.**

**This document:**


Customers are responsible for making their own independent assessment of the information in this document. 

This document: 

(a) is for informational purposes only, 

(b) references AWS product offerings and practices, which are subject to change without notice, 

(c) does not create any commitments or assurances from AWS and its affiliates, suppliers or licensors. AWS products or services are provided “as is” without warranties, representations, or conditions of any kind, whether express or implied. The responsibilities and liabilities of AWS to its customers are controlled by AWS agreements, and this document is not part of, nor does it modify, any agreement between AWS and its customers, and 

(d) is not to be considered a recommendation or viewpoint of AWS. 

Additionally, you are solely responsible for testing, security and optimizing all code and assets on GitHub repo, and all such code and assets should be considered: 

(a) as-is and without warranties or representations of any kind, 

(b) not suitable for production environments, or on production or other critical data, and 

(c) to include shortcuts in order to support rapid prototyping such as, but not limited to, relaxed authentication and authorization and a lack of strict adherence to security best practices. 

All work produced is open source. More information can be found in the GitHub repo. 
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
