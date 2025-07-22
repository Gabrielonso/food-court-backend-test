import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddressDetailsDto {
  @IsString()
  city: string;
  @IsString()
  name: string;
  @IsString()
  address_line: string;
  @IsString()
  building_number: string;
  @IsNotEmpty()
  lat: number;
  @IsNotEmpty()
  lng: number;
}

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  meals: string[];

  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @IsBoolean()
  @IsNotEmpty()
  free_delivery: boolean;

  @IsNumber()
  @IsNotEmpty()
  delivery_fee: number;

  @IsNumber()
  service_charge: number;

  @ValidateNested()
  @Type(() => AddressDetailsDto)
  address_details: AddressDetailsDto;

  @IsString()
  cokitchen_polygon_id: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  cokitchen_id: string;

  @IsBoolean()
  @IsNotEmpty()
  pickup: boolean;

  @IsNumber()
  prev_price: number;

  @IsString()
  box_number: string;

  @IsString()
  @IsNotEmpty()
  order_type_id: string;
}
