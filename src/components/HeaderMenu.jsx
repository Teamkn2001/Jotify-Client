import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import Permission from './Permission'
import { History, LogOut, Users } from 'lucide-react'
import RollBack from './RollBack'

export default function HeaderMenu({ title, hdlTitleChange, hdlSave, clearCurrentDoc, user, documentId, token, findContentByDocumentId, setContent }) {

  // console.log('title at header ========', title)
  return (
    <>
      <div className="flex justify-between items-center px-9 h-20 ">
        <div className='flex gap-10 items-center'>
          <div className='w-12'>
            <img src="https://res.cloudinary.com/djudr1vzc/image/upload/v1731374480/sunflower-1621990_1920_fiumqr.jpg" alt="" />
          </div>
          <div>
            <div>
              <input
                name='title'
                value={title}
                onChange={hdlTitleChange}
                className='bg-none border-none' />
            </div>
            <div className='flex gap-3'>
              <div className="dropdown">
                <div tabIndex={0} className="">file</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li><a>Item 1</a></li>
                  <li><a>Item 2</a></li>
                </ul>
              </div>
              <div
                onClick={() => hdlSave()}
                className="bg-red-300 cursor-pointer"
              >set savepoint
              </div>
            </div>
          </div>
        </div>

        <div className='flex gap-10 items-center'>
          <Link to={'/'}>
            <LogOut />
          </Link>

          <div onClick={() => document.getElementById('permission-setting').showModal()} className='cursor-pointer'>
            <Users />
          </div>

          <dialog id='permission-setting' className='modal'>
            <Permission documentId={documentId} />
          </dialog>

          <div onClick={() => document.getElementById('rollback-setting').showModal()} className='cursor-pointer'>
            <History />
          </div>
          <dialog id='rollback-setting' className='modal'>
            <RollBack token={token} documentId={documentId} documentDetail={findContentByDocumentId} setContent={setContent} />
          </dialog>

          <div
            onClick={() => document.getElementById('profile-Info').showModal()}>
            < Avatar imgSrc={user.profileImage} className='flex justify-center origin-center  w-16 rounded-full overflow-hidden' />
            {/* <AvatarIcon01 className='w-16 ' /> */}
          </div>

          <dialog id='profile-Info' className='modal'>
            <div className="modal-box flex flex-col justify-center items-center">
              <p className='text-2xl font-bold'>User Info</p>
              <Avatar imgSrc={user.profileImage} className='w-[125px]' />
              <p> <span className='font-bold'>Name :</span> {user.username}</p>
              <button
                type="button"
                onClick={e => e.target.closest('dialog').close()}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </div>
          </dialog>
        </div>
      </div>
    </>
  )
}
