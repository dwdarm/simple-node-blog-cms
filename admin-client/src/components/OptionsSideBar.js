import React from 'react';

export default ({ isPublished, isFeatured, isPage, onOptionsChange, onSave }) => {
  return (
    <div className="panel">
      <p className="panel-heading is-size-6">Options</p>
      
      <label className="panel-block">
        <input 
          type="checkbox" 
          name="isPublished"
          checked={isPublished}
          onChange={onOptionsChange}
        />
        Published
      </label>
      
      <label className="panel-block">
        <input 
          type="checkbox" 
          name="isPage"
          checked={isPage}
          onChange={onOptionsChange}
        />
        Page
      </label>
      
      <label className="panel-block">
        <input 
          type="checkbox" 
          name="isFeatured"
          checked={isFeatured}
          onChange={onOptionsChange}
        />
        Featured
      </label>
      
      <div className="panel-block">
        <button className="button is-success is-fullwidth" onClick={onSave}>Save</button>
      </div>
      
    </div>
  );
}
