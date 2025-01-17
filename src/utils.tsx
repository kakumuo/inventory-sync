export const fetchB64String = async (imageUrl:string) => {
    const res = await fetch(imageUrl)
    const buffer = await res.arrayBuffer()
    const base64String = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
    return base64String
}

export const fetchImageFile = async (imageUrl:string, fileName:string, padOffset:number|undefined = undefined):Promise<File> => {
    let targetFile: File = new File([], fileName)
    if(!padOffset) {
        const resp = await fetch(imageUrl)
        const buffer = await resp.arrayBuffer()
        console.log("image type:", resp.type)

        targetFile = new File([buffer], fileName, {type: resp.type})
    }else {
        const image = new Image(); 
        image.src = imageUrl
        const [width, height] = await new Promise<number[]>(r => image.onload = () => r([image.width, image.height]))
        const targetDim = Math.max(width, height) + 4
        
        const canvas = document.createElement('canvas')
        canvas.width = targetDim
        canvas.height = targetDim
        const canvasContext = canvas.getContext('2d')
        if(!canvasContext) return targetFile

        canvasContext.fillStyle = 'white'
        canvasContext.fillRect(0, 0, targetDim, targetDim)
        canvasContext.drawImage(image, (targetDim - width) / 2, (targetDim - height) / 2)
        const blob = await new Promise<Blob|null>(r => canvas.toBlob((blob) => r(blob)))

        if(!blob) return targetFile

        return new File([blob], fileName)
    }

    return targetFile
}


