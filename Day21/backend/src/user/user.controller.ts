import {
  Controller,
  Get,
  Post,
  Param,
  Put,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.userService.findById(req.user.userId);
  }

  @Get('profile/:id')
  getUserProfile(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(@Req() req, @Body() updateData) {
    return this.userService.updateProfile(req.user.userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  toggleFollow(@Req() req, @Param('id') id: string) {
    return this.userService.toggleFollow(req.user.userId, id);
  }
}
