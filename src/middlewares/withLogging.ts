import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - [${req.method}]: ${req.url}`)
    console.dir({
        body: req.body,
        query: req.query
    })
    next()
}