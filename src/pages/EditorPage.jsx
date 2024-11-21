import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'quill/dist/quill.snow.css';
import useUserStore from '../stores/userStore';
import HeaderMenu from '../components/HeaderMenu';
import io from 'socket.io-client';
import QuillToolbarMenu from '../components/QuillToolbarMenu';
import leaves from '../../src/assets/leaves.svg'
import QuillPage from '../components/EditorPage/QuillPage'
import yellowLog from '../services/yellowLog';
import greenLog from '../services/greenLog';
import blueLog from '../services/blueLog';

const EditorPage = () => {
  const { docId } = useParams();
  const documentId = useUserStore(pull => pull.currentDocumentId);
  const updateDoc = useUserStore(pull => pull.updateDoc);
  const updateTitle = useUserStore(pull => pull.updateTitle);
  const clearCurrentDoc = useUserStore(pull => pull.clearCurrentDoc);
  const user = useUserStore(pull => pull.user);
  const token = useUserStore(pull => pull.token);
  const [socket, setSocket] = useState(null);

  const [title, setTitle] = useState({ title: '' });
  const [pages, setPages] = useState(['']);

  // --------------------------Debug !!--------------------------------------------
  const debugRef = useRef({
    lastAction: '',
    lastPage: null
  });

  //  -----------`-----------------Debug !!--------------------------------------------

  // page Controller activeness
  const [activePageNumber, setActivePageNumber] = useState(0);
  const [activeQuill, setActiveQuill] = useState(null)

  // Keep track of all quill instances
  const [quillInstances, setQuillInstances] = useState({});
  greenLog('quillInstances =====', quillInstances);

  // Add ref to track if toolbar action is in progress
  const toolbarActionInProgress = useRef(false);

  const registerQuill = (pageNumber, quillInstance) => {
    setQuillInstances(prev => ({
      ...prev,
      [pageNumber]: quillInstance
    }));
  };

  const handlePageActive = (pageNumber) => {
    console.log('🟡 Page activation requested:', {
      requestedPage: pageNumber,
      currentActivePage: activePageNumber,
      source: debugRef.current.lastAction
    });

    // Only update if actually changing pages
    if (!toolbarActionInProgress.current) {
      setActivePageNumber(pageNumber);
      setActiveQuill(quillInstances[pageNumber]);
    }
  }

  // Create a function to handle toolbar formatting
  const handleToolbarAction = (action) => {
    toolbarActionInProgress.current = true;

    const currentQuill = quillInstances[activePageNumber];
    if (!currentQuill) {
      toolbarActionInProgress.current = false;
      return;
    }

    // Ensure the correct editor has focus
    if (!currentQuill.hasFocus()) {
      currentQuill.focus();
    }

    // Let default Quill toolbar handlers work
    setTimeout(() => {
      toolbarActionInProgress.current = false;
    }, 100);
  };

  const modules = {
    toolbar: {
      container: '#toolbar',
      handlers: {
        // Handle formatting buttons
        bold: () => handleToolbarAction('bold'),
        italic: () => handleToolbarAction('italic'),
        underline: () => handleToolbarAction('underline'),
        strike: () => handleToolbarAction('strike'),

        // Handle image separately as it needs more complex logic
        image: function () {
          toolbarActionInProgress.current = true;

          const currentQuill = quillInstances[activePageNumber];
          if (!currentQuill) {
            toolbarActionInProgress.current = false;
            toast.warning('Please select a page first');
            return;
          }

          // Ensure focus is on correct editor
          if (!currentQuill.hasFocus()) {
            currentQuill.focus();
          }

          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = () => {
            const file = input.files[0];
            if (file) {
              const reader = new FileReader();

              reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                  if (img.height > PAGE_HEIGHT) {
                    toast.error('Image too big nah!');
                    toolbarActionInProgress.current = false;
                    return;
                  }

                  const range = currentQuill.getSelection(true);
                  currentQuill.insertEmbed(
                    range ? range.index : currentQuill.getLength() - 1,
                    'image',
                    e.target.result
                  );

                  setTimeout(() => {
                    toolbarActionInProgress.current = false;
                  }, 100);
                };
              };
              reader.readAsDataURL(file);
            } else {
              toolbarActionInProgress.current = false;
            }
          };
        }
      }
    }
  };

  // const handleImageUpload = (currentQuill) => {
  //   const input = document.createElement('input');
  //   input.setAttribute('type', 'file');
  //   input.setAttribute('accept', 'image/*');
  //   input.click();

  //   input.onchange = () => {
  //     const file = input.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         const img = new Image();
  //         img.src = e.target.result;

  //         img.onload = () => {
  //           if (img.height > PAGE_HEIGHT) {
  //             toast.error('Image too big nah!');
  //             return;
  //           }

  //           // Ensure we have proper selection before inserting
  //           const selection = currentQuill.getSelection(true);
  //           const insertAt = selection ? selection.index : currentQuill.getLength() - 1;
  //           currentQuill.insertEmbed(insertAt, 'image', e.target.result);
  //         };
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };
  // };

  console.log('%c All page content', 'background-color: yellow', pages);

  const [focusNewPage, setFocusNewPage] = useState(false);

  const handleContentChange = (pageNumber, contentHeight, content) => {
    setPages(prev => {
      console.log("%c hdlContentChange", 'background-color: yellow', "pageNumber =", pageNumber, "contentHeight =", contentHeight, "content =", content)
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
    const enterSocket = io('http://localhost:8200');
    setSocket(enterSocket);

    enterSocket.on('connect', () => {
      toast.success("user connect with id =" + enterSocket.id);
      return () => enterSocket.disconnect();
    });
  }, []);

  useEffect(() => {
    if (socket == null) return;
    socket.emit("get-docId", docId);
  }, [socket, docId]);
  // not use now
  const hdlSave = async () => {
    toast.success("saved");
  };

  return (
    <div className='flex flex-col bg-[#f8d7b1]'>
      <div className='flex flex-col sticky top-0 z-10 bg-[#FFB25B]'>
        <HeaderMenu
          title={title}
          hdlTitleChange={hdlTitleChange}
          hdlSave={hdlSave}
          clearCurrentDoc={clearCurrentDoc}
          user={user}
        />

        <div id='toolbar' className='w-full bg-[#fcc280]'>
          <span className="ql-formats">
            <select className="ql-header">
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
              <option value="6">Heading 6</option>
              <option value="">Normal</option>
            </select>
          </span>
          <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
          </span>
          <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
          </span>
          <span className="ql-formats">
            <select className="ql-align" />
          </span>
          <span className="ql-formats">
            <button className="ql-link" />
            <button className="ql-image" />
          </span>
          <span className="ql-formats">
            <button className="ql-clean" />
          </span>
        </div>
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
            debugRef={debugRef}
            toolbarActionInProgress={toolbarActionInProgress}
          />
        ))}
      </div>
    </div>
  );
};

export default EditorPage;