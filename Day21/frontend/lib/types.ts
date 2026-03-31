export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  followers?: string[];
  following?: string[];
  points?: number;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  postId: string;
  parentComment?: string | null;
  likes: string[];
  createdAt: string;
  replies?: Comment[];
  imageUrl?: string;
}

export interface Notification {
  id: string;
  recipient: string;
  sender: User;
  type: 'comment' | 'reply' | 'like' | 'follow';
  comment?: Comment;
  read: boolean;
  createdAt: string;
}
