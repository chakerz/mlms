import { IResultRepository } from '../../../domain/result/repositories/IResultRepository';
import { ResultDto } from '../dto/ResultDto';

export class ListResultsByOrder {
  constructor(private readonly resultRepo: IResultRepository) {}

  async execute(orderId: string): Promise<ResultDto[]> {
    const results = await this.resultRepo.findByOrderId(orderId);
    return results.map(ResultDto.from);
  }
}
