import { useState, useRef } from 'react';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';

import classes from './auth-form.module.css';

async function createUser(email, password) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}

/**
 * 2.1: Sending signup requests from the frontend.
 * We will send users credentials, so users can signup to our API endpoint we created
 * in the previous lecture.
 * 
 * 
 * If you want to see how the sign up page looks and works run the app or check 
 * the word document "6-Sending signup requests from the frontend".
 */
function AuthForm() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    /**
     * Remember that to get the input values we can either use "useState" and listen
     * to "onChange" events or we can just "useRef" to get the value right when the
     * users "submits" the form.
     */
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation

    /**
     * 4.1: Sending sign-in request from the frontend.
     * 
     * Now that we have the API route for logging users in. We can wire up the 
     * front-end AuthForm with the login endpoint. Well, here we need to sign 
     * the user in. We don't really need to send an HTTP request. We don't need
     * to configure it ourselves. And we shouldn't. Instead, let's import from 
     * "next-auth/client" and from there, we can import the "signIn" function. 
     * This "signIn" function is a function that we can call in our component to 
     * send a "signIn" request. The request will be sent automatically. The first 
     * argument describes the provider with which we want to "signIn". Remember we
     * could have multiple providers in the same application. For our case, it's the
     * credentials provider. Then we can also pass a second argument,a configuration
     * object where we can configure how the "signIn" process should work. Specifically,
     * we can add a redirect field and set it to false. You might remember that we 
     * said that when "next-auth" is used on the back-end and we throw an error 
     * because the authentication failed or something, by default, Next.js would 
     * redirect us to another page, to an error page. To avoid this, we can set 
     * the redirect option to false. If we want to handle the error on the same page 
     * and display a custom error message, we can set up the error handling logic 
     * accordingly. So, let's just show the error in the same page.
     * 
     * Now, when setting redirect to false, "signIn" will actually return a promise 
     * which eventually yields us our result. The promise will always resolve, it 
     * will never be rejected. Even if we have an error in our back-end authentication
     * code, the result would be an object that contains information about the error. 
     * If we have no error during authentication, the result is still an object, 
     * but without the error information. So, this will never throw an error, it will 
     * never be rejected.
     */
    if (isLogin) {
      const result = await signIn('credentials', {
        redirect: false,
        // If you remember in "[...nextauth].js" we are getting "email" and "password" from the payload.
        email: enteredEmail,
        password: enteredPassword,
      });

      /**
       * 9.1: Protecting the "Auth" page.
       * 
       * Now let's start with the redirecting after logging in successfully. Here, 
       * if we don't have an error (signed in succeessfully), then redirect. Now we 
       * could again redirect with "window.location.href", but that basically resets 
       * the entire application. That is fine for an initial page load but if we already
       * worked in this application, and we have state already going on, then we 
       * probably don't wanna reset the entire application and lose all our state. 
       * So, therefore, instead for redirecting, the better way of doing that is by 
       * using Next router. And then in our component we simply call "useRouter" to get 
       * access to the router. And then, we can simply call "replace". And "replace" 
       * will basically redirect us. It will replace the current URL with a different 
       * one.
       * 
       * So, test this, first login and then verify if you are redirected to the profile
       * page.
       */
      if (!result.error) {
        // set some auth state
        router.replace('/profile');
      }
    } else {
      try {
        const result = await createUser(enteredEmail, enteredPassword);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
