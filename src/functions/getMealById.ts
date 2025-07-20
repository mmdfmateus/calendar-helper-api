import { APIGatewayProxyEventV2 } from "aws-lambda";
import { GetMealByIdController } from "../controllers/GetMealByIdController";
import { handleProtectedRoute } from "../utils/httpHandlers";

export async function handler(event: APIGatewayProxyEventV2) {
  return handleProtectedRoute(event, GetMealByIdController.handle);
}
