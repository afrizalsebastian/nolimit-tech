import { Logger } from '@common/logger.service';
import { NextFunction, Request, Response } from 'express';

export interface HttpCustomError extends Error {
  status?: number;
}

export class UnauthorizedError implements HttpCustomError {
  status?: number | undefined;
  name: string;
  message: string;
  stack?: string | undefined;

  constructor(message?: string) {
    this.status = 401;
    this.name = 'UnauthorizedError';
    this.message = message || 'Unauthorized';
  }
}

export class BadRequestError implements HttpCustomError {
  status?: number | undefined;
  name: string;
  message: string;
  stack?: string | undefined;

  constructor(message?: string) {
    this.status = 400;
    this.name = 'BadRequestError';
    this.message = message || 'Bad Request';
  }
}

export class NotFoundError implements HttpCustomError {
  status?: number | undefined;
  name: string;
  message: string;
  stack?: string | undefined;

  constructor(message?: string) {
    this.status = 404;
    this.name = 'NotFoundError';
    this.message = message || 'Not Found';
  }
}

export class InternalServerError implements HttpCustomError {
  status?: number | undefined;
  name: string;
  message: string;
  stack?: string | undefined;

  constructor(message?: string) {
    this.status = 500;
    this.name = 'IInternalServerError';
    this.message = message || 'Internal Server Error';
  }
}

export class CustomError implements HttpCustomError {
  status?: number | undefined;
  name: string;
  message: string;
  stack?: string | undefined;

  constructor(status: number, message: string) {
    this.status = status;
    this.name = 'CustomError';
    this.message = message;
  }
}

const ErrorHandlerMiddleware = (
  err: HttpCustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  Logger.error(`[${statusCode}]-[${req.url}] ${message}`);
  res.status(statusCode).json({
    status: false,
    error: message,
  });
};

export default ErrorHandlerMiddleware;
