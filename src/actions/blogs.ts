"use server";

import { connectToDatabase } from "@/lib/mongodb";
import Blog, { IBlog } from "@/models/Blog";
import Comment from "@/models/Comment";
import { BLOG_POSTS as SEED_BLOGS } from "@/data/blogs";

export interface BlogType {
  _id: string;
  slug: string;
  title: string;
  category: string;
  tag: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  keyTakeaways: string[];
  sections: {
    heading?: string;
    subheading?: string;
    body: string;
    quote?: string;
    list?: string[];
  }[];
  tags: string[];
  featured: boolean;
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Ensures initial blogs are seeded into the database if the collection is empty.
 */
async function ensureBlogsSeeded() {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      const docs = SEED_BLOGS.map((b) => ({
        slug: b.slug,
        title: b.title,
        category: b.category,
        tag: b.tag || "Smart insights for Real Business Growth",
        date: b.date,
        readTime: b.readTime,
        image: b.image,
        excerpt: b.excerpt,
        keyTakeaways: b.keyTakeaways || [],
        sections: b.sections || [],
        tags: b.tags || [],
        featured: Boolean(b.featured),
        published: true,
        views: Math.floor(Math.random() * 200) + 50,
      }));
      await Blog.insertMany(docs);
    }
  } catch (err) {
    console.error("Auto-seeding blogs failed:", err);
  }
}

/**
 * Format mongoose blog document to plain serializable object
 */
function formatBlogDoc(doc: any): BlogType {
  return {
    _id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    tag: doc.tag || "Smart insights for Real Business Growth",
    date: doc.date || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    readTime: doc.readTime || "5 min read",
    image: doc.image,
    excerpt: doc.excerpt,
    keyTakeaways: doc.keyTakeaways || [],
    sections: (doc.sections || []).map((s: any) => ({
      heading: s.heading || "",
      subheading: s.subheading || "",
      body: s.body || "",
      quote: s.quote || "",
      list: s.list || [],
    })),
    tags: doc.tags || [],
    featured: Boolean(doc.featured),
    published: doc.published !== false,
    views: doc.views || 0,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
  };
}

/**
 * Fetch all blogs with optional filtering (category, search, publish status)
 */
export async function getAllBlogsAction(options?: {
  category?: string;
  search?: string;
  includeUnpublished?: boolean;
}): Promise<{
  success: boolean;
  blogs: BlogType[];
  error?: string;
}> {
  try {
    await connectToDatabase();
    await ensureBlogsSeeded();

    const query: any = {};
    if (!options?.includeUnpublished) {
      query.published = { $ne: false };
    }
    if (options?.category && options.category !== "All") {
      query.category = options.category;
    }
    if (options?.search && options.search.trim()) {
      const searchRegex = new RegExp(options.search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { tags: searchRegex },
        { category: searchRegex },
      ];
    }

    const docs = await Blog.find(query).sort({ featured: -1, createdAt: -1 }).lean();
    const formatted = docs.map(formatBlogDoc);

    return { success: true, blogs: formatted };
  } catch (err: unknown) {
    console.error("Error fetching blogs:", err);
    // Graceful fallback to static seed data
    const fallback = SEED_BLOGS.map((b, idx) => ({
      _id: `static-${idx}`,
      slug: b.slug,
      title: b.title,
      category: b.category,
      tag: b.tag,
      date: b.date,
      readTime: b.readTime,
      image: b.image,
      excerpt: b.excerpt,
      keyTakeaways: b.keyTakeaways,
      sections: b.sections,
      tags: b.tags,
      featured: Boolean(b.featured),
      published: true,
      views: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    return { success: true, blogs: fallback };
  }
}

/**
 * Fetch a single blog by slug
 */
export async function getBlogBySlugAction(slug: string): Promise<{
  success: boolean;
  blog: BlogType | null;
  relatedBlogs: BlogType[];
  error?: string;
}> {
  try {
    await connectToDatabase();
    await ensureBlogsSeeded();

    const blogDoc = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!blogDoc) {
      const fallbackItem = SEED_BLOGS.find((b) => b.slug === slug);
      if (!fallbackItem) {
        return { success: false, blog: null, relatedBlogs: [], error: "Blog not found." };
      }
      const formattedFallback: BlogType = {
        _id: `static-${slug}`,
        ...fallbackItem,
        featured: Boolean(fallbackItem.featured),
        published: true,
        views: 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const related: BlogType[] = SEED_BLOGS.filter((b) => b.slug !== slug).slice(0, 3).map((b, i) => ({
        _id: `static-rel-${i}`,
        ...b,
        featured: Boolean(b.featured),
        published: true,
        views: 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      return { success: true, blog: formattedFallback, relatedBlogs: related };
    }

    const blog = formatBlogDoc(blogDoc);

    // Fetch related blogs (excluding current)
    const relatedDocs = await Blog.find({ slug: { $ne: slug }, published: true })
      .limit(3)
      .lean();
    const relatedBlogs = relatedDocs.map(formatBlogDoc);

    return { success: true, blog, relatedBlogs };
  } catch (err: unknown) {
    console.error("Error fetching blog by slug:", err);
    return { success: false, blog: null, relatedBlogs: [], error: "Failed to load blog." };
  }
}

/**
 * Create a new blog post
 */
export async function createBlogAction(data: {
  title: string;
  slug?: string;
  category: string;
  tag?: string;
  readTime?: string;
  image: string;
  excerpt: string;
  keyTakeaways: string[];
  sections: {
    heading?: string;
    subheading?: string;
    body: string;
    quote?: string;
    list?: string[];
  }[];
  tags: string[];
  featured?: boolean;
  published?: boolean;
}): Promise<{
  success: boolean;
  blog?: BlogType;
  error?: string;
}> {
  try {
    if (!data.title?.trim() || !data.image?.trim() || !data.excerpt?.trim()) {
      return { success: false, error: "Title, Image, and Excerpt are required." };
    }

    await connectToDatabase();

    // Generate slug from title if not provided
    let finalSlug = data.slug?.trim() || "";
    if (!finalSlug) {
      finalSlug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    // Ensure slug uniqueness
    const existing = await Blog.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const newBlog = await Blog.create({
      slug: finalSlug,
      title: data.title.trim(),
      category: data.category || "Marketing & Growth",
      tag: data.tag || "Smart insights for Real Business Growth",
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      readTime: data.readTime || "5 min read",
      image: data.image.trim(),
      excerpt: data.excerpt.trim(),
      keyTakeaways: data.keyTakeaways.filter((k) => k.trim()),
      sections: data.sections.filter((s) => s.body.trim()),
      tags: data.tags.filter((t) => t.trim()),
      featured: Boolean(data.featured),
      published: data.published !== false,
      views: 0,
    });

    return { success: true, blog: formatBlogDoc(newBlog) };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create blog.";
    console.error("Create blog error:", err);
    return { success: false, error: msg };
  }
}

/**
 * Update an existing blog post
 */
export async function updateBlogAction(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    category: string;
    tag: string;
    readTime: string;
    image: string;
    excerpt: string;
    keyTakeaways: string[];
    sections: {
      heading?: string;
      subheading?: string;
      body: string;
      quote?: string;
      list?: string[];
    }[];
    tags: string[];
    featured: boolean;
    published: boolean;
  }>
): Promise<{
  success: boolean;
  blog?: BlogType;
  error?: string;
}> {
  try {
    await connectToDatabase();

    const blog = await Blog.findById(id);
    if (!blog) {
      return { success: false, error: "Blog not found." };
    }

    if (data.title) blog.title = data.title.trim();
    if (data.slug) blog.slug = data.slug.trim().toLowerCase();
    if (data.category) blog.category = data.category;
    if (data.tag) blog.tag = data.tag;
    if (data.readTime) blog.readTime = data.readTime;
    if (data.image) blog.image = data.image.trim();
    if (data.excerpt) blog.excerpt = data.excerpt.trim();
    if (data.keyTakeaways) blog.keyTakeaways = data.keyTakeaways.filter((k) => k.trim());
    if (data.sections) blog.sections = data.sections.filter((s) => s.body.trim());
    if (data.tags) blog.tags = data.tags.filter((t) => t.trim());
    if (data.featured !== undefined) blog.featured = data.featured;
    if (data.published !== undefined) blog.published = data.published;

    await blog.save();

    return { success: true, blog: formatBlogDoc(blog) };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update blog.";
    console.error("Update blog error:", err);
    return { success: false, error: msg };
  }
}

/**
 * Delete a blog post and its associated comments
 */
export async function deleteBlogAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await connectToDatabase();
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return { success: false, error: "Blog not found." };
    }

    // Delete associated comments for this blog slug
    await Comment.deleteMany({ blogSlug: blog.slug });

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete blog.";
    console.error("Delete blog error:", err);
    return { success: false, error: msg };
  }
}
