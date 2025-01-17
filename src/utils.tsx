export const fetchB64String = async (imageUrl:string) => {
    const res = await fetch(imageUrl)
    const buffer = await res.arrayBuffer()
    const base64String = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
    return base64String
}

export const fetchImageFile = async (imageUrl:string, fileName:string):Promise<File> => {
    const resp = await fetch(imageUrl)
    const buffer = await resp.arrayBuffer()
    return new File([buffer], fileName, {type: resp.type})
}


