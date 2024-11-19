import React, { useState } from 'react'
import Register from './Register'
import useUserStore from '../stores/userStore'
import { toast } from 'react-toastify'
import roof from '../../src/assets/roof.svg'


export default function Login() {
    const login = useUserStore(pull => pull.login)

    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const hdlDataChange = e => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const hdlLogin = async e => {
        try {
            e.preventDefault()

            if (!(data.email.trim() || data.password.trim())) {
                return toast.error("please fill email and password")
            }
            await login(data)
            toast.success("login successful")

        } catch (err) {
            const errMsg = err?.response?.data?.msg || err.message
            toast.error(errMsg)
        }
    }

    console.log(data)
    return (
        <div className="w-full h-full flex items-center text-center ">

        <div className="flex w-full h-full">
            <div className='w-3/5 h-full bg-[#FBDD5C] opacity-25 m-12'>
                <h1>Document</h1>
            </div>
            
                <div className={`min-h-[27rem] rounded-3xl flex flex-grow flex-col justify-center  backdrop-blur-[3px] shadow-2xl m-auto shadow-drop-2-center`}>

                    <form className="h-auto w-full flex flex-col gap-10 p-5 items-center justify-center" onSubmit={hdlLogin}>
                        <div><p className='text-5xl font-bold'>Login</p></div>
                        <label className="input input-bordered flex w-3/5 items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>
                            <input
                                name='email'
                                value={data.email}
                                onChange={hdlDataChange}
                                type="text"
                                placeholder="Username"
                            />
                        </label>
                        <label className="w-3/5 input input-bordered flex items-center gap-2 opacity-90">
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
                                name='password'
                                value={data.password}
                                onChange={hdlDataChange}
                                type="password"
                                placeholder='Password'
                                className="grow"
                            />
                        </label>
                        <button className="btn w-3/5 bg-[#ECCC04] text-xl border-none opacity-95">Login</button>
                    </form>

                    <div className="flex justify-center py-4">
                        <button
                            className="underline text-white"
                            onClick={() => document.getElementById('register-modal').showModal()}
                        >Create Account
                        </button>
                    </div>

                    <dialog className='modal' id='register-modal'>
                        <div className='modal-box'>
                            <button
                                className='w-5 h-5 absolute right-2 top-2 rounded-full bg-red-500 '
                                onClick={e => e.target.closest('dialog').close()}>X</button>
                            <Register />
                        </div>
                    </dialog>
                </div>
            </div>
       
    </div>
    )
}
