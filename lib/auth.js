/**
 * 1.4: Adding signup route.
 * These are some utility functions.
 */
import { hash, compare } from 'bcryptjs';

export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

// This is how we can find out if a plaintext password matches a hashed password.
export async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}