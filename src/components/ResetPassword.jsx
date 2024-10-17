import React, { useState } from 'react'
import { toast } from 'react-toastify'
import useUserStore from '../stores/userStore'

export default function ResetPassword() {
    const user = useUserStore( pull => pull.user)
    const resetPassword = useUserStore(pull => pull.resetPassword)
    const token = useUserStore(pull => pull.token)

    const [ newPassword, setNewPassword ] = useState({
        newPassword : '',
        confirmNewPassword : ''
    })
    console.log(newPassword)

    const hdlOnchange = e => {
        setNewPassword( prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const hdlResetPassword = async e => {
        try {
        e.preventDefault()
        if(newPassword.newPassword !== newPassword.confirmNewPassword) {
            return toast.error('password not match')
        }
            // axios 
            await resetPassword(user.id, newPassword, token)
            toast.success('reset successful')
            
        } catch (err) {
            const errMsg = err?.response?.data?.msg || err.message
            toast.error(errMsg)
        }
    }

  return (
    <form className='flex flex-col p-7 gap-5 items-center' onSubmit={hdlResetPassword}>
                        <p className='font-mono text-2xl'>Reset Password</p>
                        <div className="flex flex-col gap-2">
                            <p>new password</p>
                            <label className="input input-bordered flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path
                                        fillRule="evenodd"
                                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                        clipRule="evenodd" />
                                </svg>
                                <input 
                                name='newPassword'
                                value={newPassword.newPassword}
                                onChange={hdlOnchange}
                                type="password" 
                                className="grow"
                                />
                            </label>
                            <p>confirm password</p>
                            <label className="input input-bordered flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path
                                        fillRule="evenodd"
                                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                        clipRule="evenodd" />
                                </svg>
                                <input 
                                name='confirmNewPassword'
                                value={newPassword.confirmNewPassword}
                                onChange={hdlOnchange}
                                type="password" 
                                className="grow" 
                                />
                            </label>
                        </div>
                        <button className="btn btn-error w-[50%]">change password</button>
                    </form>
  )
}
