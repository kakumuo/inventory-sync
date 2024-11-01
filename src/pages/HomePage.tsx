import React from "react"
import * as Icons from "../components/Icons"



export const HomePage = () => {
    return <div style={{backgroundColor: "white", padding: 16, display: 'grid', gridTemplateRows: 'auto auto 1fr auto', gap: 16, margin: ''}}>
        
        <header style={{display: 'flex'}}>
            <h1 style={{marginRight: 'auto'}}>Inventory</h1>
            <button children={Icons.Close} />
            <button children={Icons.Settings} />
            <button children={Icons.Refresh} />
            <button children={Icons.Changes} />
            <button children={Icons.MoreOptions} />
        </header>

        {/* input search */}
        <div style={{display: 'grid', gap: 4, gridTemplateColumns: "1fr auto auto"}}>
            <input type="search" name="" id="" />
            <button children={Icons.Add} />
            <button children={Icons.List} />
        </div>

        <table>
        </table>

        <footer style={{display: 'flex', gap: 4}}>
            <p style={{marginRight: 'auto'}}>1 Selected</p>
            <button children={Icons.ArrowLeft}/>
            {[1, 2, 3, 4].map((item, itemI) => <button style={{padding: 8}} key={itemI} children={item} />)}
            <p style={{padding: 8}}>...</p>
            {[7, 8, 9].map((item, itemI) => <button style={{padding: 8}} key={itemI} children={item} />)}
            <button children={Icons.ArrowRight}/>
            <p style={{marginLeft: 'auto'}}>Showing 10 of 30</p>
        </footer>
    </div>
}