import { OAuth, OAuthProvider } from '../../../../domain/user/Credentials';
import { OAuthService } from '../OAuthService';
import config from '../../../../config';
import { HttpUtils } from '/opt/nodejs/sdk/utils/http';

const { clientId, clientSecret, scope, baseUrl } = config.discord;
const { baseRedirectUri } = config.app;

interface DiscordResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export class DiscordOAuthService extends OAuthService {
  protected clientSecret: string;
  constructor() {
    super({
      clientId,
      scope,
      refreshTokenUrl: `${baseUrl}/api/oauth2/token`,
      requestTokenUrl: `${baseUrl}/api/oauth2/token`,
      redirectUri: `${baseRedirectUri}/twitter`,
    });
    this.clientSecret = clientSecret;
  }

  getAuthorizeUrl(userUuid: string): string {
    const encodedScope = this.scope.join('%20');
    return `${baseUrl}/api/oauth2/authorize?response_type=${this.responseType}&client_id=${this.clientId}&redirect_uri=${this.redirectUri}/${userUuid}&scope=${encodedScope}&state=${this.state}`;
  }

  buildRequestTokenBody(code: string): string {
    const body = {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
    };
    return HttpUtils.encodeBody(body);
  }

  buildRefreshTokenBody(refreshToken: string): string {
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    return HttpUtils.encodeBody(body);
  }

  adaptResponse({ access_token, refresh_token, expires_in }: DiscordResponse): OAuth {
    const currentDate = new Date();
    return {
      expireDate: new Date(currentDate.setSeconds(currentDate.getSeconds() + expires_in)),
      accessToken: access_token,
      refreshToken: refresh_token,
      type: OAuthProvider.DISCORD,
    };
  }
}
