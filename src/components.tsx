import React from 'react'

export type InputParam = {
    label:string, 
    type:'text',
    value:string,
    onChange:(updatedValue:string) => void
} | {
    label:string, 
    type:'number',
    value:number, 
    onChange:(updatedValue:string) => void
} | {
    label:string,
    type:'option', 
    options:string[],
    value:string, 
    onChange:(updatedValue:string) => void
} | {
    label:string,
    type:'custom', 
    target:React.JSX.Element
}

// {options?:InputOption[], defaultValue?:string|number, label:string, type:'number'|'text'|'option'|'custom'}

export const Input = (params:InputParam) => {
    if(params.type == 'option')
        console.log(params.value)

    return <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gridTemplateRows: 'auto', gap: 8}}> 
        <p>{params.label}</p>{
        params.type == 'option' ? 
            <select onChange={(ev) => params.onChange(ev.target.value)} value={params.value}>
                {params.options.map((option, optionI) => <option key={optionI} label={option} value={option} />)}
            </select>
            :
        params.type == 'custom' ? 
            <div></div>
            :
            <input 
                type={params.type} 
                // defaultValue={params.defaultValue} 
                value={params.value}
                onChange={(ev) => params.onChange(ev.target.value)} 
            />
    }</div>
}
