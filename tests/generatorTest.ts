import {ListingGenerator} from '../src/generators/ListingGenerator'
import * as fs from 'fs'
import { LlavaModelHandler } from '../src/generators/LLavaModel'
import { DepopGeneratorContext } from '../src/generators/DepopGenerator'

const fileDir = "./tests/testImages"
const images:string[] = []


for(let imagefilename of fs.readdirSync(fileDir)){
    const curFile = fs.readFileSync(`${fileDir}/${imagefilename}`, {encoding: 'base64'})
    images.push(curFile)
}

const listingGen = new ListingGenerator(new LlavaModelHandler("127.0.0.1", 11434), new DepopGeneratorContext(), images)

;(async() => {
    await listingGen.execStep()

    for(let i = 0; i < 8; i += 1)
        await listingGen.execStep()

})()