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
            "Access-Control-Allow-Methods": "GET, OPTIONS",
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
        parameters = event.get('queryStringParameters')
    except:
        return request_error(response, 404, "ERROR: invalid path parameter.")
    
    if target == "rewards":
        result = get_rewards(cur)

    elif target == "behaviors":
        result = get_behaviors(cur)

    elif target == "locations":
        result = get_locations(cur)

    elif target == "juveniles":
        event_id = None
        active = None
        
        if parameters != None:
            event_id = parameters.get('event_id')
            active = parameters.get('active')
            if active != None:
                if active != "1" and active != "0":
                    return request_error(response, 400, "ERROR: invalid input to parameter: active.")
        result = get_juvenile(cur, event_id, active)

    elif target == "transactions" or target == "modifications":
        try:
            juvenile_id = parameters.get('juvenile_id')
            if juvenile_id == None:
                raise Exception()
            juvenile_id = str(juvenile_id)
        except:
            conn.close()
            return request_error(response, 400, "ERROR: missing juvenile_id parameter.")
        result = get_transactions(cur, juvenile_id) if target == "transactions" else get_modifications(cur, juvenile_id)

    else:
        conn.close()
        return request_error(response, 404, "ERROR: invalid path parameter.")
    
    conn.commit()
    conn.close()
    
    response['body'] = json.dumps(result)
    return response

#-------------------------------------------------------------------------------


def get_rewards(cur):
    select_rewards = ("select Rewards.Id, RewardCategory.Description, Rewards.MaxQuantity, " +
                   "Rewards.Item, Rewards.Price, Rewards.Image from Rewards join RewardCategory on " +
                   "RewardCategory.Id = Rewards.Category;")
    cur.execute(select_rewards)
    rewards = []

    for db_entry in cur.fetchall():
        reward = {
            "id": db_entry[0],
            "category": db_entry[1],
            "max_quantity": db_entry[2],
            "name": db_entry[3],
            "price": db_entry[4],
            "image": db_entry[5]
        }
        rewards.append(reward)
    return rewards


def get_behaviors(cur):
    select_behaviors = ("select Behaviors.id, Behaviors.Description, " +
                        "BehaviorCategory.Name, Location.Name " +
                        "from Behaviors join BehaviorCategory on " +
                        "Behaviors.CategoryId = BehaviorCategory.Id join Location on " +
                        "Behaviors.LocationId = Location.Id;")
    cur.execute(select_behaviors)
    behaviors = []
    
    for db_entry in cur.fetchall():
        behavior = {
            "id": db_entry[0],
            "title": db_entry[1],
            "category": db_entry[2],
            "location": db_entry[3]
        }
        behaviors.append(behavior)
    return behaviors


def get_locations(cur):
    select_locations = "select Name from Location;"
    cur.execute(select_locations)
    locations = [location[0] for location in cur.fetchall()]
    return locations


def get_juvenile(cur, event_id, active):
    #this sql statement retrieves the most recent juvenile/event-id entry for each juvenile in the database
    select_juveniles = """SELECT  Juvenile.Id,
                                Juvenile.FirstName,
                                Juvenile.LastName,
                                JuvenileEvent.TotalPoints,
                                JuvenileEvent.Id,
                                JuvenileEvent.Active
                        FROM Juvenile
                        JOIN    (SELECT JuvenileEvent.Id,
                                        JuvenileEvent.JuvenileId,
                                        JuvenileEvent.Active,
                                        JuvenileEvent.EDateTime,
                                        JuvenileEvent.TotalPoints
                                FROM JuvenileEvent
                                JOIN    (SELECT JuvenileId,
                                                MAX(EDateTime) AS date
                                        FROM JuvenileEvent
                                        GROUP BY JuvenileId)
                                AS maxDates ON JuvenileEvent.JuvenileId = maxDates.JuvenileId AND JuvenileEvent.EDateTime = maxDates.date)
                        AS JuvenileEvent ON Juvenile.Id = JuvenileEvent.JuvenileId"""
    
    parameters = {"JuvenileEvent.Id" : event_id, "JuvenileEvent.Active": active}


    
    if event_id == None and active == None:
        cur.execute(select_juveniles)
    elif event_id != None and active != None:
        select_juveniles += " WHERE JuvenileEvent.Id = %s AND JuvenileEvent.Active = %s"
        cur.execute(select_juveniles, [event_id, active])
    elif event_id != None:
        select_juveniles += " WHERE JuvenileEvent.Id = %s"
        cur.execute(select_juveniles, [event_id])
    elif active != None:
        select_juveniles += " WHERE JuvenileEvent.Active = %s"
        cur.execute(select_juveniles, [active])
    
    juveniles = []
    juvenile = {}
    
    for db_entry in cur.fetchall():
        juvenile = {
            "id": db_entry[0],
            "first_name": db_entry[1],
            "last_name": db_entry[2],
            "points": db_entry[3],
            "event_id": db_entry[4],
            "active": db_entry[5]
        }
        juveniles.append(juvenile)
    return juvenile if event_id != None else juveniles


def get_transactions(cur, juvenile_id):
    get_claims = ("select RewardClaim.Id, RewardClaim.OfficerName, RewardClaim.Points, " +
                  "RewardClaim.CDateTime, Rewards.Item, Transactions.Quantity, Rewards.Price from " +
                  "RewardClaim join Transactions on RewardClaim.Id = Transactions.ClaimId " +
                  "join Rewards on Rewards.Id = Transactions.RewardId where " +
                  "RewardClaim.JuvenileId = %s order by CDateTime desc;")
    
    cur.execute(get_claims, [juvenile_id])
    itemized_claims = cur.fetchall()

    reward_claims = []
    current_claim_id = None
    claim = None
    
    for purchase in itemized_claims:
        claim_id = purchase[0]
        if claim_id != current_claim_id:
            if current_claim_id != None: #check for first iteration so that None isnt added to the list
                reward_claims.append(claim)
            
            current_claim_id = claim_id
            claim = {
                "claim_id": current_claim_id,
                "officer": purchase[1],
                "date": str(purchase[3]).split(" ")[0],
                "subtotal": purchase[2],
                "purchases": []
            }
        
        item = {
            "name": purchase[4],
            "quantity": purchase[5],
            "unit_price": purchase[6]
        }
        claim['purchases'].append(item)
    if claim != None:
        reward_claims.append(claim)
    return reward_claims


def get_modifications(cur, juvenile_id):
    select_modifications = ("select AdminName, Points, PDateTime from PointChange " +
                            "where JuvenileId = %s order by PDateTime desc;")
    cur.execute(select_modifications, [juvenile_id])
    
    itemized_modifications = []
    for point_change in cur.fetchall():
        modification = {
            "officer": point_change[0],
            "points": point_change[1],
            "date": str(point_change[2]).split(" ")[0]
        }
        itemized_modifications.append(modification)
    return itemized_modifications