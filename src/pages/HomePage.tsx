import React from "react"
import * as Icons from "../components/Icons"
import { useParams } from "react-router"
import { api_getInventory, api_getProfile } from "../api"
import { InventoryItem, InventoryProfile } from "../types"
import { Badge } from "../components/Status"
import { Link } from "react-router-dom"

export const HomePage = () => {
    const {profileId} = useParams()
    const [profile, setProfile] = React.useState<InventoryProfile>({} as InventoryProfile)
    const [inventory, setInventory] = React.useState<InventoryItem[]>([])
    const [workingInventory, setWorkingInventory] = React.useState<InventoryItem[]>([])
    const [pageSize, setPageSize] = React.useState(10)
    const [filters, setFilters] = React.useState<string[]>([])
    const [navButtons, setNavButtons] = React.useState<{path:string|undefined, icon:React.JSX.Element}[]>([
        {path: 'add_item', icon: Icons.Add},
        {path: 'settings', icon: Icons.Settings},
        {path: 'changes', icon: Icons.Changes},
    ])

    const navButtonStyle:React.CSSProperties = {
        textDecoration: 'none', 
        aspectRatio: '3/1', 
        height: '100%'
    }

    React.useEffect(() => {
        api_getInventory({profileId: profileId})
            .then(resp => {
                if(resp.success && resp.data) updateInventory(resp.data)
            })
        
        if(profileId)
            api_getProfile({ids: [profileId]})
            .then(resp => {
                if(resp.success && resp.data && resp.data.length > 0) setProfile(resp.data[0])
            })
    }, [profileId])

    React.useEffect(() => {
        updateInventory(inventory)
    }, [filters])

    const updateInventory = (items:InventoryItem[]) => {
        setInventory(items)

        for(let filter of filters){
            items = items.filter(i => JSON.stringify(i).includes(filter))
        }
        setWorkingInventory(items)
    }

    const handleFilterList = (filter:string, isAdd:boolean = true) => {
        if(isAdd)
            setFilters([...filters, filter])
        else
            setFilters(filters.filter(f => f != filter))
    }

    return <div style={{
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr', 
        backgroundColor: 'white', 
        overflow: 'hidden',
        width: '100%', height: '100%', padding: 16, gap: 8
    }}>

        {/* banner */}
        <header style={{display: 'flex', gap: 8, height: 32}}>
            <input  style={{width: '50%', marginRight: 'auto'}}/>
            
            {navButtons.map(button => {
                if(button.path) 
                    return <Link to={button.path} style={navButtonStyle} children={<button style={{width: '100%'}} children={button.icon} />}/>
            })}
            <button style={navButtonStyle}  children={Icons.MoreOptions}/>
        </header>

        <select>
            {["All", "EBay", "Marketplace"].map(i => <option value={i} children={i}/>) }
        </select>

        <main style={{display: 'grid', gridTemplateColumns: '3fr 2fr', gridTemplateRows: '1fr', gap: 8, overflow: 'hidden'}}>
            <StatisticsContent />
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', gridTemplateColumns: '1fr', gap: 8, overflow: 'hidden'}}>
                <header style={{display: 'grid', gridTemplateColumns: '10fr 2fr', gridTemplateRows: '1fr', gap: 8}}>
                    <input onKeyDown={(ev) => {
                        if(ev.key == 'Enter' && ev.currentTarget.value.trim() != "") {
                            handleFilterList(ev.currentTarget.value.trim())
                            ev.currentTarget.value = "" 
                        }
                    }} />
                    <Badge label={filters.length} children={<button children={Icons.FilterList}/>} />
                </header>
                <InventoryList items={workingInventory} />
                <footer>
                    <p>Showing {Math.min(workingInventory.length, pageSize)} of {workingInventory.length} items</p>
                </footer>
            </div>
        </main>
    </div>
}

const InventoryList = ({items}:{items:InventoryItem[]}) => {
    const ListItem = ({item}:{item:InventoryItem}) => {
        const [isHovered, setIsHovered] = React.useState(false)
        const hoverColor:React.CSSProperties['backgroundColor'] = 'lightblue'
        const defaultColor:React.CSSProperties['backgroundColor'] = 'white'

        return <Link 
            style={{
                display: 'flex', flexWrap: 'wrap', flexDirection: 'column', border: 'solid lightgray 2px', padding: 8, height: '150px', width: '100%',
                backgroundColor: isHovered ? hoverColor : defaultColor, gap: 8, textDecoration: 'none'
            }}
            to={`item/${item._id}`}
            onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
        >
            <img src={item.imgPaths[0]} style={{height: '100%', aspectRatio: '1/1', objectFit: 'cover'}} />
            <div style={{display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, gridTemplateRows: 'auto'}}>
                <h3 style={{}} children={item.name}/>
                <button children={Icons.MoreOptions}/>
            </div>
            <h5 style={{fontWeight: 'lighter'}} children={item._id}/>
            <div style={{display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, gridTemplateRows: 'auto', marginTop: 'auto'}}>
                <p style={{}} children={item.shippingStatus}/>
                <p style={{}} children={item.price}/>
            </div>
        </Link>
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

