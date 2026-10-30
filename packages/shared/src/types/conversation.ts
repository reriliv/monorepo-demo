export type Conversation = {
  id: number;
  title: string;
  participants: number[];
};

export type Message = {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  timestamp: Date;
};
