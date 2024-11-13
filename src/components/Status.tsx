import React from 'react'

export const Badge = ({label, children}:{label:string|number|undefined, children?:React.JSX.Element}) => {
    return <div style={{display: 'grid', gridTemplateColumns: 'auto', gridTemplateRows: 'auto', position: 'relative', overflow: 'visible'}}>
        {label != undefined && <div style={{
            backgroundColor: 'red', color: 'white', position: 'absolute', top: 0, right: 0, padding: 4, aspectRatio: '1/1',
            borderRadius: 8, zIndex: '100', transform: 'translate(50%, -50%)'
        }}>{label}</div>}
        {children}
    </div>
}