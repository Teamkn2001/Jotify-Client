import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'quill/dist/quill.snow.css';
import useUserStore from '../stores/userStore';
import HeaderMenu from '../components/HeaderMenu';
import io from 'socket.io-client';
import leaves from '../../src/assets/leaves.svg'
import QuillPage from '../components/EditorPage/QuillPage'
import ImageResize from 'quill-image-resize-module-react';
import Quill from 'quill';
import Toolbar from '../components/EditorPage/Toolbar';
import useDocumentStore from '../stores/documentStore';

// set up size of page
const PAGE_HEIGHT = 300;
const MAX_CONTENT_LENGTH = 10000; // Maximum characters per page fix later!!!!!!!!

Quill.register('modules/imageResize', ImageResize);

const EditorPage = () => {
  const { docId } = useParams();
  const documentId = docId
  // --------------------------useDocumentStore-------------------
  const getDocument = useDocumentStore(pull => pull.getDoc);
  //------------------------- useUserStore-----------------------
  const updateDoc = useUserStore(pull => pull.updateDoc);
  const updateTitle = useUserStore(pull => pull.updateTitle);
  const clearCurrentDoc = useUserStore(pull => pull.clearCurrentDoc);// logout
  // user info
  const user = useUserStore(pull => pull.user);
  const token = useUserStore(pull => pull.token);
  // ----------------------------------------------------------
  const [leading, setLoading] = useState(true)

  const [title, setTitle] = useState('');
  const [pages, setPages] = useState(['']);
  const [focusNewPage, setFocusNewPage] = useState(false);
  
  const [activePageNumber, setActivePageNumber] = useState(0);
  const [activeQuill, setActiveQuill] = useState(null)
  
  // Keep track of all quill instances
  const quillInstancesRef = useRef({});  // Use ref instead of state for quillInstances

  // socket management
  const [socket, setSocket] = useState(null);
  const [lastSavedContent, setLastSavedContent] = useState('');
  const saveTimeoutRef = useRef(null);
  const AUTOSAVE_TIMEOUT = 2000;

  const registerQuill = (pageNumber, quillInstance) => {
    console.log("📝 Registering quill for page", pageNumber);
    quillInstancesRef.current[pageNumber] = quillInstance;
  };

  const handlePageActive = (pageNumber) => {
    console.log("🎯 Setting active page:", pageNumber);
    console.log("🎯 Available quills:", quillInstancesRef.current);
    setActivePageNumber(pageNumber);
    setActiveQuill(quillInstancesRef.current[pageNumber]);
  };

  const modules = {
    toolbar: {
      container: '#toolbar',
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize'],
      displaySize: true
    },
  };
  console.log('%c All page content', 'background-color: yellow', pages);

  const handleContentChange = (pageNumber, contentHeight, content) => {
    setPages(prev => {
      // console.log("%c hdlContentChange", 'background-color: yellow', "pageNumber =", pageNumber, "contentHeight =", contentHeight, "content =", content)
      const updatedPages = [...prev];
      updatedPages[pageNumber] = content;
      return updatedPages;
    });
  };

  const handlePageFull = (pageNumber, currentContent, remainingContent) => {
    alert('page full')
    console.log('%c remainingContent', 'background-color: yellow', remainingContent);
    // console.log("%c handle Page full executed!!",'background-color: yellow')
    // console.log("%c data sent in hdlPageful :",'background-color: yellow', "index =", pageIndex, "cur content", currentContent, "remain cont. =", remainingContent)
    setPages(prev => {
      const updatedPages = [...prev];
      // console.log('hdl Page full updatedPages ===', updatedPages)
      console.log('%c remain Contents =====', 'background-color: yellow', remainingContent);
      // If we have content to split
      if (remainingContent) {
        // Update current page
        if (currentContent) {
          updatedPages[pageNumber] = currentContent;
        }
        // Insert new page with remaining content
        updatedPages.splice(pageNumber + 1, 0, remainingContent);
        // updatedPages.splice(pageNumber + 1, 0, '');
      } else {
        // Just add a new empty page
        updatedPages.push('');
      }
      return updatedPages;
    });
    setFocusNewPage(true);
  };

  const hdlTitleChange = e => {
    const newValue = e.target.value;
    setTitle(newValue);
  };

  // useEffect(() => {
  //   let intervalAxios = setTimeout(() => {
  //     console.log('mwanshile in useff title ==', title)
  //     if (title) {
  //       updateTitle(documentId, title, token);
  //     }
  //   }, 2000);

  //   return () => clearTimeout(intervalAxios);
  // }, [title]);

  // Initialize socket connection with error handling
  useEffect(() => {
    const enterSocket = io('http://localhost:8200', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
    setSocket(enterSocket);

    enterSocket.on('connect', () => {
      toast.success("user connect with id =" + enterSocket.id);
      // join room
      enterSocket.emit('join-document', { docId, userId: user.id });
    });

    enterSocket.on('connect-error', (error) => {
      toast.error(error, "Retrying nah");
    })

    enterSocket.on('document-saved', ({ timestamp }) => {
      toast.success("Document auto saved at " + new Date(timestamp).toLocaleTimeString());
      setLastSavedContent(JSON.stringify(pages));
    })

    enterSocket.on('save-error', (error) => {
      toast.error(`auto save failed: ${error}`)
    })

    enterSocket.on('document-updated', ({ updatedPage, updatedTitle, updatedBy }) => {
      if( updatedBy !== user.id) {
        setPages(updatedPage);
        setTitle(updatedTitle);
        toast.info(`Document updated by ${updatedBy}`)
      }
    })

    return () => {
      if( saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      enterSocket.disconnect();
    }

  }, []);

  // load content if user click old document
  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true)
        const data = await getDocument(docId, token)
        const fetchedTitle = data.getDocumentContent.title
        const fetchedAllPages = JSON.parse(data.getDocumentContent.content)

        console.log("fetchedTitle ====", fetchedTitle)
        console.log("fetchedAllPages ====", fetchedAllPages)

      // console.log("Type of fetchedAllPages:", typeof fetchedAllPages)
      // console.log("Is Array?", Array.isArray(fetchedAllPages))
      // console.log("Length:", fetchedAllPages?.length)

        setTitle(fetchedTitle)

        fetchedAllPages.map( (page, index) => {
          console.log(pages)
          if ( index === 0) {
            setPages([page])
          } else {
            console.log(" 🥰🥰🥰page and index ====" ,index ,page)
            setPages(prev => [...prev, page])
          }
        })
    
      } catch (error) {
        toast.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (docId) {
      loadDocument();
    }
  }, [docId]);

  // not use now
  const hdlSave = async () => {
    updateDoc(documentId, { title, content: pages }, token);
    toast.success("saved");
  };

  // Autosave content logic
  useEffect( () => {
    if( !socket || !pages.length) return;

    const currentContent = JSON.stringify(pages);
    if( currentContent === lastSavedContent) return;

    if( saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // new Timeout
    saveTimeoutRef.current = setTimeout(() => {
      socket.emit('save-document', { docId, content: pages, title, userId: user.id });
    }, AUTOSAVE_TIMEOUT);

    return () => {
      if( saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    }
  }, [pages, title, socket]);

  return (
    <div className='flex flex-col bg-[#f8d7b1]'>
      <div className='flex flex-col sticky top-0 z-10 bg-[#FFB25B]'>
        <HeaderMenu
          documentId={documentId}
          token={token}
          title={title}
          hdlTitleChange={hdlTitleChange}
          hdlSave={hdlSave}
          clearCurrentDoc={clearCurrentDoc}
          user={user}
        />
        <Toolbar />
      </div>

      <div className='relative'>
        {socket ?
          <h1 className='bg-red-600 mb-3'>user :{socket.id}</h1> :
          <h1>no socket user</h1>
        }
        {pages.map((content, pageNumber) => (
          <QuillPage
            key={pageNumber}
            pageNumber={pageNumber}
            initialContent={content}
            modules={modules}
            isPageActive={activePageNumber === pageNumber}
            onActivePage={() => handlePageActive(pageNumber)}
            onQuillInit={(quill) => registerQuill(pageNumber, quill)}
            handleContentChange={(height, content) => handleContentChange(pageNumber, height, content)}
            handlePageFull={handlePageFull}
            focusOnMount={focusNewPage && pageNumber === pages.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default EditorPage;