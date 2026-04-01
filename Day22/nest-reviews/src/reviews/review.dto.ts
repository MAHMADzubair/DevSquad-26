import { IsNumber, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsString() productId: string;
  @IsString() authorId: string;
  @IsString() authorName: string;
  @IsNumber() @Min(1) @Max(5) rating: number;
  @IsString() @MinLength(3) body: string;
}

export class CreateReplyDto {
  @IsString() authorId: string;
  @IsString() authorName: string;
  @IsString() @MinLength(1) body: string;
}

export class LikeReviewDto {
  @IsString() userId: string;
}
