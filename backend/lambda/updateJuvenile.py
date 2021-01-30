import json
import pymysql
from utility import *

logger = init_logger()

def lambda_handler(event, context):
    logger.info("event info: {}".format(event))

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
    except Exception as e:
        logger.info(str(e))
        return request_error(response, 500, "database credentials improperly configured server-side.")

    try:
        conn = pymysql.connect(host=RDS_HOST, user=NAME, password=PASSWORD, database=DB_NAME, connect_timeout=5)
    except:
        return request_error(response, 503, "cannot connect to database")
    cur = conn.cursor()

    result = None

    try:
        target = event['pathParameters']['proxy'].lower()
        parameters = eval(event['body'])

        event_id = parameters.get('event_id')
        if event_id == None and target != "delete":
            return request_error(response, 400, "request body missing event_id.")
        event_id = str(event_id)
    except:
        return request_error(response, 404, "invalid path parameter.")

    if target == "create":
        first_name = parameters.get('first_name')
        last_name = parameters.get('last_name')
        if first_name == None or last_name == None:
            conn.close()
            return request_error(response, 400, "first/last name missing in body.")
        result = create_juvenile(cur, first_name, last_name, event_id)
        if result == -1:
            return request_error(response, 400, "juvenile or event id already exists in database.")

    elif target == "activate" or target == "deactivate":
        juvenile_id = parameters.get('juvenile_id')
        if juvenile_id == None:
            conn.close()
            return request_error(response, 400, "juvenile_id missing in body.")
        juvenile_id = str(juvenile_id)

        check_juvenile = "select Id from Juvenile where Id = " + juvenile_id + ";"
        if cur.execute(check_juvenile) == 0:
            conn.close()
            return request_error(response, 400, "juvenile not found in database.")

        activate = True if target == "activate" else False

        result = map_juvenile_event(cur, event_id, juvenile_id, activate)

    elif target == "delete":
        juvenile_id = parameters.get('juvenile_id')
        if juvenile_id == None:
            conn.close()
            return request_error(response, 400, "juvenile_id missing in body.")
        juvenile_id = str(juvenile_id)
        result = delete_juvenile(cur, juvenile_id)

    else:
        conn.close()
        return request_error(response, 404, "invalid path parameter.")

    conn.commit()
    conn.close()
    response['body'] = json.dumps(result)
    return response


#----------------------------------lambda_handler helper functions----------------------------------


def create_juvenile(cur, first_name, last_name, event_id):
    validate_juvenile = ("SELECT Juvenile.Id FROM Juvenile JOIN JuvenileEvent ON " +
                         " Juvenile.Id = JuvenileEvent.JuvenileId WHERE Juvenile.FirstName = %s " +
                         "AND Juvenile.LastName = %s AND JuvenileEvent.Id = %s")

    #check that juvenile does not already exist in the database
    if cur.execute(validate_juvenile, [first_name, last_name, event_id]) != 0:
        return -1

    #generate database id for juvenile
    select_id = ("select max(Id) from Juvenile;")
    if cur.execute(select_id) != 0:
        juvenile_id = str(cur.fetchone()[0] + 1)
    else:
        juvenile_id = "1001"

    juvenile_insert = ("INSERT INTO Juvenile (Id, FirstName, LastName) VALUES (%s, %s, %s)")
    cur.execute(juvenile_insert, [juvenile_id, first_name, last_name])

    event_insert = ("INSERT INTO JuvenileEvent (Id, JuvenileId, Active, EDateTime) " +
                    "VALUES (%s, %s, 1, NOW())")
    cur.execute(event_insert, [event_id, juvenile_id])

    juvenile_select = """SELECT  Juvenile.Id,
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


def map_juvenile_event(cur, event_id, juvenile_id, activate):
    if activate == True:
        try:
            event_insert = ("INSERT INTO JuvenileEvent (Id, JuvenileId, Active, EDateTime) VALUES (%s, %s, 1, NOW())")
            cur.execute(event_insert, [event_id, juvenile_id])
        except:
            set_active = "UPDATE JuvenileEvent SET Active = 1, EDateTime = NOW() WHERE Id = %s AND JuvenileId = %s"
            cur.execute(set_active, [event_id, juvenile_id])
    else:
        event_update = "UPDATE JuvenileEvent SET Active = 0 WHERE Id = %s"
        cur.execute(event_update, [event_id])

        #refactor PointTotals to be referenced within JuvenileEvent instead of Juvenile
        #point_reset = "UPDATE Juvenile SET TotalPoints = 0 WHERE Id = %s"
        #cur.execute(point_reset, [juvenile_id])

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
    cur.execute("select Id from RewardClaim where JuvenileId = %s", [juvenile_id])
    for id in cur.fetchall():
        cur.execute("delete from Transactions where ClaimId = %s", [id])
    cur.execute("delete from RewardClaim where JuvenileId = %s",[juvenile_id])
    cur.execute("delete from PointChange where JuvenileId = %s",[juvenile_id])
    cur.execute("delete from PointAssignment where JuvenileId = %s",[juvenile_id])
    cur.execute("delete from JuvenileEvent where JuvenileId = %s",[juvenile_id])
    cur.execute("delete from Juvenile where Id = %s",[juvenile_id])
    return {}