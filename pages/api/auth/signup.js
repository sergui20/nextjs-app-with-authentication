import { hashPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

/**
 * 1.1: Adding signup route.
 * 
 * We will first of all have to add the logic to create users because "NextAuth" 
 * can then help us with authenticating those users and with getting the token 
 * for those users, but to create the users themselves, we need to bring our own logic.
 * 
 * So, this API route receives a request with an email and a password.
 * This data should then be used to store that user, and we will use MongoDB again 
 * as a database for storing the user data. MongoDB atlas is also very useful to use.
 */
async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;

  const { email, password } = data;

  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message:
        'Invalid input - password should also be at least 7 characters long.',
    });
    return;
  }

  const client = await connectToDatabase();

  const db = client.db();

  const existingUser = await db.collection('users').findOne({ email: email });

  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' });
    client.close();
    return;
  }

  /**
   * 1.3: Adding signup route.
   * 
   * Keep in mind that for the passwords we should never store the plain password 
   * in the database because if our database ever gets compromised by someone 
   * or a third-party intruder, then all our user credentials would be usable. 
   * Hence, for security reasons, it is a best practice and strongly recommended 
   * that you don't store plain passwords in the database,
   * but that you instead encrypt them such that they can't be decrypted.
   * We will still be able to verify them later, no worries, but we want to make sure 
   * that we store passwords in encrypted form. To encrypt passwords, we can 
   * use a third-party package "bcryptjs".
   */
  const hashedPassword = await hashPassword(password);

  const result = await db.collection('users').insertOne({
    email: email,
    password: hashedPassword,
  });

  res.status(201).json({ message: 'Created user!' });
  client.close();
}

export default handler;
