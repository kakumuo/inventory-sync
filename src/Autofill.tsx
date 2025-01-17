import {DepopModelResponseObject } from "./generators/DepopGenerator"
import { fetchB64String, fetchImageFile } from "./utils"

export interface AutofillContext<T> {
    // fillOrder:string[]
    targetData:T
    mapping:{
        [key:string]:()=>Promise<boolean>
    }
}

export class DepopAutofillContext implements AutofillContext<DepopModelResponseObject>{
    // fillOrder:string[]
    targetData:DepopModelResponseObject
    images:string[] 
    mapping:{
        [key:string]:()=>Promise<boolean>
    }
    DELAY = 100

    constructor(targetData:DepopModelResponseObject, images:string[]) {
        this.targetData = targetData
        this.images = images
        this.mapping = {
            '[id=imageInput]': () => this.imageFill(),
            '[id=description]': () => this.textareaFill('[id=description]', this.targetData.description),

            '[id=listingCategories__category__select]': () => this.categorySelect('[id=listingCategories__category__select]', this.targetData.gender, this.targetData.category),
            '[id=listingCategories__subcategory__select]': () => this.dropdownSelect('[id=listingCategories__subcategory__select]', this.targetData.subcategory),

            '[id$=-type-attribute__select]': () => this.dropdownMultiSelect('[id$=-type-attribute__select]', this.targetData.type),
            '[id=dress-length-attribute__select]': () => this.dropdownSelect('[id=dress-length-attribute__select]', this.targetData.length),
            '[id$=-style-attribute__select]': () => this.dropdownMultiSelect('[id$=-style-attribute__select]', this.targetData.fit),
            '[id=occasion-attribute__select]': () => this.dropdownMultiSelect('[id=occasion-attribute__select]', this.targetData.occasion),
            '[id=material-attribute__select]': () => this.dropdownMultiSelect('[id=material-attribute__select]', this.targetData.material),
            '[id=body-fit-attribute__select]': () => this.dropdownMultiSelect('[id=body-fit-attribute__select]', this.targetData.bodyfit),
            '[id=listingBrands__select]': () => this.dropdownSelect('[id=listingBrands__select]', this.targetData.brand),
            '[id=listingSelect__listing__condition__select]': () => this.dropdownSelect('[id=listingSelect__listing__condition__select]', this.targetData.condition),

            '[id=createProductSizes__sizeRow0__size__select]': () => this.dropdownSelect('[id=createProductSizes__sizeRow0__size__select]', this.targetData.size),
            '[id=listingSelect__listing__colour__select]': () => this.dropdownMultiSelect('[id=listingSelect__listing__colour__select]', this.targetData.color),
            '[id=listingSelect__source__select]': () => this.dropdownMultiSelect('[id=listingSelect__source__select]', this.targetData.source),
            '[id=listingSelect__age__select]': () => this.dropdownSelect('[id=listingSelect__age__select]', this.targetData.age),
            '[id=listingSelect__style__select]': () => this.dropdownMultiSelect('[id=listingSelect__style__select]', this.targetData.style),
            '[id=shipping__parcelSize__select]':  () => this.dropdownSelect('[id=shipping__parcelSize__select]', 'XXS')
        }
    }

    //FIXME: cannot delete exising images and add new ones in the fill operation
    private async imageFill(){
        const selector = '[id=imageInput]'
        const imageInput = (document.querySelector(selector) as HTMLInputElement)
        // const targetImages = ["https://tothemountainshuttle.com/wp-content/uploads/2023/08/unisex-organic-t-shirt-black-front-64de96036dac7.jpg"]
        const targetImages = this.images
        
        if(!imageInput || targetImages.length == 0) return false;

        // clear existing images
        let didDelete = false
        for (const container of document.querySelectorAll('[class*=ImageInput-styles__Container]')) {
            didDelete = true
            const deleteButton = container.querySelector('[class*=ImageInput-styles__Delete]') as HTMLButtonElement;
            if (deleteButton) deleteButton.click();
            await new Promise(r => setTimeout(r, this.DELAY))
        }

        console.log(targetImages)
        const dataTransfer = new DataTransfer();
        for(let i = 0; i < targetImages.length; i++){
            const imageURL = targetImages[i]
            dataTransfer.items.add(await fetchImageFile(imageURL, `image-${i}`))
        } 

        imageInput.files = dataTransfer.files
        imageInput.dispatchEvent(new Event('change', {bubbles: true}))
        imageInput.dispatchEvent(new Event('input', {bubbles: true, cancelable: true}))
        return true;
    }

    private async textareaFill(selector:string, data:string|undefined) {
        if(!data) return false

        const ele = (document.querySelector(selector) as HTMLTextAreaElement)

        if(!ele) return false;

        ele.focus()
        ele.value = data
        ele.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        ele.dispatchEvent(new Event('change', { bubbles: true }));

        return true
    }
    
    private async categorySelect(selector:string, gender:string|undefined, category:string|undefined) {
        if(!gender || !category) return false; 

        const ele = (document.querySelector(selector) as HTMLInputElement)

        if(!ele) return false;

        ele.focus()
        ele.value = category
        ele.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        ele.dispatchEvent(new Event('change', { bubbles: true }));


        await new Promise(r => setTimeout(r, this.DELAY))

        const options:NodeListOf<HTMLInputElement> = document.querySelectorAll('[class*="option"]')
        if(gender.match(/Women.*?/)){
            options[1].click()
        }else {
            options[0].click()
        }

        return true
    }

    private async dropdownSelect(selector:string, data:string|undefined) {
        if(!data) return false

        const ele = (document.querySelector(selector) as HTMLInputElement)

        if(!ele) return false;

        ele.focus()
        ele.value = data
        ele.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        ele.dispatchEvent(new Event('change', { bubbles: true }));

        await new Promise(r => setTimeout(r, this.DELAY))

        const options:NodeListOf<HTMLInputElement> = document.querySelectorAll('[class*="option"]')
        options.forEach(option => option.innerText.toLowerCase().match(`^${data.toLowerCase()}`) ? option.click() : null)

        return true
    }

    private async dropdownMultiSelect(selector:string, data:string[]|undefined) {
        if(!data) return false

        const ele = (document.querySelector(selector) as HTMLInputElement)

        if(!ele) return false;

        // clear if already has values
        // need to constantly pull available items
        const container = ele.parentElement?.parentElement?.parentElement
        if(container){
            console.log("resetting")
            const totalTags = container.querySelectorAll('[class~=select__multi-value]').length
            for(let i  = 0; i < totalTags; i ++){
                const tagElement = container.querySelectorAll('[class~=select__multi-value]').item(0)
                await new Promise(r => setTimeout(r, this.DELAY))
                ;(tagElement.lastChild as HTMLInputElement).click()
                await new Promise(r => setTimeout(r, this.DELAY))
            }
        }

        for(const targetData of data){
            ele.focus()
            ele.value = targetData
            ele.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            ele.dispatchEvent(new Event('change', { bubbles: true }));

            await new Promise(r => setTimeout(r, this.DELAY))

            const options:NodeListOf<HTMLInputElement> = document.querySelectorAll('[class*="option"]')
            options.forEach(option => option.innerText.toLowerCase().match(`^${targetData.toLowerCase()}`) ? option.click() : null)

            await new Promise(r => setTimeout(r, this.DELAY))
        }

        return true
    } 
}

export class ListingAutofiller {
    private fillContext:AutofillContext<any>
    private DELAY = 200
    private fillI = 0
    public totalFill = 0
    constructor(fillContext:AutofillContext<any>) {
        this.fillContext = fillContext
        this.totalFill = Object.keys(this.fillContext.mapping).length
        
    }

    async fillNext():Promise<{status:boolean, fillIndex:number, total:number}>{
        const keys = Object.keys(this.fillContext.mapping)
        const targetSelector = keys[this.fillI]
        console.log("target selector", this.fillI, targetSelector)
        const status = await this.fillContext.mapping[targetSelector]()
        await new Promise(r => setTimeout(r, this.DELAY))
        this.fillI++

        return {
            status: status, 
            fillIndex: this.fillI,
            total: this.totalFill
        }
    }

    reset(){
        this.fillI = 0
    }

    // async autofill(progress:{value: number, total: number}){
    //     // for(let i = 0; i < this.fillContext.fillOrder.length; i+=1){
    //     const keys = Object.keys(this.fillContext.mapping)

    //     // for(let i = 12; i < 13; i+=1){
    //     for(let i = 0; i < keys.length; i+=1){
    //     // for(let i = 0; i < 1; i+=1){
    //         const targetSelector = keys[i]
    //         console.log("target selector", i, targetSelector)
    //         await this.fillContext.mapping[targetSelector]()
    //         await new Promise(r => setTimeout(r, this.DELAY))

    //         progress = {value: i, total: keys.length}
    //     }
    // }
}