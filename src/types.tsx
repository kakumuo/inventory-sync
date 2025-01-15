
export enum LLMType {
    LLAVA = 'llava', 
    CHAT_GPT = 'chatgpt'
}

export interface SettingsConfig {
    targetModel:LLMType, 
    hostPath:string
    hostPort:number
}

export interface Position {
    x:number, y:number
}
