import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useQuill } from 'react-quilljs';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import { CloudFog } from 'lucide-react';


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

const PAGE_HEIGHT = 300;
const MAX_CONTENT_LENGTH = 10000; // Maximum characters per page fix later!!!!!!!!

// --------------------------------------------------------------------------------
const QuillPage = ({ handleContentChange, initialContent = '', handlePageFull, pageNumber, focusOnMount }) => {

  // console.log( "%c 1 onContentChange =",'background-color: #90EE90', handleContentChange  )
  // console.log("%c 2 pageNumber = ",'background-color: #90EE90', pageNumber , "content on page = ", initialContent)
  // console.log("%c 3 onPageFull =",'background-color: #90EE90', onPageFull) // this ony called when function
  console.log("%c 4 focusOnMount =", 'background-color: #90EE90', focusOnMount)

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

    // Set up image handling and file Reader ( console log === orange salmon color)
    quill.getModule('toolbar').addHandler('image', () => {
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
                return;
              }

              // If we get here, image is small enough, so insert it
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'image', e.target.result);
            };
          };

          reader.readAsDataURL(file);
        }
      };
    });

    // Monitor content changes ( console log === green)
    quill.on('text-change', () => {
      const editor = quillRef.current; // get whole div of this quill
      // console.log(' 99 editor by quillRef.current =', editor)

      const contentHeight = editor?.clientHeight; // height of what user typed
      // console.log('contentHeight by editor client=', contentHeight)

      const contentLength = quill.getText().length; // for limit characters length

      const content = quill.root.innerHTML; // get all content in html format
      console.log('%c 5 content.root.innerHTML =', 'background-color: #90EE90', content)

      const iJustWantToSeeDeltaImg = quill.getContents();
      console.log('%c delta with image is', 'background-color: #90EE90', iJustWantToSeeDeltaImg)

      // Check if content exceeds limits
      if (contentHeight > PAGE_HEIGHT || contentLength > MAX_CONTENT_LENGTH) {
        // Get cursor position
        const selection = quill.getSelection();
        // console.log('%c 8 selection =', 'background-color: #ADD8E6' , selection)
        // console.log('%c 9 quill.getLength -1 =', 'background-color:#ADD8E6' , quill.getLength() - 1)
        // if (!selection) return;

        // noob create a new page!!!!!
        // if (selection.index === quill.getLength() - 1) {
        //   handlePageFull(pageNumber);
        //   return;
        // }

        alert("come to 2nd phase")
        // If we're in the middle of the content split it
        const contents = quill.getContents(0, selection.index); // this will get content till cursor position
        console.log('%c 10 content by .getContents =', 'background-color: pink', contents)

        const remainingContents = quill.getContents(selection.index); // this is Delta object
        console.log('%c 11 remain Contents =====', 'background-color: pink', remainingContents);

        // *************  process change Delta ---->>> html(Pink log) ****************
        const tempContainer = document.createElement('div');
        const tempQuill = new Quill(tempContainer);

        tempQuill.setContents(remainingContents); // set the remain Delta in tempQuill
        const remainingContent = tempQuill.root.innerHTML
        console.log("%c 12 remainingContent", 'background-color: pink', remainingContent)
        // Update current page with content up to cursor
        quill.setContents(contents);

        const dataToHandlePageFull = {
          pageNumber,
          currentContent: quill.root.innerHTML,
          remainingContent
        }
        console.log("%c 11 dataToHandlePageFull ===", 'background-color: pink', dataToHandlePageFull)
        // Signal parent to create new page with remaining content
        handlePageFull(pageNumber, quill.root.innerHTML, remainingContent);
      }

      handleContentChange(contentHeight, content);
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
    <div className='no-border bg-white shadow-md w-[794px] min-h-[400px] m-auto p-16 mb-9 overflow-hidden'>
      <div ref={quillRef} className='quill-page' />
    </div>
  );
};

export default QuillPage; 