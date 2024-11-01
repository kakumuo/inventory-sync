import { InventoryProfile } from "./types"

interface APIResponse<T>{
    code:number, 
    success:boolean, 
    message:string, 
    data:T
}

const BASE_URI = "http://127.0.0.1:5000"

export const api_getProfile = async (ids:string[]): Promise<APIResponse<InventoryProfile[]>> => {
    const headers:HeadersInit = {
        'Content-Type': 'application/json'
    }    

    const resp = fetch(`${BASE_URI}/profile?ids=${ids.join(",")}`)
    const respObj = await (await resp).json()

    return respObj
}