import { JwtPayload, sign, verify } from "jsonwebtoken";

const EXPIRES_IN = "7d";

export const generateToken = (userId: string) => {
  return sign({ sub: userId }, process.env.JWT_SECRET!, {
    expiresIn: EXPIRES_IN,
  });
};

export const verifyToken = (token: string): string | null => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    return decoded?.sub as string | null;
  } catch (error) {
    return null;
  }
};
