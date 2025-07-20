import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { HttpRequest, HttpResponse } from "../types/HttpTypes";
import { badRequest, created } from "../utils/http";
import { z } from "zod";
import { hashPassword } from "../utils/crypt";
import { generateToken } from "../utils/token";
import { calculateGoals } from "../lib/goalCalculator";

const schema = z.object({
  goal: z.enum(["lose", "maintain", "gain"]),
  gender: z.enum(["male", "female"]),
  birthDate: z.coerce.date(),
  height: z.number(),
  weight: z.number(),
  activityLevel: z.number().min(1).max(5),
  account: z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string(),
  }),
});

export class SignUpController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(body);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, data.account.email),
      columns: {
        id: true,
      },
    });

    if (user) {
      return badRequest({ errors: [{ message: "User already exists" }] });
    }

    const goals = calculateGoals({
      ...data,
      birthDate: data.birthDate,
    });

    const hashedPassword = await hashPassword(data.account.password);
    const [newUser] = await db
      .insert(usersTable)
      .values({
        ...data,
        ...data.account,
        ...goals,
        password: hashedPassword,
        birthDate: data.birthDate.toISOString(),
      })
      .returning({
        id: usersTable.id,
      });

    const accessToken = generateToken(newUser.id);

    return created({
      userId: newUser.id,
      accessToken,
    });
  }
}
