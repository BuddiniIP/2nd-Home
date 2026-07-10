import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  readBy: mongoose.Types.ObjectId[];
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
