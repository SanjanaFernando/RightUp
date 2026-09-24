import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  // Account / Auth
  email: string;
  password?: string;
  
  // Personal Info
  firstName: string;
  lastName: string;
  title?: string;
  phone?: string;

  // Onboarding / Intent
  intent?: string;
  goals?: string[];
  stage?: string;
  strengths?: string;
  challenges?: string;

  // Company Details
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;

  // Location Details
  country?: string;
  state?: string;
  city?: string;

  // Socials
  linkedin?: string;
  twitter?: string;

  // Metadata
  termsAccepted: boolean;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Don't return password by default in queries
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    intent: {
      type: String,
      trim: true,
    },
    goals: {
      type: [String],
      default: [],
    },
    stage: {
      type: String,
      trim: true,
    },
    strengths: {
      type: String,
      trim: true,
    },
    challenges: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    companySize: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    termsAccepted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent recompilation in development hot-reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
