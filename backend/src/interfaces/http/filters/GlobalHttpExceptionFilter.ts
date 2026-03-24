import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { DomainValidationException } from '../../../domain/common/exceptions/ValidationException';
import { UnauthorizedDomainException } from '../../../domain/common/exceptions/UnauthorizedDomainException';
import { ConflictDomainException } from '../../../domain/common/exceptions/ConflictDomainException';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (typeof body === 'object' && body !== null) {
        const bodyObj = body as Record<string, unknown>;
        if (Array.isArray(bodyObj.message)) {
          errors = bodyObj.message;
          message = 'Validation failed';
        } else {
          message = (bodyObj.message as string) ?? message;
        }
      }
    } else if (exception instanceof DomainNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof ConflictDomainException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof DomainValidationException) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = exception.message;
    } else if (exception instanceof UnauthorizedDomainException) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(errors ? { errors } : {}),
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
