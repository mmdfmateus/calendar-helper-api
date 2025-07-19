import { APIGatewayProxyEventV2 } from "aws-lambda";
import { HttpRequest } from "../types/HttpTypes";

export const parseEvent = (event: APIGatewayProxyEventV2): HttpRequest => {
  return {
    body: JSON.parse(event.body ?? "{}"),
    queryParams: event.queryStringParameters ?? {},
    params: event.pathParameters ?? {},
  };
};
