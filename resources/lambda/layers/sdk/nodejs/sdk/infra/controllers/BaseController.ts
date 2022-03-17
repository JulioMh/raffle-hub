export interface ErrorDetails {
  field: string;
  error_msg: string;
}

export interface ErrorPayload {
  status_code: number;
  message: string;
  details?: ErrorDetails[];
  payload?: any;
  status_specific?: string;
}

export interface ErrorBody {
  error: ErrorPayload;
}

export interface LambdaResponse {
  isBase64Encoded: boolean;
  statusCode: number;
  headers: Record<string, string>;
  body: any;
}

export class BaseController {
  static buildResponse(statusCode: number, body?: any): LambdaResponse {
    return {
      isBase64Encoded: false,
      statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  }

  static buildErrorResponse(error: ErrorPayload): LambdaResponse {
    return BaseController.buildResponse(error.status_code, { error });
  }

  static ok(dto: any): LambdaResponse {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!dto) {
      return BaseController.buildResponse(200, dto);
    }
    return BaseController.buildResponse(200);
  }

  static validationFailed(validationErrors: ErrorDetails[]): LambdaResponse {
    const errorPayload: ErrorPayload = {
      status_code: 400,
      message: 'Validation Error',
      details: validationErrors,
    };
    return BaseController.buildErrorResponse(errorPayload);
  }

  static fail(): LambdaResponse {
    const errorPayload: ErrorPayload = {
      status_code: 500,
      message: 'Internal Server Error - contact Sync.',
    };
    return BaseController.buildErrorResponse(errorPayload);
  }

  static notFound(message = 'Not Found'): LambdaResponse {
    const errorPayload: ErrorPayload = {
      status_code: 404,
      message,
    };
    return BaseController.buildErrorResponse(errorPayload);
  }
}
