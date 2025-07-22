/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateRiderLocationDto {
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  riderId: string;
}
