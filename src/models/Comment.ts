import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  blogSlug: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  userTitle?: string;
  userId?: string;
  content: string;
  likes: number;
  likedBy?: string[];
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema<IComment> = new Schema(
  {
    blogSlug: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    userAvatar: {
      type: String,
      default: "",
    },
    userTitle: {
      type: String,
      default: "Verified Reader",
    },
    userId: {
      type: String,
    },
    content: {
      type: String,
      required: [true, "Comment content cannot be empty"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String],
      default: [],
    },
    parentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
