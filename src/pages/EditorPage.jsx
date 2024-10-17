import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AvatarIcon01 } from '../icons';
import { Link } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { toast } from 'react-toastify';
import Avatar from '../components/Avatar';
import RollBack from '../components/RollBack';
import Permission from '../components/Permission';

const EditorPage = () => {

  const [newSetTitle, setNewSetTitle] = useState(false)

  // get content in the doc first 
  const getAllDocument = useUserStore(pull => pull.documents)

  // get the it when clicked from main doc
  const documentId = useUserStore(pull => pull.currentDocumentId)
  const updateDoc = useUserStore(pull => pull.updateDoc) // for display
  const updateTitle = useUserStore(pull => pull.updateTitle) 
  const clearCurrentDoc = useUserStore(pull => pull.clearCurrentDoc)
  const getAllDoc = useUserStore(pull => pull.getAllDoc)
  const addOwnerPermission = useUserStore(pull => pull.addOwnerPermission)
  const saveBackupVersion = useUserStore(pull => pull.saveBackupVersion)
  const getVersionDoc = useUserStore(pull => pull.getVersionDoc)

  // get all doc then find the id that get clicked
  const findContentByDocumentId = getAllDocument.find(doc => doc.id === documentId)
  // console.log(findContentByDocumentId)

  const user = useUserStore(pull => pull.user)
  const token = useUserStore(pull => pull.token)
  console.log(user)

  const [content, setContent] = useState('');
  console.log("content =", content)

  const [title, setTitle] = useState({
    title: findContentByDocumentId ? findContentByDocumentId.title : ""
  })
  console.log("title = ", title)

  // change title 
  const hdlTitleChange = e => {
    const newValue = e.target.value; // Capture the new input value
    setTitle(prev => ({ ...prev, [e.target.name]: newValue }))

  }
  // it's work but infinity loop !!!!!!!!!!!!!!!!!!
  useEffect(() => {
    let intervalAxios = setTimeout(() => {
      if (title?.title?.trim()) {
        updateTitle(documentId, title, token)
      }
    }, 2000)
    //  setNewSetTitle(true)

    return () => clearTimeout(intervalAxios)

  }, [title?.title])


  // prepare body for set owner permission
  // const body = {
  //   userId : user.id,
  //   documentId : documentId
  // }
  // if when you clicked the mapped doc it will set the docId and sent here
  useEffect(() => {
    // addOwnerPermission(body , token)
    const testAs = async () => {

      // for clicked open doc
      if (findContentByDocumentId) {
        setContent(findContentByDocumentId.content)
        setTitle(findContentByDocumentId.title)
      } else {
        // for clicked create new
        const test = await getAllDoc(user.id, token)
        console.log('findContentByDocumentId', findContentByDocumentId, test)
        // setNewSetTitle(true)
        // setTitle(findContentByDocumentId?.title)
      }
    }
    testAs()
  }, [])

  // console.log("newSetTitle", newSetTitle)
  // if (newSetTitle) {
  // }

  const hdlSave = async e => {
    const body = {
      content: content
    }
    await updateDoc(documentId, body, token)
    await saveBackupVersion(documentId, body, token)
    await getVersionDoc(documentId, token)
  }

  // separate toolbar from textarea
  const modules = {
    toolbar: {
      container: "#customToolbar" // link to id
    }
  }

  // format need to use
  const formats = [
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "align", "link", "image", "color", "background"
  ]

  return (
    <div className='flex flex-col  bg-sky-200'>

      <div className="flex justify-between items-center px-9 h-20 ">

        <div className='flex gap-10 items-center'>
          <div >
            Logo
          </div>
          <div>
            <div>
              <input
                name='title'
                value={title?.title}
                onChange={hdlTitleChange}
                // placeholder={() => title} 
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
                className="bg-green-300 cursor-pointer"
              >save</div>
              <p>feature1</p>
              <p>feature2</p>
              <p>feature3</p>
              <p>feature4</p>
              <p>feature5</p>
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
           <Permission documentId={documentId}/>
          </dialog>

          <div onClick={() => document.getElementById('rollback-setting').showModal()}>
            rollback
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

      {/* // create toolbar  */}
      <div className="mb-4 " id='customToolbar'>
        <select className='ql-header'>
          {/* add header that can select */}
          <option value="1"></option>
          <option value="2"></option>
        </select>
        <button className='ql-bold'></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-strike"></button>
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
        <button className="ql-align" value=""></button>
        <button className="ql-align" value="center"></button>
        <button className="ql-align" value="right"></button>
        <button className="ql-link"></button>
        <button className="ql-image"></button>
      </div>


      {/* // this is text area  */}
      <div className='relative'>

        <div className="bg-white shadow-md w-[794px] h-[1123px] m-auto p-16 ">
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            className='no-border'
          />

          <div
            onClick={() => document.getElementById('comment-section').showModal()}
            className='bg-green-600 w-12 h-44 absolute right-0 flex items-center justify-center rounded-md'>
            <p className='-rotate-90 text-lg font-semibold'>comment</p>
          </div>

          <dialog id='comment-section' className='modal'>
            <div className="modal-box w-4/5 h-4/5 bg-sky-300 flex flex-col gap-6 relative">
              <button
                type="button"
                onClick={e => e.target.closest('dialog').close()}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
              <div>
                <h1>Comments</h1>
              </div>
              {/* mapped */}
              <div className='flex flex-col gap-3'>
                <div className='flex gap-4'>
                  <div>
                    <Avatar imgSrc={user.profileImage} className='w-11' />
                  </div>
                  <div>
                    <div>
                      mapped username
                    </div>
                    <div>
                      mapped i will show comment here
                    </div>
                  </div>
                </div>
                <div className='flex gap-4'>
                  <div>
                    <Avatar imgSrc={user.profileImage} className='w-11' />
                  </div>
                  <div>
                    <div>
                      mapped username
                    </div>
                    <div>
                      mapped i will show comment here
                    </div>
                  </div>
                </div>
                <div className='flex gap-4'>
                  <div>
                    <Avatar imgSrc={user.profileImage} className='w-11' />
                  </div>
                  <div>
                    <div>
                      mapped username
                    </div>
                    <div>
                      mapped i will show comment here
                    </div>
                  </div>
                </div>
              </div>

              <div className='w-5/6 min-h-12 bg-sky-100 absolute bottom-6 p-4 flex items-center gap-5'>
                <div className='flex gap-4'>
                  <div>
                    <Avatar imgSrc={user.profileImage} className='w-11' />
                  </div>
                  <div>
                    <div>
                      from userStore username
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="write something here ...."
                        className="input input-bordered w-full max-w-xs"
                      />
                    </div>

                  </div>
                </div>
                <div>
                  send icon
                </div>
              </div>
            </div>
          </dialog>

        </div>
      </div>

    </div>
  )
}

export default EditorPage