import { getSession } from 'next-auth/client';

import UserProfile from '../components/profile/user-profile';

function ProfilePage() {
  return <UserProfile />;
}

/**
 * 7.1: Adding route protection to pages.
 * We want to redirect users to avoid accessing the profile page if they are not
 * authenticated.
 * 
 * With "useSession" sometimes "loading" stays true, and it doesn't really update. 
 * We are not sure if it's a bug or a feature, but it is what it is. Thankfully,
 * there is a way around that, though. Besides "useSession", there also is 'getSession'.
 * And the difference is that with "useSession", we immediately get the "session" 
 * and "loading" values, and then both session and loading could change if session 
 * data was fetched. If we have no session because we're logged out, the session 
 * will never change, though, and, as we see, loading unfortunately also doesn't change. 
 * It stays true.
 * 
 * "getSession" works differently. "getSession" sends a new request and gets the 
 * latest session data, and we can then react to the answer or the response for 
 * that request. And that allows us to manage our own loading state while fetching 
 * the session and act accordingly. It's a bit more cumbersome and requires more 
 * work from our side, but it is the way around this issue that we have here.
 * 
 * So, with "useSession" if we rely on the differences between being in a loading 
 * state and not having a session or not having a session because we're not 
 * authenticated directly after loading a page. In that case, "useSession" didn't 
 * help us, and this is what "getSession" does.
 */
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default ProfilePage;
