/* eslint-disable global-require */
import AWSXRay from 'aws-xray-sdk-core';
import fetch, { Response } from 'node-fetch';

const { AWS_XRAY_CAPTURE_ENABLED } = <
  {
    AWS_XRAY_CAPTURE_ENABLED: string;
  }
>process.env;

if (AWS_XRAY_CAPTURE_ENABLED === 'true') {
  // eslint-disable-next-line no-undef
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AWSXRay.captureHTTPsGlobal(require('http'), true);
  // eslint-disable-next-line no-undef
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AWSXRay.captureHTTPsGlobal(require('https'), true);

  AWSXRay.capturePromise();
}

const handleResponseContentType = async (
  response: Response
): Promise<Record<string, unknown> | string> => {
  if (!response.ok) {
    const errorRes = await response.text();
    throw new Error(
      `Response was not successful, error code: ${response.status}. Error: ${errorRes}`
    );
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('json')) {
    const responseJSON = (await response.json()) as Record<string, unknown>;
    return responseJSON;
  }

  if (contentType.startsWith('text/html')) {
    const responseText = await response.text();
    return responseText;
  }

  throw new Error(`Unsupported response content-type: ${contentType}`);
};

export const httpRequest = async (url: string, options: any): Promise<any> => {
  console.log('HTTP Request URL: ', url);
  const httpRes = await fetch(url, options);
  return handleResponseContentType(httpRes);
};
