/*
FEATURES: 
    - dynamic generation steps depending on the last result
    - restart generation at specific steps
    - heirarchy based generation
*/

class ListingGenerator {    
    modelHandler:ModelHandler
    genSteps:GenerationStep
    listingImages:string[]
    constructor(modelHandler:ModelHandler, listingImages:string[]) {
        this.modelHandler = modelHandler    
        this.genSteps = new GenerationStep()
        this.listingImages = listingImages

        // Initialization
        this.genSteps.prompt = `
            Ignore preivous instructions. Use the attached images to answer the following questions.
        `
        this.genSteps.images = this.listingImages
    }
}

class GenerationStep {
    prompt:string = ""
    images:string[] = []
    targetLabel:string = ""
    // targetElement:string = ""
    subSteps:{[key:string]:GenerationStep} = {}
}

class ModelHandler {
    modelPath:string 
    constructor(modelPath:string) {
        this.modelPath = modelPath
    }

    prompt(message:string, images:string[]) {
        return "string"
    }

    private parseResponse() {
        return {} as ModelResponse
    }
}

class ModelResponse {

}