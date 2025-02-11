import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class MarkProgressDto {
  @ApiProperty()
  @IsInt()
  topicId: string;
}
