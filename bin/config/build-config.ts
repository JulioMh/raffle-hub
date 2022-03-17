export interface BuildConfig {
  readonly AWSAccountID: string;
  readonly AWSRegion: string;

  readonly App: string;
  readonly Environment: string;
  readonly Repository: string;
  readonly Branch: string;
  readonly CompiledFolder: string;
  readonly Parameters: BuildParameters;
}

export interface BuildParameters {
  LAMBDA_LAYER_SYNC_SDK_VERSION_ARN: string;
  LAMBDA_TIMEOUT: number;
  BILLING_MODE: string;
  SYNC_USER_PROFILE_URL: string;
  MAX_ATTEMPTS: string;
  READ_CAPACITY: number;
  WRITE_CAPACITY: number;
}
