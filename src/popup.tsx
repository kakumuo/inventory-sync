import React from 'react'
import {createRoot} from 'react-dom/client'
import {LLMType, Position, SettingsConfig} from './types'
import { ListingGenerator, ModelHandler } from './generators/ListingGenerator'
import { LlavaModelHandler, ModelContext } from './generators/LLavaModel'
import { DepopModelContext, DepopModelResponseObject } from './generators/DepopGenerator'
import { DepopAutofillContext, ListingAutofiller } from './Autofill'
import { fetchB64String } from './utils'

const log = (message:any) => {
    console.log(`${new Date().toISOString()} - PopGen - ${message}`)
}

const PopGenMinimizedWindow = ({isVisible, onClose, onMaximize}:{isVisible:boolean, onClose:() => void, onMaximize:() => void}) => {
    const [dragging, setDragging] = React.useState(false)
    const [height, setHeight] = React.useState(50)
    const [dragStartTS, setDragStartTS] = React.useState(Date.now())
    const CLICK_THRESH_TS = 135
    const closeBtnRef = React.useRef<HTMLButtonElement>(null)

    React.useEffect(() => {
        if(dragging){
            setDragStartTS(Date.now())
        }

        const handleMouseMove = (ev:MouseEvent) => {
            if(dragging){
                setHeight(prev => prev + ev.movementY)
            }
        }

        const handleMouseUp = (ev:MouseEvent) => {
            setDragging(false)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

    }, [dragging])

    const handleMaximize = (ev:React.MouseEvent) => {
        console.log(ev)
        if(Date.now() - dragStartTS < CLICK_THRESH_TS && (ev.target as HTMLElement).tagName == 'DIV')
            onMaximize()
    }

    return <div style={{
            display: !isVisible ? 'none' : 'block',
            userSelect:'none', position:'fixed', right: '0', top: height, border: 'solid', 
            width: 100, height: 50, zIndex: 100, background: 'white', padding: 16
        }}
        onClick={handleMaximize}
        onMouseDown={() => setDragging(true)}
    >
        <button 
            onClick={onClose}
            ref={closeBtnRef}
            style={{zIndex: 101, position: 'absolute', top: 0, left: 0, transform: 'translate(-50%, -50%)'}} children={"x"}
        />
        Popgen
    </div>
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

enum RESIZE_DIR {
    NONE, NORTH, SOUTH, EAST, WEST
}

const PopgenWindow = ({isVisible, onClose, onMinimize}:{isVisible:boolean, onClose:() => void, onMinimize:() => void}) => {
    const MAX_IMAGES = 8
    const [images, setImages] = React.useState<string[]>([])
    const [autofillStatus, setAutofillStatus] = React.useState<{isFilling:boolean, fillCount:number, total:number}>({isFilling: false, fillCount: 0, total: 0})
    const [windowSize, setWindowSize] = React.useState<Position>({x: 200, y: 300})
    const [resizing, setResizing] = React.useState<RESIZE_DIR>(0)
    const [dragging, setDragging] = React.useState(false)
    const [position, setPosition] = React.useState<Position>({x: 0, y: 0}) 
    const MIN_HEIGHT = 200, MIN_WIDTH = 200;

    const popgenContext = React.useContext(PopgenWindowContext)

    React.useEffect(() => {
        ;(async() => {
            if(popgenContext.listingGen){
                let imageDataFiles:string[] = []

                for(let image of images){
                    const imageData = await fetchB64String(image)
                    if(imageData) imageDataFiles.push(imageData)
                }
    
                popgenContext.listingGen.setImages(imageDataFiles)
            }
        })()
    }, [images])

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

    const handleGenerate = async () => {
        if(popgenContext.listingGen){
            setAutofillStatus({isFilling: true, fillCount: 0, total: 0})
            const response = await popgenContext.listingGen.generate()
            const modelResp:DepopModelResponseObject = response.responseObj
            console.log(modelResp)
            
            const autofiller = new ListingAutofiller(new DepopAutofillContext(modelResp, images))
            for(let i = 0; i < autofiller.totalFill; i++){
                const resp = await autofiller.fillNext()
                setAutofillStatus({isFilling: true, fillCount: resp.fillIndex, total: autofiller.totalFill})
            }

            setAutofillStatus({isFilling: false, fillCount: 0, total: 0})

            /* image test */
            // const response = await popgenContext.listingGen.generate()
            // const modelResp:DepopModelResponseObject = response.responseObj
            // const tmpImages:string[] = [
            //     "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSmFaJFBNHUjTfzuZJubJwbXRMBAQODeSatAEFyIjYvfUQAVCPVZP2kSHO9f8w9C-vkZhNZ_YGVzLCxAxJqXbqo-cBxKL1JqkXz6cj_f8XijhTtRPbmO2oh"
            // ]
            // const autofiller = new ListingAutofiller(new DepopAutofillContext({}, tmpImages))

            // await autofiller.fillNext()
            // autofiller.reset()
        }
    }

    React.useEffect(() => {
        const mouseMoveHandler = (ev:MouseEvent) => {
            if(resizing != RESIZE_DIR.NONE){
                let dSize:Position = {x: 0, y: 0}
                let dPos:Position = {x: 0, y: 0}

                switch(resizing){
                    case RESIZE_DIR.NORTH:
                        dSize.y = -1 * (dPos.y = ev.movementY)
                        break;
                    case RESIZE_DIR.SOUTH:
                        dSize.y = ev.movementY
                        break;
                    case RESIZE_DIR.EAST:
                        dSize.x = ev.movementX
                        break;
                    case RESIZE_DIR.WEST:
                        dSize.x = -1 * (dPos.x = ev.movementX)
                }

                setWindowSize(prev => ({x: Math.max(MIN_WIDTH, prev.x + dSize.x), y: Math.max(MIN_HEIGHT, prev.y + dSize.y)})); 
                setPosition(prev => ({x: prev.x + dPos.x, y: prev.y + dPos.y}))
            }
            else if(dragging){
                setPosition(prev => ({x: prev.x + ev.movementX, y: prev.y + ev.movementY}))
            }
        }

        const mouseUpHandler = (ev:MouseEvent) => {
            if(dragging) setDragging(false)
            if(resizing != RESIZE_DIR.NONE) setResizing(RESIZE_DIR.NONE)
        }

        document.addEventListener('mousemove', mouseMoveHandler)
        document.addEventListener('mouseup', mouseUpHandler)

        return () => {  
            document.removeEventListener('mousemove', mouseMoveHandler)
            document.removeEventListener('mouseup', mouseUpHandler)
        }
    }, [resizing, dragging])


    return <div style={{
        position: 'fixed', width: windowSize.x, height: windowSize.y, 
        border:'solid', top: position.y, left: position.x, zIndex: 1000, 
        display: !isVisible ? 'none' : 'grid', gridTemplateRows:'auto 1fr auto', gridTemplateColumns: 'auto',
        backgroundColor: 'white',
        resize: 'both'
    }}
        
    >
        {
            // resize handles
            [
                {/*border: 'solid green'  ,*/ transform: 'translate(0,-100%)', top: '0', width:'100%', height: 4, cursor: 'n-resize', resizeDir:RESIZE_DIR.NORTH}, 
                {/*border: 'solid orange' ,*/ transform: 'translate(0, 100%)', bottom: '0', width:'100%',height: 4, cursor: 's-resize', resizeDir:RESIZE_DIR.SOUTH}, 
                {/*border: 'solid blue'   ,*/ transform: 'translate( 100%, 0)', right: '0', height:'100%',width: 4, cursor: 'e-resize', resizeDir:RESIZE_DIR.EAST}, 
                {/*border: 'solid red'    ,*/ transform: 'translate(-100%, 0)', left: '0', height:'100%',width: 4, cursor: 'w-resize', resizeDir:RESIZE_DIR.WEST}
            ].map((divProp, divPropI) => <div key={divPropI} style={{...divProp, position: 'absolute'}} onMouseDown={() => setResizing(divProp.resizeDir)} />)
        }

            <header 
            onMouseDown={() => setDragging(true)}
            style={{display: 'grid', gridTemplateColumns: '1fr auto auto', gridTemplateRows: 'auto',
                backgroundColor: 'lightgray', padding: 8, gap: 4,
                userSelect: 'none',
                cursor: 'move'
            }}>
                <p>PopGen</p>
                <button onClick={onMinimize}>Minimize</button>
                <button onClick={onClose}>Close</button>
            </header>
            {
                autofillStatus.isFilling ? 
                    <main style={{display: 'flex', border: 'solid lightgray 4px', margin: 8, flexDirection: 'column'}}>
                        <p style={{margin: 'auto'}}>Filling</p>
                        
                        {/* div */}
                        {
                        autofillStatus.total == 0 &&
                        <div style={{display: 'grid', gridTemplateRows: '100%', gridTemplateColumns: `${autofillStatus.fillCount * 100 / autofillStatus.total}% auto`, height: '20px', border: 'solid', width: '100%'}}>
                            <div style={{backgroundColor: 'lightgreen'}} /> 
                        </div>
                        }
                    </main>
                :
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

            <div style={{display: 'grid', gridTemplateColumns: '1fr auto', gridTemplateRows: 'auto'}}>
                <button style={{width: '100%'}} disabled={autofillStatus.isFilling || images.length == 0} onClick={handleGenerate}>Generate</button>
                {images.length > 0 && !autofillStatus.isFilling && 
                    <button style={{width: '100%'}} children={"Clear Images"} onClick={() => setImages([])} />}
            </div>

    </div>
}

type PopGenContextData = {
    config:SettingsConfig|null,
    listingGen:ListingGenerator|null,
    modelHandler:ModelHandler|null,
    modelContext:ModelContext|null,
}

const PopgenWindowContext = React.createContext({} as PopGenContextData)

const PopgenWindowWrapper = () => {
    const [isMinimized, setIsMinimized] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(true)
    const [config, setConfig] = React.useState<SettingsConfig | null>(null)
    const [listingGen, setListingGen] = React.useState<ListingGenerator | null>(null)
    const [modelHandler, setModelHandler] = React.useState<ModelHandler | null>(null)
    const [modelContext, setModelContext] = React.useState<ModelContext | null>(null)

    React.useEffect(() => {
        (async() => {
            const configData = await browser.storage.local.get('popgen-settings')
            let configDetails:SettingsConfig = {
                hostPath: 'http://127.0.0.1',
                hostPort: 11434,
                targetModel: LLMType.LLAVA
            }
            
            if(Object.hasOwn(configData, 'popgen-settings')){
                configDetails = configData['popgen-settings']
            }
            setConfig(configDetails)

            let tmpModelHandler = new LlavaModelHandler("", 0)
            if(configDetails.targetModel == 'llava')
                tmpModelHandler = new LlavaModelHandler(configDetails.hostPath, configDetails.hostPort)

            let tmpModelContext = new DepopModelContext()
            setModelHandler(tmpModelHandler)
            setModelContext(tmpModelContext)
            setListingGen(new ListingGenerator(tmpModelHandler, tmpModelContext))
        })()
    }, [])

    return (
    <React.StrictMode>
    <PopgenWindowContext.Provider value={{
        config: config,
        listingGen: listingGen, 
        modelHandler: modelHandler, 
        modelContext: modelContext
    }}>
        {
            isOpen && <>
                <PopGenMinimizedWindow isVisible={isMinimized} onClose={() => setIsOpen(false)} onMaximize={() => setIsMinimized(!isMinimized)} />
                <PopgenWindow isVisible={!isMinimized} onClose={() => setIsOpen(false)} onMinimize={() => setIsMinimized(!isMinimized)}/>
            </>
        }
    </PopgenWindowContext.Provider>
    </React.StrictMode>
    )
}

const container = document.createElement('div')
document.body.appendChild(container)

const root = createRoot(container)
root.render(<PopgenWindowWrapper />)

export {}