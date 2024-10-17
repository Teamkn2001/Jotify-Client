import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AvatarIcon01 } from '../icons'
import useUserStore from '../stores/userStore'

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
        await createDoc(user.id, token)

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

            navigate('/document')
        }
    }, [isReady])
    
    const hdlLogout = e => {
        logout()
    }
    return (
        <div className="bg-red-200 flex w-1/6 h-screen">
            <div className="flex flex-col gap-5 m-auto">
                <Link to={'/profile'}
                    // onClick={hdlProfileMenu}
                    className="flex flex-col items-center">
                    <AvatarIcon01 className='w-2/5' />
                    <p>Profile</p>
                </Link>
                <div
                    //  to={'/document'}
                    onClick={() => hdlCreateDoc()}
                    className="flex flex-col items-center">
                    <AvatarIcon01 className='w-2/5' />
                    <p>New</p>
                </div>
                <div
                    onClick={hdlLogout}
                    className="flex flex-col items-center cursor-pointer">
                    <AvatarIcon01 className='w-2/5' />
                    <p>Logout</p>
                </div>
            </div>
        </div>
    )
}
