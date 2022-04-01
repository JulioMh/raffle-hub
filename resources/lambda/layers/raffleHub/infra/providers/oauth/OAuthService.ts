import fetch from 'node-fetch';
import { uuid as uuidv4 } from 'uuidv4';
import { OAuthRepository } from '../../repositories/OAuthRepository';
import { ContentType } from '/opt/nodejs/sdk/utils/http';
import { OAuth } from '../../../domain/OAuth';

export interface OAuthServiceProps {
  scope: string[];
  redirectUri: string;
  clientId: string;
  clientSecret: string;
  refreshTokenUrl: string;
  requestTokenUrl: string;
  state?: string;
  responseType?: string;
}

export abstract class OAuthService {
  protected clientId: string;
  protected clientSecret: string;

  protected scope: string[];
  protected state: string;
  protected redirectUri: string;
  protected responseType: string;

  protected requestTokenUrl: string;
  protected refreshTokenUrl: string;
  protected revokeTokenUrl: string;

  protected codeChallenge?: string;
  protected codeChallengeMethod?: string;

  protected oauthRepository: OAuthRepository;

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

  abstract buildAuthorizeUrl(): string;
  abstract buildRequestTokenBody(code: string): string;
  abstract buildRefreshTokenBody(refreshToken: string): string;
  abstract adaptResponse(response: unknown): OAuth;

  async getAuthorizeUrl(userUuid: string): Promise<string> {
    await this.oauthRepository.saveVerification({
      userUuid,
      state: this.state,
      codeChallenge: this.codeChallenge,
    });

    return this.buildAuthorizeUrl();
  }

  async requestToken(code: string): Promise<OAuth> {
    const response = await fetch(this.requestTokenUrl, {
      method: 'POST',
      body: this.buildRequestTokenBody(code),
      headers: { 'Content-Type': ContentType.APPLICATION_JSON },
    });

    return this.adaptResponse(response);
  }

  async refreshToken(refreshToken: string): Promise<OAuth> {
    const response = await fetch(this.requestTokenUrl, {
      method: 'POST',
      body: this.buildRefreshTokenBody(refreshToken),
      headers: { 'Content-Type': ContentType.APPLICATION_JSON },
    });

    return this.adaptResponse(response);
  }
}
