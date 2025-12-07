import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, query, params } = request;

        if (error instanceof HttpException) {
          const status = error.getStatus();
          const response = error.getResponse();

          this.logger.warn(
            `HTTP ${status} - ${method} ${url} - ${JSON.stringify({
              body,
              query,
              params,
              response,
            })}`,
          );
        } else {
          this.logger.error(
            `Unhandled error - ${method} ${url} - ${error.message}`,
            error.stack,
          );
        }

        return throwError(() => {
          if (error instanceof HttpException) {
            return error;
          }

          return new HttpException(
            {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: "Internal server error",
              error: "Internal Server Error",
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });
      }),
    );
  }
}
