import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../db";
import { mealsTable } from "../db/schema";
import { HttpResponse, ProtectedHttpRequest } from "../types/HttpTypes";
import { badRequest, ok } from "../utils/http";
import z from "zod";

const schema = z.object({
  date: z.coerce.date(),
});

export class ListMealsController {
  static async handle({
    userId,
    queryParams,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(queryParams);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    const startDate = new Date(data.date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(data.date);
    endDate.setUTCHours(23, 59, 59, 999);

    const meals = await db.query.mealsTable.findMany({
      where: and(
        eq(mealsTable.userId, userId),
        gte(mealsTable.createdAt, startDate),
        lte(mealsTable.createdAt, endDate),
        eq(mealsTable.status, "success")
      ),
      columns: {
        id: true,
        name: true,
        createdAt: true,
        status: true,
        icon: true,
        foods: true,
      },
    });

    return ok({
      meals,
    });
  }
}
