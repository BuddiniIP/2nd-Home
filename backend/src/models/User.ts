import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';


export enum UserRole {
  STUDENT = 'student',
  OWNER = 'owner',
  ADMIN = 'admin',
  VERIFIER = 'verifier',
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional if you decide to add Google auth later
  role: UserRole;
  phone?: string;
  // Specific to student
  university?: string;
  // Common fields
  profilePicture?: string;
  isActive: boolean;
  currentBoarding?: mongoose.Types.ObjectId; // edited ss
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: Object.values(UserRole), required: true, default: UserRole.STUDENT },
    phone: { type: String },
    university: { type: String },
    profilePicture: { type: String },
    isActive: { type: Boolean, default: true },
    currentBoarding: {type: mongoose.Schema.Types.ObjectId,ref: "Listing",default: null,} // edited ss
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (this: any) {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('findOneAndDelete', async function () {
  const filter = this.getFilter();
  const userId = filter._id;
  if (userId) {
    const Listing = require('./Listing.js').default;
    const Booking = require('./Booking.js').default;
    const Notification = require('./Notification.js').default;
    const Message = require('./Message.js').default;
    const Conversation = require('./Conversation.js').default;
    const Report = require('./Report.js').default;
    const SavedListing = require('./SavedListing.js').default;
    const VerificationAssignment = require('./VerificationAssignment.js').default;
    await Listing.deleteMany({ owner: userId });
    await Booking.deleteMany({ student: userId });
    await Notification.deleteMany({ recipient: userId });
    await Message.deleteMany({ sender: userId });
    await Conversation.deleteMany({ participants: userId });
    await Report.deleteMany({ $or: [{ reporter: userId }, { targetUser: userId }] });
    await SavedListing.deleteMany({ student: userId });
    await VerificationAssignment.deleteMany({ $or: [{ owner: userId }, { verifier: userId }, { assignedBy: userId }] });
  }
});

const User = mongoose.model<IUser>('User', userSchema);

//User.syncIndexes().catch(console.error);

export default User;

