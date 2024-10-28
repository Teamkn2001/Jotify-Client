import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQuill } from 'react-quilljs';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import useUserStore from '../stores/userStore';
import HeaderMenu from '../components/HeaderMenu';
import ImageResize from 'quill-image-resize-module-react';
import io from 'socket.io-client';
import QuillToolbarMenu from '../components/QuillToolbarMenu';

Quill.register('modules/imageResize', ImageResize);

// ------------------------jsx ------------------------------
const EDITOR_CONFIGS = {
  modules: {
    toolbar: '#toolbar',
    imageResize: {
      parchment: Quill.import('parchment'),
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
};

const PAGE_HEIGHT = 750;
const MAX_CONTENT_LENGTH = 10000; // Maximum characters per page fix later!!!!!!!!

// Create a separate component for each Quill editor page
const QuillPage = ({ onContentChange, initialContent = '', onPageFull, pageIndex, focusOnMount }) => {
  const { quill, quillRef } = useQuill({
    ...EDITOR_CONFIGS,
    theme: 'snow',
    preserveWhitespace: true,
  });

  useEffect(() => {
    if (!quill) return;

    // Set initial content if provided
    if (initialContent) {
      quill.root.innerHTML = initialContent;
    }

    // Focus on this editor if it's new
    if (focusOnMount) {
      setTimeout(() => {
        quill.focus();
        quill.setSelection(0, 0);
      }, 100);
    }

    // Set up image handling
    quill.getModule('toolbar').addHandler('image', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        if (file) {
          const reader = new FileReader();
          console.log('reader =', reader)
          reader.onload = (e) => {
            const range = quill.getSelection(true);
            console.log('range of cursor', range)
            // Use insertEmbed instead of updateContents for images
            quill.insertEmbed(range.index, 'image', e.target.result);
          };
          reader.readAsDataURL(file);
        }
      };
    });

    // Monitor content changes
    quill.on('text-change', () => {
      const editor = quillRef.current;
      console.log('editor by quillRef.current =', editor)
      const contentHeight = editor?.clientHeight;
      console.log('contentHeight by editor client=', contentHeight)
      const contentLength = quill.getText().length; // for limit characters length

      const content = quill.root.innerHTML;
      console.log('content.root.innerHTML =', content)

      // Check if content exceeds limits
      if (contentHeight > PAGE_HEIGHT || contentLength > MAX_CONTENT_LENGTH) {
        // Get cursor position
        const selection = quill.getSelection();
        if (!selection) return;

        // If we're at the end of the content
        if (selection.index === quill.getLength() - 1) {
          onPageFull(pageIndex);
          return;
        }

        // If we're in the middle of the content, split it
        const contents = quill.getContents(0, selection.index);
        const remainingContents = quill.getContents(selection.index);
        
        // Update current page with content up to cursor
        quill.setContents(contents);
        
        // Signal parent to create new page with remaining content
        onPageFull(pageIndex, quill.root.innerHTML, remainingContents);
      }

      onContentChange(contentHeight, content);
    });

    // Prevent pasting if it would exceed the limit
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      const currentLength = quill.getText().length;
      const incomingLength = delta.length();
      
      if (currentLength + incomingLength > MAX_CONTENT_LENGTH) {
        toast.warning('Content exceeds page limit. Please continue on next page.');
        return new Delta(); // Return empty delta to prevent paste
      }
      return delta;
    });

  }, [quill]);

  return (
    <div className='no-border bg-white shadow-md w-[794px] min-h-[750px] m-auto p-16 mb-9 overflow-hidden'>
      <div ref={quillRef} className='quill-page' />
    </div>
  );
};
// ------------------------jsx ------------------------------
const EditorPage = () => {
  const { docId } = useParams();
  const documentId = useUserStore(pull => pull.currentDocumentId);
  const updateDoc = useUserStore(pull => pull.updateDoc);
  const updateTitle = useUserStore(pull => pull.updateTitle);
  const clearCurrentDoc = useUserStore(pull => pull.clearCurrentDoc);
  const user = useUserStore(pull => pull.user);
  const token = useUserStore(pull => pull.token);

  const [pages, setPages] = useState(['']);
  const [title, setTitle] = useState({ title: '' });
  const [socket, setSocket] = useState(null);
  const [focusNewPage, setFocusNewPage] = useState(false);

  const handleContentChange = (index, contentHeight, content) => {
    setPages(prev => {
      console.log("hdlContentChange index =",index, "contentHeight =", contentHeight, "content =", content)
      const updatedPages = [...prev];
      updatedPages[index] = content;
      return updatedPages;
    });
  };

  const  handlePageFull = (pageIndex, currentContent, remainingContent) => {
    console.log("handle Page full executed!!")
    setPages(prev => {
      const updatedPages = [...prev];
      console.log('hdl Page full updatedPages ===', updatedPages)
      
      // If we have content to split
      if (remainingContent) {
        // Update current page
        if (currentContent) {
          updatedPages[pageIndex] = currentContent;
        }
        
        // Insert new page with remaining content
        updatedPages.splice(pageIndex + 1, 0, '');
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
    <div className='flex flex-col bg-sky-200'>
      <div className='flex flex-col sticky top-0 z-10 bg-green-300'>
        <HeaderMenu
          title={title}
          hdlTitleChange={hdlTitleChange}
          hdlSave={hdlSave}
          clearCurrentDoc={clearCurrentDoc}
          user={user}
        />
        <QuillToolbarMenu />
      </div>

      <div className='relative'>
        {socket ?
          <h1 className='bg-red-600 mb-3'>user :{socket.id}</h1> :
          <h1>no socket user</h1>
        }
        
        {pages.map((content, index) => (
          <QuillPage
            key={index}
            pageIndex={index}
            initialContent={content}
            onContentChange={(height, content) => handleContentChange(index, height, content)}
            onPageFull={handlePageFull}
            focusOnMount={focusNewPage && index === pages.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default EditorPage;