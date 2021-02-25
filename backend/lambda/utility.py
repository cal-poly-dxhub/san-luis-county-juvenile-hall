import boto3
import json
import logging

logger = None

def init_logger():
    global logger
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    return logger

def request_error(response, status_code, body):
    response['statusCode'] = str(status_code)
    error = { "message": body }
    logger.info("error: {}".format(body))
    response['body'] = json.dumps(error)
    return response

def get_secret():
    secret_name = "slojhAppAccess"
    client = boto3.client("secretsmanager")

    get_secret_value_response = client.get_secret_value(
        SecretId=secret_name
    )
    
    if 'SecretString' in get_secret_value_response:
        return get_secret_value_response['SecretString']