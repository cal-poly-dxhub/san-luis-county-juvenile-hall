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
    
    try:
        parameters = eval(event.get('body'))
        juvenile_id = str(parameters.get('juvenile_id'))
        check_juvenile = ("SELECT Juvenile.Id FROM Juvenile JOIN JuvenileEvent ON " +
                          "Juvenile.Id = JuvenileEvent.JuvenileId WHERE Juvenile.Id = %s " +
                          "AND JuvenileEvent.Active = 1;")
        if cur.execute(check_juvenile, [juvenile_id]) == 0:
            return request_error(response, 400, "ERROR: juvenile not active/found in the database.")
    except:
        return request_error(response, 400, "ERROR: malformed request body.")
    
    #secure officer info
    try:
        officer_info = event['requestContext']['authorizer']['claims']
        
        officer_name = officer_info['cognito:username']
        officer_group = officer_info.get('cognito:groups') #will not throw an exception if 'cognito:groups' doesnt appear as a key
    except:
        return request_error(response, 401, "ERROR: Officer credentials missing from request.")
    
    result = None
    
    try:
        target = event['pathParameters']['proxy'].lower()
    except:
        return request_error(response, 404, "ERROR: invalid path parameter.")
    
    if target == "incr":
        behavior_id = parameters.get('behavior_id')
        if behavior_id == None:
            conn.close()
            return request_error(response, 400, "ERROR: body missing behavior id.")
        result = increment_points(cur, juvenile_id, officer_name, str(behavior_id))
    
    elif target == "decr":
        rewards = parameters.get('rewards')
        if rewards == None:
            conn.close()
            return request_error(response, 400, "ERROR: reward list missing from body.")
        result = decrease_points(cur, juvenile_id, officer_name, rewards)
    
    elif target == "admin":
        points = parameters.get('points')
        if officer_group == None or "Administrators" not in officer_group:
            conn.close()
            return request_error(response, 403, "ERROR: access limited to Administrators.")
        elif points == None:
            conn.close()
            return request_error(response, 400, "ERROR: points missing from body.")
        else:
            admin_name = officer_name
        
        result = admin_point_change(cur, juvenile_id, admin_name, str(points))
    
    else:
        conn.close()
        return request_error(response, 404, "ERROR: invalid path parameter.")
    
    conn.commit()
    conn.close()
    
    response['body'] = json.dumps(result)
    return response


#-------------------------------------------------------------------------------


def increment_points(cur, juvenile_id, officer_name, behavior_id):
    log_assignment = ("INSERT INTO PointAssignment (JuvenileId, OfficerName, ADateTime, Behavior) " +
                      "VALUES (%s, %s, NOW(), %s)")
    cur.execute(log_assignment, [juvenile_id, officer_name, behavior_id])
    
    update_points = """ UPDATE JuvenileEvent
                        JOIN (	SELECT	JuvenileEvent.Id,
                                        JuvenileEvent.EDateTime
                                FROM JuvenileEvent
                                JOIN    (SELECT JuvenileId,
                                                MAX(EDateTime) AS date
                                        FROM JuvenileEvent
                                        GROUP BY JuvenileId)
                                AS RecentEvent ON JuvenileEvent.JuvenileId = RecentEvent.JuvenileId AND JuvenileEvent.EDateTime = RecentEvent.date
                                WHERE JuvenileEvent.JuvenileId = %s) AS MaxDate
                        ON JuvenileEvent.Id = MaxDate.Id
                        SET JuvenileEvent.TotalPoints = JuvenileEvent.TotalPoints + 1
                        WHERE JuvenileEvent.JuvenileId = %s"""
    response = cur.execute(update_points, [juvenile_id, juvenile_id])
    logger.info(response)

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


def decrease_points(cur, juvenile_id, officer_name, rewards):
    result = None
    if cur.execute("select max(Id) from RewardClaim;") != 0:
        result = cur.fetchone()[0]
    if result == None:
        claim_id = "100001"
    else:
        claim_id = str(result + 1)
    
    #log information in RewardClaim table
    log_claim = ("INSERT INTO RewardClaim (Id, JuvenileId, OfficerName, CDateTime, Points) " +
                 "VALUES (%s, %s, %s, NOW(), 0)")
    cur.execute(log_claim, [claim_id, juvenile_id, officer_name])
    
    #insert receipt items into database for entire transaction
    reward_id = None
    quantity = None
    points = 0
    for reward in rewards:
        reward_id = str(reward['reward']['id'])
        quantity = str(reward['quantity'])
        points += reward['reward']['price'] * reward['quantity']
        log_transaction = ("INSERT INTO Transactions (ClaimId, RewardId, Quantity) " +
                           "VALUES (%s, %s, %s)")
        cur.execute(log_transaction, [claim_id, reward_id, quantity])
    
    #update RewardClaim log with true point value
    update_claim_points = "UPDATE RewardClaim SET Points = %s WHERE Id = %s"
    cur.execute(update_claim_points, [str(points), claim_id])

    #update point value of juvenile
    update_juvenile = """ UPDATE JuvenileEvent
                        JOIN (	SELECT	JuvenileEvent.Id,
                                        JuvenileEvent.EDateTime
                                FROM JuvenileEvent
                                JOIN    (SELECT JuvenileId,
                                                MAX(EDateTime) AS date
                                        FROM JuvenileEvent
                                        GROUP BY JuvenileId)
                                AS RecentEvent ON JuvenileEvent.JuvenileId = RecentEvent.JuvenileId AND JuvenileEvent.EDateTime = RecentEvent.date
                                WHERE JuvenileEvent.JuvenileId = %s) AS MaxDate
                        ON JuvenileEvent.Id = MaxDate.Id
                        SET JuvenileEvent.TotalPoints = JuvenileEvent.TotalPoints - %s
                        WHERE JuvenileEvent.JuvenileId = %s"""

    cur.execute(update_juvenile, [juvenile_id, str(points), juvenile_id])
    
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


def admin_point_change(cur, juvenile_id, admin_name, points):
    log_change = ("INSERT INTO PointChange (AdminName, JuvenileId, Points, PDateTime) " +
                  "VALUES (%s, %s, %s, NOW())")
    cur.execute(log_change, [admin_name, juvenile_id, points])
    
    update_points = """ UPDATE JuvenileEvent
                        JOIN (	SELECT	JuvenileEvent.Id,
                                        JuvenileEvent.EDateTime
                                FROM JuvenileEvent
                                JOIN    (SELECT JuvenileId,
                                                MAX(EDateTime) AS date
                                        FROM JuvenileEvent
                                        GROUP BY JuvenileId)
                                AS RecentEvent ON JuvenileEvent.JuvenileId = RecentEvent.JuvenileId AND JuvenileEvent.EDateTime = RecentEvent.date
                                WHERE JuvenileEvent.JuvenileId = %s) AS MaxDate
                        ON JuvenileEvent.Id = MaxDate.Id
                        SET JuvenileEvent.TotalPoints = JuvenileEvent.TotalPoints + %s
                        WHERE JuvenileEvent.JuvenileId = %s"""
    cur.execute(update_points, [juvenile_id, points, juvenile_id])
    
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