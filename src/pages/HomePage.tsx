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

        <InventoryTable items={inventory} />
        

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


const InventoryTable = ({items}:{items:InventoryItem[]}) => {
    
    const headers:string[] = [
        "", 
        "", 
        "Name", 
        "Price",
        "Description", 
        "Status", 
        ""
    ];

    const TABLE_GRID_STYLE:React.CSSProperties = {
        display: 'grid', 
        gridTemplateRows: 'auto',
        width: '100%',
        gridTemplateColumns: [
            "10%", 
            "10%", 
            "20%", 
            "20%", 
            "20%", 
            "10%", 
            "10%", 
        ].join(" ")
    }

    return <div style={{display: 'flex', flexDirection: 'column', overflowY: 'scroll'}}>
        {/* header */}
        <header style={{...TABLE_GRID_STYLE, backgroundColor: 'lightgray'}} >{headers.map(header => <div style={{width: '100%'}} key={header}>{header}</div>)}</header>
        <main>{items.map(item => <InventoryItemTableRow key={item._id} item={item} rowGridStyle={TABLE_GRID_STYLE} />)}</main>
    </div>
}

const InventoryItemTableRow = ({item, rowGridStyle}:{item:InventoryItem, rowGridStyle:React.CSSProperties}) => {
    return <details><summary style={{...rowGridStyle, alignItems: 'center'}}>
        <div><input type="checkbox" /></div>
        <div style={{maxWidth: '6vw', whiteSpace: 'discard-after'}}><img style={{objectFit: 'contain', width: '100%'}} src={item.imgPaths[0]}/></div>
        <div><p>{item.name}</p><p>{item._id}</p></div>
        <div><p>{item.price}</p></div>
        <div><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, quod.</p></div>
        <div><p>{item.shippingStatus}</p></div>
        <div><button children={Icons.MoreOptions} /></div>
    </summary>
        <InventoryItemEdit item={item} />
    </details>
}

const InventoryItemEdit = ({item}:{item:InventoryItem}) => {
    const LABEL_STYLE:React.CSSProperties = {
        width: '10%', 
        height: 'auto'
    }

    const INPUT_STYLE:React.CSSProperties = {
        flex: '90%', 
        height: 'auto'
    }

    const Divider = () => <div style={{borderBottom: 'solid white 2px'}} />

    return <div style={{backgroundColor: 'lightgray', height: "400px", padding: "16px", display: 'grid', gridTemplateRows: 'auto 1fr'}}>
        <header style={{borderBottom: 'solid white 2px'}}>
            <button children={"All Shops"} />
            <button children={"Ebay"} />
            <button children={"Facebook Marketplace"} />
        </header>

        <main style={{display: 'grid', overflowY: 'scroll', gridTemplateRows: 'repeat(10, auto) 1fr', gap: 16, padding: 16}}>
            <InventoryItemEditSection title="General" style={{display: 'flex', flexWrap: 'wrap'}}>
                <p style={LABEL_STYLE}>Title</p> <input style={INPUT_STYLE} />
                <p style={LABEL_STYLE}>Price</p> <input style={INPUT_STYLE} />
                <ImageInputCarousel />
            </InventoryItemEditSection>
            <Divider />
        </main>
    </div>
}

const InventoryItemEditSection = ({title, children, style}:{title:string, children?:any, style?:React.CSSProperties}) => {
    return <section style={{display: 'grid', gridTemplateColumns: '50% auto'}}>
        <h1>{title}</h1>
        <aside style={style}>{children}</aside>
    </section>
}

