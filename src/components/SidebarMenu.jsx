import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AvatarIcon01 } from '../icons'
import useUserStore from '../stores/userStore'
import { v4 as uuidV4 } from 'uuid'
import { FilePlus2 } from 'lucide-react';
import { UserRoundPen } from 'lucide-react';
import { LogOut } from 'lucide-react';

export default function SidebarMenu() {
    const navigate = useNavigate()
    const user = useUserStore(pull => pull.user)
    const token = useUserStore(pull => pull.token)
    const logout = useUserStore(pull => pull.logout)
    const createDoc = useUserStore(pull => pull.createDoc)
    const getAllDoc = useUserStore(pull => pull.getAllDoc)
    const documentId = useUserStore(pull => pull.currentDocumentId)

    const addOwnerPermission = useUserStore(pull => pull.addOwnerPermission)

    const [isReady, setIsReady] = useState(false)

   
    const hdlCreateDoc = async (e) => {
        // console.log(user.id, token)
        const rs = await createDoc(user.id, token)
      
        await getAllDoc(user.id, token)

        setIsReady(true)
    }

    console.log(isReady)
    useEffect(() => {
        if (isReady) {

            const body = {
                userId: user.id,
                documentId: documentId
            }
        
            console.log("body",body)
    
            addOwnerPermission(body, token)

            navigate(`/document/${documentId}${uuidV4()}`)
        }
    }, [isReady])
    
    const hdlLogout = e => {
        logout()
    }
    return (
        <div className=" flex w-1/6 h-screen">
            <div className="flex flex-col gap-[5rem] m-auto">
                <Link to={'/profile'}
                    // onClick={hdlProfileMenu}
                    className="flex flex-col items-center">
                    <UserRoundPen size={60}/>
                    <p>Profile</p>
                </Link>
                <div
                    //  to={'/document'}
                    onClick={() => hdlCreateDoc()}
                    className="flex flex-col items-center cursor-pointer">
                    <FilePlus2 size={60}/>
                    <p>New Document</p>
                </div>
                <div
                    onClick={hdlLogout}
                    className="flex flex-col items-center cursor-pointer">
                     <LogOut size={60}/>
                    <p>Logout</p>
                </div>
            </div>
        </div>
    )
}
