import { APIGatewayProxyEventV2 } from "aws-lambda";
import {
  HttpRequest,
  HttpResponse,
  ProtectedHttpRequest,
} from "../types/HttpTypes";
import { verifyToken } from "./token";

export const parseEvent = (event: APIGatewayProxyEventV2): HttpRequest => {
  return {
    body: JSON.parse(event.body ?? "{}"),
    queryParams: event.queryStringParameters ?? {},
    params: event.pathParameters ?? {},
  };
};

export const parseProtectedEvent = (
  event: APIGatewayProxyEventV2
): ProtectedHttpRequest => {
  const { authorization } = event.headers;

  if (!authorization) {
    throw new Error("Access token is required");
  }

  const [, token] = authorization.split(" ");

  const decodedUserId = verifyToken(token);

  if (!decodedUserId) {
    throw new Error("Invalid access token");
  }

  return {
    ...parseEvent(event),
    userId: decodedUserId,
  };
};

export const parseResponse = ({ statusCode, body }: HttpResponse) => {
  return {
    statusCode,
    body: body ? JSON.stringify(body) : undefined,
  };
};
