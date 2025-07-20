import { APIGatewayProxyEventV2 } from "aws-lambda";
import { parseProtectedEvent } from "./httpParser";
import { HttpResponse, ProtectedHttpRequest } from "../types/HttpTypes";
import { unauthorized } from "./http";
import { parseResponse } from "./httpParser";

export const handleProtectedRoute = async (
  event: APIGatewayProxyEventV2,
  handler: (request: ProtectedHttpRequest) => Promise<HttpResponse>
) => {
  const request = parseProtectedEvent(event);

  try {
    const response = await handler(request);
    return parseResponse(response);
  } catch (error) {
    return parseResponse(
      unauthorized({
        errors: [{ message: (error as Error).message }],
      })
    );
  }
};
