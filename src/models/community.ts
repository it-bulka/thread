import mongoose, { Types } from 'mongoose'
import { Models } from '@/consts';

interface ICommunity {
  authOrganizationId: string
  username: string
  name: string
  image: string
  bio: string
  createdBy?: Types.ObjectId
  threads: Types.ObjectId[]
  members: Types.ObjectId[]
  isPrivate: boolean
  joinRequests: Types.ObjectId[]
}

const communitySchema = new mongoose.Schema<ICommunity>({
  authOrganizationId: {
    type: String,
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Models.USER,
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Models.THREAD,
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Models.USER,
    },
  ],
  isPrivate: {
    type: Boolean,
    default: false,
  },
  joinRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Models.USER,
    },
  ],
});

const Community = (mongoose.models[Models.COMMUNITY] as mongoose.Model<ICommunity>)
  || mongoose.model<ICommunity>(Models.COMMUNITY, communitySchema);

export default Community;