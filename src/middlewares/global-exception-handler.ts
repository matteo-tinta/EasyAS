import { Request, Response, NextFunction} from 'express';

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  
  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};