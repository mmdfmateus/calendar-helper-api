import { randomUUID } from "crypto";
import { db } from "../db";
import { mealsTable } from "../db/schema";
import { HttpResponse, ProtectedHttpRequest } from "../types/HttpTypes";
import { badRequest, ok, unauthorized } from "../utils/http";
import z from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getPresignedUrl } from "../utils/fileHelper";

const schema = z.object({
  fileType: z.enum(["image/jpeg", "audio/m4a"]),
});

export class MealController {
  static async handle({
    userId,
    body,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(body);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    const { fileKey, presignedUrl } = await getPresignedUrl(data.fileType);

    const [meal] = await db
      .insert(mealsTable)
      .values({
        userId,
        inputType: data.fileType === "image/jpeg" ? "picture" : "audio",
        status: "uploading",
        createdAt: new Date(),
        name: "",
        inputFileKey: fileKey,
        icon: "",
        foods: [],
      })
      .returning({
        id: mealsTable.id,
      });

    return ok({
      mealId: meal.id,
      presignedUrl,
    });
  }
}
