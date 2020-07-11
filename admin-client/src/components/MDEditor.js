import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default React.forwardRef(({ defaultValue, onChange }, ref) => {
  const [ write, setWrite ] = useState(true);
  const textareaRef = ref || useRef(null);
  
  return (
    <div className="md-editor">
    
      <div className="md-editor-btn-wrapper">
        <button 
          className={`${write ? 'md-is-active' : ''}`}
          onClick={() => setWrite(true)}>
          Write
        </button>
        <button 
          className={`${!write ? 'md-is-active' : ''}`}
          onClick={() => setWrite(false)}>
          Preview
        </button>
      </div>
      
      <textarea
        className={`${!write ? 'md-is-hidden' : ''}`}
        ref={textareaRef}
        rows="24"
        placeholder="Markdown here..."
        defaultValue={defaultValue}
        onChange={onChange}>
      </textarea>
      
      <div className={`md-editor-preview ${write ? 'md-is-hidden' : ''}`}>
        <ReactMarkdown source={textareaRef.current ? textareaRef.current.value : undefined} />
      </div>
      
    </div>
  );
});
