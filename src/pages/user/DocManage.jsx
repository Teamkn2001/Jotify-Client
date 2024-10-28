import React from 'react'
import { AvatarIcon01 } from '../../icons'

import SidebarMenu from '../../components/SidebarMenu'
import DocManageContent from '../../components/DocManageContent'
import { Outlet } from 'react-router-dom'

export default function DocManage() {
    return (
        <>
            <div className="flex ">
                <SidebarMenu />
                <DocManageContent />
            </div>  
         
        </>
    )
}
