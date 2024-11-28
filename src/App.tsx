import React from "react"

// component for main extension and settings
export const App = () => {
  const [showPopup, setShowPopup] = React.useState(false)


  return <>
    <div style={{width: 400, height: 600, border: 'solid',
      display: 'grid', gridTemplateRows: 'auto 1fr auto'
    }}>
      <header style={{display: 'grid', gridTemplateColumns: '1fr auto', gridTemplateRows: 'auto', padding: 8}}>
        <p>PopGen - Settings</p>
        <button>Close</button>
      </header>

      <main style={{
        backgroundColor: 'lightgray'
      }}>
        
      </main>

      <button onClick={() => setShowPopup(!showPopup)}>Generate Popup Window</button>
  </div>
  {showPopup && <PopGen />}
  </>
}

// component for injected window

interface Point {
  top: number, 
  left: number,
}

export const PopGen = () => {
  const [showWindow, setShowWindow] = React.useState<boolean>(true)
  const [height, setHeight] = React.useState(0)
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
    }else if (isDragStart != undefined && !isDragStart) {
      setIsDragging(false)
    }else if (isDragging) {
      setHeight(height + ev.movementY)
    }
  }

  return <>{
    showWindow ? 
    <button 
      style={divStyle}
      onMouseDown={(ev) => handleDrag(ev, true)}
      onMouseMove={(ev) => handleDrag(ev)}
      onMouseUp={(ev) => handleDrag(ev, false)}
      onMouseLeave={(ev) => handleDrag(ev, false)}
      // onClick={() => setShowWindow(false)}
    >
      <p>PopGen</p>
      <button style={{position: 'absolute', top: 0, transform: 'translate(-75%, -50%)'}}>Close</button>
    </button> 
    : <PopgenWindow onClose={() => setShowWindow(true)}  />
  }</>
}

export const PopgenWindow = ({onClose}:{onClose:()=>void}) => {
  const [position, setPosition] = React.useState<Point>({top: 0, left: 0})
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

      <main>
        
      </main>
  </div>
}
