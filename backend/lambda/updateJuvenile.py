import json
import pymysql
from utility import *

logger = get_logger()

def lambda_handler(event, context):
    logger.info("event info: {}".format(event))

    result = None
    response = {
        "isBase64Encoded": "false",
        "statusCode": "200",
        "headers": {
            "Accept": "*/*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,Date,X-Amzn-Trace-Id,x-amz-apigw-id,x-amzn-RequestId,Authorization",
        }
    }

    try:
        dbCredentials = eval(get_secret())

        RDS_HOST = dbCredentials['host']
        NAME = dbCredentials['username']
        PASSWORD = dbCredentials['password']
        DB_NAME = dbCredentials['dbname']

        conn = pymysql.connect(host=RDS_HOST, user=NAME, password=PASSWORD, database=DB_NAME, connect_timeout=5)
    except Exception as e:
        logger.error(str(e))
        return request_error(response, 503, "cannot secure database connection")
    cur = conn.cursor()

    try:
        action = event['pathParameters']['proxy'].lower()
        if action not in ["create", "activate", "deactivate", "delete"]:
            raise Exception()
    except:
        conn.close()
        return request_error(response, 404, "invalid path parameter")
    
    try:
        parameters = eval(event['body'])
        event_id = parameters.get('event_id')
        if action != "delete":
            if event_id == None:
                raise Exception()
            event_id = str(event_id)
    except:
        return request_error(response, 400, "parameter not found: event_id/juvenile_id")

    if action == "create":
        try:
            first_name = parameters['first_name']
            last_name = parameters['last_name']
        except:
            conn.close()
            return request_error(response, 400, "body missing parameters: first_name/last_name")
        
        result = create_juvenile(cur, first_name, last_name, event_id)
        if result == -1:
            conn.close()
            return request_error(response, 400, "juvenile/event_id already exists in database")

    elif action == "activate" or action == "deactivate":
        try:
            juvenile_id = str(parameters['juvenile_id'])
        except:
            conn.close()
            return request_error(response, 400, "body missing parameters: juvenile_id")
        
        if cur.execute("SELECT Id FROM Juvenile WHERE Id = {};".format(juvenile_id)) == 0:
            conn.close()
            return request_error(response, 400, "juvenile not found in database")

        activate = (action == "activate")
        result = map_juvenile_event(cur, event_id, juvenile_id, activate)

    elif action == "delete":
        try:
            juvenile_id = str(parameters['juvenile_id'])
        except:
            conn.close()
            return request_error(response, 400, "body missing parameters: juvenile_id")
        result = delete_juvenile(cur, juvenile_id)

    conn.commit()
    conn.close()

    response['body'] = json.dumps(result)
    return response


#----------------------------------lambda_handler helper functions----------------------------------


def create_juvenile(cur, first_name, last_name, event_id):
    validate_juvenile = """ SELECT Juvenile.Id
                            FROM Juvenile
                            JOIN JuvenileEvent
                            ON Juvenile.Id = JuvenileEvent.JuvenileId
                            WHERE Juvenile.FirstName = %s
                                AND Juvenile.LastName = %s
                                AND JuvenileEvent.Id = %s"""

    #check that juvenile does not already exist in the database
    if cur.execute(validate_juvenile, [first_name, last_name, event_id]) != 0:
        return -1

    #generate database id for juvenile
    juvenile_id = "1001" if cur.execute("SELECT MAX(Id) FROM Juvenile;") == 0 else str(cur.fetchone()[0] + 1)

    juvenile_insert = "INSERT INTO Juvenile(Id, FirstName, LastName) VALUES (%s, %s, %s)"
    cur.execute(juvenile_insert, [juvenile_id, first_name, last_name])

    event_insert = "INSERT INTO JuvenileEvent(Id, JuvenileId, Active, EDateTime) VALUES (%s, %s, 1, NOW())"
    cur.execute(event_insert, [event_id, juvenile_id])

    juvenile_select = """SELECT Juvenile.Id,
                                Juvenile.FirstName,
                                Juvenile.LastName,
                                JuvenileEvent.TotalPoints,
                                JuvenileEvent.Id,
                                JuvenileEvent.Active
                        FROM Juvenile
                        JOIN JuvenileEvent
                        ON Juvenile.Id = JuvenileEvent.JuvenileId
                        WHERE Juvenile.Id = %s
                        ORDER BY JuvenileEvent.EDateTime DESC
                        LIMIT 1"""
    
    cur.execute(juvenile_select, [juvenile_id])
    db_entry = cur.fetchone()

    juvenile = {
        "id": db_entry[0],
        "first_name": db_entry[1],
        "last_name": db_entry[2],
        "points": db_entry[3],
        "event_id": db_entry[4],
        "active": db_entry[5]
    }
    return juvenile


def map_juvenile_event(cur, event_id, juvenile_id, activate):
    check_event = "SELECT Id FROM JuvenileEvent WHERE Id = %s AND JuvenileId = %s"
    record_exists = (cur.execute(check_event, [event_id, juvenile_id]) != 0)

    if record_exists:
        sql_stmt = "UPDATE JuvenileEvent SET Active = {}, EDateTime = NOW() WHERE Id = %s AND JuvenileId = %s".format("1" if activate else "0")
    else:
        sql_stmt = "INSERT INTO JuvenileEvent (Id, JuvenileId, Active, EDateTime) VALUES (%s, %s, {}, NOW())".format("1" if activate else "0")
    cur.execute(sql_stmt, [event_id, juvenile_id])

    juvenile_select= """SELECT  Juvenile.Id,
                                Juvenile.FirstName,
                                Juvenile.LastName,
                                JuvenileEvent.TotalPoints,
                                JuvenileEvent.Id,
                                JuvenileEvent.Active
                        FROM Juvenile
                        JOIN JuvenileEvent ON Juvenile.Id = JuvenileEvent.JuvenileId
                        WHERE Juvenile.Id = %s
                        ORDER BY JuvenileEvent.EDateTime DESC
                        LIMIT 1"""
    cur.execute(juvenile_select, [juvenile_id])
    db_entry = cur.fetchone()

    juvenile = {
        "id": db_entry[0],
        "first_name": db_entry[1],
        "last_name": db_entry[2],
        "points": db_entry[3],
        "event_id": db_entry[4],
        "active": db_entry[5]
    }
    return juvenile

def delete_juvenile(cur, juvenile_id):
    cur.execute("SELECT Id FROM RewardClaim WHERE JuvenileId = %s", [juvenile_id])
    for claim_id in cur.fetchall():
        cur.execute("DELETE FROM Transactions WHERE ClaimId = %s", [claim_id])
    cur.execute("DELETE FROM RewardClaim WHERE JuvenileId = %s",[juvenile_id])
    cur.execute("DELETE FROM PointChange WHERE JuvenileId = %s",[juvenile_id])
    cur.execute("DELETE FROM PointAssignment WHERE JuvenileId = %s",[juvenile_id])
    cur.execute("DELETE FROM JuvenileEvent WHERE JuvenileId = %s",[juvenile_id])
    cur.execute("DELETE FROM Juvenile WHERE Id = %s",[juvenile_id])
    return {}