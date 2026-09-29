"use server";

import { connectToDatabase } from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalBlogs: number;
  totalViews: number;
  totalComments: number;
  recentUsers: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    role: string;
    avatar?: string;
    createdAt: string;
  }[];
}

export interface AdminUserType {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  title?: string;
  phone?: string;
  avatar?: string;
  intent?: string;
  goals?: string[];
  stage?: string;
  strengths?: string;
  challenges?: string;
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  country?: string;
  state?: string;
  city?: string;
  linkedin?: string;
  twitter?: string;
  role: "user" | "admin";
  createdAt: string;
}

/**
 * Get dashboard overview statistics
 */
export async function getAdminStatsAction(): Promise<{
  success: boolean;
  stats?: AdminStats;
  error?: string;
}> {
  try {
    await connectToDatabase();

    const [totalUsers, totalAdmins, totalBlogs, totalComments, recentUsersDocs, blogs] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "admin" }),
        Blog.countDocuments(),
        Comment.countDocuments(),
        User.find().sort({ createdAt: -1 }).limit(5).lean(),
        Blog.find({}, "views").lean(),
      ]);

    const totalViews = blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);

    const recentUsers = recentUsersDocs.map((u: any) => ({
      _id: u._id.toString(),
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      companyName: u.companyName,
      role: u.role,
      avatar: u.avatar,
      createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
    }));

    return {
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalBlogs,
        totalViews,
        totalComments,
        recentUsers,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load admin stats";
    console.error("Admin stats error:", err);
    return { success: false, error: msg };
  }
}

/**
 * Get users list with optional search and role filtering
 */
export async function getAdminUsersAction(options?: {
  search?: string;
  role?: string;
}): Promise<{
  success: boolean;
  users: AdminUserType[];
  error?: string;
}> {
  try {
    await connectToDatabase();

    const query: any = {};
    if (options?.role && options.role !== "All") {
      query.role = options.role.toLowerCase();
    }
    if (options?.search && options.search.trim()) {
      const regex = new RegExp(options.search.trim(), "i");
      query.$or = [
        { email: regex },
        { firstName: regex },
        { lastName: regex },
        { companyName: regex },
        { industry: regex },
      ];
    }

    const docs = await User.find(query).sort({ createdAt: -1 }).lean();

    const users: AdminUserType[] = docs.map((u: any) => ({
      _id: u._id.toString(),
      email: u.email,
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      title: u.title || "",
      phone: u.phone || "",
      avatar: u.avatar || "",
      intent: u.intent || "",
      goals: u.goals || [],
      stage: u.stage || "",
      strengths: u.strengths || "",
      challenges: u.challenges || "",
      companyName: u.companyName || "",
      industry: u.industry || "",
      companySize: u.companySize || "",
      website: u.website || "",
      country: u.country || "",
      state: u.state || "",
      city: u.city || "",
      linkedin: u.linkedin || "",
      twitter: u.twitter || "",
      role: u.role || "user",
      createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
    }));

    return { success: true, users };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load users";
    console.error("Get admin users error:", err);
    return { success: false, users: [], error: msg };
  }
}

/**
 * Update user role (user <-> admin)
 */
export async function updateUserRoleAction(
  userId: string,
  role: "user" | "admin"
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await connectToDatabase();
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) {
      return { success: false, error: "User not found." };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update user role.";
    console.error("Update user role error:", err);
    return { success: false, error: msg };
  }
}

/**
 * Delete a user
 */
export async function deleteUserAction(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await connectToDatabase();
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return { success: false, error: "User not found." };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete user.";
    console.error("Delete user error:", err);
    return { success: false, error: msg };
  }
}
