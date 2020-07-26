import React from 'react';

export default ({title, show, text, closeable, onClose}) => (
  <div className={`modal ${show ? 'is-active' : ''}`}>
    <div className="modal-background" onClick={closeable ? onClose : undefined}></div>
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">{ title || 'Info' }</p>
        {closeable 
          ? <button className="delete" aria-label="close" onClick={onClose}></button>
          : null
        }
      </header>
      <section className="modal-card-body">
        {text}
      </section>
      <footer className="modal-card-foot">
        {closeable 
          ? <button className="button" onClick={onClose}>Close</button>
          : null
        }
      </footer>
    </div>
  </div>
);
