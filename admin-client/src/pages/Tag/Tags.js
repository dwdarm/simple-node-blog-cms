import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { 
  getTags, 
  postTag, 
  updateTag,
  deleteTag
} from '../../store/actions/tag.action';
import Table from '../../components/Table';
import InfoDialog from '../../components/InfoDialog';
import PromptDialog from '../../components/PromptDialog';

const Dialog = ({value, show, onSave, onClose}) => {
  const titleRef = useRef(null);
  
  const handleSaveClick = () => {
    if (onSave) {
      onSave({
        title: titleRef.current.value
      })
    }
    
    if (onClose) { onClose(); }
  }
  
  useEffect(() => {
    titleRef.current.value = value;
  })
  
  return (
    <div className={`modal ${show ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Add a tag</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <div className="control">
              <label className="label">Title</label>
              <input ref={titleRef} className="input" type="text" defaultValue={value} />
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={handleSaveClick}>Save</button>
          <button className="button" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
}

const Tags = ({ tags, isFetching, dispatch }) => {
  const [ showAddDialog, setShowAddDialog ] = useState(false);
  const [ showEditDialog, setShowEditDialog ] = useState(false);
  const [ showDeleteDialog, setShowDeleteDialog ] = useState(false);
  const [ selected, setSelected ] = useState({});
  const [ isSending, setIsSending ] = useState(false);
  
  const handlePostTag = val => {
    setIsSending(true);
    dispatch(postTag(val, localStorage.getItem('token')))
    .finally(() => setIsSending(false));
  }
  
  const handleUpdateTag = val => {
    setIsSending(true);
    dispatch(updateTag(selected.id, val, localStorage.getItem('token')))
    .finally(() => {
      setSelected({});
      setIsSending(false);
    });
  }
  
  const handleDeleteTag = val => {
    setIsSending(true);
    dispatch(deleteTag(selected.id, localStorage.getItem('token')))
    .finally(() => {
      setSelected({});
      setIsSending(false);
    });
  }
  
  useEffect(() => {
    if (tags.length === 0) {
      const token = localStorage.getItem('token');
      dispatch(getTags(token))
    }
  });
  
  return (
    <>
      <div className="columns is-vcentered is-mobile">
        <div className="column">
          <h1 className="title">Tag</h1>
        </div>
        <div className="column is-narrow">
          <button 
            className="button is-link is-small"
            onClick={() => setShowAddDialog(true)}>
            New Tag
          </button>
        </div>
      </div>
      
      <Table 
        data={tags} 
        onEdit={(val) => {
          setSelected(val);
          setShowEditDialog(true);
        }}
        onDelete={(val) => {
          setSelected(val);
          setShowDeleteDialog(true);
        }}
      />
      
      <Dialog 
        show={showAddDialog} 
        onSave={handlePostTag}
        onClose={() => setShowAddDialog(false)}
      />
      
      <Dialog 
        value={selected.title}
        show={showEditDialog} 
        onSave={handleUpdateTag}
        onClose={() => setShowEditDialog(false)}
      />
      
      <InfoDialog 
        text="Please Wait..."
        show={isSending} 
      />
      
      <PromptDialog 
        text="Are you sure?"
        show={showDeleteDialog} 
        onAccept={handleDeleteTag}
        onClose={() => setShowDeleteDialog(false)}
      />
      
    </>
  );
}

const mapStateToProps = ({ tag }) => {
  return {
    tags: Object.keys(tag.tags).map(key => tag.tags[key]),
    isFetching: tag.isFetching,
  }
}

export default connect(mapStateToProps)(Tags);
