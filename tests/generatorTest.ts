import {DepopGeneratorContext, ListingGenerator, LlavaModelHandler} from '../src/ListingGenerator'
import * as fs from 'fs'

const fileDir = "./tests/testImages"
const images:string[] = []


for(let imagefilename of fs.readdirSync(fileDir)){
    const curFile = fs.readFileSync(`${fileDir}/${imagefilename}`, {encoding: 'base64'})
    images.push(curFile)
}

const listingGen = new ListingGenerator(new LlavaModelHandler("127.0.0.1", 11434), new DepopGeneratorContext(), images)

;(async() => {
    let val = await listingGen.execStep()
    val = await listingGen.execStep()

    val = await listingGen.execStep()
})()