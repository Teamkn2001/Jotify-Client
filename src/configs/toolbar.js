import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import yellowLog from '../services/yellowLog';

Quill.register('modules/imageResize', ImageResize);

const TOOLBAR_CONFIGS = (toolbarId) => ({
    modules: {
      toolbar: `#toolbar-${toolbarId}`,
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize'],
        displaySize: true
      }, 
    },
    formats: [
      'header',
      'bold', 'italic', 'underline', 'strike',
      'list',
      'align',
      'link', 'image'
    ]
  });;
 
  export default TOOLBAR_CONFIGS;

// const TOOLBAR_CONFIGS = {
//     modules: {
//       toolbar: '#toolbar-1',
//       imageResize: {
//         parchment: Quill.import('parchment'),
//         modules: ['Resize', 'DisplaySize'],
//         displaySize: true
//       }, 
//     },
//     formats: [
//       'header',
//       'bold', 'italic', 'underline', 'strike',
//       'list',
//       'align',
//       'link', 'image'
//     ]
//   };

//   export default TOOLBAR_CONFIGS;