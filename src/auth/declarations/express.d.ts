import { IUserPayload } from '../dto/user-payload.dto';

declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}
