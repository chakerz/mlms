import { DomainException } from './DomainException';

export class DomainNotFoundException extends DomainException {
  constructor(entity: string, id?: string) {
    super(id ? `${entity} '${id}' not found` : `${entity} not found`);
  }
}
