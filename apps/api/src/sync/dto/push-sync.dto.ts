import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Grade, StopStatus, SyncStatus, TicketStatus } from '@silk-value/shared-types';

export class CollectionTicketRecordDto {
  @IsString()
  @IsUUID(4)
  id!: string;

  @IsString()
  route_stop_id!: string;

  @IsString()
  route_id!: string;

  @IsString()
  reeler_id!: string;

  @IsString()
  collector_id!: string;

  @IsString()
  @IsIn(Object.values(Grade))
  grade!: string;

  @IsNumber()
  gross_weight_kg!: number;

  @IsNumber()
  tare_weight_kg!: number;

  @IsNumber()
  net_weight_kg!: number;

  @IsNumber()
  @IsOptional()
  moisture_pct?: number;

  @IsNumber()
  price_per_kg!: number;

  @IsNumber()
  total_amount!: number;

  @IsString()
  ticket_number!: string;

  @IsString()
  @IsIn(Object.values(TicketStatus))
  status!: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  server_id?: string;

  @IsString()
  @IsIn(Object.values(SyncStatus))
  sync_status!: string;

  @IsNumber()
  created_at!: number;

  @IsNumber()
  updated_at!: number;
}

export class RouteStopRecordDto {
  @IsString()
  @IsUUID(4)
  id!: string;

  @IsString()
  route_id!: string;

  @IsString()
  reeler_id!: string;

  @IsNumber()
  stop_order!: number;

  @IsString()
  @IsIn(Object.values(StopStatus))
  status!: string;

  @IsNumber()
  @IsOptional()
  arrived_at?: number;

  @IsNumber()
  @IsOptional()
  departed_at?: number;

  @IsString()
  @IsOptional()
  server_id?: string;

  @IsString()
  @IsIn(Object.values(SyncStatus))
  sync_status!: string;

  @IsNumber()
  created_at!: number;

  @IsNumber()
  updated_at!: number;
}

export class TableChangesDto<T> {
  @IsArray()
  @ValidateNested({ each: true })
  created!: T[];

  @IsArray()
  @ValidateNested({ each: true })
  updated!: T[];

  @IsArray()
  @IsString({ each: true })
  deleted!: string[];
}

// Custom sub-classes to allow @Type decorators to correctly hydrate nested records for validation
export class CollectionTicketChangesDto extends TableChangesDto<CollectionTicketRecordDto> {
  @Type(() => CollectionTicketRecordDto)
  declare created: CollectionTicketRecordDto[];

  @Type(() => CollectionTicketRecordDto)
  declare updated: CollectionTicketRecordDto[];
}

export class RouteStopChangesDto extends TableChangesDto<RouteStopRecordDto> {
  @Type(() => RouteStopRecordDto)
  declare created: RouteStopRecordDto[];

  @Type(() => RouteStopRecordDto)
  declare updated: RouteStopRecordDto[];
}

export class PushSyncDto {
  @ValidateNested()
  @Type(() => CollectionTicketChangesDto)
  collection_tickets!: CollectionTicketChangesDto;

  @ValidateNested()
  @Type(() => RouteStopChangesDto)
  route_stops!: RouteStopChangesDto;

  @IsNumber()
  @IsOptional()
  last_pulled_at?: number;
}
