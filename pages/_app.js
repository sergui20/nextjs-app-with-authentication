import { Provider } from 'next-auth/client';

import Layout from '../components/layout/layout';
import '../styles/globals.css';

/**
 * 10.1: Optimizing our app with the Session Provider component.
 * 
 * In some client side components we are using "useSession", there is nothing wrong
 * with that hook, it is perfectly fine placed, but it is redundant in some cases.
 * 
 * For example, when a user is on their Profile page and they reload that page, the
 * "useSession" hook will send a request to the backend to validate the session, 
 * because we can't validate the session in the client-side JavaScript for security 
 * reasons. But, the Profile page already validates the session in the backend with
 * "getServerSideProps", therefore we are redundant with the session validation.
 * 
 * We can avoid this redundancy by using the "Provider" from "next-auth/client".
 * So, we can wrap this Provider around our layout and pass the "session" data, so
 * that NextAuth skip the extra session check performed by "useSession" if we already 
 * have the session from our "getServeSideProp" function.
 * How come we get the "session" here in the "_app.js"? Because there are some pages with 
 * "getServerSideProps" that return "session", therefore it is also accessible in the
 * "_app.js" file as well.
 * 
 * Now, obviously for some other components "session" will be undefined since we are
 * not loading it from "getServerSideProps", therefore the "useSession" will send a 
 * request to validate the session. So, now, we will only do the validate session
 * request just once.
 * 
 * Using this wrapper provider is a recommended pattern because it theoretically 
 * or practically allows NextAuth to optimize itself internally, and skip certain 
 * checks and possibly HTTP requests. Even though we unfortunately didn't see in the
 * test, nonetheless, adding this extra wrapper is a recommended optimization which 
 * is ideal.
 */
function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
