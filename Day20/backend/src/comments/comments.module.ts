import { Module } from '@nestjs/common';
import { CommentsGateway } from './comments.gateway';
import { CommentsService } from './comments.service';

@Module({
  providers: [CommentsGateway, CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
