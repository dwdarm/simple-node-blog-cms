import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateUser } from '../../store/actions/user.action';

const Account = ({ user, dispatch }) => {
  const history = useHistory();
  const usernameRef = useRef(null);
  const nameRef = useRef(null);
  const avatarRef = useRef(null);
  const aboutRef = useRef(null);
  const emailRef = useRef(null);
  const [ isSending, setIsSending ] = useState(false);
  
  const handleUpdateUser = () => {
    setIsSending(true);
    dispatch(updateUser(user.id, {
      username: usernameRef.current.value,
      fullName: nameRef.current.value,
      urlToAvatar: avatarRef.current.value,
      about: aboutRef.current.value,
      email: emailRef.current.value
    }, localStorage.getItem('token')))
    .then(() => setIsSending(false));
  }
  
  useEffect(() => {
    if (!user) { history.replace('/'); }
  });
  
  if (!user) { return null; }
  
  return (
    <>
    
      <div className="field">
        <label className="label">Username</label>
        <div className="control">
          <input 
            ref={usernameRef}
            className="input" 
            type="text" 
            placeholder="Username"
            defaultValue={user.username}
          />
        </div>
      </div>
      
      <div className="field">
        <label className="label">Full name</label>
        <div className="control">
          <input 
            ref={nameRef}
            className="input" 
            type="text" 
            placeholder="Full name"
            defaultValue={user.fullName || ''}
          />
        </div>
      </div>
      
      <div className="field">
        <label className="label">URL to avatar</label>
        <div className="control">
          <input 
            ref={avatarRef}
            className="input" 
            type="url" 
            placeholder="URL to avatar"
            defaultValue={user.urlToAvatar}
          />
        </div>
      </div>
      
      <div className="field">
        <label className="label">About</label>
        <div className="control">
          <input 
            ref={aboutRef}
            className="input" 
            type="text" 
            placeholder="About"
            defaultValue={user.about || ''}
          />
        </div>
      </div>
      
      <div className="field">
        <label className="label">Email</label>
        <div className="control">
          <input 
            ref={emailRef}
            className="input" 
            type="text" 
            placeholder="Email"
            defaultValue={user.email || ''}
          />
        </div>
      </div>
      
      <div className="field is-grouped is-grouped-right">
        <div className="control">
          <button 
            className="button is-success"
            disabled={isSending ? true : undefined}
            onClick={handleUpdateUser}>
            Save
          </button>
        </div>
      </div>
    
    </>
  );
}

const mapStateToProps = ({ auth, user }) => ({
  user: auth.userId ? user[auth.userId] : null
});

export default connect(mapStateToProps)(Account);
