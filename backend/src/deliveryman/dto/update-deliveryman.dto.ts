import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliverymanDto } from './create-deliveryman.dto';

export class UpdateDeliverymanDto extends PartialType(CreateDeliverymanDto) {}