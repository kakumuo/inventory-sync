import { ModelContext, ResponseSchema } from './LLavaModel'

const GENDER_OPTIONS = ['Mens', 'Womans']
const CATEGORY_OPTIONS =  ['Tops', 'Bottoms', 'Coats and Jackets', 'Jumpsuits and Rompers']
const TOPS_SUB_OPTIONS = ['T-Shirts', 'Hoodies', 'Sweatshirts', 'Sweaters', 'Cardigans', 'Shirts', 'Polo shirts', 'Blouses', 'Crop tops', 'Tank tops and camis', 'Corsets', 'Bodysits', 'Other']
const BOTTOMS_SUB_OPTIONS = ['Jeans', 'Pants', 'Sweatpants', 'Shorts', 'Leggings', 'Skirts', 'Other']
const COATSJACKETS_SUB_OPTIONS = ['Coats', 'Jackets', 'Vests', 'Other']
const JUMPSUITSROMP_SUB_OPTIONS = ['Jumpsuits', 'Rompers', 'Overalls', 'Other']

const LENGTH_OPTIONS = ['Maxi', 'Midi', 'Mini']
const TYPE_BOTTOMS_OPTIONS = ['Acid-washed','Bleached','Capri','Cargo','Chino','Distressed','Embellished','Embroidered','Faded','Painted','Patched','Printed','Ripped','Stone-washed']
const TYPE_COAT_OPTIONS = ['Duffle', 'Overcoat', 'Parka', 'Peacoat', 'Puffer', 'Raincoat', 'Teddy', 'Trench']
const TYPE_JACKETS_OPTIONS = ['Blazer','Bomber','Cape','Duster','Lightweight','Poncho','Puffer','Shacket','Varsity','Windbreaker']
const TYPE_JUMPSUITS_OPTIONS = ['Palazzo', 'Skinny', 'Straight leg']
const TYPE_OVERALLS_OPTIONS = ['Trousers', 'Shorts', 'Skirt']
const FIT_BOTTOMS_OPTIONS = ['Bootcut', 'Flare', 'High waisted', 'Low rise', 'Skinny', 'Slim', 'Straight leg', 'Tailored', 'Wide leg']
const OCCASION_OPTIONS = ['Casual', 'Festival', 'Gifting', 'Going Out', 'Outdoors', 'Party', 'Relaxation', 'School', 'Ski', 'Special Occasion', 'Holiday', 'Winter', 'Work', 'Workout']
const MATERIAL_OPTIONS = ['Acrylic', 'Canvas', 'Cashmere', 'Corduroy', 'Cotton', 'Crochet', 'Denim', 'Spandex', 'Fleece', 'Hemp', 'Lace', 'Leather', 'Linen', 'Nylon', 'Polyester', 'Rayon', 'Silk', 'Suede', 'Velvet', 'Wool']
const BODYFIT_OPTIONS = ['Maternity', 'Petite', 'Plus Size', 'Tall']
const CONDITION_OPTIONS = [/*'Brand New', 'Like New', */'Used - Excellent', 'Used - Good', 'Used - Fair']
const SIZE_OPTIONS = ['6XS', '5XS', '4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL']
const COLOR_OPTIONS = ['Black', 'Grey', 'White', 'Brown', 'Tan', 'Cream', 'Yellow', 'Red', 'Burgundy', 'Orange', 'Pink', 'Purple', 'Blue', 'Navy', 'Green', 'Khaki', 'Multi', 'Silver', 'Gold']
const SOURCE_OPTIONS = ['Vintage', 'Preloved', 'Reworked / Upcycled', 'Custom', 'Handmade', 'Deadstock', 'Designer', 'Repaired']
const AGE_OPTIONS = ['Modern', '00s', '90s', '80s', '70s', '60s', '50s', 'Antique']
const STYLE_OPTIONS = [
    'Streetwear', 'Sportswear', 'Loungewear', 'Goth', 'Retro', 'Boho', 'Western', 'Indie', 
    'Skater', 'Rave', 'Costume', 'Cosplay', 'Grunge', 'Emo', 'Minimalist', 'Preppy', 
    'Avant Garde', 'Punk', 'Glam', 'Regency', 'Casual', 'Utility', 'Futuristic', 'Cottage', 
    'Kidcore', 'Y2K', 'Biker', 'Gorpcore', 'Twee', 'Coquette', 'Whimsygoth'
]

export enum DepopModelResponseFields {
    description = 'description',
    gender = 'gender',
    category = 'category',
    subcategory = 'subcategory',
    length = 'length',
    type = 'type',
    fit = 'fit',
    brand = 'brand',
    occasion = 'occasion',
    material = 'material',
    bodyfit = 'bodyfit',
    condition = 'condition',
    size = 'size',
    color = 'color',
    source = 'source',
    age = 'age',
    style = 'style',
}

export type DepopModelResponseObject = {
    description?: string,
    gender?: string,
    category?: string,
    subcategory?: string,
    length?: string,
    type?: string[],
    fit?: string[],
    brand?: string,
    occasion?: string[],
    material?: string[],
    bodyfit?: string[],
    condition?: string,
    size?: string,
    color?: string[],
    source?: string[],
    age?: string,
    style?: string[],
}

export class DepopModelContext implements ModelContext {
    prompt: string;
    responseFormat: ResponseSchema;

    constructor() {
        this.prompt = `
            You are a fashion stylist and fashion buyer. Generate product listing details for the clothing item in the attached images. Reply in JSON format
            For the related categories, be sure to fill the fields with one of the following fields along with the other required fields

            if category == Tops: 
                - subcategory = ${TOPS_SUB_OPTIONS}

            if category == Bottoms: 
                - subcategory = ${BOTTOMS_SUB_OPTIONS}
                - type = ${TYPE_BOTTOMS_OPTIONS}
                - fit = ${FIT_BOTTOMS_OPTIONS}
                - length = ${LENGTH_OPTIONS}
            
            if category == Coats and Jackets: 
                - subcategory = ${COATSJACKETS_SUB_OPTIONS}
                if subcategory == Coats
                    - type = ${TYPE_COAT_OPTIONS}
                if subcategory == Jackets
                    - type = ${TYPE_JACKETS_OPTIONS}

            if category == Jumpsuits and Rompers: 
                - subcategory = ${JUMPSUITSROMP_SUB_OPTIONS}
                if subcategory == Jumpsuits: 
                    - type = ${TYPE_JUMPSUITS_OPTIONS}
                if subcategory == Overalls: 
                    - type = ${TYPE_OVERALLS_OPTIONS}

            NOTE: 
            1. If the name of the brand is not identifiable, set the brand to 'Other'
            2. For each field with multiple options, keep the values different
            3. Fill in the materials section based on any information presented on the tags. If no tags are present guess based off the options. 
            4. For the description, write a ten word personalized listing description for the clothing article in the images. Do not mention anything else in the image that is not the clothing item.
            `   

        this.responseFormat = {
            type: 'object', 
            properties: {
                description: {type: 'string'}, 
                gender: {enum: GENDER_OPTIONS},
                category: {enum: CATEGORY_OPTIONS}, 
                subcategory: {enum: [...TOPS_SUB_OPTIONS, ...BOTTOMS_SUB_OPTIONS, ...COATSJACKETS_SUB_OPTIONS, ...JUMPSUITSROMP_SUB_OPTIONS]},
                length: {enum: LENGTH_OPTIONS}, 
                type: {type: 'array', maxContains: 2, items: {enum: [...TYPE_BOTTOMS_OPTIONS, ...TYPE_COAT_OPTIONS, ...TYPE_JACKETS_OPTIONS, ...TYPE_JUMPSUITS_OPTIONS, ...TYPE_OVERALLS_OPTIONS]}}, 
                fit: {type: 'array', items: {enum: FIT_BOTTOMS_OPTIONS}, maxContains: 2},
                occasion: {type: 'array', items: {enum: OCCASION_OPTIONS}, maxContains: 3},
                material: {type: 'array', items: {enum: MATERIAL_OPTIONS}, maxContains: 4}, 
                bodyfit: {type: 'array', items: {enum: BODYFIT_OPTIONS}, maxContains: 2}, 
                condition: {enum: CONDITION_OPTIONS},
                brand: {type: 'string'},
                size: {enum: SIZE_OPTIONS}, 
                color: {type: 'array', items: {enum: COLOR_OPTIONS}, maxContains: 2}, 
                source: {type: 'array', items: {enum: SOURCE_OPTIONS}, maxContains: 2},
                age: {enum: AGE_OPTIONS}, 
                style: {type: 'array', items: {enum: STYLE_OPTIONS}, maxContains: 3},
            }, 
            required: [
                'description', 
                'gender', 'category', 'subcategory', 
                'occasion', 'material', 'bodyfit', 'condition', 'brand', 'size', 
                'color', 'source', 'age', 'style'
            ], 
        }
    }
}
