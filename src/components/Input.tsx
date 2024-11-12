import React, {useState} from "react";
import * as Icons from "./Icons";

export const ImageInputCarousel = () => {
    const [targetImageI, setTargetImageI] = React.useState(0)
    const [images, setImages] = React.useState(["https://placehold.co/400","https://placehold.co/400","https://placehold.co/600"])

    const previewStyle:React.CSSProperties = {
        width: '100%', 
        height: 400,
        objectFit: 'cover'
    }

    const handlePreviewChange = (ev:React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const clickRange = ev.currentTarget.width * .2
        if(ev.pageX < ev.currentTarget.offsetLeft + clickRange) setTargetImageI( targetImageI == 0 ? images.length - 1 : targetImageI - 1)
        else if (ev.pageX > ev.currentTarget.offsetLeft + ev.currentTarget.width - clickRange) setTargetImageI( (targetImageI + 1) % images.length)
    }

    const removeImage = (imageI:number) => {
        setImages(images.filter((v, i) => i != imageI))
    }

    return <div style={{display: 'grid', gap: 8, gridTemplateColumns: '40% 1fr', gridTemplateRows: '100%', width: '100%'}}>
        <img onClick={handlePreviewChange} src={images[targetImageI]} style={{...previewStyle, height: "100%"}}/>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(auto-fill, auto)'}}>
            {images.map((image, imageI) => 
                <ImageCarouselThumbnail onClick={() => setTargetImageI(imageI)} 
                    onClose={() => removeImage(imageI)} image={image} key={imageI}
                    isSelected={imageI == targetImageI}
                />)
            }
        </div>
    </div>
};


const ImageCarouselThumbnail = ({image, isSelected, onClose, onClick}:{image:string, isSelected:boolean, onClose:()=>void, onClick:()=>void}) => {
    return <div style={{display: 'flex', width: '100%', height: '100px', position: 'relative', border: isSelected ? 'solid goldenrod 2px' : 0}} onClick={onClick}> 
        <img style={{ width: '100%', height: '100%',  objectFit: 'cover' }} src={image}/>
        <button onClick={onClose} style={{position: 'absolute', top: 0, left: 0}} children={Icons.Close} />
    </div>
}
