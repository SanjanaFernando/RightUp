import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogSection {
  heading?: string;
  subheading?: string;
  body: string;
  quote?: string;
  list?: string[];
}

export interface IBlog extends Document {
  slug: string;
  title: string;
  category: string;
  tag: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  keyTakeaways: string[];
  sections: IBlogSection[];
  tags: string[];
  featured: boolean;
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSectionSchema: Schema<IBlogSection> = new Schema(
  {
    heading: { type: String, default: "" },
    subheading: { type: String, default: "" },
    body: { type: String, required: true },
    quote: { type: String, default: "" },
    list: { type: [String], default: [] },
  },
  { _id: false }
);

const BlogSchema: Schema<IBlog> = new Schema(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      default: "Marketing & Growth",
    },
    tag: {
      type: String,
      default: "Smart insights for Real Business Growth",
    },
    date: {
      type: String,
      default: () =>
        new Date().toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    image: {
      type: String,
      required: [true, "Blog image is required"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
    },
    keyTakeaways: {
      type: [String],
      default: [],
    },
    sections: {
      type: [BlogSectionSchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
