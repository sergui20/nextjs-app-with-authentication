import { useRef } from 'react';

import classes from './profile-form.module.css';

/**
 * 12.1: Wiring up the 'Change password' form to their endpoint.
 * 
 * We need to handle the form submission and extract the old and new passwords and
 * send an HTTP PATCH request to the 'Change Password' endpoint.
 * 
 * For, getting the input values we could have used "useState", but we better decided
 * to use "useRef".
 * 
 * We are going to send the request in the parent instead of here.
 */
function ProfileForm(props) {
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredOldPassword = oldPasswordRef.current.value;
    const enteredNewPassword = newPasswordRef.current.value;

    // optional: Add validation

    props.onChangePassword({
      oldPassword: enteredOldPassword,
      newPassword: enteredNewPassword
    });
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPasswordRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor='old-password'>Old Password</label>
        <input type='password' id='old-password' ref={oldPasswordRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
