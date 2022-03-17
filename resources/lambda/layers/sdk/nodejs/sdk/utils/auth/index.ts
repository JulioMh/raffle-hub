import { httpRequest } from '../../infra/httpRequest';

const { SYNC_USER_PROFILE_URL } = <
  {
    SYNC_USER_PROFILE_URL: string;
  }
>process.env;

export const authAndGetUserUuid = async (authHeader: string): Promise<string> => {
  let response;
  const headers = { Authorization: authHeader };
  try {
    response = await httpRequest(SYNC_USER_PROFILE_URL, { method: 'GET', headers });
  } catch (error: any) {
    console.error(error);
    const errorUsersMs = error.message.split(/Error:(.+)/)[1];
    throw new Error(errorUsersMs);
  }

  if (response.kycStatus !== 'DONE') {
    throw new Error(
      JSON.stringify({
        error: {
          status_code: 403,
          message: 'Forbidden requests',
        },
      })
    );
  }

  return response.userUuid;
};

export const hideUserToken = (event: any): any => ({
  ...event,
  headers: event.headers
    ? {
        ...event.headers,
        authorization: event.headers.authorization ? 'hidden for logs' : undefined,
        Authorization: event.headers.Authorization ? 'hidden for logs' : undefined,
      }
    : {},
});
