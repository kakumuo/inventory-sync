
interface LLMClientRequestBody {
    model:'llava'|'llama', 
    prompt:string, 
    images?:string[]
}

export class LLMClient {
    
    private endpoint:string = ""
    private port:number = 0 
    constructor(endpoint:string, port:number) {
        this.endpoint = endpoint; 
        this.port = port; 
    }

    public async query(body:LLMClientRequestBody) {
        console.log(body)
        const resp = await fetch(`http://${this.endpoint}:${this.port}/api/generate`, {
            body: JSON.stringify(body), 
            method: 'POST'
        })

        const respJson = await resp.text()
        console.log(respJson)
    }

}



