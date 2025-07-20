import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { mealsTable } from "../db/schema";
import { HttpResponse, ProtectedHttpRequest } from "../types/HttpTypes";
import { badRequest, notFound, ok } from "../utils/http";
import z from "zod";

const schema = z.object({
  mealId: z.uuid(),
});

export class GetMealByIdController {
  static async handle({
    userId,
    params,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(params);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    const meal = await db.query.mealsTable.findFirst({
      where: and(eq(mealsTable.userId, userId), eq(mealsTable.id, data.mealId)),
      columns: {
        id: true,
        name: true,
        createdAt: true,
        status: true,
        icon: true,
        foods: true,
      },
    });

    if (!meal) {
      return notFound({
        errors: [{ message: "Meal not found" }],
      });
    }

    return ok({
      meal,
    });
  }
}
