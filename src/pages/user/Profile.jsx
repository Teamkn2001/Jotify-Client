import React, { useRef, useState } from 'react'
import { AvatarIcon01 } from '../../icons'
import ResetPassword from '../../components/ResetPassword'
import useUserStore from '../../stores/userStore'
import Avatar from '../../components/Avatar'
import { toast } from 'react-toastify'

export default function Profile() {

    const user = useUserStore(pull => pull.user)
    const token = useUserStore(pull => pull.token)
    const editProfile = useUserStore(pull => pull.editProfile)

    const [data, setData] = useState({
        username: user.username,
        profileImage: ''
    })
    console.log("data", data)

    // change after upload img
    const [previewImage, setPreviewImage] = useState(null)
    // console.log( previewImage)

    const hdlSubmit = async e => {
        e.preventDefault()
        console.log('😀😀😀 submit exe' )

        const body = new FormData();
        body.append('username', data.username)
        if (data.profileImage) {
            body.append('image', data.profileImage)
        }

        try {
            await editProfile(user.id, body, token)
            toast.success("updated ~")
        } catch (err) {
            const errMsg = err?.response?.data?.msg || err.message
            toast.error(errMsg)
        }
    }

    // prepare name change
    const hdlNameChange = e => {
        setData(prev => ({ ...prev, username: e.target.value }))
    }

    const hiddenInputButton = useRef(null)
    const hdlClickChangeProfile = e => {

        hiddenInputButton.current.click()
    }

    const hdlImageChange = e => {
        // console.log(e.target.files[0])
        const file = e.target.files[0]
        setData(prev => ({ ...prev, profileImage: file }))

        const read = new FileReader()
        read.onloadend = () => {
            setPreviewImage(read.result)
        }
        if (file) {
            read.readAsDataURL(file)
        }
    }

    return (

        <div className="h-screen">
            <form
                onSubmit={hdlSubmit}
                className="flex w-3/5 h-auto m-auto mt-10 flex-col p-[5%] items-center justify-center bg-yellow-200 rounded-2xl gap-4">

                <div className="flex flex-col items-center">
                    <p className='font-bold'>Profiles</p>
                    {/* wht it not rounded???? !!!!!!!!!!!!!!!*/}
                    {previewImage ? <Avatar imgSrc={previewImage} className='flex justify-center origin-center  w-[200px] h-[200px] rounded-full overflow-hidden' /> : <Avatar imgSrc={user.profileImage} className='flex justify-center origin-center  w-[200px] h-[200px]   rounded-full overflow-hidden' />}
                    <button
                        className='btn'
                        type='button'
                        onClick={hdlClickChangeProfile}
                    >
                        change picture
                    </button>

                    <input
                        type="file"
                        ref={hiddenInputButton}
                        placeholder='change picture?'
                        accept="image/*"
                        onChange={hdlImageChange}
                        className='hidden'
                    />
                </div>

                <div className="flex flex-col">
                    <p className='font-bold'>Username</p>
                    <div className="flex gap-4">
                        <label className="input input-bordered flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>
                            <input
                                name='username'
                                value={data.username}
                                onChange={hdlNameChange}
                                type="text"
                                className="grow "
                                placeholder={data.username}
                            />
                        </label>
                        <button className="btn btn-error w-[100px] ">Save</button>
                    </div>
                </div>
                <p
                    onClick={() => document.getElementById('reset-password').showModal()}
                    className='cursor-pointer hover:text-red-400 '
                >forget password?</p>
            </form>

            <dialog id='reset-password' className='modal'>
                <div className="modal-box">
                    <button
                        type="button"
                        onClick={e => e.target.closest('dialog').close()}
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                    </button>
                    <ResetPassword />
                </div>
            </dialog>
        </div>

    )
}
