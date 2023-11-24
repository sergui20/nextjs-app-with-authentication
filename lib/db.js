import { MongoClient } from 'mongodb';

/**
 * 1.2: Adding signup route.
 * We will need to talk to our MongoDB instance therefore we can create this utility
 * function to connect to the database.
 * Notice this can be enhanced even more, we could cache the connection instance, so
 * that we avoid connecting to the database for each incoming request.
 */
export async function connectToDatabase() {
  const client = await MongoClient.connect(
    'mongodb+srv://maximilian:ZbJcz3dJ88LSUMlM@cluster0.ntrwp.mongodb.net/auth-demo?retryWrites=true&w=majority'
  );

  return client;
}
