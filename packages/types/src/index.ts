export interface CurrentUser {
  account_id: string;
  email: string;
  user_id: string;
  username: string;
}

declare global {
  namespace Express {
    interface User extends CurrentUser {}
  }
}
