import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ListMealsController } from "../controllers/ListMealsController";
import { handleProtectedRoute } from "../utils/httpHandlers";

export async function handler(event: APIGatewayProxyEventV2) {
  return handleProtectedRoute(event, ListMealsController.handle);
}
