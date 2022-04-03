import fetch from 'node-fetch';
import { uuid as uuidv4 } from 'uuidv4';
import { ContentType } from '/opt/nodejs/sdk/utils/http';
import { OAuth } from '../../../domain/user/Credentials';

export interface OAuthServiceProps {
  scope: string[];
  redirectUri: string;
  clientId: string;
  clientSecret?: string;
  refreshTokenUrl: string;
  requestTokenUrl: string;
  codeChallenge?: string;
  state?: string;
  responseType?: string;
}

export abstract class OAuthService {
  protected clientId: string;
  protected clientSecret?: string;

  protected scope: string[];
  readonly state: string;
  protected redirectUri: string;
  protected responseType: string;

  protected requestTokenUrl: string;
  protected refreshTokenUrl: string;
  protected revokeTokenUrl: string;

  readonly codeChallenge?: string;
  protected codeChallengeMethod?: string;

  constructor({
    scope,
    redirectUri,
    state = uuidv4(),
    clientId,
    clientSecret,
    requestTokenUrl,
    refreshTokenUrl,
    responseType = 'code',
  }: OAuthServiceProps) {
    this.state = state;
    this.scope = scope;
    this.responseType = responseType;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.clientId = clientId;
    this.requestTokenUrl = requestTokenUrl;
    this.refreshTokenUrl = refreshTokenUrl;
  }

  protected abstract buildRequestTokenBody(code: string): string;
  protected abstract buildRefreshTokenBody(refreshToken: string): string;
  protected abstract adaptResponse(response: unknown): OAuth;

  abstract getAuthorizeUrl(userUuid: string): string;

  async requestToken(code: string): Promise<OAuth> {
    const response = await fetch(this.requestTokenUrl, {
      method: 'POST',
      body: this.buildRequestTokenBody(code),
      headers: { 'Content-Type': ContentType.FORM_URLENCODED },
    });

    const credentials = this.adaptResponse(response);

    return credentials;
  }

  async refreshToken(userUuid: string, refreshToken: string): Promise<OAuth> {
    const response = await fetch(this.requestTokenUrl, {
      method: 'POST',
      body: this.buildRefreshTokenBody(refreshToken),
      headers: { 'Content-Type': ContentType.FORM_URLENCODED },
    });
    const credentials = this.adaptResponse(response);

    return credentials;
  }
}
