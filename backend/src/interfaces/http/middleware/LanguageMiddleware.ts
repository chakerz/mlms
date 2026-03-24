import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const lang = req.headers['accept-language']?.toUpperCase();
    (req as any).language = lang === 'AR' ? 'AR' : 'FR';
    next();
  }
}
