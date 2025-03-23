import { UserInformation } from '@app/repositories';

declare global {
  namespace Express {
    export interface Request {
      user?: UserInformation;
    }
  }
}

export {};
