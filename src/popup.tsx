import React, { useEffect } from 'react'
import {createRoot} from 'react-dom/client'
import {LLMType, Position, SettingsConfig} from './types'

const log = (message:any) => {
    console.log(`${new Date().toISOString()} - PopGen - ${message}`)
}

const PopGenMinimizedWindow = ({onClose, onMaximize}:{onClose:() => void, onMaximize:() => void}) => {
    return <div></div>
}

const ImageItem = ({src, onShift, onClose}:{src:string, onClose:()=>void, onShift:(left:boolean)=>void}) => {
    const shiftButtonStyle:React.CSSProperties = {
        position: 'absolute', 
        height: '100%', 
        width: '30%', 
        top: 0, 
        border: 'none', 
        background: 'none'
    }
    
    return <div style={{position: 'relative'}}>
        <img src={src} />
        <button style={{position: 'absolute',
            top: 0, right: 0, zIndex: 10            
        }} onClick={onClose} children={"X"}/>

        <button onClick={() => onShift(true)} style={{...shiftButtonStyle, left: 0}} />
        <button onClick={() => onShift(false)} style={{...shiftButtonStyle, right: 0}}/>
    </div>
}

const PopgenWindow = ({onClose, onMinimize}:{onClose:() => void, onMinimize:() => void}) => {
    const [config, setConfig] = React.useState({} as SettingsConfig)
    const [images, setImages] = React.useState<string[]>([])
    const [dragging, setDragging] = React.useState(false)
    const [position, setPosition] = React.useState<Position>({x: 0, y: 0})
    const MAX_IMAGES = 8

    const handleDrag = (mouseEv:React.MouseEvent, mouseDown:boolean) => {
        if(mouseDown && !dragging) {
            setDragging(true)
        }else if (mouseDown && dragging) {
            const tmpPos = Object.assign({}, position)
            tmpPos.x += mouseEv.movementX
            tmpPos.y += mouseEv.movementY
            setPosition(tmpPos)
        }else {
            setDragging(false)
        }
    }

    const handleImageDrop = (ev:React.DragEvent) => {
        ev.preventDefault()
        const droppedImages = []

        for (let file of ev.dataTransfer.files){
            droppedImages.push(URL.createObjectURL(file))
        }

        const tmp = [...images, ...droppedImages].filter((_, i) => i < MAX_IMAGES)
        setImages(tmp)
    }

    const handleImageRemove = (imageI:number) => {
        setImages(images.filter((_, i) => i != imageI))
    }

    const handleShiftImage = (imageI:number, left:boolean) => {
        let target = 0; 
        if(left)
            target = imageI == 0 ? images.length - 1 : imageI - 1
        else
            target = (imageI + 1) % images.length

        const tmp = Object.assign([], images)
        const tmpImage = tmp[imageI]
        tmp[imageI] = tmp[target]
        tmp[target] = tmpImage
        setImages(tmp)
    }

    React.useEffect(() => {
        (async() => {
            const configData = await browser.storage.local.get('popgen-settings')
            if(configData && Object.hasOwn(configData, 'popgen-settings')){
                setConfig(configData['popgen-settings'])
            }else {
                setConfig({
                    hostPath: 'http://localhost:11434', 
                    targetModel: LLMType.LLAVA
                })
            }
        })()
    }, [])


    return <div style={{
            position: 'absolute', width: 400, height: 500, 
            border:'solid', top: position.y, left: position.x, zIndex: 1000, 
            display: 'grid', gridTemplateRows:'auto 1fr auto', gridTemplateColumns: 'auto',
            backgroundColor: 'white'
    }}>
        <header style={{display: 'grid', gridTemplateColumns: '1fr auto auto', gridTemplateRows: 'auto',
            backgroundColor: 'lightgray', padding: 8, gap: 4
        }}
            onMouseDown={(ev) => handleDrag(ev, true)}
            onMouseMove={(ev) => handleDrag(ev, dragging)}
            onMouseUp={(ev) => handleDrag(ev, false)}
            onMouseLeave={(ev) => handleDrag(ev, false)}
        >
            <p>PopGen</p>
            <button>Minimize</button>
            <button>Close</button>
        </header>


        {
            images.length == 0 ? 
                <main style={{display: 'flex', border: 'dashed lightgray 4px', margin: 8}}
                    onDrop={(ev) => handleImageDrop(ev)}
                    onDragOver={(ev) => ev.preventDefault()}
                >
                    <p style={{margin: 'auto'}}>Drop Images</p>
                </main>
            :  
                <main style={{display: 'grid', border: 'dashed lightgray 4px', margin: 8,
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridTemplateRows: 'repeat(2, 1fr)'
                }}
                    onDrop={(ev) => handleImageDrop(ev)}
                    onDragOver={(ev) => ev.preventDefault()}
                >
                    {images.map((image, imageI) => {
                        return <ImageItem src={image} 
                            onClose={() => handleImageRemove(imageI)} 
                            onShift={(left) => handleShiftImage(imageI, left)}
                            key={imageI}
                        />
                    })}
                </main>
        }

        <button>Generate</button>
    </div>
}

const PopgenWindowWrapper = () => {
    const [isMinimized, setIsMinimized] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(true)

    return <React.StrictMode>
        {
            isOpen && (isMinimized ? 
                <PopGenMinimizedWindow onClose={() => setIsOpen(false)} onMaximize={() => setIsMinimized(false)} />
                :
                <PopgenWindow onClose={() => setIsOpen(false)} onMinimize={() => setIsMinimized(true)}/>
            )
        }
        
    </React.StrictMode>
}

const container = document.createElement('div')
document.body.appendChild(container)

const root = createRoot(container)
root.render(<PopgenWindowWrapper />)

export {}