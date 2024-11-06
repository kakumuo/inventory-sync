import { InventoryItem, InventoryProfile } from "./types"

interface APIResponse<T>{
    code:number, 
    success:boolean, 
    message:string, 
    data:T
}


const BASE_URI = 'http://127.0.0.1:5000'
const execEndpoint = async (args:{path:string, method?:'GET'|'POST'|'DELETE', queryParams?:{[key:string]: string | string[] | undefined}, body?:any}) => {
    const BASE_URI = 'http://127.0.0.1:5000'
    let path = BASE_URI + args.path
    let params:string[] = []

    if(args.queryParams){
        for(let key of Object.keys(args.queryParams)){
            const val = args.queryParams[key]
            if(!val) continue; 
            if(typeof val == 'string')
                params.push(`${key}=${val}`)
            else if(val instanceof Array && val.length > 0)
                params.push(`${key}=${val.join(',')}`)
        }
    }
        
        

    if(params.length > 0)
        path = path + "?" + params.join("&")

    console.log("Calling endpoint: ", path)

    return fetch(path, { 
        method: args.method,
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: args.body && JSON.stringify(args.body)
    })
}

export const api_getProfile = async (args:{ids?:string[]}): Promise<APIResponse<InventoryProfile[]>> => {
    let resp = null; 
    resp = execEndpoint({
        path: "/profile", 
        queryParams: {
            ids: args.ids
        }
    })
    const respObj = await (await resp).json()

    return respObj
}

export const api_addProfile = async (args:{name:string}): Promise<APIResponse<InventoryProfile[]>> => {
    let resp = null; 
    resp = execEndpoint({
        path: "/profile",
        method: 'POST', 
        body: {data: [{
            name: args.name
        }]}
    })
    const respObj = await (await resp).json()

    return respObj
}

export const api_getInventory = async (args:{ids?:string[], profileId?:string}):Promise<APIResponse<InventoryItem[]>> => {
    
    let resp = execEndpoint({
        path: "/inventory", 
        queryParams: {
            ids: args.ids, 
            profileId: args.profileId
        }
    })

    const respObj = await (await resp).json()

    return respObj
}