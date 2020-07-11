import React from 'react';

export default ({show, text, onAccept, onClose}) => (
  <div className={`modal ${show ? 'is-active' : ''}`}>
    <div className="modal-background" onClick={onClose}></div>
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">Prompt</p>
        <button className="delete" aria-label="close" onClick={onClose}></button>
      </header>
      <section className="modal-card-body">
        {text}
      </section>
      <footer className="modal-card-foot">
        <button className="button is-success" onClick={() => {
          if (onAccept) { onAccept(); }
          if (onClose) { onClose(); }
        }}>Yes</button>
        <button className="button" onClick={onClose}>Close</button>
      </footer>
    </div>
  </div>
);
