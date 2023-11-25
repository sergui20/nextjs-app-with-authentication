import ProfileForm from './profile-form';
import classes from './user-profile.module.css';

/**
 * 8.2: Adding server-side route protection to pages.
 * 
 * Now that we use "getServerSideProps". And that means we can now get rid of our 
 * client-side code. Now, this component will only be rendered if that page renders. 
 * And that page will only render if we are authenticated because of our 
 * "getServerSideProps" logic. And that might be the more elegant way of handling 
 * this because with this, if we save that, if I'm not logged in and I then visit 
 * /profile I don't even see the profile page flashing. Instead, I'm instantly 
 * redirected. We are now not showing the loader.
 */
function UserProfile() {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   getSession().then((session) => {
  //     if (!session) {
  //       window.location.href = '/auth';
  //     } else {
  //       setIsLoading(false);
  //     }
  //   });
  // }, []);

  // if (isLoading) {
  //   return <p className={classes.profile}>Loading...</p>;
  // }

  /**
   * 12.2: Wiring up the 'Change password' form to their endpoint.
   * 
   * Here is our 'change password' handler, which as we said sends a PATCH request
   * to the change password endpoint.
   */
  async function changePasswordHandler(passwordData) {
    const response = await fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // You could add more feedback to the user, like a loader or success message or
    // sommething, but we just wanted to check if our logic works.
    console.log(data);
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler} />
    </section>
  );
}

export default UserProfile;
