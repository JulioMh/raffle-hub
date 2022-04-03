interface Config {
  app: {
    baseRedirectUri: string;
  };
  twitter: {
    clientId: string;
    clientSecret: string;
    baseUrl: string;
    scope: string[];
  };
  discord: {
    clientId: string;
    clientSecret: string;
    baseUrl: string;
    scope: string[];
  };
}

export default {
  app: {
    baseRedirectUri: '',
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    scope: process.env.TWITTER_SCOPE?.split(','),
    baseUrl: process.env.TWITTER_BASE_URL || 'https://api.twitter.com',
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    scope: process.env.DISCORD_SCOPE?.split(','),
    baseUrl: process.env.DISCORD_BASE_URL || 'https://discord.com',
  },
} as Config;
