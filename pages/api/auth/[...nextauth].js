/**
 * 3.1: Adding authentication.
 * 
 * Now that we are able to create users, it's time to work on the authentication 
 * functionality. So, we need to get generate tokens for our logged-in users.
 * We need to be able to find out if a user is logged in both on the client-side
 * for changing what we see and for disabling certain routes, as well as 
 * on the server-side in different API routes. This is where the "NextAuth" package,
 * which we installed earlier, becomes important. It helps us with authenticating
 * users and with finding out whether a user has a specific permission by managing
 * that token creation and storage, both parts behind the scenes.
 * 
 * Therefore, that is why we have created this catch-all route, a dynamic API route, 
 * with name "...nextauth", which catches all unknown routes that start with 
 * "api/auth". In here, we now use that "NextAuth" package. We need this catch-all 
 * route, because the "NextAuth" package behind the scenes will expose multiple 
 * routes for user login and for user logout, for example, along with a couple 
 * of other routes in order to set up its own routes and handle its own routes, 
 * we need to have a catch-all route so that all those special requests to 
 * these specific routes are automatically handled by the "NextAuth" package.
 * 
 * We can still also define our own routes, like the signup route in addition, 
 * as long as we don't override one of the built-in routes NextAuth exposes. 
 * If you want to find out which routes it creates, you can check out the official
 * "NextAuth" documentation here: https://next-auth.js.org/getting-started/rest-api. 
 * So, we shouldn't clash with the built-in NextAuth endpoints.
 * 
 * 
 */
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import { verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

/**
 * 3.2: Adding authentication.
 * 
 * Now, how do we then use NextAuth? Import NextAuth from next-auth, and then 
 * we need to export "NextAuth" as a default and executing it. So, NextAuth 
 * here is a function, which we can execute, and when we execute it, 
 * it returns a new function, a handler function. It needs to because this is still 
 * an API route, and therefore, an API route still needs to return a function, a handler.
 * It needs to export a function. But that exported handler function is created 
 * by NextAuth by calling NextAuth. And we can pass a configuration object to it. 
 * That's the object which allows us to configure NextAuth's behavior.
 */
export default NextAuth({
  /**
   * To make sure that a JSON Web Token is created after validating a user 
   * we can specify in the NextAuth config object, the sessions option here.
   * 
   * For some other authentication providers, you have other ways of managing this. 
   * For example, that a session is stored in a database, but for credential-based
   * authentication, for this provider, you must use JWT and set this to true, it is
   * true by default, but being explicit is not bad.
   * 
   * Just as a side note, you can use Cognito as an authentication provider!
   * Check out the docs.
   */
  session: {
    jwt: true,
  },
  /**
   * 3.3: Adding authentication.
   * So, we need to import Providers from next-auth/providers, and then you can 
   * choose from the long list of supported providers. And again, check out 
   * the providers docs to learn more about the concrete way of setting up 
   * the different providers. But here, we need the Credentials provider, 
   * which means that we bring our own credentials.
   * 
   * Now, this takes a configuration object itself, and we now can configure 
   * a couple of things. For example, we can set the credentials key and define 
   * what our credentials are, email and password, in this case. We could use let 
   * "NextAuth" generate a login form for us. However, we don't wanna let 
   * NextAuth generate a form for me. We already built one in previous lectures.
   * 
   * The only thing we need to set here actually is authorize and authorize 
   * turns out to be a method. It's a method which Next.js will call for us 
   * when it receives an incoming login request.
   * 
   * So, "authorize" is an async function, so it returns a promise, 
   * and as a argument, we get the credentials that were submitted. 
   * And that is the object with the data we submitted, email, password. 
   * In here, we now have to bring our own authorization logic > check if the 
   * credentials are valid and tell the user if that's not the case, and so on.
   */
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDatabase();

        const usersCollection = client.db().collection('users');

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        /**
         * Now, when you throw an error inside of authorize, authorize will reject
         * that promise, and it will then by default redirect the client to 
         * another page. But we will be able to override this so that we stay 
         * on the login page and maybe just show an error there. 
         * But that's something we'll do later.
         */
        if (!user) {
          client.close();
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error('Could not log you in!');
        }

        /**
         *  If we pass all the if checks, we know that we have a valid user for 
         * the given email address and password. So in that case, the user will be 
         * logged, therefore, we can now return an object. When we return an object 
         * inside of authorize, we let "NextAuth" know that authorization succeeded. 
         * And this object will then actually be encoded into the 
         * NextAuth JSON Web Token. Hence here, we could, for example, include 
         * the user email. We should not pass the entire user object because 
         * we don't wanna include the password. Even though it's hashed, we 
         * don't wanna expose that to the client. So, that's the object we return 
         * and that will then be encoded in a JSON Web Token.
         */
        client.close();
        return { email: user.email };
        
      },
    }),
  ],
});
