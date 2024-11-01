from flask import json, make_response
from Inventory import InventoryItem, InventoryProfile
from uuid import uuid4

class ConfigFile:
    def __init__(self): 
        self.dbConnectionString:str = ""
        self.dbName:str = ""

    @staticmethod
    def fromDict(dict:dict):
        config = ConfigFile()
        for key in dict:
            setattr(config, key, dict[key])
        return config

def generateUUID(_class): 
    if _class == InventoryItem: 
        return f"i-{uuid4()}"
    elif _class == InventoryProfile: 
        return f"p-{uuid4()}"

class APIResponse:
    SUCCESS:int = 0
    INVALID_REQUEST:int = 1
    BODY_FIELD_NOT_FOUND:int = 2
    QUERY_FIELD_NOT_FOUND:int = 3

    @staticmethod
    def formatApiResponse(code:int, errorDetails=[], data:any=[]): 
        resp = make_response()
        resp.content_type = 'applicaiton/json'
        resp.status_code = 400
        respBody:dict = {
            "code": code, 
            "success": False,
            "message": "", 
            "data": data
        }

        if code == APIResponse.SUCCESS:
            respBody["message"] = "success"
            respBody["success"] = True
            resp.status_code = 200
        elif code == APIResponse.INVALID_REQUEST: 
            respBody["message"] = f"Invalid request: {''.join(errorDetails)}"
        elif code == APIResponse.BODY_FIELD_NOT_FOUND:
            respBody["message"] = f"Field '{errorDetails[0]}' not found in body"
        elif code == APIResponse.QUERY_FIELD_NOT_FOUND:
            respBody["message"] = f"Field '{errorDetails[0]}' not found in query params"

        resp.set_data(json.dumps(respBody))
        return resp
    

def formatApiResponse (code:int, errorDetails=[], data:any=[]):
    return APIResponse.formatApiResponse(code, errorDetails, data)
    