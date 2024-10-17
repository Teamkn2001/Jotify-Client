import React, { useEffect, useState } from 'react'
import useUserStore from '../stores/userStore'
import { toast } from 'react-toastify'

export default function Permission({ documentId }) {

    const givePermission = useUserStore(pull => pull.givePermission)
    const getAllUserPermission = useUserStore(pull => pull.getAllUserPermission)
    const userPermissions = useUserStore(pull => pull.userPermissions)
    const token = useUserStore(pull => pull.token)
    const deletePermission = useUserStore(pull => pull.deletePermission)

    console.log('userPermissions', userPermissions)

    const [permission, setPermission] = useState({
        identity: '',
        permission: ''
    })

    // console.log(permission)
    const hdlSelectPermission = e => {
        // console.log(e.target.value)
        setPermission(prv => ({ ...prv, permission: e.target.value }))
    }
    const hdlSearchUser = e => {
        setPermission(prv => ({ ...prv, [e.target.name]: e.target.value }))
    }

    const hdlGivePermission = async e => {
        e.preventDefault()
        try {
            if (!(permission.identity.trim() || permission.permission.trim())) {
                toast.error('must select type and fill the user !')
            }
            await givePermission(documentId, permission, token)
            await getAllUserPermission(documentId, token)
            toast.success('gave permit~~')
        } catch (err) {
            const errMsg = err?.response?.data?.msg || err.message
            toast.error(errMsg)
        }
    }

    const hdlDeletePermission = async (permissionId) => {
        try {
            console.log(permissionId)
            await deletePermission(permissionId, token)
            await getAllUserPermission(documentId, token)
        } catch (err) {
            const errMsg = err?.response?.data?.msg || err.message
            toast.error(errMsg)
        }
    }


    useEffect(() => {
        getAllUserPermission(documentId, token)
    }, [])

    return (
        <>
            <div className='modal-box flex flex-col items-center gap-4'>
                <button
                    type="button"
                    onClick={e => e.target.closest('dialog').close()}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                </button>

                <div className='flex items-center gap-3'>
                    <p className='font-bold text-xl'>Permission Type</p>
                    <select
                        onChange={hdlSelectPermission}
                        className="select select-info max-w-xs">
                        <option disabled selected>Select permission</option>
                        <option>EDITOR</option>
                        <option>VIEWER</option>
                    </select>  
                </div>

                <div className='flex gap-4'>
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            name='identity'
                            value={Permission.identity}
                            onChange={hdlSearchUser}
                            type="text"
                            className="grow"
                            placeholder="user email..." />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd" />
                        </svg>
                    </label>
                    <button
                        onClick={e => hdlGivePermission(e)}
                        className="btn btn-info">Add user</button>
                </div>

                <div>
                    {userPermissions.map(el => (
                        <div className='flex gap-5'>
                            <p>{el.permission} </p>
                            <p>{el.user.username} </p>
                            <p>({el.user.email}) </p>
                            <p onClick={() => hdlDeletePermission(el.id)}>remove</p>
                        </div>
                    ))}

                </div>
            </div>
        </>
    )
}
