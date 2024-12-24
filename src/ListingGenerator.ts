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

    async execStep(gotoNextStep:boolean = false){
        console.log(`============= RUNNING PROMPT: ${this.curDecisionNode.id} =============`)
        const targetPrompt = this.curDecisionNode.prompt
        const resp = await this.modelHandler.sendPrompt(targetPrompt, this.curDecisionNode.id != 'reset' ? this.listingImages : [])
        
        if(gotoNextStep) {
            if('' in this.curDecisionNode.nextSteps)
                this.curDecisionNode = this.curDecisionNode.nextSteps['']
            else if (resp.response in this.curDecisionNode.nextSteps)
                this.curDecisionNode = this.curDecisionNode.nextSteps['']
        }

        console.log(`=======> Response: ${resp.response}`)

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

class DecisionTreeNode {
    prompt:string = ""
    id:'reset'|string
    nextSteps:{[key:string]:DecisionTreeNode}

    constructor(params:{id:'reset'|string, prompt:string}){
        this.prompt = params.prompt
        this.id = params.id
        this.nextSteps = {}
    }
}

interface ListingGeneratorContext {
    decisionMap:{[key:string]: DecisionTreeNode}
}

export class DepopGeneratorContext implements ListingGeneratorContext {
    decisionMap: {[key:string]: DecisionTreeNode}

    constructor() {
        this.decisionMap = {'reset': new DecisionTreeNode({
            id: 'reset', 
            prompt: `IGNORE PREVOUS COMMANDS`
        })}

        this.decisionMap['description'] = new DecisionTreeNode({
            id: 'description', 
            prompt: `
            You are a fashion buyer for an online retailer.
            Write a very short product description of the items in the image that would go on a retail website. 
            Write the response without quotation marks.
            `
        })

        this.decisionMap['category'] = new DecisionTreeNode({
            id: 'category', 
            prompt: `
            What gender is the clothing item belong to
                Mens | Womens
            What category does the clothing item belong to?
                Tops | Bottoms | Coats and Jackets | Jumpsuits and Rompers | Suits  | Footwear | Accessories | Sleepwear | Underwear | Swimwear | Costume
            Select a response in the format "{gender} / {category}". For example "Mens / Bottoms".
            Respond without quotations.
            `
        })
        
        this.decisionMap['tops-subcategory'] = new DecisionTreeNode({
            id: 'tops-subcategory', 
            prompt: `
            What subcategory does it belong to? 
                T-Shirts | Hoodies | Sweatshirts | Sweaters | Cardigans | Shirts | Polo shirts | Blouses | Crop tops | Tank tops and camis | Corsets | Bodysits | Other
            Select a response.
            `
        })

        this.decisionMap['bottoms-subcategory'] = new DecisionTreeNode({
            id: 'bottoms-subcategory', 
            prompt: `
            What subcategory does it belong to? 
                Jeans | Pants | Sweatpants | Shorts | Leggings | Skirts | Other
            Select a response.
            `
        })


        /****************** MAPPING ****************/
        this.decisionMap['reset'].nextSteps = {
            '': this.decisionMap['description']
        }

        this.decisionMap['description'].nextSteps = {
            '': this.decisionMap['category']
        }

        this.decisionMap['category'].nextSteps = {
            'Mens / Tops': this.decisionMap['tops-subcategory'],
            'Womens / Tops': this.decisionMap['tops-subcategory'],
            'Mens / Bottoms': this.decisionMap['bottoms-subcategory'],
            'Womens / Bottoms': this.decisionMap['bottoms-subcategory'],
        }
        

        // this.decisionMap['coats-subcategory'] = new DecisionTreeNode()
        // this.decisionMap['coats-subcategory'].prompt = `
        // What subcategory does it belong to? 
        //     Coats | Jackets | Vests | Other
        // Select a response.
        // `

        // this.decisionMap['coats-subcategory'] = new DecisionTreeNode()
        // this.decisionMap['coats-subcategory'].prompt = `
        // What subcategory does it belong to? 
        //     Coats | Jackets | Vests | Other
        // Select a response.
        // `

        // this.decisionMap['jumpsuits-subcategory'] = new DecisionTreeNode()
        // this.decisionMap['jumpsuits-subcategory'].prompt = `
        // What subcategory does it belong to? 
        //     Jumpsuits | Rompers | Overalls | Other
        // Select a response.
        // `

        // this.decisionMap['suits-subcategory'] = new DecisionTreeNode()
        // this.decisionMap['suits-subcategory'].prompt = `
        // What subcategory does it belong to? 
        //     Suits | Tailored jackets | Tailored trousers | Vests | Tuxedos | Other
        // Select a response.
        // `

    }
}


/*
LLM MODEL
*/

interface ModelHandler {
    sendPrompt(prompt:string, images:string[]):Promise<ModelResponse> 
}


interface ModelResponse {
    model:string,
    createdAt:Date,
    response:string, 
    duration:number
}


export class LlavaModelHandler implements ModelHandler {
    private modelHost:string
    private modelPort:number
    constructor(modelHost:string, modelPort:number){
        this.modelHost = modelHost
        this.modelPort = modelPort
    }

    async sendPrompt(prompt:string, images:string[]=[]):Promise<ModelResponse> {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            model: "llava",
            prompt: prompt,
            stream: false,
            images: images,
            options: {
                seed: 2,
                temperature: .1
            }
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        } as RequestInit

        const response = await fetch(`http://${this.modelHost}:${this.modelPort}/api/generate`, requestOptions)
        const responseJson = await response.json()
        return responseJson as ModelResponse
    }
}


