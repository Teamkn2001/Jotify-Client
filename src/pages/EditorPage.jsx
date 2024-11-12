import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'quill/dist/quill.snow.css';
import useUserStore from '../stores/userStore';
import HeaderMenu from '../components/HeaderMenu';
import io from 'socket.io-client';
import QuillToolbarMenu from '../components/QuillToolbarMenu';
import leaves from '../../src/assets/leaves.svg'
import QuillPage from '../components/EditorPage/QuillPage'


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

  console.log('%c All page content','background-color: yellow', pages);

  const [focusNewPage, setFocusNewPage] = useState(false);

  const handleContentChange = (index, contentHeight, content) => {
    setPages(prev => {
      console.log("%c hdlContentChange",'background-color: yellow',"index =", index, "contentHeight =", contentHeight, "content =", content)
      const updatedPages = [...prev];
      updatedPages[index] = content;
      return updatedPages;
    });
  };

  const handlePageFull = (pageIndex, currentContent, remainingContent) => {
    alert('page full')
    // console.log("%c handle Page full executed!!",'background-color: yellow')
    // console.log("%c data sent in hdlPageful :",'background-color: yellow', "index =", pageIndex, "cur content", currentContent, "remain cont. =", remainingContent)
    setPages(prev => {
      const updatedPages = [...prev];
      // console.log('hdl Page full updatedPages ===', updatedPages)

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
    <div className='flex flex-col bg-[#f8d7b1]'>

      {/* header and toolbar */}
      <div className='flex flex-col sticky top-0 z-10 bg-[#FFB25B]'
      // style={{
      //   backgroundImage: `url(${leaves})`,
      // }}
      >
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