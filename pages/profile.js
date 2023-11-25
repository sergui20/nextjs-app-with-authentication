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
 * 
 * 8.1: Adding server-side route protection to pages.
 * "getSession" is not limited to client-side only as we did it in "user-profile.js"
 * component.
 * 
 * In the previous lecture we protected the profile page and redirected away for 
 * not authenticated users. But there is a brief moment of "loading", which flashes 
 * on the screen when we enter profile when not authenticated, that is maybe 
 * something we want to get rid of. Now, we can't really get rid of it with just 
 * client-side code because if we visit this page and we then use client-side 
 * JavaScript code to determine whether we are authenticated or not, then we'll 
 * always need to wait that fraction of a second to find out if we are. But we must 
 * not forget that Next.js blends server-side and client-side code, so we can use 
 * server-side code to determine whether the user, who sent the request, is 
 * authenticated or not and return different page content and possibly a redirect 
 * if the user is not authenticated.
 * 
 * So, let's use "getSession" and pass the entire incoming request. 
 * And then, "getSession" will automatically look into that request and extract 
 * the data it needs, the session token cookie, to be precise—and see if that's valid,
 * and if the user is authenticated and if that cookie even exists to begin with.
 */
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      // If you remember, we already learned that "getServerSideProps" can also return a redirect parameter. As well as a 404 or props.
      redirect: {
        destination: '/auth',
        // You can add "permanent" to indicate if that's a permanent redirect, which will always apply, or only a temporary one. And here we definitely want to set permanent to false to make it clear that it's only this time that we redirect because the user is not logged in.
        permanent: false,
      },
    };
  }

  return {
    props: { session }, // If you want you can pass the session as a prop to the component.
  };
}

export default ProfilePage;
