import React from "react";
import { InventoryProfile } from "../types";
import { api_addProfile, api_getProfile } from "../api";
import * as Icon from '../components/Icons'
import { Link } from "react-router-dom";
import { eventNames } from "process";

export const LoginPage = () => {
    const [profiles, setProfiles] = React.useState<InventoryProfile[]>([])
    const [isAddingProfile, setIsAddingProfile] = React.useState(false);
    const [lastUpdatedTime, setLastUpdatedTime] = React.useState(Date.now())
    const [searchFilter, setSearchFilter] = React.useState("")

    React.useEffect(() => {
        api_getProfile({})
            .then(resp => {
                if(resp.success) setProfiles(resp.data)
                console.log(resp.data)
            })
    }, [lastUpdatedTime])

    const handleAddProfile = (ev:React.KeyboardEvent<HTMLInputElement>) => {
        if(ev.key == "Enter" && ev.currentTarget.value.trim() != "") {
            api_addProfile({name: ev.currentTarget.value.trim()})
                .then(resp => setLastUpdatedTime(Date.now()))
            ev.currentTarget.value = ""
            ev.currentTarget.blur()
        }
    }
    
    return <div style={{display: 'grid', 
        gridTemplateColumns: '60% 1fr', 
        gridTemplateRows: '100%',
        margin: 'auto', width: '70vw', height: '80vh', 
        padding: 16, gap: 16,   
        backgroundColor: 'white', 
    }}>
        <img style={{objectFit: 'cover', width: '100%', height: '100%'}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png" />
        <section style={{display: 'grid', height: '100%', gridTemplateColumns: '100%', gridTemplateRows: 'auto auto 1fr auto', gap: 16}}>
            <h1>Select Profile</h1>
            <input onChange={(ev) => setSearchFilter(ev.currentTarget.value)} style={{width: '70%', justifySelf: 'center'}} type="search" name="" id="" />
            <div style={{display: "flex", flexDirection: 'column', height: '100%', gap: 16, overflowY: 'scroll'}}>   
                {
                    profiles.filter(p => searchFilter.trim() == "" || p.name.includes(searchFilter)).map(profile => {
                        return <ProfileListItem key={profile._id} profileData={profile} />
                    })
                }
            </div>

            {!isAddingProfile ? 
                <button style={{width: '2vw', height: '2vw', justifySelf: 'end'}} children={Icon.Add} onClick={() => setIsAddingProfile(true)} />
                : <input type="text"  style={{height: '2vw'}} autoFocus onBlur={() => setIsAddingProfile(false)} onKeyDown={handleAddProfile}/>
            }
        </section>
    </div>
}


const ProfileListItem = ({profileData}:{profileData:InventoryProfile}) => {
    return <Link to={`./${profileData._id}`} style={{textDecoration: 'none'}}>
        <button style={{display: 'grid', gridTemplateColumns: '20% 1fr', height: '100px', width: '100%', padding: 8, gap: 8}}>
            <img style={{objectFit: 'cover', height: '100%', width: '100%', alignSelf: 'center'}} src="https://placehold.co/600x400" />
            <div style={{display: "grid", textAlign: 'left'}}>
                <h5>Admin</h5>
                <h2>{profileData.name}</h2>
                <h6>Last Logon: {profileData.updated}</h6>
            </div>
        </button>
    </Link>
}
