import React from "react"
import * as Icons from "../components/Icons"
import { useParams } from "react-router"
import { api_getInventory, api_getProfile } from "../api"
import { InventoryItem, InventoryProfile } from "../types"


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

    const headerButtonStyle:React.CSSProperties = {
        aspectRatio: '1.5/1'
    }

    return <div style={{backgroundColor: "white", padding: 16, display: 'grid', gridTemplateRows: 'auto auto 1fr auto', gap: 16, height: 'auto'}}>
        
        <header style={{display: 'flex', gap: 8}}>
            <div style={{marginRight: 'auto'}}>
                <h2 children={"Inventory"} />
                <h5>{profile.name}</h5>
            </div>
            <button style={headerButtonStyle} children={Icons.BarChart} />
            <button style={headerButtonStyle} children={Icons.Settings} />
            <button style={headerButtonStyle} children={Icons.Refresh} />
            <button style={headerButtonStyle} children={Icons.Changes} />
            <button style={headerButtonStyle} children={Icons.MoreOptions} />
        </header>

        {/* input search */}
        <div style={{display: 'grid', gap: 4, gridTemplateColumns: "1fr auto auto"}}>
            <input type="search" name="" id="" />
            <button children={Icons.Add} />
            <button children={Icons.List} />
        </div>

        <div style={{display: 'grid', overflowY: 'scroll', height: '100%'}}>
            <table style={{textAlign: 'start'}}>
            <thead>
                <tr>
                    <th className="checkbox-header" />
                    <th className="image-header"/>
                    <th className="name-header" children={"Name"}/>
                    <th className="price-header" children={"Price"}/>
                    <th className="description-header" children={"Description"}/>
                    <th className="status-header" children={"Shipped"}/>
                    <th className="more-header"/>
                </tr>
            </thead>
            <tbody>
                {inventory.filter((_, i) => i < 10).map(item => <InventoryItemTableRow key={item._id} item={item} />)}
            </tbody>

        </table>
        </div>
        

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


const InventoryItemTableRow = ({item}:{item:InventoryItem}) => {
    return <tr>
        <td><input type="checkbox" /></td>
        <td><img width={'100%'} height={'100%'} style={{objectFit: 'contain'}} src={item.imgPaths[0]}/></td>
        <td><p>{item.name}</p><p>{item._id}</p></td>
        <td><p>{item.price}</p></td>
        <td><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, quod.</p></td>
        <td><p>{item.shippingStatus}</p></td>
        <td><button children={Icons.MoreOptions} /></td>
    </tr>
}