import { DomainException } from './DomainException';

export class DomainValidationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
