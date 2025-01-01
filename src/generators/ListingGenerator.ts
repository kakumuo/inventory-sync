/*
FEATURES: 
    - dynamic generation steps depending on the last result
    - restart generation at specific steps
    - heirarchy based generation
*/

import { LlavaModelHandler, ModelContext, ResponseSchema, ResponseSchemaObject } from "./LLavaModel"

export class ListingGenerator {
    private modelHandler:ModelHandler
    private context:ModelContext
    private listingImages:string[]

    constructor(modelHandler:ModelHandler, context:ModelContext, listingImages:string[]=[]) {
        this.modelHandler = modelHandler    
        this.context = context
        this.listingImages = listingImages
    }

    setImages(listingImages:string[]){
        this.listingImages = listingImages
    }

    setModelHandler(modelHandler:ModelHandler){
        this.modelHandler = modelHandler
    }

    setContext(context:ModelContext){
        this.context = context
    }

    async generate(targetFields:string[]=[]){
        let targetFormat:ResponseSchema = Object.assign({}, this.context.responseFormat)
        if(targetFields.length > 0){
            (targetFormat as ResponseSchemaObject).required = [...targetFields]
        }

        const prompt = this.context.prompt
        const modelResponse = await (this.modelHandler as LlavaModelHandler).sendPrompt(prompt, this.listingImages, targetFormat)
        modelResponse.responseObj = JSON.parse(modelResponse.response)
        return modelResponse
    }
}

/*
LLM MODEL
*/
export interface ModelHandler {
    sendPrompt(prompt:string, images:string[]):Promise<ModelResponse> 
}

export interface ModelResponse {
    model:string,
    createdAt:Date,
    response:string,
    responseObj:object
    duration:number
}