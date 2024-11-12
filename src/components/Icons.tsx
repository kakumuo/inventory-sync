import React from "react";
import 'material-icons/iconfont/material-icons.css';


const genIcon = (iconName:string) => {
    return <span className="material-icons-outlined">{iconName}</span>
}

export const Close = genIcon("close")
    , BarChart = genIcon("bar_chart")
    , Settings = genIcon("settings")
    , Changes = genIcon("compare_arrows")
    , MoreOptions = genIcon("more_horiz")
    , Refresh = genIcon("refresh")
    , Add = genIcon("add")
    , FilterList = genIcon("filter_list")
    , ArrowLeft = genIcon("arrow_left")
    , ArrowRight = genIcon("arrow_right")