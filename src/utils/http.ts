import { HttpResponse } from "../types/HttpTypes";

export const ok = (body?: Record<string, any>): HttpResponse => {
  return {
    statusCode: 200,
    body,
  };
};

export const created = (body?: Record<string, any>): HttpResponse => {
  return {
    statusCode: 201,
    body,
  };
};

export const badRequest = (body?: Record<string, any>): HttpResponse => {
  return {
    statusCode: 400,
    body,
  };
};

export const unauthorized = (body?: Record<string, any>): HttpResponse => {
  return {
    statusCode: 401,
    body,
  };
};

export const notFound = (body?: Record<string, any>): HttpResponse => {
  return {
    statusCode: 404,
    body,
  };
};
