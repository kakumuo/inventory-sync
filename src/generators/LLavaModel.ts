import { DepopModelResponseObject } from "./DepopGenerator";
import { HandlerTarget, ModelHandler, ModelResponse } from "./ListingGenerator";

export class LlavaModelHandler implements ModelHandler {
    private modelHost:string
    private modelPort:number
    constructor(modelHost:string, modelPort:number){
        this.modelHost = modelHost
        this.modelPort = modelPort
    }

    async sendPrompt(prompt:string, images:string[]=[], format:ResponseSchema|'json' = 'json'):Promise<ModelResponse> {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "applicaiton/json")

        const raw = JSON.stringify({
            model: "llava",
            prompt: prompt,
            stream: false,
            images: images,
            format: format,
            keep_alive: "20m",
            // format: 'json',
            options: {
                seed: 1,
                temperature: .1
            }
        } as LlavaModelRequest);

        // console.log(images)

        const requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        console.log("sending...")
        
        const endpoint = `${this.modelHost}:${this.modelPort}/api/generate`;
        const response = await fetch(endpoint, requestOptions);

        console.log("received response...")
        const respJson = await response.json()

        console.log("converting to json")

        return respJson as ModelResponse
    }
}

type LlavaModelRequest = {
    model:'llava', 
    prompt: string,
    images?: string[],
    stream?: boolean,

    suffix?: string,
    options?: LlavaModelOptions
    format?: 'json'|ResponseSchema, 
    system?: string, 
    template?: object, 
    raw?:boolean, 
    keep_alive:string, 
}

export type ResponseSchema = {
    type: 'integer' | 'string' | 'boolean' 
} | {
    type: 'array'
    items: ResponseSchema
    minContains?: number
    maxContains?: number
} | {
    enum: string[]
} | ResponseSchemaObject
export type ResponseSchemaObject = {
    type: 'object',
    allOf?: ResponseSchema[], 
    anyOf?: ResponseSchema[], 
    oneOf?: ResponseSchema[],
    properties: {
        [key:string]: ResponseSchema
    }, 
    required: string[], 
    if?: ResponseSchema
    then?: ResponseSchema
}

export interface ModelContext {
    prompt: string
    responseFormat: ResponseSchema
}

/*
@param mirostat -           Enable Mirostat sampling for controlling perplexity. (default: 0, 0 = disabled, 1 = Mirostat, 2 = Mirostat 2.0) 	int 	mirostat 0
@param mirostat_eta -       Influences how quickly the algorithm responds to feedback from the generated text. A lower learning rate will result in slower adjustments, while a higher learning rate will make the algorithm more responsive. (Default: 0.1) 	float 	mirostat_eta 0.1
@param mirostat_tau -       Controls the balance between coherence and diversity of the output. A lower value will result in more focused and coherent text. (Default: 5.0) 	float 	mirostat_tau 5.0
@param num_ctx -            Sets the size of the context window used to generate the next token. (Default: 2048) 	int 	num_ctx 4096
@param repeat_last_n -      Sets how far back for the model to look back to prevent repetition. (Default: 64, 0 = disabled, -1 = num_ctx) 	int 	repeat_last_n 64
@param repeat_penalty -     Sets how strongly to penalize repetitions. A higher value (e.g., 1.5) will penalize repetitions more strongly, while a lower value (e.g., 0.9) will be more lenient. (Default: 1.1) 	float 	repeat_penalty 1.1
@param temperature -        The temperature of the model. Increasing the temperature will make the model answer more creatively. (Default: 0.8) 	float 	temperature 0.7
@param seed -               Sets the random number seed to use for generation. Setting this to a specific number will make the model generate the same text for the same prompt. (Default: 0) 	int 	seed 42
@param stop -               Sets the stop sequences to use. When this pattern is encountered the LLM will stop generating text and return. Multiple stop patterns may be set by specifying multiple separate stop parameters in a modelfile. 	string 	stop "AI assistant:"
@param tfs_z -              Tail free sampling is used to reduce the impact of less probable tokens from the output. A higher value (e.g., 2.0) will reduce the impact more, while a value of 1.0 disables this setting. (default: 1) 	float 	tfs_z 1
@param num_predict -        Maximum number of tokens to predict when generating text. (Default: -1, infinite generation) 	int 	num_predict 42
@param top_k -              Reduces the probability of generating nonsense. A higher value (e.g. 100) will give more diverse answers, while a lower value (e.g. 10) will be more conservative. (Default: 40) 	int 	top_k 40
@param top_p -              Works together with top-k. A higher value (e.g., 0.95) will lead to more diverse text, while a lower value (e.g., 0.5) will generate more focused and conservative text. (Default: 0.9) 	float 	top_p 0.9
@param min_p -              Alternative to the top_p, and aims to ensure a balance of quality and variety. The parameter p represents the minimum probability for a token to be considered, relative to the probability of the most likely token. For example, with p=0.05 and the most likely token having a probability of 0.9, logits with a value less than 0.045 are filtered out. (Default: 0.0) 	float 	min_p 0.0
*/
type LlavaModelOptions = {
    mirostat?: number, 
    mirostat_eta?: 0|1|2, 
    mirostat_tau?: number, 
    num_ctx?: number, 
    repeat_last_n?: number, 
    repeat_penalty?: number, 
    seed?: number, 
    temperature?: number,     
    stop?: string,     
    tfs_z?: number,
    num_predict?: number,
    top_k?: number,
    top_p?: number,
    min_p?: number,
}

