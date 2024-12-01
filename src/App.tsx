import React from "react"
import { PopGen } from "./PopGen"

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
