import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SignInController } from "../controllers/SignInController";
import { parseEvent, parseResponse } from "../utils/httpParser";

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseEvent(event);

  const response = await SignInController.handle(request);
  return parseResponse(response);
}
