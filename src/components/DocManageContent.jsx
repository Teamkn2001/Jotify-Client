import React, { useEffect, useState } from 'react'
import useUserStore from '../stores/userStore'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidV4 } from 'uuid'
import { FilePlus2 } from 'lucide-react';
import leaves from '../../src/assets/leaves.svg'
import NoDocument from './Dashboard/NoDocument'

export default function DocManageContent() {
    const user = useUserStore(pull => pull.user)
    const token = useUserStore(pull => pull.token)

    const navigate = useNavigate()

    const [allDocuments, setAllDocuments] = useState([])
    const [mutualDocuments, setMutualDocuments] = useState([])

    // const allDocuments = useUserStore(pull => pull.documents)
    console.log("allDocuments ==", allDocuments)
    console.log("allDocuments  type==", typeof allDocuments)
    console.log("mutualDocuments ==", mutualDocuments)
    const getAllDoc = useUserStore(pull => pull.getAllDoc)
    const getFilteredDoc = useUserStore(pull => pull.getFilteredDoc)
    const deleteDoc = useUserStore(pull => pull.deleteDoc)
    // okay it set page here
    // const currentDocumentId = useUserStore( pull => pull.currentDocumentId)
    // console.log(currentDocumentId)

    const [searchTitle, setSearchTitle] = useState('')

    useEffect(() => {
        // toast.success('fetching data')
        async function fetchFilteredDoc() {
            try {
                const searchOwn = searchTitle
                    ? await getFilteredDoc(user.id, searchTitle, token)
                    : await getAllDoc(user.id, token)

                console.log("searchOwn ALL ===", searchOwn)
                console.log("Raw data:", searchTitle ? searchOwn.allFilteredDocs : searchOwn.allDocuments);
                setAllDocuments(searchTitle
                    ? searchOwn.allFilteredDocs
                    : searchOwn.allDocuments
                )
                setMutualDocuments(searchTitle
                    ? searchOwn.allSharedDocuments
                    : searchOwn.allSharedDocuments
                )
            } catch (error) {
                toast.error(error)
            }

        }

        fetchFilteredDoc()
    }, [searchTitle, user.id])

    // Super confused here about the logic
    // useEffect(() => {
    //     const fetchAllDoc = async () => {
    //         try {
    //             const allDoc = await getAllDoc(user.id, token)
    //             console.log("😄😄😄😄", allDoc)
    //             console.log("😄😄😄😄", allDoc.allSharedDocuments)

    //             setAllDocuments(prev => [...prev, ...allDoc.allDocuments])

    //             setMutualDocuments(prev => [...prev, ...allDoc.allSharedDocuments])
    //         } catch (error) {
    //             toast.error(error)
    //         }
    //     }
    //     fetchAllDoc()
    // }, [])

    const hdlSetCurrentDoc = async (e, docId) => {
        e.stopPropagation()
        // console.log(docId
        navigate(`/document/${docId}/${uuidV4()}`)
    }

    const hdlDeleteDoc = async (e, documentId) => {
        e.stopPropagation()
        try {
            console.log(documentId)
            await deleteDoc(documentId, token)

            toast.success('delete success')
        } catch (error) {
            toast.error(error)
        }
        await getAllDoc(user.id, token)
    }
    return (
        <div className="bg-blue-200 flex flex-grow max-h-screen"
            style={{
                backgroundImage: `url(${leaves})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="flex  flex-grow m-5">
                <div className="flex flex-col gap-4 m-4 flex-grow">
                    <h1 className='text-2xl font-bold'>All Files</h1>
                    <label className="input input-bordered flex items-center gap-2 w-3/5">
                        <input
                            value={searchTitle}
                            onChange={e => setSearchTitle(e.target.value)}
                            type="text"
                            className="grow"
                            placeholder="Search" />
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

                    <div className="flex flex-col gap-4 overflow-auto max-h-[50%] hide-scrollbar ">

                        {allDocuments.length > 0
                            ? allDocuments.map(el => (
                                <div
                                    onClick={(e) => hdlSetCurrentDoc(e, el.id)}
                                    key={el.id}
                                    className='bg-pink-400 p-4 w-[95%] rounded-xl flex justify-between px-14 cursor-pointer hover:text-2xl hover:w-[97%] '>
                                    <p>{el.title}</p>
                                    <button
                                        onClick={(e) => hdlDeleteDoc(e, el.id)}
                                        className="btn btn-error">del</button>
                                </div>
                            ))
                            : <NoDocument />
                        }
                    </div>
                    <div className="flex flex-col gap-4 overflow-auto max-h-[50%] hide-scrollbar ">
                        <h1 className='text-xl font-bold'>shared document</h1>
                        {mutualDocuments.length > 0
                            ? mutualDocuments.map(el => (
                                <div
                                    onClick={(e) => hdlSetCurrentDoc(e, el.document.id)}
                                    key={el.id}
                                    className='bg-pink-400 p-4 w-[95%] rounded-xl flex justify-between px-14 cursor-pointer hover:text-2xl hover:w-[97%] '>
                                    <p>{el.document.title}</p>
                                    <button
                                        onClick={(e) => hdlDeleteDoc(e, el.document.id)}
                                        className="btn btn-error">del</button>
                                </div>
                            ))
                            : <NoDocument />
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}
