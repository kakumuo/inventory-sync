import React from "react"
import { LLMClient } from "./LLMClient"

// component for injected window

interface Point {
    top: number, 
    left: number,
  }
  
  export const PopGen = () => { 
    const [showWindow, setShowWindow] = React.useState<boolean>(true)
    const [height, setHeight] = React.useState(0)
    const [origin, setOrigin] = React.useState(0)
    const [isDragging, setIsDragging] = React.useState<boolean>(false)
  
    const divStyle:React.CSSProperties = {
      backgroundColor: 'lightpink', position: 'absolute', right: '0%',
      width: 75, height: 75, 
      top: height,
      transform: 'translate(0, 0)', 
      padding: 8
    }
  
    const handleDrag = (ev:React.MouseEvent<HTMLElement, MouseEvent>, isDragStart:boolean|undefined=undefined) => {
      if(isDragStart != undefined && isDragStart) {
        setIsDragging(true)
        setOrigin(height)
      }else if (isDragStart != undefined && !isDragStart) {
        setIsDragging(false)
      }else if (isDragging) {
        setHeight(height + ev.movementY)
      }
    }
  
    return <>{
      !showWindow ? 
      <button 
        style={divStyle}
        onMouseDown={(ev) => handleDrag(ev, true)}
        onMouseMove={(ev) => handleDrag(ev)}
        onMouseUp={(ev) => handleDrag(ev, false)}
        onMouseLeave={(ev) => handleDrag(ev, false)}
        onClick={(ev) => !isDragging && origin == height && setShowWindow(true)}
      >
        <p>PopGen</p>
        <button style={{position: 'absolute', top: 0, transform: 'translate(-75%, -50%)'}}>Close</button>
      </button> 
      : <PopgenWindow onClose={() => setShowWindow(false)}  />
    }</>
  }
  
  export const PopgenWindow = ({onClose}:{onClose:()=>void}) => {
    const [position, setPosition] = React.useState<Point>({top: 100, left: 300})
    const [size, setSize] = React.useState<Point>({top: 500, left: 400})
    const [isDragging, setIsDragging] = React.useState<boolean>(false)
  
    const windowStyle:React.CSSProperties = {
      position: 'absolute', top: position.top, left: position.left, 
      border: 'solid', 
      background: 'lightpink', 
      display: 'grid', gridTemplateRows: 'auto 1fr',
      width: size.left, height: size.top
    }
  
    const handleDrag = (ev:React.MouseEvent<HTMLElement, MouseEvent>, isDragStart:boolean|undefined=undefined) => {
      if(isDragStart != undefined && isDragStart) {
        setIsDragging(true)
      }else if (isDragStart != undefined && !isDragStart) {
        setIsDragging(false)
      }else if (isDragging) {
        setPosition({top: position.top + ev.movementY, left: position.left + ev.movementX})
      }
    }
    
    React.useEffect(() => {
      console.log("Changed drag state to : ", isDragging)
    }, [isDragging])
  
    return <div style={windowStyle}>
        <header 
          style={{
            backgroundColor: 'salmon', display: 'grid', gridTemplateColumns: '1fr auto'
            , gridTemplateRows: 'auto', padding: 8,
            cursor: 'move'
          }} 
          onMouseDown={(ev) => handleDrag(ev, true)}
          onMouseMove={(ev) => handleDrag(ev)}
          onMouseUp={(ev) => handleDrag(ev, false)}
          onMouseLeave={(ev) => handleDrag(ev, false)}
        >  
          <p>PopGen</p>
          <button onClick={onClose}>Close</button>
        </header>
        <PopGenMain />
  
    </div>
  }
  
  
  const PopGenMain = () => {
    // const [images, setImages] = React.useState(["https://placehold.co/400", "https://placehold.co/600x400"])
    const [images, setImages] = React.useState<string[]>([])
  
  
    const handleImageShift = (imageI:number, shiftLeft:boolean) => {
      const tmpImages = Object.assign([], images)
      if(imageI > 0 && shiftLeft || imageI < images.length - 1 && !shiftLeft){
        const target = imageI + (shiftLeft ? -1 : 1)
        const tmp = tmpImages[target]
        tmpImages[target] = tmpImages[imageI]
        tmpImages[imageI] = tmp
      }
      setImages(tmpImages)
    }
  
    const handleImageRemove = (removeI:number) => {
      return setImages(images.filter((_, i) => i != removeI))
    }
  
    const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
      ev.preventDefault();
      const files = ev.dataTransfer.files;
      const b64Strings: string[] = [];
    
      const readFile = (file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      };
    
      Promise.all(Array.from(files).map(readFile))
        .then((results) => {
          setImages([...images, ...results].filter((_, i) => i < 8))
        })
        .catch((error) => {
          console.error('Error reading files:', error);
        });
    };
    
  
    return <main style={{display: 'grid', gridTemplateRows: 'minmax(30%, auto) 1fr auto', gridTemplateColumns: '100%', gap: 8, padding: 8}}>
        <div 
          onDrop={(ev) => handleDrop(ev)}
          onDragOver={(ev) => ev.preventDefault()}
          style={{
              border: '1px dashed', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 8
              , width: '100%', height: '100%', minHeight: '50%'
            }}>
          {images.map((image, imageI) => <ImagePreview key={imageI} blob={image} onRemove={() => handleImageRemove(imageI)} onShiftImage={(shiftLeft) => handleImageShift(imageI, shiftLeft)}/>)}        
        </div>
  
        <div style={{display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: 4, padding: 4}}>
          <select > 
            <option value={"Something"} />
            <option value={"Custom"} />
          </select>
          <textarea style={{height: '100%', resize: 'none'}}/>
          <footer style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gridTemplateRows: '100%', gap: 4}}>
            <button>Save As</button>
            <input />
          </footer>
        </div>
  
        <button disabled={images.length == 0} children={"Generate"} 
          onClick={async () => {
            const client = new LLMClient("localhost", 11434)
            client.query({
              model: 'llava', 
              prompt: 'What are these images of', 
              images: images.map(image => image.split(",")[1])
            })
          }}
        />
    </main>
  }
  
  const ImagePreview = ({blob, onRemove, onShiftImage: shiftImage}:{blob:string, onRemove:()=>void, onShiftImage:(shiftLeft:boolean)=>void}) => {
    const shiftButtonWidth = '20px'
    const shiftButtonStyle:React.CSSProperties = {
      position: 'absolute', height: '100%', width: shiftButtonWidth, zIndex: 100
    }
  
    return <div style={{display: 'grid', position: 'relative', flexWrap: 'wrap', width: '100%', height: '100%' ,border: 'solid', aspectRatio: '1/1', backgroundColor: 'white'}}>
        <img draggable={false} style={{objectFit: 'contain', width: '100%', height: '100%'}} src={blob} />
        <button style={{position: 'absolute', top: 0, right: 0, transform: 'translate(50%, -50%)'}} onClick={onRemove}>x</button>
        
        <div onClick={() => shiftImage(true)} style={{...shiftButtonStyle, left: 0}}/>
        <div onClick={() => shiftImage(false)} style={{...shiftButtonStyle, right: 0}}/>
    </div>
  }
  