declare global {
  interface Window {
    NEXT_PUBLIC_WEBSOCKET_API_URL: string;
    USER_POOL_ID: string;
    AWS_REGION: string;
    USER_POOL_CLIENT_ID: string;
  }
}

export const config = {
  apiEndpoint: window.NEXT_PUBLIC_WEBSOCKET_API_URL,
  userPoolId: window.USER_POOL_ID,
  awsRegion: window.AWS_REGION,
  userPoolClientId: window.USER_POOL_CLIENT_ID,
};
