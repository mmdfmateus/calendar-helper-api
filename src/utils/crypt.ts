import { hash, compare } from "bcryptjs";

const SALT_ROUNDS = 8;

export const hashPassword = async (password: string) => {
  return await hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string) => {
  return await compare(password, hash);
};
