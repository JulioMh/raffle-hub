import { OAuthProvider } from '/opt/nodejs/raffle-hub/domain/user/Credentials';

export function getOAuthProvider(rawPath: string): OAuthProvider | undefined {
  return Object.values(OAuthProvider).find((value) => rawPath.includes(value));
}
