import { ReportDto } from './ReportDto';
import { PatientDto } from '../../patient/dto/PatientDto';
import { OrderDto } from '../../order/dto/OrderDto';
import { ResultDto } from '../../result/dto/ResultDto';

export class ReportDetailDto {
  report: ReportDto;
  patient: PatientDto;
  order: OrderDto;
  results: ResultDto[];
}
