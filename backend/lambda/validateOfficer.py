import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info("event object: {}".format(event))
    
    accepted_domains = ["co.slo.ca.us", "slocoe.org"]
    user_domain = event['request']['userAttributes']['email'].split('@')[1]
    
    #check if email domain is authorized
    if not user_domain in accepted_domains:
        raise Exception("\nInvalid Email Domain.")
    return event