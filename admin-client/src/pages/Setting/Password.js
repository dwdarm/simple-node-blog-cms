import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateUser } from '../../store/actions/user.action';

const Password = ({ user, dispatch }) => {
  const history = useHistory();
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ isSending, setIsSending ] = useState(false);
  
  const handleUpdateUser = () => {
    if ((password.length >= 8) && (password === confirmPassword)) {
      setIsSending(true);
      dispatch(updateUser(user.id, { password }, localStorage.getItem('token')))
      .then(() => setIsSending(false));
    }
  }
  
  useEffect(() => {
    if (!user) { history.replace('/'); }
  });
  
  if (!user) { return null; }
  
  return (
    <>
    
      <div className="field">
        <label className="label">New password</label>
        <div className="control">
          <input 
            className={`input ${(password.length < 8) && (password !== '') ? 'is-danger' : ''}`}  
            type="password" 
            placeholder="New password"
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        { (password.length < 8) && (password !== '')
          ? <p className="help is-danger">Minimum length is 8 characters</p>
          : null
        }
      </div>
      
      <div className="field">
        <label className="label">Confirm password</label>
        <div className="control">
          <input 
            className={`input ${password !== confirmPassword ? 'is-danger' : ''}`} 
            type="password" 
            placeholder="Confirm password"
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        { password !== confirmPassword
          ? <p className="help is-danger">Invalid password</p>
          : null
        }
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

export default connect(mapStateToProps)(Password);
