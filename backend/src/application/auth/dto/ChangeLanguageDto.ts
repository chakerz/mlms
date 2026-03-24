import { IsEnum } from 'class-validator';
import { Language } from '../../../domain/common/types/Language';

export class ChangeLanguageDto {
  @IsEnum(Language)
  language: Language;
}
