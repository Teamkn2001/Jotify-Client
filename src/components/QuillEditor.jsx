import React from 'react'
import { useQuill } from 'react-quilljs';

export default function QuillEditor({ onContentChange, initialContent = '', onPageFull, pageIndex, focusOnMount }) {
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
        // 1. Get the toolbar and add a custom handler for the image button
        quill.getModule('toolbar').addHandler('image', () => {
             // 2. Create a hidden file input element type file accept image
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            // 3. click the input element
            input.click();

            // 4. Handle when user selects a file
            input.onchange = async () => {
                const file = input.files[0];

                if (file) {
                     // 5. Create a FileReader to read the image file
                    const reader = new FileReader();

                    // 6. Set up what happens when file is loaded
                    reader.onload = (e) => {
                         // 7. Get current cursor position in editor
                        const range = quill.getSelection(true);
                         // 8. Insert the image at cursor position
                        // Use insertEmbed instead of updateContents for images
                        quill.insertEmbed(range.index, 'image', e.target.result);
                        // range.index: where to insert the image
                        // image': what type of content to insert
                        // e.target.result: the image data (as base64 string)
                    };
                     // 9. Start reading the file as a data URL
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
            const contentLength = quill.getText().length;
            const content = quill.root.innerHTML;

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
        <>
            <div className='no-border bg-white shadow-md w-[794px] min-h-[750px] m-auto p-16 mb-9 overflow-hidden'>
                <div ref={quillRef} className='quill-page' />
            </div>
        </>
    )
}
