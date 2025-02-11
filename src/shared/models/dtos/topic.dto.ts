import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ example: 'Algebra' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'https://video.url' })
  @IsString()
  video?: string;

  @ApiPropertyOptional({ example: 'https://image.url' })
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'https://audio.url' })
  @IsString()
  audio?: string;

  @ApiPropertyOptional({ example: 'Introduction to Algebra' })
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  subjectId: string;
}
