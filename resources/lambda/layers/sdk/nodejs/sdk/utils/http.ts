export enum ContentType {
  APPLICATION_JSON = 'application/json',
  FORM_URLENCODED = 'application/x-www-form-urlencoded',
}

export class HttpUtils {
  static encodeBody = (body: { [key: string]: any }): string => {
    return Object.keys(body)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`)
      .join('&');
  };
}
