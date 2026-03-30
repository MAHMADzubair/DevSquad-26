import { Injectable } from '@nestjs/common';

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
}

@Injectable()
export class CommentsService {
  private comments: Comment[] = [];
  private commentIdCounter = 1;

  addComment(data: { author: string; text: string }): Comment {
    const comment: Comment = {
      id: `comment-${this.commentIdCounter++}`,
      author: data.author,
      text: data.text,
      timestamp: new Date(),
    };

    this.comments.push(comment);
    return comment;
  }

  getComments(): Comment[] {
    return this.comments;
  }

  deleteComment(id: string): boolean {
    const index = this.comments.findIndex((c) => c.id === id);
    if (index > -1) {
      this.comments.splice(index, 1);
      return true;
    }
    return false;
  }

  getCommentById(id: string): Comment | undefined {
    return this.comments.find((c) => c.id === id);
  }
}
