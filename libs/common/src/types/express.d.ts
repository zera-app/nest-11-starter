import { UserInformation } from '@app/model/models/User.model';

declare global {
  namespace Express {
    export interface Request {
      user?: UserInformation;
    }
  }
}

export {};
