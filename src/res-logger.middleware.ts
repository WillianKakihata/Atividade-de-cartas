import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ResLogger implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    const start = new Date().getTime();
    console.log(`Request \nPath: ${req.originalUrl} \nMethod: ${req.method}`)
    
    res.on('finish', () => {
        const finish = new Date().getTime();
        console.log(`Response time: ${finish - start}ms`);
    });

    next();
  }
}
