import { HttpResponse } from "../types/HttpTypes";

export const parseResponse = ({ statusCode, body }: HttpResponse) => {
  return {
    statusCode,
    body: body ? JSON.stringify(body) : undefined,
  };
};
