import { Request, Response, NextFunction} from 'express';
import { DB } from '../infrastructure/persitence/db';

export default async (req: Request, res: Response, next: NextFunction) => {
  
  await DB.instance.connect()
  
  next()
}