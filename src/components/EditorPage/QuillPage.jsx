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
// -------------------------------------------------------------------------------
// QuillPage.jsx
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
  // Remove the modules spread in useQuill to use the parent's modules directly
  const { quill, quillRef } = useQuill({
    modules, // Use modules directly without spreading
    // theme: 'snow',
    preserveWhitespace: true,
  });

  useEffect(() => {
    if (!quill) return;
    
    // Register quill instance
    onQuillInit(quill);

    // Set initial content if provided
    if (initialContent) {
      quill.root.innerHTML = initialContent;
    }

    // Focus handling for new pages
    if (focusOnMount) {
      setTimeout(() => {
        quill.focus();
        quill.setSelection(0, 0);
        onActivePage();
      }, 100);
    }

    // Monitor Page Active state
    const handleSelection = (range) => {
      if (range) {
        onActivePage();
      }
    };

    quill.on('selection-change', handleSelection);

    // Handle content changes
    quill.on('text-change', () => {
      const editor = quillRef.current;
      const contentHeight = editor?.clientHeight;
      const contentLength = quill.getText().length;
      const content = quill.root.innerHTML;

      if (contentHeight > PAGE_HEIGHT || contentLength > MAX_CONTENT_LENGTH) {
        const selection = quill.getSelection();
        if (!selection) return;

        const contents = quill.getContents(0, selection.index);
        const remainingContents = quill.getContents(selection.index);

        const tempContainer = document.createElement('div');
        const tempQuill = new Quill(tempContainer);
        tempQuill.setContents(remainingContents);
        const remainingContent = tempQuill.root.innerHTML;

        quill.setContents(contents);
        handlePageFull(pageNumber, quill.root.innerHTML, remainingContent);
      }

      handleContentChange(contentHeight, content);
    });

    return () => {
      quill.off('selection-change', handleSelection);
    };
  }, [quill]);

  return (
    <div
      className={`quill-page-container ${isPageActive ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onActivePage()}
    >
      <div className='bg-white shadow-md w-[794px] min-h-[420px] m-auto p-16 mb-9 overflow-hidden '>
        <div ref={quillRef} className='quill-page ' />
      </div>
    </div>
  );
};

export default QuillPage; 