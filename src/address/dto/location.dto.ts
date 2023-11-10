import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class LocationDto {
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

}
