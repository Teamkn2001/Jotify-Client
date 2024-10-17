import React, { useState } from 'react'
import useUserStore from '../stores/userStore'
import { toast } from 'react-toastify'

export default function Register() {
    const register = useUserStore(pull => pull.register)

    const [registerForm, setRegisterFrom] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const hdlOnChange = e => {
        setRegisterFrom(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const hdlSubmit = async e => {
        try {
            e.preventDefault()

            if (!(registerForm.username.trim() && registerForm.email.trim() && registerForm.password.trim() && registerForm.confirmPassword.trim())) {
                return toast.error("please fill all data required")
            }
            await register(registerForm)
            toast.success("login successful")

            setRegisterFrom({
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            })

            e.target.closest('dialog').close()
        } catch (err) {
            const errMsg = err?.response?.data?.msg || err.message
            toast.error(errMsg)
        }
    }

    return (
        <form className='flex flex-col gap-3 p-4 pt-10' onSubmit={hdlSubmit}>
            <div className="flex flex-col gap-6">
                <input
                    name="username"
                    value={registerForm.username}
                    onChange={hdlOnChange}
                    type="text"
                    placeholder='username'
                    className='input input-bordered w-full'
                />
                <input
                    name="email"
                    value={registerForm.email}
                    onChange={hdlOnChange}
                    type="text"
                    placeholder='email'
                    className='input input-bordered w-full'
                />

                <input
                    name="password"
                    value={registerForm.password}
                    onChange={hdlOnChange}
                    type="password"
                    placeholder='New password'
                    className='input input-bordered w-full'
                />
                <input
                    name="confirmPassword"
                    value={registerForm.confirmPassword}
                    onChange={hdlOnChange}
                    type="password"
                    placeholder='Confirm password'
                    className='input input-bordered w-full'
                />
                <button className='btn btn-secondary text-xl text-white'>Sign up</button>
            </div>
        </form>
    )
}
