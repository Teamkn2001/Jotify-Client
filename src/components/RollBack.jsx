import React, { useEffect, useState } from 'react'
import useUserStore from '../stores/userStore'

export default function RollBack({ token, documentId, documentDetail, setContent }) {

    const getVersionDoc = useUserStore(pull => pull.getVersionDoc)
    const savedVersions = useUserStore(pull => pull.savedVersions)
    const updateDoc = useUserStore( pull => pull.updateDoc)

    // console.log("savedVersions =",savedVersions)
    const [versionDetail, setVersionDetail] = useState(null)
    const hdlCollectIdVersion = (version) => {
        setVersionDetail(version)
        // console.log(version)
    }

    // console.log("versionIdCollected =", versionDetail)

    const  hdlRollback = async () => {
        // console.log("prepare rollback data =",versionDetail.content)
       
            const content = versionDetail.content.length === 0 
            ? ['']
            : versionDetail.content.split(",")
            
            await setContent(content)
    //         // await saveBackupVersion(documentId, body, token)
    //         // await getVersionDoc(documentId, token)
    //       }
    }
 
    useEffect(() => {
        const allVersion = getVersionDoc(documentId, token)
    }, [])

    return (
        <>
            <div className="modal-box flex flex-col gap-4 p-10">
                <button
                    type="button"
                    onClick={e => e.target.closest('dialog').close()}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                </button>

                <h1 className='font-bold text-2xl'>Document Saved Version</h1>
                {savedVersions.map((el, index) => (
                    <div key={index}>
                        <div
                            className='flex gap-3'
                            onClick={() => {
                                document.getElementById('confirm-rollback').showModal();
                                hdlCollectIdVersion(el)
                            }

                            }>
                            <span>{el.title}</span>
                            <p>{el.versionNumber}</p>
                        </div>
                    </div>
                ))}

                <dialog id='confirm-rollback' className='modal'>
                    <div className="modal-box flex flex-col items-center gap-5">
                        <button
                            type="button"
                            onClick={e => e.target.closest('dialog').close()}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                        </button>

                        <div>
                            <h1>Open Document Version</h1>
                        </div>
                        <div className='flex gap-2'>
                            <span>XXX title here najah</span>
                           {versionDetail?.versionNumber ? <p>{versionDetail.versionNumber}</p> : <p> art of blank space</p>}
                        </div>
                        <div className='flex gap-10'>
                            <button 
                            onClick={()=> hdlRollback()}
                            className="btn btn-info">open</button>
                            <button 
                             onClick={e => e.target.closest('dialog').close()}
                            className="btn btn-warning">cancel</button>
                        </div>
                    </div>
                </dialog>

            </div>
        </>
    )
}
