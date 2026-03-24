import { DomainException } from './DomainException';

export class UnauthorizedDomainException extends DomainException {
  constructor(message = 'Unauthorized') {
    super(message);
  }
}
