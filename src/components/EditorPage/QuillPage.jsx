import React, { act, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import { CloudFog } from 'lucide-react';
import yellowLog from '../../services/yellowLog';
import orange from '../../services/orange';
import setToolbarId from '../../configs/toolbar';
import TOOLBAR_CONFIGS from '../../configs/toolbar';
import Quill from 'quill';

// Quill.register('modules/imageResize', ImageResize);

const PAGE_HEIGHT = 300;
const MAX_CONTENT_LENGTH = 10000; // Maximum characters per page fix later!!!!!!!!

// ----------------- QuillPage Component -----------------
const QuillPage = ({
  modules,
  handleContentChange,
  initialContent = '',
  handlePageFull,
  pageNumber,
  focusOnMount,
  isPageActive,
  onActivePage,
  onQuillInit
}) => {
  const { quill, quillRef } = useQuill({
    modules,
    theme: 'snow',
    preserveWhitespace: true,
  });


  useEffect(() => {
    console.log('📄 Quillpage Component run at ', pageNumber)
    console.log('🌈🌈🌈🌈', quill)
    if (!quill) return;

    // Register quill instance
    onQuillInit(quill);

    // Get toolbar module
    const toolbar = quill.getModule('toolbar');

    // Custom handlers
    toolbar.addHandler('bold', function () {
      const format = quill.getFormat();
      quill.format('bold', !format.bold);
    });

    toolbar.addHandler('italic', function () {
      const format = quill.getFormat();
      quill.format('italic', !format.italic);
    });


    // Set initial content if provided
    if (initialContent) {
      quill.root.innerHTML = initialContent;
    }

    // Focus handling for new pages
    console.log("focusOnMount =", focusOnMount)
    if (focusOnMount) {
      setTimeout(() => {
        quill.focus();
        quill.setSelection(0, 0);
        onActivePage();
      }, 100);
    }

    // Monitor Page Active state
    const handleSelection = (range) => {
      console.log("%c range ====", 'background-color: pink', range)
      if (range) {
        onActivePage();
      }
    };

    // Handle content changes
    const handleTextChange = () => {
      const editor = quillRef.current;
      const contentHeight = editor?.clientHeight;
      console.log('current quill height =', contentHeight)
      const contentLength = quill.getText().length;
      const content = quill.root.innerHTML;

      if (contentHeight > PAGE_HEIGHT || contentLength > MAX_CONTENT_LENGTH) {
        const selection = quill.getSelection();
        if (!selection) return;

        const contents = quill.getContents(0, selection.index);
        const remainingContents = quill.getContents(selection.index);
        console.log("🌸🌸🌸🌸 🤚 ", contents, remainingContents)

        const tempContainer = document.createElement('div');
        const tempQuill = new Quill(tempContainer);
        tempQuill.setContents(remainingContents);
        const remainingContent = tempQuill.root.innerHTML;

        quill.setContents(contents);
        handlePageFull(pageNumber, quill.root.innerHTML, remainingContent);
      }
      handleContentChange(contentHeight, content);
    };

    quill.on('selection-change', handleSelection);
    quill.on('text-change', handleTextChange);

    return () => {
      quill.off('selection-change', handleSelection);
      quill.off('text-change', handleTextChange);
    };
  }, [quill]);

  return (
    <div
      className={`quill-page-container ${isPageActive ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onActivePage()}
    >
      <div className='bg-white shadow-md w-[794px] min-h-[420px] m-auto p-16 mb-9 overflow-hidden '>
        <div ref={quillRef} className='quill-page border-none' />
      </div>
    </div>
  );
};

export default QuillPage; 