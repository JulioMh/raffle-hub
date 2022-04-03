import { uuid as uuidv4 } from 'uuidv4';
import { OAuthProvider, TwitterOAuth } from '../../../../domain/user/Credentials';
import { OAuthService } from '../OAuthService';
import config from '../../../../config';
import { HttpUtils } from '/opt/nodejs/sdk/utils/http';

const { clientId, scope, baseUrl } = config.twitter;
const { baseRedirectUri } = config.app;

interface TwitterResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export class TwitterOAuthService extends OAuthService {
  readonly codeChallenge: string;
  protected codeChallengeMethod: string;

  constructor(codeChallenge = uuidv4()) {
    super({
      clientId,
      scope,
      refreshTokenUrl: `${baseUrl}/2/oauth2/token`,
      requestTokenUrl: `${baseUrl}/2/oauth2/token`,
      redirectUri: `${baseRedirectUri}/twitter`,
    });
    this.codeChallenge = codeChallenge;
    this.codeChallengeMethod = 'plain';
  }

  getAuthorizeUrl(userUuid: string): string {
    const encodedScope = this.scope.join('%20');
    return `${baseUrl}/i/oauth2/authorize?response_type=${this.responseType}&client_id=${this.clientId}&redirect_uri=${this.redirectUri}/${userUuid}&scope=${encodedScope}&state=${this.state}&code_challenge=${this.codeChallenge}&code_challenge_method=${this.codeChallengeMethod}`;
  }

  buildRequestTokenBody(code: string): string {
    const body = {
      code,
      client_id: this.clientId,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
      code_verifier: this.codeChallenge,
    };
    return HttpUtils.encodeBody(body);
  }

  buildRefreshTokenBody(refreshToken: string): string {
    const body = {
      client_id: this.clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    return HttpUtils.encodeBody(body);
  }

  adaptResponse({ access_token, refresh_token, expires_in }: TwitterResponse): TwitterOAuth {
    const currentDate = new Date();
    return {
      expireDate: new Date(currentDate.setSeconds(currentDate.getSeconds() + expires_in)),
      accessToken: access_token,
      refreshToken: refresh_token,
      type: OAuthProvider.TWITTER,
    };
  }
}
