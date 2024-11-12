import React from "react"
import * as Icons from "../components/Icons"
import { useParams } from "react-router"
import { api_getInventory, api_getProfile } from "../api"
import { InventoryItem, InventoryProfile } from "../types"
import { ImageInputCarousel } from "../components/Input"

export const HomePage = () => {
    const {profileId} = useParams()
    const [profile, setProfile] = React.useState<InventoryProfile>({} as InventoryProfile)
    const [inventory, setInventory] = React.useState<InventoryItem[]>([])

    React.useEffect(() => {
        api_getInventory({profileId: profileId})
            .then(resp => {
                if(resp.success && resp.data) setInventory(resp.data)                    
            })
        
        if(profileId)
            api_getProfile({ids: [profileId]})
            .then(resp => {
                if(resp.success && resp.data && resp.data.length > 0) setProfile(resp.data[0])
            })
    }, [profileId])

    return <div style={{
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr', 
        backgroundColor: 'white', 
        overflow: 'hidden',
        width: '100%', height: '100%', padding: 16, gap: 8
    }}>

        {/* banner */}
        <header style={{display: 'flex', gap: 8}}>
            <input  style={{width: '50%', marginRight: 'auto'}}/>
            
            <button children={Icons.Add}/>
            <button children={Icons.BarChart}/>
            <button children={Icons.Settings}/>
            <button children={Icons.Changes}/>
            <button children={Icons.MoreOptions}/>
        </header>

        <select>
            {["All", "EBay", "Marketplace"].map(i => <option value={i} children={i}/>) }
        </select>

        <main style={{display: 'grid', gridTemplateColumns: '3fr 2fr', gridTemplateRows: '1fr', gap: 8, overflow: 'hidden'}}>
            <StatisticsContent />
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', gridTemplateColumns: '1fr', gap: 8, overflow: 'hidden'}}>
                <header style={{display: 'grid', gridTemplateColumns: '1fr auto', gridTemplateRows: '1fr', gap: 8}}>
                    <input /><button children={Icons.FilterList}/>
                </header>
                <InventoryList items={inventory} />
            </div>
        </main>
    </div>
}

const InventoryList = ({items}:{items:InventoryItem[]}) => {
    const ListItem = ({item}:{item:InventoryItem}) => {
        return <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column', border: 'solid lightgray 2px', padding: 8}}>
            <img src={item.imgPaths[0]} />
            <p style={{}} children={item.name}/>
            <p style={{}} children={item._id}/>
            <p style={{}} children={item.shippingStatus}/>
            <p style={{}} children={item.price}/>
        </div>
    }

    return <div style={{display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'scroll', height: '100%'}}>
        {[...items].map(item => <ListItem item={item} />)}
    </div>
}

const StatisticsContent = () => {
    return <section style={{display: 'grid', gridTemplateRows: '1fr 20%', gap: 8}}>
        <div style={{backgroundColor: 'lightpink'}} />
        <footer style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: '100%', gap: 8}}>
            <div style={{backgroundColor: 'lightsalmon'}}/>
            <div style={{backgroundColor: 'lightsteelblue'}}/>
            <div style={{backgroundColor: 'lightcoral'}}/>
            <div style={{backgroundColor: 'lightgoldenrodyellow'}}/>
        </footer>
    </section>
}

