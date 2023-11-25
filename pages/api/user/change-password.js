import { getSession } from 'next-auth/client';

import { hashPassword, verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

/**
 * 11.1: Protecting API routes or adding authorization.
 * 
 * Let's take the change password page for example. This clearly is an operation that
 * should be restricted to only authenticated users. Not every user should be allowed
 * to change a password. Hence, let's add this new API route "/api/user/change-password".
 * 
 * We could have added this endpoint under the "/api/auth" folder, but we decided to
 * create a new folder just so you can see endpoints can be added anywhere under "api".
 * 
 * In here, we want to extract the old and new password, which the user will send.
 * We want to verify that the request is coming from an authenticated user and deny
 * if it's not. We want to get the email address of that authenticated user then,
 * and then we want to look into the database, see if we find that user there, see 
 * if the old password that was entered matches the current password in the database,
 * and if that's the case, we want to replace that old password with the new password.
 * Let's first of all check if the incoming request has the right method, and for
 * changing the password, a POST, PUT, or PATCH request makes sense. These are the
 * three kinds of requests that imply that resources on the server should be created
 * or changed, and you can argue whether changing a password is creating a new resource,
 * a new password, or changing an existing resource, and we will go for the latter
 * argument. So, let's continue with the request only if it is a PATCH. So, if it's not
 * PATCH, then we will just return and not continue at all.
 */
async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  // Check if this is coming from an authenticated user. Only allow if it is.
  // "getSession" needs the entire request, because it will look into the request and check if the token cookie is there.
  const session = await getSession({ req: req });

  if (!session) {
    // 401 is the status code to tell the user that auth is missing.
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  // Thankfully, we included the user email in the token, so we can easily get it from the session.
  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();

  const usersCollection = client.db().collection('users');

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    // 403 means that you are "authenticated", but not "authorized" for this operation.
    // Unlike the 401 we used above, which means that the user is not "authenticated".
    // Or we could use a 422 which indicates that the user input is incorrect, that could be a fair assumption as well, but we will go with 403.
    res.status(403).json({ message: 'Invalid password.' });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } } // "$set" is an operation understood by MongoDB to set the properties of a document that should change. 
  );

  client.close();
  res.status(200).json({ message: 'Password updated!' });
}

export default handler;
