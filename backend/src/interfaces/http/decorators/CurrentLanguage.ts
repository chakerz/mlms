import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Language } from '../../../domain/common/types/Language';

export const CurrentLanguage = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Language => {
    const request = ctx.switchToHttp().getRequest();
    return (request.language as Language) ?? Language.FR;
  },
);
