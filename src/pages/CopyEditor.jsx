// import React, { useEffect, useRef, useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { AvatarIcon01 } from '../icons';
// import { Link, useParams } from 'react-router-dom';
// import useUserStore from '../stores/userStore';
// import { toast } from 'react-toastify';
// import Avatar from '../components/Avatar';
// import RollBack from '../components/RollBack';
// import Permission from '../components/Permission';


// const EditorPage = () => {
//   const  {docId}  = useParams()
//   console.log('docId',docId)
//   // get content in the doc first 
//   const getAllDocument = useUserStore(pull => pull.documents)

//   const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`;
//   const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

//   // get the it when clicked from main doc
//   const documentId = useUserStore(pull => pull.currentDocumentId)
//   const updateDoc = useUserStore(pull => pull.updateDoc) // for display
//   const updateTitle = useUserStore(pull => pull.updateTitle)
//   const clearCurrentDoc = useUserStore(pull => pull.clearCurrentDoc)
//   const getAllDoc = useUserStore(pull => pull.getAllDoc)
//   const addOwnerPermission = useUserStore(pull => pull.addOwnerPermission)
//   const saveBackupVersion = useUserStore(pull => pull.saveBackupVersion)
//   const getVersionDoc = useUserStore(pull => pull.getVersionDoc)

//   // get all doc then find the id that get clicked
//   const findContentByDocumentId = getAllDocument.find(doc => doc.id === documentId)
//   console.log("findContentByDocumentId",findContentByDocumentId)

//   const user = useUserStore(pull => pull.user)
//   const token = useUserStore(pull => pull.token)

//   const [content, setContent] = useState(['']); // this time i have to map creating new textarea
//   console.log("content =", content)
//   const quillRefs = useRef([]) // store ref for each text content area
//   console.log("quillRefs", quillRefs)

//   const hdlAutoNewPage = (index, value) => {
//     const newContent = [...content]
//     newContent[index] = value

//     // Check if the height exceeds and we are on the last page
//     const currentQuill = quillRefs.current[index]; // go to current area
//     if (currentQuill) {
//       const editor = currentQuill.getEditor(); // get into area
//       const editorHeight = editor.root.scrollHeight; // check content area height

//       // Add a new page if content height exceeds 1123px and we're on the last page (-1)
//       if (editorHeight > 200 && index === content.length - 1) {
//         newContent.push(''); // Add  new empty page
//         setContent(newContent)

//         // cursor focus on created new page
//         setTimeout( ()=> {
//           if(quillRefs.current[newContent.length - 1]) {
//             quillRefs.current[newContent.length -1].focus()
//           }
//         }, 100) 
//         return;
//       }
//     }

//     setContent(newContent)
//   }

//   const handleImageUpload = async (file) => {

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', uploadPreset);

//     try {
//       const response = await fetch(cloudinaryUrl, {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await response.json();

//       if (data.secure_url) {
//         return data.secure_url;
//       } else {
//         toast.error('Failed to upload image.');
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       toast.error('Error uploading image.');
//     }
//   };

//   const handleImageInsert = () => {
//     const input = document.createElement('input');
//     input.setAttribute('type', 'file');
//     input.setAttribute('accept', 'image/*');
//     // input.click();

//     input.onchange = async () => {
//       const file = input.files[0];
//       if (file) {
//         const imageUrl = await handleImageUpload(file);
//         if (imageUrl) {
//           const editor = quillRefs.current[0].getEditor(); // Adjust to target the correct editor if multiple pages
//           const range = editor.getSelection();
//           editor.insertEmbed(range.index, 'image', imageUrl);
//         }
//       }
//     };
//   };


//   const [title, setTitle] = useState({
//     title: findContentByDocumentId ? findContentByDocumentId.title : ""
//   })
//   console.log("title = ", title)

//   // change title 
//   const hdlTitleChange = e => {
//     const newValue = e.target.value; // Capture the new input value
//     setTitle(prev => ({ ...prev, [e.target.name]: newValue }))

//   }
//   // it's work but infinity loop !!!!!!!!!!!!!!!!!!
//   useEffect(() => {
//     let intervalAxios = setTimeout(() => {
//       if (title?.title?.trim()) {
//         updateTitle(documentId, title, token)
//       }
//     }, 2000)
//     //  setNewSetTitle(true)

//     return () => clearTimeout(intervalAxios)

//   }, [title?.title])

//   // if when you clicked the mapped doc it will set the docId and sent here
//   useEffect(() => {
//     const initializeDoc = async () => {

//       // for clicked open doc
//       if (findContentByDocumentId) {
//         // even if the array is empty it will not replace with [''] due to empty arr this truthy whatt!
//         // setContent(findContentByDocumentId.content || [''])
//         //-------------------------------------------------------------
//         // const preSetContent = Array.isArray(findContentByDocumentId.content) && findContentByDocumentId.length === 0 
//         // ? [''] 
//         // : findContentByDocumentId.content 
//         console.log('findContentByDocumentId******', findContentByDocumentId?.content)

//         const preSetContent = findContentByDocumentId?.content[0]?.length === 0 || !findContentByDocumentId?.content[0]?.text 
//         ? [''] 
//         : findContentByDocumentId?.content[0]?.text?.split(",")

//         // console.log("preSetContent", preSetContent.split(","))
//          setContent(() => (preSetContent))
//         setTitle(findContentByDocumentId.title)
//       } else {
//         // for clicked create new
//         console.log("elsefirst")
//         setContent([''])
//         const test = await getAllDoc(user.id, token)
//         console.log('findContentByDocumentId', findContentByDocumentId, test)
//       }
//     }
//     initializeDoc()
//   }, [])

//   const hdlSave = async e => {
//     console.log('content', content)

//     handleImageInsert()

//     const body = {
//       content: content
//     }

//     const data = new FormData()
//     data.append("content", content)

//     await updateDoc(documentId, data, token)
//     toast.success("saved")

//     // await saveBackupVersion(documentId, body, token)
//     // await getVersionDoc(documentId, token)
//   }

//   // separate toolbar from textarea
//   const modules = {
//     toolbar: {
//       container: "#customToolbar",
//        // link to id
//       // handlers : {
//       //   image : handleImageInsert()
//       // }
//     } 
//   }

//   // format need to use
//   const formats = [
//     "header", "bold", "italic", "underline", "strike",
//     "list", "bullet", "align", "link", "image", "color", "background"
//   ]

//   return (
//     <div className='flex flex-col  bg-sky-200'>

//       {/* header menu */}
//       <div className="flex justify-between items-center px-9 h-20 ">
//         <div className='flex gap-10 items-center'>
//           <div >
//             Logo
//           </div>
//           <div>
//             <div>
//               <input
//                 name='title'
//                 value={title?.title}
//                 onChange={hdlTitleChange}
//                 placeholder={() => title} 
//                 className='bg-none border-none' />
//             </div>
//             <div className='flex gap-3'>
//               <div className="dropdown">
//                 <div tabIndex={0} className="">file</div>
//                 <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
//                   <li><a>Item 1</a></li>
//                   <li><a>Item 2</a></li>
//                 </ul>
//               </div>
//               <div
//                 onClick={() => hdlSave()}
//                 className="bg-green-300 cursor-pointer"
//               >save</div>
//               <p>feature1</p>
//               <p>feature2</p>
//               <p>feature3</p>
//               <p>feature4</p>
//               <p>feature5</p>
//             </div>
//           </div>
//         </div>

//         <div className='flex gap-4 items-center'>
//           <Link to={'/'}
//             onClick={() => clearCurrentDoc()}
//           >
//             I'm out Icon
//           </Link>

//           <div onClick={() => document.getElementById('permission-setting').showModal()}>
//             <p className='text-red-500'>Permission</p>
//           </div>

//           <dialog id='permission-setting' className='modal'>
//             {/* <Permission documentId={documentId} /> */}
//           </dialog>

//           <div onClick={() => document.getElementById('rollback-setting').showModal()}>
//             rollback
//           </div>
//           <dialog id='rollback-setting' className='modal'>
//             {/* <RollBack token={token} documentId={documentId} documentDetail={findContentByDocumentId} setContent={setContent} /> */}
//           </dialog>

//           <div
//             onClick={() => document.getElementById('profile-Info').showModal()}>
//             < Avatar imgSrc={user.profileImage} className='flex justify-center origin-center  w-16 rounded-full overflow-hidden' />
//             {/* <AvatarIcon01 className='w-16 ' /> */}
//           </div>

//           <dialog id='profile-Info' className='modal'>
//             <div className="modal-box flex flex-col justify-center items-center">
//               <p className='text-2xl font-bold'>User Info</p>
//               <Avatar imgSrc={user.profileImage} className='w-[125px]' />
//               <p> <span className='font-bold'>Name :</span> {user.username}</p>
//               <button
//                 type="button"
//                 onClick={e => e.target.closest('dialog').close()}
//                 className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
//                 ✕
//               </button>
//             </div>
//           </dialog>
//         </div>
//       </div>

//       {/* // toolbar menu  */}
//       <div className="mb-4 " id='customToolbar'>
//         <select className='ql-header'>
//           {/* add header that can select */}
//           <option value="1"></option>
//           <option value="2"></option>
//         </select>
//         <button className='ql-bold'></button>
//         <button className="ql-italic"></button>
//         <button className="ql-underline"></button>
//         <button className="ql-strike"></button>
//         <button className="ql-list" value="ordered"></button>
//         <button className="ql-list" value="bullet"></button>
//         <button className="ql-align" value=""></button>
//         <button className="ql-align" value="center"></button>
//         <button className="ql-align" value="right"></button>
//         <button className="ql-link"></button>
//         <button className="ql-image"></button>
//       </div>

//       {/* // this is text area  */}
//       <div className='relative'>

//         <div className='relative' onClick={(e) => {
//           if (e.target.classList.contains('relative')) {
//             // Prevent focus on the empty space
//             e.preventDefault();
//           }
//         }}>
//           {content?.map((el, index) => (
//               <ReactQuill
//                 key={index}
//                 ref={(el) => (quillRefs.current[index] = el)}
//                 value={el}
//                 onChange={(el) => hdlAutoNewPage(index, el)}
//                 modules={modules}
//                 formats={formats}
//                 className='no-border bg-white shadow-md w-[794px] h-[300px] m-auto p-16 mb-9 overflow-hidden'
//               />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditorPage

// this is comment
// {/* <div
// onClick={() => document.getElementById('comment-section').showModal()}
// className='bg-green-600 w-12 h-44 absolute right-0 flex items-center justify-center rounded-md'>
// <p className='-rotate-90 text-lg font-semibold'>comment</p>
// </div>

// <dialog id='comment-section' className='modal'>
// <div className="modal-box w-4/5 h-4/5 bg-sky-300 flex flex-col gap-6 relative">
//   <button
//     type="button"
//     onClick={e => e.target.closest('dialog').close()}
//     className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
//     ✕
//   </button>
//   <div>
//     <h1>Comments</h1>
//   </div>
//   {/* mapped */}
//   <div className='flex flex-col gap-3'>
//     <div className='flex gap-4'>
//       <div>
//         <Avatar imgSrc={user.profileImage} className='w-11' />
//       </div>
//       <div>
//         <div>
//           mapped username
//         </div>
//         <div>
//           mapped i will show comment here
//         </div>
//       </div>
//     </div>
//     <div className='flex gap-4'>
//       <div>
//         <Avatar imgSrc={user.profileImage} className='w-11' />
//       </div>
//       <div>
//         <div>
//           mapped username
//         </div>
//         <div>
//           mapped i will show comment here
//         </div>
//       </div>
//     </div>
//     <div className='flex gap-4'>
//       <div>
//         <Avatar imgSrc={user.profileImage} className='w-11' />
//       </div>
//       <div>
//         <div>
//           mapped username
//         </div>
//         <div>
//           mapped i will show comment here
//         </div>
//       </div>
//     </div>
//   </div>

//   <div className='w-5/6 min-h-12 bg-sky-100 absolute bottom-6 p-4 flex items-center gap-5'>
//     <div className='flex gap-4'>
//       <div>
//         <Avatar imgSrc={user.profileImage} className='w-11' />
//       </div>
//       <div>
//         <div>
//           from userStore username
//         </div>
//         <div>
//           <input
//             type="text"
//             placeholder="write something here ...."
//             className="input input-bordered w-full max-w-xs"
//           />
//         </div>

//       </div>
//     </div>
//     <div>
//       send icon
//     </div>
//   </div>
// </div>
// </dialog> */}

// copy before use sandbox
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { displayName } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AvatarIcon01 } from '../icons';
import { Link, useParams } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { toast } from 'react-toastify';
import Avatar from '../components/Avatar';
import RollBack from '../components/RollBack';
import Permission from '../components/Permission';
import axios from 'axios';
import HeaderMenu from '../components/HeaderMenu';
import QuillToolbarMenu from '../components/QuillToolbarMenu';
import io from 'socket.io-client'

const EditorPage = () => {
  const { docId } = useParams()
  // console.log('docId', docId)

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

  // get the it when clicked from main doc
  const documentId = useUserStore(pull => pull.currentDocumentId)
  const updateDoc = useUserStore(pull => pull.updateDoc) // for display
  const updateTitle = useUserStore(pull => pull.updateTitle)
  const clearCurrentDoc = useUserStore(pull => pull.clearCurrentDoc)
  const getAllDoc = useUserStore(pull => pull.getAllDoc)
  const addOwnerPermission = useUserStore(pull => pull.addOwnerPermission)
  const saveBackupVersion = useUserStore(pull => pull.saveBackupVersion)
  const getVersionDoc = useUserStore(pull => pull.getVersionDoc)

  const user = useUserStore(pull => pull.user)
  const token = useUserStore(pull => pull.token)

  const [title, setTitle] = useState({
    title : ''
  })
  console.log('title =', title )
  const [socket, setSocket] = useState(null)
  // console.log('socket', socket)
  const [content, setContent] = useState(['']); // this time i have to map creating new textarea
  console.log("content =", content)
  const quillRefs = useRef([]) // store ref for each text content area
  // console.log("quillRefs", quillRefs)

  const hdlAutoNewPage = (index, value) => {
    // console.log(index, value)
    const newContent = [...content];
    newContent[index] = value;

    // Check if the height exceeds and we are on the last page
    const currentQuill = quillRefs.current[index];
    console.log('currentQuill', currentQuill)
    if (currentQuill) {
      const editor = currentQuill.getEditor();
      const editorHeight = editor.root.scrollHeight;

      // Ensure that we only add a new page if content height exceeds 1123px 
      // and we are on the last page, and that the last page is not empty
      if (editorHeight > 200 && index === content.length - 1 && newContent[index].trim() !== '') {
        newContent.push(''); // Add a new empty page
        setContent(newContent);

        // Focus cursor on the newly created page
        setTimeout(() => {
          if (quillRefs.current[newContent.length - 1]) {
            quillRefs.current[newContent.length - 1].focus();
          }
        }, 100);
        quillRefs.current[newContent.length - 1].blur()

        return;
      }
    }
    setContent(newContent);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        toast.error('Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image.');
    }
  };

  const handleImageInsert = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    // input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const imageUrl = await handleImageUpload(file);
        if (imageUrl) {
          const editor = quillRefs.current[0].getEditor(); // Adjust to target the correct editor if multiple pages
          const range = editor.getSelection();
          editor.insertEmbed(range.index, 'image', imageUrl);
        }
      }
    };
  };

  // change title 
  const hdlTitleChange = e => {
    const newValue = e.target.value; // Capture the new input value
    setTitle(prev => ({ ...prev, [e.target.name]: newValue }))

  }

  // save title done!
  useEffect(() => {
    console.log('title in save effect', title.title)
    let intervalAxios = setTimeout(() => {
      if (title.title.trim()) {
        updateTitle(documentId, title, token)
      }
    }, 2000)

    return () => clearTimeout(intervalAxios)

  }, [title.title])

  // if when you clicked the mapped doc it will set the docId and sent here
  const initializeDoc = async () => {
    console.log("-------------------------------------------------------------------------------------------------------------------------------------------------------------")
    try {
      const rs = await axios.get(
        `http://localhost:8200/user/getDocument/${documentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
     
      const preSetContent = await rs.data.DocumentById[0].content[0].text === null || !rs.data.DocumentById[0].content[0].text
        ? ['']
        : rs.data.DocumentById[0].content[0].text

      const handleTitle = await rs.data.DocumentById[0].title
      const handlePresetContent = await preSetContent.includes(',')
        ? preSetContent.split(",")
        : preSetContent

      // console.log("preSetContent", handlePresetContent)
      setContent(handlePresetContent)
      console.log('handleTitle', handleTitle)
      setTitle(prv => ({...prv, title : handleTitle}))

      // setContent(rs.data.DocumentById.content.map(el=>el.text))
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }
  useEffect(() => {
    // connect socket server
    const enterSocket = io('http://localhost:8200')
    setSocket(enterSocket)

    enterSocket.on('connect', () => {
      toast.success("user connect with id =" + enterSocket.id)

      initializeDoc()
      // exist current socket 
      return () => enterSocket.disconnect()
    })
  }, [])

  // send content to server
  useEffect(() => {
    if (socket == null || content == '') return
    socket.emit('update Content', content)

    return () => socket.off('update Content', content)
  }, [content, socket])

  // receive content form server 
  useEffect(() => {
    if (socket == null) return

    const updateSocketContent = (content) => {
      setContent(content)
    }
    socket.on('document Updated', updateSocketContent)

    return () => socket.off('document Updated', updateSocketContent)
  }, [content, socket])

  useEffect(() => {
    if (socket == null || content == '') return

    // socket.once("load-document", document => {
    //   setContent(document)
    // })

    socket.emit("get-docId", docId)
  }, [socket, content, docId])
  const hdlSave = async e => {
    // handleImageInsert() // only when save 
    const body = {
      content: content
    }
    // const data = new FormData()
    // data.append("content", content)

    await updateDoc(documentId, body, token)
    toast.success("saved")

    // await saveBackupVersion(documentId, body, token)
    // await getVersionDoc(documentId, token)
  }

  // separate toolbar from textarea
  const modules = {
    toolbar: {
      container: "#customToolbar",
      // link to id
      // handlers : {
      //   image : handleImageInsert()
      // }
    }
  }
  // format need to use
  const formats = [
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "align", "link", "image", "color", "background"
  ]

  return (
    <div className='flex flex-col  bg-sky-200'>

      <div className='flex flex-col sticky top-0 overflow-hidden z-10 bg-green-300'>
        {/* header menu */}
        {/* not send title yet... */}
        <HeaderMenu title={title} hdlTitleChange={hdlTitleChange} hdlSave={hdlSave} clearCurrentDoc={clearCurrentDoc} user={user} />
        {/* // toolbar menu  */}
        <QuillToolbarMenu />
      </div>

      {/* // this is text area  */}
      <div className='relative '>
        {socket ? <h1 className='bg-red-600 mb-3'>user :{socket.id}</h1> : <h1> no socket user</h1>}

        <div className='relative' onClick={(e) => {
          if (e.target.classList.contains('relative')) {
            // Prevent focus on the empty space
            e.preventDefault();
          }
        }}>
          {/* <ReactQuill 
          value={singleContent}
          modules={modules}
          formats={formats}
          onChange={setSinGleContent}
          className='no-border bg-white shadow-md w-[794px] h-[700px] m-auto p-16 mb-9 overflow-hidden'
          /> */}
          {content?.map((el, index) => {
            return <ReactQuill
              key={index}
              ref={(el) => (quillRefs.current[index] = el)}
              value={el}
              onChange={(el) => hdlAutoNewPage(index, el)}
              modules={modules}
              formats={formats}
              className='no-border bg-white shadow-md w-[794px] h-[300px] m-auto p-16 mb-9 overflow-hidden'
            />
          })}
        </div>
      </div>
    </div>
  )
}

export default EditorPage

// 27/10/2024
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQuill } from 'react-quilljs'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import useUserStore from '../stores/userStore';
import HeaderMenu from '../components/HeaderMenu';
import ImageResize from 'quill-image-resize-module-react';
import { useStore } from 'zustand';
import io from 'socket.io-client'
import QuillToolbarMenu from '../components/QuillToolbarMenu';

// First, import all Quill essentials
const Parchment = Quill.import('parchment');
const Delta = Quill.import('delta');
const Module = Quill.import('core/module');

// Register the image resize module AFTER importing core modules
Quill.register('modules/imageResize', ImageResize);

const EDITOR_CONFIGS = {
  modules: {
    toolbar: '#toolbar',
    imageResize: {
      parchment: Parchment,
      modules: ['Resize', 'DisplaySize'],
      displaySize: true
    }
  },
  formats: [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'align',
    'link', 'image'
  ]
}

const PAGE_HEIGHT = 750

const EditorPage = () => {

  const { docId } = useParams();
  const documentId = useUserStore(pull => pull.currentDocumentId);
  const updateDoc = useUserStore(pull => pull.updateDoc);
  const updateTitle = useUserStore(pull => pull.updateTitle);
  const clearCurrentDoc = useUserStore(pull => pull.clearCurrentDoc);
  const getVersionDoc = useUserStore(pull => pull.getVersionDoc);
  const user = useUserStore(pull => pull.user);
  const token = useUserStore(pull => pull.token);

  const [pages, setPages] = useState([''])
  const [quillRefs, setQuillRefs] = useState([])
  const [title, setTitle] = useState({ title: '' });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (quillRefs.length < pages.length) {
      const newRefs = [...quillRefs];
      for (let i = quillRefs.length; i < pages.length; i++) {
        const { quill, quillRef } = useQuill({
          ...EDITOR_CONFIGS,
          theme: 'snow',
          preserveWhitespace: true,
        });

        // Set up image handling for each Quill instance
        if (quill) {
          quill.getModule('toolbar').addHandler('image', () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
              const file = input.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  const range = quill.getSelection(true);
                  quill.updateContents(
                    new Quill.import('delta')
                      .retain(range.index)
                      .delete(range.length)
                      .insert({ image: reader.result })
                  );
                };
                reader.readAsDataURL(file);
              }
            };
          });
        }

        newRefs.push({ quill, quillRef });
      }
      setQuillRefs(newRefs);
    }
  }, [pages, quillRefs]);

  // Monitor content height and add new pages when needed
  useEffect(() => {
    quillRefs.forEach((quillRefObj, index) => {
      const { quill, quillRef } = quillRefObj;
      if (!quill) return;

      quill.on('text-change', () => {
        const editor = quillRef.current;
        const contentHeight = editor?.clientHeight;

        // If content exceeds the page height, create a new page
        if (contentHeight > PAGE_HEIGHT && index === pages.length - 1) {
          setPages((prev) => [...prev, '']);
        }

        // Sync page content with state
        setPages((prev) => {
          const updatedPages = [...prev];
          updatedPages[index] = quill.root.innerHTML;
          return updatedPages;
        });
      });
    });
  }, [quillRefs]);

  // useEffect(() => {
  //   if (quill) {
  //     quill.getModule('toolbar').addHandler('image', () => {
  //       const input = document.createElement('input');
  //       input.setAttribute('type', 'file');
  //       input.setAttribute('accept', 'image/*');
  //       input.click();

  //       input.onchange = async () => {
  //         const file = input.files[0];
  //         if (file) {
  //           const reader = new FileReader();
  //           reader.onload = () => {
  //             const range = quill.getSelection(true);
  //             quill.updateContents(
  //               new Delta()
  //                 .retain(range.index)
  //                 .delete(range.length)
  //                 .insert({ image: reader.result })
  //             );
  //           };
  //           reader.readAsDataURL(file);
  //         }
  //       };
  //     });
  //   }
  // }, [quill]);

  // useEffect(() => {
  //   if (quill) {
  //     quill.on('text-change', (delta, oldDelta, source) => {
  //       console.log('delta', delta)
  //       console.log('oldDelta', oldDelta)
  //       // console.log('source', source)

  //       const currentContent = quill.getContents()
  //       console.log('currentContent', currentContent)
  //     })
  //   }
  // }, [quill])


  const hdlTitleChange = e => {
    const newValue = e.target.value;
    setTitle(prev => ({ ...prev, [e.target.name]: newValue }));
  };

  useEffect(() => {
    let intervalAxios = setTimeout(() => {
      if (title.title.trim()) {
        updateTitle(documentId, title, token);
      }
    }, 2000);

    return () => clearTimeout(intervalAxios);
  }, [title.title]);

  useEffect(() => {
    // connect socket server
    const enterSocket = io('http://localhost:8200')
    setSocket(enterSocket)

    enterSocket.on('connect', () => {
      toast.success("user connect with id =" + enterSocket.id)

      // exist current socket 
      return () => enterSocket.disconnect()
    })
  }, [])

  // send content to server
  // useEffect(() => {
  //   if (socket == null ) return
  //   socket.emit('update Content', content)

  //   return () => socket.off('update Content', content)
  // }, [ socket])

  // receive content form server 
  // useEffect(() => {
  //   if (socket == null) return

  //   const updateSocketContent = (content) => {
  //     setContent(content)
  //   }
  //   socket.on('document Updated', updateSocketContent)

  //   return () => socket.off('document Updated', updateSocketContent)
  // }, [socket])

  useEffect(() => {
    if (socket == null) return

    // socket.once("load-document", document => {
    //   setContent(document)
    // })

    socket.emit("get-docId", docId)
  }, [socket, docId])

  const hdlSave = async e => {
    toast.success("saved");
  };

  return (
    <div className='flex flex-col bg-sky-200'>
      <div className='flex flex-col sticky top-0 overflow-hidden z-10 bg-green-300'>
        <HeaderMenu
          title={title}
          hdlTitleChange={hdlTitleChange}
          hdlSave={hdlSave}
          clearCurrentDoc={clearCurrentDoc}
          user={user}
        />
        <QuillToolbarMenu />
      </div>

      <div className='relative '>
        {socket ?
          <h1 className='bg-red-600 mb-3'>user :{socket.id}</h1> :
          <h1>no socket user</h1>
        }
        {quillRefs.map((quillRefObj, index) => (
          <div key={index} className='no-border bg-white shadow-md w-[794px] min-h-[750px] m-auto p-16 mb-9 overflow-hidden'>
            <div ref={quillRefObj.quillRef} className='quill-page' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorPage;