import * as fs from 'fs'
import { LlavaModelHandler } from '../src/generators/LLavaModel'
import { DepopModelContext, DepopModelResponseObject } from '../src/generators/DepopGenerator'
import { HandlerTarget, ListingGenerator } from '../src/generators/ListingGenerator'

const fileDir = "./tests/testImages"
const images:string[] = []


for(let imagefilename of fs.readdirSync(fileDir)){
    const curFile = fs.readFileSync(`${fileDir}/${imagefilename}`, {encoding: 'base64'})
    images.push(curFile)
}

const listingGen = new ListingGenerator(new LlavaModelHandler("http://127.0.0.1", 11434), new DepopModelContext())
listingGen.setImages(images)

;(async() => {
    const modelResp = await listingGen.generate()
    const respObject= modelResp
    console.log(respObject)
})()