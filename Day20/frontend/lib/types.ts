export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date | string;
}

export interface Notification {
  message: string;
  type: string;
  timestamp: Date | string;
}
