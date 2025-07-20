import { APIGatewayProxyEventV2 } from "aws-lambda";
import { MealController } from "../controllers/MealController";
import { handleProtectedRoute } from "../utils/httpHandlers";

export async function handler(event: APIGatewayProxyEventV2) {
  return handleProtectedRoute(event, MealController.handle);
}
