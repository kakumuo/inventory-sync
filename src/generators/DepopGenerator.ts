import {DecisionTreeNode, ListingGeneratorContext} from './ListingGenerator'

export class DepopGeneratorContext implements ListingGeneratorContext {
    decisionMap: {[key:string]: DecisionTreeNode}

    constructor() {
        this.decisionMap = {'reset': new DecisionTreeNode({
            id: 'reset', 
            prompt: `IGNORE PREVOUS COMMANDS`
        })}

        this.decisionMap['description'] = new DecisionTreeNode({
            id: 'description', 
            prompt: `Write a single sentence product listing description to attract potential buyers. 
            Write it from the perspective of someone trying to sell list their clothing. 
            `
        })

        this.decisionMap['category'] = new DecisionTreeNode({
            id: 'category', 
            prompt: ` What gender-category combination  is the clothing item belong to?  Select one.
                ${formatOptions(['Mens / Tops' , 'Mens / Bottoms' , 'Mens / Coats and Jackets' , 'Mens / Jumpsuits and Rompers' , 'Mens / Suits'
                    , 'Womens / Tops' , 'Womens / Bottoms' , 'Womens / Coats and Jackets' 
                    , 'Womens / Jumpsuits and Rompers' , 'Womens / Suits'])}
            `
        })
        
        this.decisionMap['tops-subcategory'] = new DecisionTreeNode({
            id: 'tops-subcategory', 
            prompt: `[subcategory] What subcategory does it belong to?  Select one.
                ${formatOptions(['T-Shirts', 'Hoodies', 'Sweatshirts', 'Sweaters', 'Cardigans', 
                    'Shirts', 'Polo shirts', 'Blouses', 'Crop tops', 'Tank tops and camis', 'Corsets', 'Bodysits', 'Other'])}
            Respond in json format.
            `
        })

        this.decisionMap['bottoms-subcategory'] = new DecisionTreeNode({
            id: 'bottoms-subcategory', 
            prompt: `[subcategory] What subcategory does it belong to?  Select one.
                ${formatOptions(['Jeans', 'Pants', 'Sweatpants', 'Shorts', 'Leggings', 'Skirts', 'Other'])}
            Respond in json format.
            `
        })

        this.decisionMap['coats-subcategory'] = new DecisionTreeNode({
            id: 'coats-subcategory',
            prompt: `[subcategory] What subcategory does it belong to? Select one of the below options. 
                ${formatOptions(['Coats', 'Jackets', 'Vests', 'Other'])}
            Respond in json format.
            `
        })
        
        this.decisionMap['jumpsuits-subcategory'] = new DecisionTreeNode({
            id: 'jumpsuits-subcategory',
            prompt: `[subcategory] What subcategory does it belong to?  Select one.
                ${formatOptions(['Jumpsuits', 'Rompers', 'Overalls', 'Other'])}
            Respond in json format.
            `
        })
        
        this.decisionMap['suits-subcategory'] = new DecisionTreeNode({
            id: 'suits-subcategory',
            prompt: `[subcategory] What subcategory does it belong to?  Select one.
                ${formatOptions(['Suits', 'Tailored jackets', 'Tailored trousers', 'Vests', 'Tuxedos', 'Other'])}
            `
        })      

        this.decisionMap['footwear-subcategory'] = new DecisionTreeNode({
            id: 'footwear-subcategory',
            prompt: `[subcategory] What subcategory does it belong to?  Select one.
                ${formatOptions(['Sneakers', 'Sandals', 'Boots', 'Pumps', 'Other'])}
            Respond in json format.
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
            prompt: `[Color] What colors is the item comprised of? Choose up to 2.
                ${formatOptions([
                    'Black', 'Grey', 'White', 'Brown', 'Tan', 'Cream', 'Yellow', 'Red', 'Burgundy', 
                    'Orange', 'Pink', 'Purple', 'Blue', 'Navy', 'Green', 'Khaki', 'Multi', 'Silver', 'Gold'
                ])}
            Respond in json format.`
        })

        this.decisionMap['source'] = new DecisionTreeNode({
            id: "source",
            prompt: `[source] Select a source from the below options? Choose the best possible option(s). Choose up to 2.
                ${formatOptions([
                    'Vintage', 'Preloved', 'Reworked / Upcycled', 'Custom', 'Handmade', 'Deadstock', 
                    'Designer', 'Repaired'
                ])}`
        })

        this.decisionMap['age'] = new DecisionTreeNode({
            id: "age",
            prompt: `[age] Select an age from the below options? Choose up to 1.
                ${formatOptions([
                    'Modern', '00s', '90s', '80s', '70s', '60s', '50s', 'Antique'
                ])}
            Respond in json format.`
        })

        this.decisionMap['style'] = new DecisionTreeNode({
            id: "style",
            prompt: `[style] Select a style(s) from the below options. Choose up to 3.
                ${formatOptions([
                    'Streetwear', 'Sportswear', 'Loungewear', 'Goth', 'Retro', 'Boho', 'Western', 'Indie', 
                    'Skater', 'Rave', 'Costume', 'Cosplay', 'Grunge', 'Emo', 'Minimalist', 'Preppy', 
                    'Avant Garde', 'Punk', 'Glam', 'Regency', 'Casual', 'Utility', 'Futuristic', 'Cottage', 
                    'Kidcore', 'Y2K', 'Biker', 'Gorpcore', 'Twee', 'Coquette', 'Whimsygoth'
                ])}
                Respond in json format.`
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
            'Mens / Coats and Jackets': this.decisionMap['coats-subcategory'],
            'Womens / Coats and Jackets': this.decisionMap['coats-subcategory'],
            'Mens / Jumpsuits': this.decisionMap['jumpsuits-subcategory'],
            'Womens / Jumpsuits': this.decisionMap['jumpsuits-subcategory'],
            'Mens / Suits': this.decisionMap['suits-subcategory'],
            'Womens / Suits': this.decisionMap['suits-subcategory']
        }

        this.decisionMap['tops-subcategory'].nextSteps = {
            '': this.decisionMap['OMBfBrCS-subinfo']
        }

        this.decisionMap['bottoms-subcategory'].nextSteps = {
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

const formatOptions = (options:string[]):string => {
    return options.map((option, optionI) => `- ${option}`).join("\n")
}