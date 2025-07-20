import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { HttpRequest, HttpResponse } from "../types/HttpTypes";
import { badRequest, ok, unauthorized } from "../utils/http";
import { z } from "zod";
import { comparePassword } from "../utils/crypt";
import { generateToken } from "../utils/token";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export class SignInController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(body);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, data.email),
      columns: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return unauthorized({
        errors: [{ message: "User or password incorrect" }],
      });
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      return unauthorized({
        errors: [{ message: "User or password incorrect" }],
      });
    }

    const accessToken = generateToken(user.id);

    return ok({
      data: {
        userId: user.id,
        accessToken,
      },
    });
  }
}
