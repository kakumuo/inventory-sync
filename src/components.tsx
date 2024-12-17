import React from 'react'

export type InputParam = {
    label:string, 
    type:'text',
    defaultValue?:string,
    onChange?:(updatedValue:string) => void
} | {
    label:string, 
    type:'number',
    defaultValue?:number, 
    onChange?:(updatedValue:string) => void
} | {
    label:string,
    type:'option', 
    options:string[],
    defaultValue?:string, 
    onChange?:(updatedValue:string) => void
} | {
    label:string,
    type:'custom', 
    target:React.JSX.Element
}

// {options?:InputOption[], defaultValue?:string|number, label:string, type:'number'|'text'|'option'|'custom'}

export const Input = (params:InputParam) => {
    if(params.type == 'option')
        console.log(params.defaultValue)

    return <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gridTemplateRows: 'auto', gap: 8}}> 
        <p>{params.label}</p>{
        params.type == 'option' ? 
            <select defaultValue={params.defaultValue && params.options.indexOf(params.defaultValue)} onChange={(ev) => params.onChange && params.onChange(ev.target.value)}>
                {params.options.map((option, optionI) => <option key={optionI} label={option} value={optionI} />)}
            </select>
            :
        params.type == 'custom' ? 
            <div></div>
            :
            <input type={params.type} defaultValue={params.defaultValue} onBlur={(ev) => params.onChange && params.onChange(ev.target.value)} />
    }</div>
}
