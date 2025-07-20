import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SignUpController } from "../controllers/SignUpController";
import { parseEvent, parseResponse } from "../utils/httpParser";

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseEvent(event);

  const response = await SignUpController.handle(request);
  return parseResponse(response);
}
