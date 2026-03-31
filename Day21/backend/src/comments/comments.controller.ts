import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':postId')
  async getComments(@Param('postId') postId: string) {
    return this.commentsService.getCommentsByPostId(postId);
  }

  @Get(':commentId/replies')
  async getReplies(@Param('commentId') commentId: string) {
    return this.commentsService.getReplies(commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(@Req() req, @Body() data: any) {
    return this.commentsService.create({
      ...data,
      author: req.user.userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reply')
  async replyToComment(@Req() req, @Param('id') id: string, @Body() data: any) {
    return this.commentsService.create({
      ...data,
      author: req.user.userId,
      parentComment: id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likeComment(@Req() req, @Param('id') id: string) {
    return this.commentsService.toggleLike(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async editComment(@Req() req, @Param('id') id: string, @Body() data: { content: string }) {
    return this.commentsService.editComment(id, req.user.userId, data.content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Req() req, @Param('id') id: string) {
    return this.commentsService.deleteComment(id, req.user.userId);
  }
}
