
export enum LLMType {
    LLAVA = 'llava', 
    CHAT_GPT = 'chatgpt'
}


export interface SettingsConfig {
    targetModel:LLMType, 
    hostPath:string
}

export interface Position {
    x:number, y:number
}


/* item categories

Mens
    Tops
    Bottoms
    Coats and Jackets
    Jumpsuits and Rompers
    Suits 
    Footwear
    Accessories
    Sleepwear
    Underwear
    Swimwear
    Costume
    
Womens
    Tops
    Bottoms
    Dresses
    Coats and Jackets
    Jumpsuits and Rompers
    Suits 
    Footwear
    Accessories
    Sleepwear
    Underwear
    Swimwear
    Costume

*/ 