import Link from 'next/link';
import { useSession, signOut } from 'next-auth/client';

import classes from './main-navigation.module.css';

/**
 * 5.1: Managing user session in the frontend.
 * 
 * To answer the question of whether a user is authenticated or not. For example, 
 * we want to make sure that the options in the header change based on whether w
 * e are authenticated or not. And again, Next.js makes that pretty easy for us.
 * 
 * It is worth noting that after we log in successfully, Next.js is adding a cookie. 
 * You can see this in the browser DevTools > "Application" > "Cookies" > select 
 * our domain > there you can see some cookies that were set. And those are cookies 
 * generated and managed by Next.js. For example, the session token is a 
 * JSON Web Token in the end, that was set automatically by Next.js when we logged 
 * in successfully. And it will also use that token automatically for us when we try 
 * to change what we see on the screen or when we try to send requests to 
 * protected resources.
 * 
 * So, we can get the answer to whether the user is logged in or not by finding out 
 * whether such a valid token exists. And we could come up with some code that 
 * allows us to do that manually, though that code would involve that we need to 
 * send that cookie to the server and let the server decide whether it's valid or not.
 * Hence, it's good that we don't have to do that. Instead, if you want to find out 
 * if the user using this page at the moment is authenticated or not, Next.js gives 
 * us a convenient way of doing that. So, lets set up that here, in the main navigation
 * component. We want to show the "profile" option only if the user is authenticated.
 * 
 * All you have to do is use the "useSession" hook from "next-auth/client".
 * 
 * So, only if we have a sesson show the "profile" and "logout" options in the navbar.
 * If not show "login" so that users can log in.
 * 
 * Check the "8-Managing user session in the frontend" document to see the UI result.
 */
function MainNavigation() {
  // The "loading" value tells use whether Nextjs is figuring out whether a user is logged in or not.
  const [session, loading] = useSession();

  function logoutHandler() {
    signOut();
  }

  return (
    <header className={classes.header}>
      <Link href='/'>
        <a>
          <div className={classes.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          {!session && !loading && (
            <li>
              <Link href='/auth'>Login</Link>
            </li>
          )}
          {session && (
            <li>
              <Link href='/profile'>Profile</Link>
            </li>
          )}
          {session && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
