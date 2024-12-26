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
                Tops | Bottoms | Coats and Jackets | Jumpsuits and Rompers | Suits 
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

        this.decisionMap['coats-subcategory'] = new DecisionTreeNode({
            id: 'coats-subcategory',
            prompt: `
            What subcategory does it belong to? 
                Coats | Jackets | Vests | Other
            Select a response.
            `
        })
        
        this.decisionMap['jumpsuits-subcategory'] = new DecisionTreeNode({
            id: 'jumpsuits-subcategory',
            prompt: `
            What subcategory does it belong to? 
                Jumpsuits | Rompers | Overalls | Other
            Select a response.
            `
        })
        
        this.decisionMap['suits-subcategory'] = new DecisionTreeNode({
            id: 'suits-subcategory',
            prompt: `
            What subcategory does it belong to? 
                Suits | Tailored jackets | Tailored trousers | Vests | Tuxedos | Other
            Select a response.
            `
        })      

        this.decisionMap['footwear-subcategory'] = new DecisionTreeNode({
            id: 'footwear-subcategory',
            prompt: `
            What subcategory does it belong to? 
                Sneakers | Sandals | Boots | Other | Pumps
            Select a response.
            `
        })

        this.decisionMap['OMBfBrCS-subinfo-general'] = new DecisionTreeNode({
            id: "OMBfBrCS-subinfo-general",
            prompt: new SubInfoPromptBuilder()
                .addOccasion().addBodyFit().addBrand().addCondition().addSize()
                .build()
        })

        this.decisionMap['TFOMBfBrCS-subinfo-bottoms'] = new DecisionTreeNode({
            id: "TFOMBfBrCS-subinfo-bottoms",
            prompt: new SubInfoPromptBuilder()
                .addType(['Acid-washed','Bleached','Capri','Cargo','Chino','Distressed','Embellished','Embroidered','Faded','Painted','Patched','Printed','Ripped','Stone-washed'])
                .addFit(['Bootcut', 'Flare', 'High waisted', 'Low rise', 'Skinny', 'Slim', 'Straight leg', 'Tailored', 'Wide leg'])
                .addOccasion().addBodyFit().addBrand().addCondition().addSize()
                .build()
        })


        this.decisionMap['LOMBfBrCS-subinfo'] = new DecisionTreeNode({
            id: "LOMBfBrCS-subinfo",
            prompt: new SubInfoPromptBuilder()
                .addLength()
                .addOccasion().addBodyFit().addBrand().addCondition().addSize()
                .build()
        })
        

        this.decisionMap['TOMBfBrCS-subinfo-coats'] = new DecisionTreeNode({
            id: "TOMBfBrCS-subinfo-coats",
            prompt: new SubInfoPromptBuilder()
                .addType(['Duffle', 'Overcoat', 'Parka', 'Peacoat', 'Puffer', 'Raincoat', 'Teddy', 'Trench'])
                .addOccasion().addBodyFit().addBrand().addCondition().addSize()
                .build()
        })

        this.decisionMap['TOMBfBrCS-subinfo-jackets'] = new DecisionTreeNode({
            id: "TOMBfBrCS-subinfo-jackets",
            prompt: new SubInfoPromptBuilder()
                .addType(['Blazer','Bomber','Cape','Duster','Lightweight','Poncho','Puffer','Shacket','Varsity','Windbreaker'])
                .addOccasion().addBodyFit().addBrand().addCondition().addSize()
                .build()
        })

        this.decisionMap['TOMBfBrCS-subinfo-jumpsuits'] = new DecisionTreeNode({
            id: "TOMBfBrCS-subinfo-jumpsuits",
            prompt: new SubInfoPromptBuilder()
                .addType(['Palazzo', 'Skinny', 'Straight leg'])
                .addOccasion().addBodyFit().addBrand().addCondition().addSize()
                .build()
        })

        this.decisionMap['TOMBfBrCS-subinfo-overalls'] = new DecisionTreeNode({
            id: "TOMBfBrCS-subinfo-overalls",
            prompt: new SubInfoPromptBuilder()
                .addType(['Trousers', 'Shorts', 'Skirt'])
                .addOccasion().addBodyFit().addBrand().addCondition().addSize()
                .build()
        })


        this.decisionMap['color'] = new DecisionTreeNode({
            id: "color",
            prompt: `What is the color of the item? Choose up to 2.
                ${[
                    'Black', 'Grey', 'White', 'Brown', 'Tan', 'Cream', 'Yellow', 'Red', 'Burgundy', 
                    'Orange', 'Pink', 'Purple', 'Blue', 'Navy', 'Green', 'Khaki', 'Multi', 'Silver', 'Gold'
                ].join(" | ")}
            If the item comprises of multiple main colors, choose [multi] as the option. Select a response.`
        })

        this.decisionMap['source'] = new DecisionTreeNode({
            id: "source",
            prompt: `Where might have this item been sourced from? Choose up to 2.
                ${[
                    'Vintage', 'Preloved', 'Reworked / Upcycled', 'Custom', 'Handmade', 'Deadstock', 
                    'Designer', 'Repaired'
                ].join(" | ")}
            Select a response.`
        })

        this.decisionMap['age'] = new DecisionTreeNode({
            id: "age",
            prompt: `What is the age of the item? Choose up to 1.
                ${[
                    'Modern', '00s', '90s', '80s', '70s', '60s', '50s', 'Antique'
                ].join(" | ")}
            Select a response.`
        })

        this.decisionMap['style'] = new DecisionTreeNode({
            id: "style",
            prompt: `What is the style of the item? Choose up to 3.
                ${[
                    'Streetwear', 'Sportswear', 'Loungewear', 'Goth', 'Retro', 'Boho', 'Western', 'Indie', 
                    'Skater', 'Rave', 'Costume', 'Cosplay', 'Grunge', 'Emo', 'Minimalist', 'Preppy', 
                    'Avant Garde', 'Punk', 'Glam', 'Regency', 'Casual', 'Utility', 'Futuristic', 'Cottage', 
                    'Kidcore', 'Y2K', 'Biker', 'Gorpcore', 'Twee', 'Coquette', 'Whimsygoth'
                ].join(" | ")}
            Select a response.`
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
            'Mens / Coats': this.decisionMap['coats-subcategory'],
            'Womens / Coats': this.decisionMap['coats-subcategory'],
            'Mens / Jumpsuits': this.decisionMap['jumpsuits-subcategory'],
            'Womens / Jumpsuits': this.decisionMap['jumpsuits-subcategory'],
            'Mens / Suits': this.decisionMap['suits-subcategory'],
            'Womens / Suits': this.decisionMap['suits-subcategory']
        }

        this.decisionMap['tops-subcategory'].nextSteps = {
            '': this.decisionMap['OMBfBrCS-subinfo']
        }

        this.decisionMap['pants-subcategory'].nextSteps = {
            'Jeans': this.decisionMap['TFOMBfBrCS-subinfo-bottoms'],
            'Pants': this.decisionMap['TFOMBfBrCS-subinfo-bottoms'],
            'Sweatpants': this.decisionMap['TFOMBfBrCS-subinfo-bottoms'],
            'Shorts': this.decisionMap['OMBfBrCS-subinfo'],
            'Leggings': this.decisionMap['TFOMBfBrCS-subinfo-bottoms'],
            'Skirts': this.decisionMap['LOMBfBrCS-subinfo'],
            'Other': this.decisionMap['OMBfBrCS-subinfo'],
        }

        this.decisionMap['coats-subcategory'].nextSteps = {
            'Coats': this.decisionMap['TOMBfBrCS-subinfo-coats'],
            'Jackets': this.decisionMap['TOMBfBrCS-subinfo-jackets'],
            'Vests': this.decisionMap['OMBfBrCS-subinfo'],
            'Other': this.decisionMap['OMBfBrCS-subinfo'],
        }

        this.decisionMap['jumpsuits-subcategory'].nextSteps = {
            'Jumpsuits': this.decisionMap['TOMBfBrCS-subinfo-jumpsuits'],
            'Rompers': this.decisionMap['TOMBfBrCS-subinfo'],
            'Overalls': this.decisionMap['TOMBfBrCS-subinfo-overalls'],
            'Other': this.decisionMap['OMBfBrCS-subinfo'],
        }

        this.decisionMap['suits-subcategory'].nextSteps = {
            '': this.decisionMap['OMBfBrCS-subinfo'],
        };

        ["OMBfBrCS-subinfo-general", "TFOMBfBrCS-subinfo-bottoms", "LOMBfBrCS-subinfo", "TOMBfBrCS-subinfo-coats"
            , "TOMBfBrCS-subinfo-jackets", "TOMBfBrCS-subinfo-jumpsuits", "TOMBfBrCS-subinfo-overalls"].forEach(key => {
            this.decisionMap[key].nextSteps = {
                '': this.decisionMap['color']
            }
        });

        this.decisionMap['color'].nextSteps = {
            '': this.decisionMap['source']
        }

        this.decisionMap['source'].nextSteps = {
            '': this.decisionMap['age']
        }

        this.decisionMap['age'].nextSteps = {
            '': this.decisionMap['style']
        }

    }
}

class SubInfoPromptBuilder {
    lines:{question:string, options:string[]}[]
    
    constructor() {
        this.lines = []
    }

    addType(options:string[], maxOptions:number=1) {
        this.lines.push({
            question: `[Type] What is the type of the item? Choose up to ${maxOptions}.`, 
            options: options
        })
        return this
    }

    addFit(options:string[], maxOptions:number=1) {
        this.lines.push({
            question: `[Fit] What is the fit of the item? Choose up to ${maxOptions}.`, 
            options: options
        })
        return this
    }

    addLength(maxOptions:number=1) {
        this.lines.push({
            question: `[Length] What is the type of the item? Choose up to ${maxOptions}.`, 
            options: ['Maxi', 'Midi', 'Mini']
        })
        return this
    }

    addOccasion(maxOptions:number=3){
        this.lines.push({
            question: `[Occasion] On what occasion would you wear this item? Choose up to ${maxOptions}.`, 
            options: ['Casual', 'Festival', 'Gifting', 'Going Out', 'Outdoors', 'Party', 'Relaxation', 'School', 'Ski', 'Special Occasion', 'Holiday', 'Winter', 'Work', 'Workout']
        })
        return this
    }

    addMaterial(maxOptions:number=4) {
        this.lines.push({
            question: `[Material] What is the Material. Try to idenfiy any materials from the clothing tag. If no tag is present then guess the material? Choose up to ${maxOptions}.`, 
            options: ['Acrylic', 'Canvas', 'Cashmere', 'Corduroy', 'Cotton', 'Crochet', 'Denim', 'Spandex', 'Fleece', 'Hemp', 'Lace', 'Leather', 'Linen', 'Nylon', 'Polyester', 'Rayon', 'Silk', 'Suede', 'Velvet', 'Wool']
        })
        return this
    }

    addBodyFit(maxOptions:number=2) {
        this.lines.push({
            question: `[BodyFit] What is the body fit of the item? Choose up to ${maxOptions}.`, 
            options: ['Maternity', 'Petite', 'Plus Size', 'Tall']
        })
        return this
    }

    addBrand(maxOptions:number=1){
        this.lines.push({
            question: `[Brand] What is the brand? Choose up to ${maxOptions}.`, 
            options: []
        })
        return this
    }

    addCondition(maxOptions:number=1){
        this.lines.push({
            question: `[Condition] What is the condition? Choose up to ${maxOptions}.`, 
            options: ['Brand New', 'Like New', 'Used - Excellent', 'Used - Good', 'Used - Fair']
        })
        return this
    }

    addSize(letterSizes:boolean=true, numericSizes:boolean=false, maxOptions:number=1){
        const options = []
        if(letterSizes)
            options.push('6XS -> 6XL')
        if(numericSizes)
            options.push('21" -> 61"')

        this.lines.push({
            question: `[Size] What is the size? Choose up to ${maxOptions}.`, 
            options: options
        })
        return this
    }

    build() {
        return `
            Respond to the following questions: 

            ${
                this.lines.map((line, lineI) => `${lineI}. ${line.question} \n\t ${line.options.join(" | ")}`).join("\n\n")
            }

            Reply in JSON format Include the text in [] as the key for the json key-value pair. 
        `
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


