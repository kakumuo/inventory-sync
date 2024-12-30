/*
FEATURES: 
    - dynamic generation steps depending on the last result
    - restart generation at specific steps
    - heirarchy based generation
*/

export class ListingGenerator {
    private modelHandler:ModelHandler
    private curDecisionNode:DecisionTreeNode
    private context:ListingGeneratorContext
    private listingImages:string[]

    constructor(modelHandler:ModelHandler, context:ListingGeneratorContext, listingImages:string[]=[]) {
        this.modelHandler = modelHandler    
        this.context = context
        this.curDecisionNode = this.context.decisionMap['reset']
        this.listingImages = listingImages
    }

    setImages(listingImages:string[]){
        this.listingImages = listingImages
    }

    setModelHandler(modelHandler:ModelHandler){
        this.modelHandler = modelHandler
    }

    setContext(context:ListingGeneratorContext){
        this.context = context
    }

    async execStep(gotoNextStep:boolean = true){
        console.log(`============= RUNNING PROMPT: ${this.curDecisionNode.id} =============`)
        const targetPrompt = this.curDecisionNode.prompt
        const resp = await this.modelHandler.sendPrompt(targetPrompt, this.curDecisionNode.id != 'reset' ? this.listingImages : [])
        
        if(gotoNextStep) {
            if (resp.targetResponse.length == 1 && resp.targetResponse[0] in this.curDecisionNode.nextSteps)
                this.curDecisionNode = this.curDecisionNode.nextSteps[resp.targetResponse[0]]
            else if('' in this.curDecisionNode.nextSteps)
                this.curDecisionNode = this.curDecisionNode.nextSteps['']
        }

        console.log(`=======> Response: <<${resp.targetResponse}>>`)

        return resp
    }

    setStep(stepName:string):boolean{
        if(stepName in this.context.decisionMap){
            this.curDecisionNode = this.context.decisionMap[stepName]
            return true
        }
        return false
    }
}

/*
DECISION MAPPING
*/

export class DecisionTreeNode {
    prompt:string = ""
    id:'reset'|string
    nextSteps:{[key:string]:DecisionTreeNode}
    targetElementId:string = ""

    constructor(params:{id:'reset'|string, prompt:string}){
        this.prompt = params.prompt
        this.id = params.id
        this.nextSteps = {}
    }
}

export interface ListingGeneratorContext {
    decisionMap:{[key:string]: DecisionTreeNode}
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
    targetResponse:string[]
    duration:number
}