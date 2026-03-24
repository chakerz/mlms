import { DomainException } from './DomainException';

export class ConflictDomainException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
