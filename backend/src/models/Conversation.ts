import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  listing?: mongoose.Types.ObjectId;
  lastMessage?: string;
  lastSender?: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    listing: { type: Schema.Types.ObjectId, ref: 'Listing' },
    lastMessage: { type: String },
    lastSender: { type: Schema.Types.ObjectId, ref: 'User' },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

export default mongoose.model<IConversation>('Conversation', conversationSchema);
