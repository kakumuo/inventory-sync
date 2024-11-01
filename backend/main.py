from flask import Flask, json, request
from flask_cors import CORS
from util import ConfigFile, formatApiResponse, APIResponse, generateUUID
from pymongo import MongoClient, UpdateOne, InsertOne
from pymongo.collection import Collection
from uuid import uuid4
import inspect

from Inventory import InventoryItem, InventoryProfile

configFilePath:str = "./config.json"
configFile:ConfigFile = None

with(open(configFilePath, "r")) as file:
    configFile = json.load(fp=file, object_hook=ConfigFile.fromDict)

mongoClient = MongoClient(configFile.dbConnectionString)
inventoryDB = mongoClient.get_database(configFile.dbName)

app = Flask(__name__)
cors = CORS(app)

@app.route("/")
def home():
    print(inspect.getmembers(InventoryItem()))
    return formatApiResponse(code=0, data=[])


'''
generic CRUD operations depending on the listing data
'''
def genericCrudApi(collection:Collection, _class:any):
    if request.method in ["GET", "DELETE"]:
        ids = []
        if("ids" in request.args): 
            ids = [x for x in request.args.get("ids").split(",") if len(x.strip()) != 0]

        resp = None
        if request.method == "GET":
            resp = collection.find({"_id": {"$in": ids}})
            return formatApiResponse(code=APIResponse.SUCCESS, data=list(resp))
        else:
            resp = collection.delete_many({"_id": {"$in": ids}})
            return formatApiResponse(code=APIResponse.SUCCESS, data=[{
                "acknowledged": resp.acknowledged,
                "deleted_count": resp.deleted_count,
                "raw_result": resp.raw_result,
            }])
    elif request.method == "POST":
        if("data" not in request.json):
            return formatApiResponse(code=APIResponse.BODY_FIELD_NOT_FOUND, errorDetails=["data"]) 
        
        reqData = request.json["data"]
        upsertOperations = []
        respData = [None] * len(reqData)
        
        for (dataI, data) in enumerate(reqData):
            sampleInstance = _class()
            
            for key in data: 
                if not hasattr(sampleInstance, key): 
                    respData[dataI] = {"_id": reqData[dataI]["_id"] if "_id" in reqData[dataI] else None, "success": False, "message": f"Invalid field '{key}'"}
                    break
                

            if "_id" not in data or data["_id"] is None: 
                data["_id"] = generateUUID(_class)
                upsertOperations.append(InsertOne(document=data))
            else:
                upsertOperations.append(UpdateOne(filter={"_id": data["_id"]}, update={"$set": data}))

        resp = collection.bulk_write(upsertOperations)

        for i, _ in enumerate(respData): 
            if respData[i] is None:
                respData[i] = {"_id": reqData[i]["_id"], "success": True, "message": "Success"}
        
        # TODO:  identify what records failed to upsert
        return formatApiResponse(code=APIResponse.SUCCESS, data=respData) 
    else: 
        return formatApiResponse(code=APIResponse.INVALID_REQUEST) 

'''
============================================================
PROFILE
============================================================

GET /profile?ids=[]
DELETE /profile?ids=[]
POST /profile
    body        => {data: [{name}]}
    response    => {responseData..., data: [{id:str, message:str, success:bool}...]}
'''
@app.route("/profile", methods=["GET", "POST", "DELETE"])
def profile():
    return genericCrudApi(inventoryDB.get_collection("profiles"), InventoryProfile)

'''
============================================================
ITEM
============================================================

GET /item?ids=[]
DELETE /item?ids=[]
POST /item
    body        => {data: [{name}]}
    response    => {responseData..., data: [{id:str, message:str, success:bool}...]}
'''
@app.route("/inventory", methods=["GET", "POST", "DELETE"])
def item():
    return genericCrudApi(inventoryDB.get_collection("inventory"), InventoryItem)

'''
============================================================
LISTING
============================================================

GET /listing?ids=[]
DELETE /listing?ids=[]
POST /listing
    body        => {data: [{name}]}
    response    => {responseData..., data: [{id:str, message:str, success:bool}...]}
'''
@app.route("/listing", methods=["GET", "POST", "DELETE"])
def listing(): 
    pass
