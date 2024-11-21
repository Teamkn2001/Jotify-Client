import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import yellowLog from '../services/yellowLog';

Quill.register('modules/imageResize', ImageResize);

// const TOOLBAR_CONFIGS = (toolbarId) => ({
//     modules: {
//       toolbar: `#toolbar-${toolbarId}`,
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
//   });;
 
//   export default TOOLBAR_CONFIGS;

// const TOOLBAR_CONFIGS = {
//     modules: {
//       toolbar: '#toolbar',
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

  const TOOLBAR_CONFIGS = (enable = true, toolbarId) => (
    console.log("%c XXXXXXXXXXXXXXXXXXXX", 'background-color: pink',enable, toolbarId),
    {
    modules: {
      toolbar: enable ? `#toolbar-${toolbarId}` : false,
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