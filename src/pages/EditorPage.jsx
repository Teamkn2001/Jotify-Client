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
import ImageResize from 'quill-image-resize-module-react';
import Quill from 'quill';

// set up size of page
const PAGE_HEIGHT = 300;
const MAX_CONTENT_LENGTH = 10000; // Maximum characters per page fix later!!!!!!!!

Quill.register('modules/imageResize', ImageResize);

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
  const [focusNewPage, setFocusNewPage] = useState(false);

  const [activePageNumber, setActivePageNumber] = useState(0);
  const [activeQuill, setActiveQuill] = useState(null)

  // Keep track of all quill instances
  const quillInstancesRef = useRef({});  // Use ref instead of state for quillInstances

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

  
  // this function is toolbar function
  const handleToolbarAction = (action, value) => {
    console.log("🔧 Toolbar action:", action, value);
    console.log('🌐🌐🌐 Editor page run active', activePageNumber, activePageNumber)
    console.log("🔧 Active quill (AKA currentQuill):", quillInstancesRef.current[activePageNumber]);
    
    const currentQuill = quillInstancesRef.current[activePageNumber];
    if (!currentQuill) {
      toast.warning('Please select a page first');
      return;
    }
  
    currentQuill.focus();
    const range = currentQuill.getSelection();
    console.log("🔧 Toolbar range:", range);
    if (!range) {
      currentQuill.setSelection(0, 0);
    }
  
    if (value !== undefined) {
      currentQuill.format(action, value);
    } else {
      const format = currentQuill.getFormat();
      console.log("🔧 Toolbar else format:", format);
      currentQuill.format(action, !format[action]);
    }
    console.log("-----------------🔧 Toolbar toolbar ended----------------");
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
          />
        ))}
      </div>
    </div>
  );
};

export default EditorPage;