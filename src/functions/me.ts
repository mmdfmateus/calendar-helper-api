import { APIGatewayProxyEventV2 } from "aws-lambda";
import { MeController } from "../controllers/MeController";
import { handleProtectedRoute } from "../utils/httpHandlers";

export async function handler(event: APIGatewayProxyEventV2) {
  return handleProtectedRoute(event, MeController.handle);
}
