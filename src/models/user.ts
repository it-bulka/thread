import mongoose, { Types } from "mongoose";
import { Models } from '@/consts';

interface IUser {
  authId: string
  username: string
  name: string
  image: string
  bio: string
  threads: Types.ObjectId[]
  onboarded: Boolean
  communities: Types.ObjectId[]
  deleted: boolean
  deletedAt?: Date
}

const userSchema = new mongoose.Schema<IUser>({
  authId: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Models.THREAD,
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Models.COMMUNITY,
    },
  ],
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
});

const User = mongoose.models?.User as mongoose.Model<IUser> || mongoose.model<IUser>(Models.USER, userSchema);

export default User;