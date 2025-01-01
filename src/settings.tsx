import React from "react";
import {createRoot} from 'react-dom/client'
import {Input} from './components'
import { LLMType } from "./types";
import {SettingsConfig} from './types'


const SettingsWindow = () => {
    const windowDims = {width: 300, height: 400}
    const [config, setConfig] = React.useState({} as SettingsConfig)

    React.useEffect(() => {
        (async() => {
            const configData = await browser.storage.local.get('popgen-settings')
            if(configData && Object.hasOwn(configData, 'popgen-settings')) {
                console.log("Pulling from: ", configData['popgen-settings'])
                setConfig(configData['popgen-settings'] as SettingsConfig)
            }else {
                setConfig({
                    hostPath: 'localhost',
                    hostPort: 11434, 
                    targetModel: LLMType.LLAVA
                })
            }            
        })()
    }, [])

    const handleConfigUpdate = (key:keyof(SettingsConfig), value:any) => {
        const tmp = Object.assign({}, config)
        ;(tmp as any)[value] = key // change as "any to specific field"

        console.log("updated to: ", tmp)
        setConfig(tmp)
        browser.storage.local.set({'popgen-settings': tmp})
    }

    return <div style={{
        ...windowDims, display: 'grid', 
        gridTemplateColumns: 'auto', gridTemplateRows: 'auto 1fr auto'
    }}>
        <header>PopGen - Settings</header>
        <main style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            <Input label="Target Model" type="option" options={Object.values(LLMType)} defaultValue={config.targetModel} 
                onChange={(updated) => handleConfigUpdate("targetModel", updated)}
            />
            <Input label="Host" type="text" defaultValue={config.hostPath} onChange={(updated) => handleConfigUpdate("hostPath", updated)} />
            <Input label="Port" type="number" defaultValue={config.hostPort} onChange={(updated) => handleConfigUpdate("hostPort", updated)} />
        </main>
    </div>
}

const SettingsAppWrapper = () => {
    return <React.StrictMode>
        <SettingsWindow />
    </React.StrictMode>
}

const appDiv = document.querySelector("#react-app")
if(appDiv){
    const root = createRoot(appDiv)
    root.render(<SettingsAppWrapper />)
}
document.body.style.backgroundColor = 'lightgray'

// const appDiv = document.querySelector("#react-app")
// if(appDiv)
//     appDiv.innerHTML = `<div>${new Date().toISOString()}<div>`

    

