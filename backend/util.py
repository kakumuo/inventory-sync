def formatApiResponse(code:int, errorDetails={}, data:any={}): 
    resp:dict = {
        "code": code, 
        "message": "", 
        "data": data
    }

    if code is 0:
        resp["message"] = "Success"
    elif code is 1: 
        resp["message"] = "Invalid request"

    return 
    