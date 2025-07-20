import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { HttpResponse, ProtectedHttpRequest } from "../types/HttpTypes";
import { ok, unauthorized } from "../utils/http";

export class MeController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
      columns: {
        id: true,
        email: true,
        name: true,
        calories: true,
        proteins: true,
        carbohydrates: true,
        fats: true,
      },
    });

    if (!user) {
      return unauthorized({
        errors: [{ message: "User not found" }],
      });
    }

    return ok({
      user,
    });
  }
}
