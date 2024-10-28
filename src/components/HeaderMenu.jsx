import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import Permission from './Permission'

export default function HeaderMenu({title, hdlTitleChange, hdlSave, clearCurrentDoc, user}) {
  return (
   <>
    <div className="flex justify-between items-center px-9 h-20 ">
        <div className='flex gap-10 items-center'>
          <div >
            Logo
          </div>
          <div>
            <div>
              <input
                name='title'
                value={title.title}
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
              >set savepoint</div>
              <p>feature1</p>
              <p>feature2</p>
              <p>feature3</p>
            </div>
          </div>
        </div>

        <div className='flex gap-4 items-center'>
          <Link to={'/'}
            onClick={() => clearCurrentDoc()}
          >
            I'm out Icon
          </Link>

          <div onClick={() => document.getElementById('permission-setting').showModal()}>
            <p className='text-red-500'>Permission</p>
          </div>

          <dialog id='permission-setting' className='modal'>
            {/* <Permission documentId={documentId} /> */}
          </dialog>

          <div onClick={() => document.getElementById('rollback-setting').showModal()}>
            rollback
          </div>
          <dialog id='rollback-setting' className='modal'>
            {/* <RollBack token={token} documentId={documentId} documentDetail={findContentByDocumentId} setContent={setContent} /> */}
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
