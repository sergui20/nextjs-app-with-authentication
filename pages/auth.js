import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import { useEffect, useState } from 'react';

import AuthForm from '../components/auth/auth-form';

/**
 * 9.2: Protecting the "Auth" page.
 * 
 * We also need to redirect the user if they try to access the "Auth" page when they
 * are already signed in. We shouldn't let users see that page if they already have
 * an active session.
 * 
 * So, test this, first login > you will be redirected to the Profile page > then try
 * to navigate to the "Auth" page > and you'll see the app doesn't let you.
 * 
 * So, we made sure that depending on our authentication status, we can only reach 
 * and use different kinds of pages. And we can't visit all the pages all the time.
 * And that, of course, is an important part of authentication.
 */
function AuthPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/');
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <AuthForm />;
}

export default AuthPage;
