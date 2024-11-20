// QuillToolbar.jsx
import React from 'react';

const QuillToolbarMenu = ({toolbarId}) => {
  console.log('%c QuillToolbarMenu =','color: red', `toolbar-${toolbarId}`)
  return ( 
    <div id={`toolbar-${toolbarId}`} className='w-full bg-[#fcc280]'>
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
  );
};

export default QuillToolbarMenu;