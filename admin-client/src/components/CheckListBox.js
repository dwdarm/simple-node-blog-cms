import React from 'react';

export default ({ title, data, values , onChange }) => {
  
  return (
    <div className="panel" style={{maxHeight: '16rem', overflowY: 'auto'}}>
      <p className="panel-heading is-size-6">{title}</p>
      {data.map(e => (
        <label key={e.id} className="panel-block">
          <input 
            type="checkbox" 
            name={e.title}
            value={e.id}
            checked={Array.isArray(values) ? values.indexOf(e.id.toString()) !== -1 : false}
            onChange={onChange}
          />
          {e.title}
        </label>
      ))}
    </div>
  );
}
